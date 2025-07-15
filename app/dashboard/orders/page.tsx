"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download, ArrowUpDown, ShoppingBag, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

// Mock orders data
const orders = [
  {
    id: "ORD-12345",
    customer: "Nguyen Van A",
    date: "2025-05-19",
    time: "14:30",
    status: "Completed",
    items: 3,
    total: 125000,
    payment: "Credit Card",
  },
  {
    id: "ORD-12344",
    customer: "Tran Thi B",
    date: "2025-05-19",
    time: "13:45",
    status: "Processing",
    items: 2,
    total: 85000,
    payment: "Cash",
  },
  {
    id: "ORD-12343",
    customer: "Le Van C",
    date: "2025-05-18",
    time: "10:20",
    status: "Pending",
    items: 5,
    total: 320000,
    payment: "E-wallet",
  },
  {
    id: "ORD-12342",
    customer: "Pham Thi D",
    date: "2025-05-18",
    time: "09:15",
    status: "Completed",
    items: 1,
    total: 45000,
    payment: "Credit Card",
  },
  {
    id: "ORD-12341",
    customer: "Hoang Van E",
    date: "2025-05-17",
    time: "16:45",
    status: "Cancelled",
    items: 4,
    total: 210000,
    payment: "Cash",
  },
  {
    id: "ORD-12340",
    customer: "Nguyen Thi F",
    date: "2025-05-17",
    time: "11:30",
    status: "Completed",
    items: 2,
    total: 95000,
    payment: "E-wallet",
  },
  {
    id: "ORD-12339",
    customer: "Tran Van G",
    date: "2025-05-16",
    time: "15:20",
    status: "Processing",
    items: 3,
    total: 150000,
    payment: "Credit Card",
  },
  {
    id: "ORD-12338",
    customer: "Le Thi H",
    date: "2025-05-16",
    time: "08:45",
    status: "Completed",
    items: 6,
    total: 450000,
    payment: "Cash",
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [statusFilter, setStatusFilter] = useState("all")

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
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center">
              <Download size={16} className="mr-2" />
              Export
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
              <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="px-6 pt-4">
            <div className="inline-flex bg-gray-50 rounded-full p-1">
              {['all', 'completed', 'processing', 'pending', 'cancelled'].map((status) => (
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
                  {sortedOrders.map((order) => (
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
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
              Showing <span className="font-medium">{sortedOrders.length}</span> of{" "}
              <span className="font-medium">{orders.length}</span> orders
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-full border border-gray-200 text-gray-400 text-sm" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded-full bg-gray-900 text-white text-sm">1</button>
              <button className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">2</button>
              <button className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">3</button>
              <button className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}