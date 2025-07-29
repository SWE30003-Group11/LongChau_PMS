"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Download, ArrowUpDown, ShoppingBag, Clock, CheckCircle } from "lucide-react"
import { motion } from "@/lib/framer"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export default function OrdersPage() {
  const { profile, hasRole } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  const [exporting, setExporting] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filterPayment, setFilterPayment] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      if (!profile?.current_branch_id) {
        setOrders([])
        setLoading(false)
        return
      }
      // Fetch orders for current branch
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, payment_method, created_at, branch_id, user:profiles(full_name), order_items(count)')
        .eq('branch_id', profile.current_branch_id)
        .order('created_at', { ascending: false })
      if (error) {
        setError("Failed to load orders")
        setLoading(false)
        return
      }
      // Map to table format
      const mapped = (data || []).map((o: any) => {
        let status = o.status
        // Map 'delivered' to 'Completed' for display, keep others as is
        if (status === 'delivered') status = 'Completed'
        else status = status.charAt(0).toUpperCase() + status.slice(1)
        return {
          id: o.order_number || o.id,
          customer: o.user?.full_name || "-",
          date: o.created_at ? o.created_at.slice(0, 10) : "",
          time: o.created_at ? o.created_at.slice(11, 16) : "",
          status,
          items: o.order_items?.count || 0,
          total: o.total_amount,
          payment: o.payment_method.charAt(0).toUpperCase() + o.payment_method.slice(1),
        }
      })
      setOrders(mapped)
      setLoading(false)
    }
    fetchOrders()
  }, [profile?.current_branch_id])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status.toLowerCase() === statusFilter) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortField) return 0

    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
    }

    return 0
  })

  // Advanced filter logic
  const advancedFilteredOrders = sortedOrders.filter(order =>
    (filterPayment === 'all' || order.payment.toLowerCase() === filterPayment) &&
    (!filterDate || order.date === filterDate)
  )
  const totalPages = Math.ceil(advancedFilteredOrders.length / ordersPerPage)
  const paginatedOrders = advancedFilteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  // Export to CSV
  const handleExport = () => {
    setExporting(true)
    const headers = ['Order ID', 'Customer', 'Date', 'Time', 'Status', 'Items', 'Total', 'Payment']
    const rows = advancedFilteredOrders.map(order => [
      order.id, order.customer, order.date, order.time, order.status, order.items, order.total, order.payment
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders.csv'
    a.click()
    setTimeout(() => {
      URL.revokeObjectURL(url)
      setExporting(false)
    }, 1000)
  }

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    // Map 'Completed' to 'delivered' for DB
    let dbStatus = newStatus
    if (newStatus === 'Completed') dbStatus = 'delivered'
    const { error } = await supabase.from('orders').update({ status: dbStatus.toLowerCase() }).eq('order_number', orderId)
    if (!error) {
      // Refresh orders
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, payment_method, created_at, user:profiles(full_name), order_items(count)')
        .order('created_at', { ascending: false })
      const mapped = (data || []).map((o: any) => {
        let status = o.status
        // Map 'delivered' to 'Completed' for display, keep others as is
        if (status === 'delivered') status = 'Completed'
        else status = status.charAt(0).toUpperCase() + status.slice(1)
        return {
          id: o.order_number || o.id,
          customer: o.user?.full_name || "-",
          date: o.created_at ? o.created_at.slice(0, 10) : "",
          time: o.created_at ? o.created_at.slice(11, 16) : "",
          status,
          items: o.order_items?.count || 0,
          total: o.total_amount,
          payment: o.payment_method.charAt(0).toUpperCase() + o.payment_method.slice(1),
        }
      })
      setOrders(mapped)
    }
    setUpdatingOrderId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Calculate stats
  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === "Completed").length
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length

  if (!profile?.current_branch_id) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Please select a branch in settings.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-light">Orders</h1>
            <p className="text-gray-500 mt-1">Manage customer orders</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <button
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download size={16} className="mr-2" />
              {exporting ? 'Exporting...' : 'Export'}
            </button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-light mt-2">{totalOrders}</h3>
              </div>
              <ShoppingBag size={20} className="text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Completed</p>
                <h3 className="text-2xl font-light mt-2">{completedOrders}</h3>
              </div>
              <CheckCircle size={20} className="text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Pending</p>
                <h3 className="text-2xl font-light mt-2">{pendingOrders}</h3>
              </div>
              <Clock size={20} className="text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Main Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100"
        >
          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => setShowFilter(v => !v)}
                type="button"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          {showFilter && (
            <div className="px-6 pt-4">
              <div className="inline-flex bg-gray-50 rounded-full p-1">
                <select
                  className="px-4 py-1.5 text-sm rounded-full capitalize transition-all"
                  value={filterPayment}
                  onChange={e => setFilterPayment(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="credit card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="e-wallet">E-wallet</option>
                </select>
              </div>
              <div className="inline-flex bg-gray-50 rounded-full p-1 mt-2">
                <input
                  type="date"
                  className="px-4 py-1.5 text-sm rounded-full capitalize transition-all"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Status Filter Tabs */}
          <div className="px-6 pt-4">
            <div className="inline-flex bg-gray-50 rounded-full p-1">
              {['all', 'Completed', 'Processing', 'Pending', 'Ready', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("id")}>
                        Order ID
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("customer")}>
                        Customer
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                        Date & Time
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("items")}>
                        Items
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("total")}>
                        Total
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">Payment</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-6 font-medium text-gray-900">{order.id}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{order.customer}</td>
                      <td className="py-4 pr-6 text-sm text-gray-600">
                        <div>
                          <div>{order.date}</div>
                          <div className="text-xs text-gray-400">{order.time}</div>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        {hasRole(['admin', 'staff', 'pharmacist']) ? (
                          <select
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>{order.status}</span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{order.items}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">₫{order.total.toLocaleString()}</td>
                      <td className="py-4 pr-6 text-sm text-gray-600">{order.payment}</td>
                      <td className="py-4">
                        <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{paginatedOrders.length}</span> of{" "}
              <span className="font-medium">{sortedOrders.length}</span> orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded-full border border-gray-200 text-gray-400 text-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded-full border border-gray-200 text-sm ${currentPage === i + 1 ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}