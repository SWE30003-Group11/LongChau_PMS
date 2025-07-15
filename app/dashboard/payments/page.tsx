"use client"

import { useState } from "react"
import { Search, Filter, Download, ArrowUpDown, CheckCircle, XCircle, Clock, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock payments data
const payments = [
  {
    id: "PMT-001",
    orderId: "ORD-1001",
    customer: "Nguyen Van A",
    amount: 1500000,
    method: "Credit Card",
    date: "2024-06-01",
    status: "Completed",
  },
  {
    id: "PMT-002",
    orderId: "ORD-1002",
    customer: "Tran Thi B",
    amount: 2000000,
    method: "Bank Transfer",
    date: "2024-06-02",
    status: "Pending",
  },
  {
    id: "PMT-003",
    orderId: "ORD-1003",
    customer: "Le Van C",
    amount: 500000,
    method: "Cash",
    date: "2024-06-03",
    status: "Failed",
  },
  {
    id: "PMT-004",
    orderId: "ORD-1004",
    customer: "Pham Thi D",
    amount: 1200000,
    method: "Credit Card",
    date: "2024-06-04",
    status: "Completed",
  },
  {
    id: "PMT-005",
    orderId: "ORD-1005",
    customer: "Hoang Van E",
    amount: 800000,
    method: "Bank Transfer",
    date: "2024-06-05",
    status: "Completed",
  },
]

const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  muted: "#999999",
  creditCard: "#3b82f6",
  bankTransfer: "#f59e0b",
  cash: "#10b981",
}

const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
const completedPayments = payments.filter(p => p.status === "Completed")
const completedRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)

const paymentMethodData = Object.entries(
  payments.reduce((acc: Record<string, number>, curr) => {
    acc[curr.method] = (acc[curr.method] || 0) + 1
    return acc
  }, {})
).map(([name, value]) => ({
  name,
  value,
  color: name === "Credit Card" ? COLORS.creditCard : name === "Bank Transfer" ? COLORS.bankTransfer : COLORS.cash
}))

const paymentStatusData = [
  { name: "Completed", value: payments.filter((p) => p.status === "Completed").length },
  { name: "Pending", value: payments.filter((p) => p.status === "Pending").length },
  { name: "Failed", value: payments.filter((p) => p.status === "Failed").length },
]

const dailyRevenueData = [
  { name: "Jun 1", revenue: payments.filter((p) => p.date === "2024-06-01").reduce((sum, p) => sum + p.amount, 0) },
  { name: "Jun 2", revenue: payments.filter((p) => p.date === "2024-06-02").reduce((sum, p) => sum + p.amount, 0) },
  { name: "Jun 3", revenue: payments.filter((p) => p.date === "2024-06-03").reduce((sum, p) => sum + p.amount, 0) },
  { name: "Jun 4", revenue: payments.filter((p) => p.date === "2024-06-04").reduce((sum, p) => sum + p.amount, 0) },
  { name: "Jun 5", revenue: payments.filter((p) => p.date === "2024-06-05").reduce((sum, p) => sum + p.amount, 0) },
]

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-gray-600 mt-1">
            {entry.name}: {typeof entry.value === 'number' ? 
              (entry.name.includes('Revenue') || entry.name.includes('₫') ? `₫${entry.value.toLocaleString()}` : entry.value.toLocaleString()) 
              : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPayments = [...filteredPayments].sort((a, b) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} className="text-green-500" />
      case "Failed":
        return <XCircle size={16} className="text-red-500" />
      case "Pending":
        return <Clock size={16} className="text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "Failed":
        return "bg-red-50 text-red-700 border-red-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
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
            <h1 className="text-3xl font-light">Payments</h1>
            <p className="text-gray-500 mt-1">Manage and track payment transactions</p>
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-light mt-2">₫{totalRevenue.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-1">From {payments.length} transactions</p>
              </div>
              <DollarSign size={20} className="text-gray-400" />
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
                <h3 className="text-2xl font-light mt-2">₫{completedRevenue.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-1">{completedPayments.length} transactions</p>
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Success Rate</p>
                <h3 className="text-2xl font-light mt-2">{Math.round((completedPayments.length / payments.length) * 100)}%</h3>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </div>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Daily Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100"
          >
            <h3 className="text-lg font-light mb-6">Daily Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" stroke={COLORS.secondary} fontSize={12} />
                  <YAxis stroke={COLORS.secondary} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <h3 className="text-lg font-light mb-6">Payment Methods</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${value}`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((method, index) => (
                <div key={method.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: method.color }} />
                    <span className="text-gray-600">{method.name}</span>
                  </div>
                  <span className="text-gray-900">{method.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100"
        >
          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search payments..."
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

          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("id")}>
                        Payment ID
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("orderId")}>
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
                      <button className="flex items-center gap-1" onClick={() => handleSort("amount")}>
                        Amount
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">Method</th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                        Date
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-6 font-medium text-gray-900">{payment.id}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{payment.orderId}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{payment.customer}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">₫{payment.amount.toLocaleString()}</td>
                      <td className="py-4 pr-6 text-sm text-gray-600">{payment.method}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{payment.date}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
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
              Showing <span className="font-medium">{sortedPayments.length}</span> of{" "}
              <span className="font-medium">{payments.length}</span> payments
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