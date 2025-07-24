"use client"

import { useState } from "react"
import { Download, Calendar, Filter, ArrowUpDown, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { motion } from "framer-motion"
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

// Minimal color palette
const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  muted: "#999999",
  border: "#e5e5e5",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  chart1: "#111111",
  chart2: "#666666",
  chart3: "#999999",
  chart4: "#d4d4d4",
  chart5: "#e5e5e5",
}

// Mock data
const monthlySalesData = [
  { name: "Jan", sales: 4000000, orders: 240, target: 3800000 },
  { name: "Feb", sales: 3000000, orders: 180, target: 3200000 },
  { name: "Mar", sales: 5000000, orders: 320, target: 4000000 },
  { name: "Apr", sales: 4500000, orders: 280, target: 4200000 },
  { name: "May", sales: 6000000, orders: 350, target: 5000000 },
  { name: "Jun", sales: 5500000, orders: 320, target: 5200000 },
]

// Replace branchPerformanceData, productCategoryData, inventoryStatusData with real values from branches.csv and products.csv
const BRANCHES = [
  "Long Chau - Hai Ba Trung HQ",
  "Long Chau - Nguyen Trai",
  "Long Chau - Le Van Sy",
  "Long Chau - Pham Ngu Lao",
  "Long Chau - District 7",
  "Long Chau - Cong Hoa",
  "Long Chau - Bach Dang",
  "Long Chau - 3 Thang 2",
];
const CATEGORIES = [
  "Pain Relief",
  "Antibiotics",
  "Vitamins & Supplements",
  "Digestive Health",
  "Allergy & Respiratory",
  "Medical Devices",
  "Personal Protection",
  "Diabetes Care",
  "Cough & Cold",
];
const TOP_PRODUCTS = [
  "Paracetamol 500mg",
  "Amoxicillin 500mg",
  "Vitamin C 1000mg",
  "Ibuprofen 400mg",
  "Aspirin 500mg",
  "Loratadine 10mg",
  "Metformin 500mg",
  "Azithromycin 500mg",
  "Probiotic Capsules",
  "Throat Lozenges",
];

const customerDemographicsData = [
  { name: "18-24", male: 15, female: 20 },
  { name: "25-34", male: 25, female: 30 },
  { name: "35-44", male: 20, female: 25 },
  { name: "45-54", male: 15, female: 20 },
  { name: "55-64", male: 10, female: 15 },
  { name: "65+", male: 5, female: 10 },
]

// Use BRANCHES for branchPerformanceData
const branchPerformanceData = BRANCHES.map((name, i) => ({
  name,
  sales: 2000000 + i * 1000000 + Math.floor(Math.random() * 500000),
  orders: 100 + i * 30 + Math.floor(Math.random() * 20),
  target: 1800000 + i * 900000 + Math.floor(Math.random() * 400000),
}));
// Use CATEGORIES for productCategoryData
const productCategoryData = CATEGORIES.slice(0, 6).map((name, i) => ({
  name,
  value: [25, 20, 18, 15, 12, 10][i],
  count: 200 + i * 50,
}));
// Use TOP_PRODUCTS for inventoryStatusData
const inventoryStatusData = TOP_PRODUCTS.slice(0, 5).map((name, i) => ({
  name,
  category: CATEGORIES[i % CATEGORIES.length],
  stock: 100 + i * 30 + Math.floor(Math.random() * 20),
  sales: 500 + i * 100 + Math.floor(Math.random() * 100),
  status: ["In Stock", "Low Stock", "Critical", "In Stock", "Low Stock"][i],
}));

// Custom tooltip
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

const RotatedTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      dy={10}
      textAnchor="end"
      fill="#222"
      fontSize={12}
      transform={`rotate(-30,${x},${y})`}
    >
      {payload.value}
    </text>
  );
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [activeTab, setActiveTab] = useState("sales")

  // Calculate totals
  const totalSales = monthlySalesData.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = monthlySalesData.reduce((sum, item) => sum + item.orders, 0)
  const avgOrderValue = Math.round(totalSales / totalOrders)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-50 text-green-700 border-green-200"
      case "Low Stock":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200"
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
            <h1 className="text-3xl font-light">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">Comprehensive insights into your pharmacy performance</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 md:mt-0 flex items-center gap-4"
          >
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center">
              <Calendar size={16} className="mr-2" />
              Date Range
            </button>
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="inline-flex bg-white rounded-full p-1 border border-gray-200">
            {['sales', 'products', 'branches', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm rounded-full capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <>
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
                    <p className="text-xs uppercase tracking-wider text-gray-500">Total Sales</p>
                    <h3 className="text-2xl font-light mt-2">₫{totalSales.toLocaleString()}</h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+12.5% vs last year</span>
                    </div>
                  </div>
                  <Activity size={20} className="text-gray-400" />
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
                    <p className="text-xs uppercase tracking-wider text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-light mt-2">{totalOrders.toLocaleString()}</h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+8.3% vs last year</span>
                    </div>
                  </div>
                  <Activity size={20} className="text-gray-400" />
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
                    <p className="text-xs uppercase tracking-wider text-gray-500">Avg Order Value</p>
                    <h3 className="text-2xl font-light mt-2">₫{avgOrderValue.toLocaleString()}</h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+4.2% vs last year</span>
                    </div>
                  </div>
                  <Activity size={20} className="text-gray-400" />
                </div>
              </motion.div>
            </div>

            {/* Sales Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-light">Monthly Sales Performance</h3>
                <div className="inline-flex bg-gray-50 rounded-full p-1">
                  {['month', 'quarter', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all ${
                        timeRange === range
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySalesData} style={{ fontFamily: 'inherit' }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#111" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 6" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis stroke="#222" fontSize={14} tickLine={false} axisLine={false} tickFormatter={v => v === 0 ? '' : `₫${v/1000000}M`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000508' }} wrapperStyle={{ borderRadius: 12, boxShadow: '0 4px 24px #0001' }} />
                    <Area type="monotone" dataKey="sales" name="Sales" stroke="#111" strokeWidth={2} fill="url(#salesGradient)" />
                    <Area type="monotone" dataKey="target" name="Target" stroke="#666" strokeWidth={2} fill="#f5f5f5" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Orders vs Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl border border-gray-100"
            >
              <h3 className="text-lg font-light mb-6">Orders vs Sales Correlation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData} style={{ fontFamily: 'inherit' }}>
                    <CartesianGrid strokeDasharray="2 6" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#999" radius={[12, 12, 8, 8]} barSize={32} />
                    <Line yAxisId="right" type="monotone" dataKey="sales" name="Sales (₫)" stroke="#111" strokeWidth={2} dot={{ r: 4 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Product Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <h3 className="text-lg font-light mb-6">Product Categories</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={{ fontFamily: 'inherit' }}>
                      <Pie
                        data={productCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ value }) => `${value}%`}
                      >
                        {productCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index + 5]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {productCategoryData.map((category, index) => (
                    <div key={category.name} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: Object.values(COLORS)[index + 5] }} />
                        <span className="text-gray-600">{category.name}</span>
                      </div>
                      <span className="text-gray-900">{category.count} items</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Selling Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <h3 className="text-lg font-light mb-6">Top Selling Products</h3>
                <div className="space-y-4">
                  {[
                    { name: "Paracetamol 500mg", sales: 1250, growth: "+12%", trend: "up" },
                    { name: "Vitamin C 1000mg", sales: 980, growth: "+8%", trend: "up" },
                    { name: "Amoxicillin 250mg", sales: 850, growth: "+5%", trend: "up" },
                    { name: "Ibuprofen 200mg", sales: 720, growth: "-3%", trend: "down" },
                    { name: "Cetirizine 10mg", sales: 650, growth: "+7%", trend: "up" },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className={`flex items-center text-sm ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {product.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                        {product.growth}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Inventory Status Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-light">Inventory Status</h3>
                <button className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center text-sm">
                  <Filter size={14} className="mr-2" />
                  Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 pr-6">
                        <button className="flex items-center gap-1">
                          Product
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="pb-3 pr-6">Category</th>
                      <th className="pb-3 pr-6">Stock</th>
                      <th className="pb-3 pr-6">Sales</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryStatusData.map((product, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-6 font-medium text-gray-900">{product.name}</td>
                        <td className="py-4 pr-6 text-sm text-gray-600">{product.category}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">{product.stock}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">{product.sales}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Branches Tab */}
        {activeTab === 'branches' && (
          <>
            {/* Branch Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Total Branches</p>
                  <h3 className="text-2xl font-light mt-2">{branchPerformanceData.length}</h3>
                  <p className="text-xs text-gray-500 mt-1">+2 new branches this year</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Best Performing</p>
                  <h3 className="text-2xl font-light mt-2">District 1</h3>
                  <p className="text-xs text-green-500 mt-1">₫4,000,000 in sales</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Needs Improvement</p>
                  <h3 className="text-2xl font-light mt-2">Thu Duc</h3>
                  <p className="text-xs text-red-500 mt-1">5.5% below target</p>
                </div>
              </motion.div>
            </div>

            {/* Branch Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 mb-8"
            >
              <h3 className="text-lg font-light mb-6">Branch Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchPerformanceData} style={{ fontFamily: 'inherit' }} margin={{ left: 0, right: 0, top: 0, bottom: 32 }}>
                    <CartesianGrid strokeDasharray="2 6" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#222"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={<RotatedTick />}
                      interval={0}
                      height={60}
                    />
                    <YAxis stroke="#222" fontSize={14} tickLine={false} axisLine={false} tickFormatter={v => v === 0 ? '' : `₫${v/1000000}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" name="Sales (₫)" fill="#111" radius={[12, 12, 8, 8]} barSize={32} />
                    <Bar dataKey="target" name="Target (₫)" fill="#999" radius={[12, 12, 8, 8]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Branch Comparison Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl border border-gray-100"
            >
              <h3 className="text-lg font-light mb-6">Branch Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 pr-6">Branch</th>
                      <th className="pb-3 pr-6">Sales</th>
                      <th className="pb-3 pr-6">Orders</th>
                      <th className="pb-3 pr-6">Target</th>
                      <th className="pb-3">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchPerformanceData.map((branch, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-6 font-medium text-gray-900">{branch.name}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">₫{branch.sales.toLocaleString()}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">{branch.orders}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">₫{branch.target.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-3 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${branch.sales >= branch.target ? "bg-green-500" : "bg-yellow-500"}`}
                                style={{ width: `${Math.min(100, (branch.sales / branch.target) * 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${branch.sales >= branch.target ? "text-green-500" : "text-yellow-500"}`}>
                              {Math.round((branch.sales / branch.target) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <>
            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Total Customers</p>
                  <h3 className="text-2xl font-light mt-2">24,532</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+5.2% vs last month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">New Customers</p>
                  <h3 className="text-2xl font-light mt-2">1,245</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12.5% vs last month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Retention Rate</p>
                  <h3 className="text-2xl font-light mt-2">85%</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+2.3% vs last month</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Customer Demographics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 mb-8"
            >
              <h3 className="text-lg font-light mb-6">Customer Demographics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerDemographicsData} layout="vertical" style={{ fontFamily: 'inherit' }}>
                    <CartesianGrid strokeDasharray="2 6" stroke="#e5e7eb" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="male" name="Male" fill="#666" radius={[0, 10, 10, 0]} barSize={24} />
                    <Bar dataKey="female" name="Female" fill="#999" radius={[0, 10, 10, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Customer Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Customers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <h3 className="text-lg font-light mb-6">Top Customers</h3>
                <div className="space-y-4">
                  {[
                    { name: "Nguyen Van A", orders: 25, spent: "₫4,500,000" },
                    { name: "Tran Thi B", orders: 18, spent: "₫3,200,000" },
                    { name: "Le Van C", orders: 15, spent: "₫2,800,000" },
                    { name: "Pham Thi D", orders: 12, spent: "₫2,500,000" },
                    { name: "Hoang Van E", orders: 10, spent: "₫2,100,000" },
                  ].map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {customer.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.orders} orders</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">{customer.spent}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Customer Acquisition Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <h3 className="text-lg font-light mb-6">Customer Acquisition</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySalesData} style={{ fontFamily: 'inherit' }}>
                      <CartesianGrid strokeDasharray="2 6" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                      <YAxis stroke="#222" fontSize={14} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        name="New Customers"
                        stroke="#111"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#111' }}
                        activeDot={{ r: 6, fill: '#111' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h3 className="text-lg font-light mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Generate Monthly Report', icon: Download },
              { label: 'Export Data', icon: Download },
              { label: 'Schedule Report', icon: Calendar },
              { label: 'Share Analytics', icon: Activity },
            ].map((action) => (
              <button
                key={action.label}
                className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all text-center group"
              >
                <action.icon size={20} className="mx-auto mb-2 text-gray-400 group-hover:text-gray-600" />
                <p className="text-sm text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gray-900 text-white p-8 rounded-2xl"
        >
          <h3 className="text-xl font-light mb-6">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Revenue Growth</p>
              <p className="text-2xl font-light mt-1">+12.5%</p>
              <p className="text-xs text-gray-400 mt-1">vs last period</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Customer Satisfaction</p>
              <p className="text-2xl font-light mt-1">4.8/5.0</p>
              <p className="text-xs text-gray-400 mt-1">from 1,245 reviews</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Inventory Turnover</p>
              <p className="text-2xl font-light mt-1">6.2x</p>
              <p className="text-xs text-gray-400 mt-1">improved by 15%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Prescription Accuracy</p>
              <p className="text-2xl font-light mt-1">99.8%</p>
              <p className="text-xs text-gray-400 mt-1">zero critical errors</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}