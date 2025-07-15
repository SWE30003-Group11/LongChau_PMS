"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { ArrowUp, ArrowDown, Users, ShoppingBag, Package, CreditCard, TrendingUp, Activity, FileText, Clock } from "lucide-react"
import { motion } from "framer-motion"

// Minimal color palette matching the Long Chau style
const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  muted: "#999999",
  light: "#f5f5f5",
  border: "#e5e5e5",
  success: "#22c55e",
  danger: "#ef4444",
  chart1: "#111111",
  chart2: "#666666",
  chart3: "#999999",
  chart4: "#d4d4d4",
  chart5: "#e5e5e5",
}

// Mock data based on time range
const getMockData = (timeRange: string) => {
  if (timeRange === 'today') {
    return {
      stats: {
        revenue: "₫8.2M",
        revenueChange: "+15.3%",
        orders: "68",
        ordersChange: "+22.1%",
        customers: "245",
        customersChange: "+8.4%",
        prescriptions: "12",
        prescriptionsChange: "+20.0%",
      },
      salesData: [
        { name: "8AM", sales: 320, orders: 3 },
        { name: "10AM", sales: 580, orders: 5 },
        { name: "12PM", sales: 1200, orders: 9 },
        { name: "2PM", sales: 950, orders: 7 },
        { name: "4PM", sales: 1450, orders: 11 },
        { name: "6PM", sales: 2100, orders: 18 },
        { name: "8PM", sales: 1600, orders: 15 },
      ],
      categoryData: [
        { name: "Prescription Drugs", value: 48, count: 32 },
        { name: "OTC Medicine", value: 22, count: 15 },
        { name: "Healthcare Products", value: 18, count: 12 },
        { name: "Personal Care", value: 12, count: 9 },
      ],
      branchData: [
        { branch: "District 1", revenue: 2800, customers: 85 },
        { branch: "District 2", revenue: 2200, customers: 68 },
        { branch: "District 3", revenue: 1500, customers: 42 },
        { branch: "District 7", revenue: 1900, customers: 56 },
        { branch: "Thu Duc", revenue: 800, customers: 24 },
      ],
    }
  } else if (timeRange === 'week') {
    return {
      stats: {
        revenue: "₫52.8M",
        revenueChange: "+12.5%",
        orders: "487",
        ordersChange: "+8.2%",
        customers: "1,820",
        customersChange: "+5.4%",
        prescriptions: "86",
        prescriptionsChange: "-2.1%",
      },
      salesData: [
        { name: "Mon", sales: 6200, orders: 58 },
        { name: "Tue", sales: 5800, orders: 52 },
        { name: "Wed", sales: 7100, orders: 68 },
        { name: "Thu", sales: 6600, orders: 61 },
        { name: "Fri", sales: 8200, orders: 82 },
        { name: "Sat", sales: 10500, orders: 98 },
        { name: "Sun", sales: 8400, orders: 78 },
      ],
      categoryData: [
        { name: "Prescription Drugs", value: 45, count: 218 },
        { name: "OTC Medicine", value: 25, count: 122 },
        { name: "Healthcare Products", value: 20, count: 97 },
        { name: "Personal Care", value: 10, count: 50 },
      ],
      branchData: [
        { branch: "District 1", revenue: 18500, customers: 520 },
        { branch: "District 2", revenue: 14200, customers: 410 },
        { branch: "District 3", revenue: 8600, customers: 285 },
        { branch: "District 7", revenue: 12800, customers: 380 },
        { branch: "Thu Duc", revenue: 7700, customers: 225 },
      ],
    }
  } else { // month
    return {
      stats: {
        revenue: "₫215.4M",
        revenueChange: "+18.7%",
        orders: "2,156",
        ordersChange: "+14.3%",
        customers: "6,842",
        customersChange: "+9.8%",
        prescriptions: "412",
        prescriptionsChange: "+7.2%",
      },
      salesData: [
        { name: "Week 1", sales: 42000, orders: 420 },
        { name: "Week 2", sales: 48000, orders: 485 },
        { name: "Week 3", sales: 52000, orders: 520 },
        { name: "Week 4", sales: 55400, orders: 565 },
        { name: "Week 5", sales: 18000, orders: 166 },
      ],
      categoryData: [
        { name: "Prescription Drugs", value: 42, count: 906 },
        { name: "OTC Medicine", value: 28, count: 604 },
        { name: "Healthcare Products", value: 19, count: 410 },
        { name: "Personal Care", value: 11, count: 236 },
      ],
      branchData: [
        { branch: "District 1", revenue: 82000, customers: 2420 },
        { branch: "District 2", revenue: 68000, customers: 1980 },
        { branch: "District 3", revenue: 45000, customers: 1290 },
        { branch: "District 7", revenue: 52000, customers: 1650 },
        { branch: "Thu Duc", revenue: 35000, customers: 1080 },
      ],
    }
  }
}

// Custom minimal tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-gray-600 mt-1">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-sm transition-all duration-300"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
        <h3 className="text-2xl font-light mt-2">{value}</h3>
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUp size={14} className="text-green-500 mr-1" />
            ) : (
              <ArrowDown size={14} className="text-red-500 mr-1" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <Icon size={20} className="text-gray-400" />
    </div>
  </motion.div>
)

const recentActivities = [
  { type: "order", action: "New order placed", details: "#LC2025-1245", time: "2 min ago", urgent: false },
  { type: "prescription", action: "Prescription pending", details: "Requires pharmacist approval", time: "5 min ago", urgent: true },
  { type: "inventory", action: "Low stock alert", details: "Paracetamol 500mg", time: "15 min ago", urgent: true },
  { type: "customer", action: "New customer registered", details: "Via mobile app", time: "30 min ago", urgent: false },
  { type: "payment", action: "Payment received", details: "₫1,250,000", time: "45 min ago", urgent: false },
]

export default function PMSDashboard() {
  const [timeRange, setTimeRange] = useState("week")
  const [data, setData] = useState(getMockData("week"))

  useEffect(() => {
    setData(getMockData(timeRange))
  }, [timeRange])

  const { stats, salesData, categoryData, branchData } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light">Pharmacy Management System</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin</p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex bg-white rounded-full border border-gray-200 p-1">
            {['Today', 'Week', 'Month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range.toLowerCase())}
                className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                  timeRange === range.toLowerCase()
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            change={stats.revenueChange}
            icon={CreditCard}
            trend="up"
          />
          <StatCard
            title={timeRange === 'today' ? 'Orders Today' : `Orders This ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`}
            value={stats.orders}
            change={stats.ordersChange}
            icon={ShoppingBag}
            trend="up"
          />
          <StatCard
            title="Active Customers"
            value={stats.customers}
            change={stats.customersChange}
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Prescriptions"
            value={stats.prescriptions}
            change={stats.prescriptionsChange}
            icon={FileText}
            trend={stats.prescriptionsChange.startsWith('+') ? 'up' : 'down'}
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light">
                {timeRange === 'today' ? 'Hourly' : timeRange === 'week' ? 'Daily' : 'Weekly'} Performance
              </h3>
              <TrendingUp size={18} className="text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="name" stroke={COLORS.secondary} fontSize={12} />
                  <YAxis stroke={COLORS.secondary} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Revenue (₫1000)"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light">Sales by Category</h3>
              <Package size={18} className="text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index + 5]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: Object.values(COLORS)[index + 5] }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Branch Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light">Branch Performance</h3>
              <Activity size={18} className="text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="branch" stroke={COLORS.secondary} fontSize={12} />
                  <YAxis stroke={COLORS.secondary} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue (₫)" 
                    fill={COLORS.primary} 
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light">Recent Activity</h3>
              <Clock size={18} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.urgent ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              View all activity →
            </button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Process Order', count: timeRange === 'today' ? 4 : timeRange === 'week' ? 12 : 48 },
            { label: 'Approve Prescriptions', count: timeRange === 'today' ? 2 : timeRange === 'week' ? 8 : 35 },
            { label: 'Low Stock Items', count: timeRange === 'today' ? 5 : timeRange === 'week' ? 15 : 28 },
            { label: 'Pending Deliveries', count: timeRange === 'today' ? 3 : timeRange === 'week' ? 6 : 19 },
          ].map((action) => (
            <button
              key={action.label}
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all text-center"
            >
              <span className="text-2xl font-light">{action.count}</span>
              <p className="text-sm text-gray-600 mt-1">{action.label}</p>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}