"use client"

import { useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, ArrowUpDown, Package, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

// Mock inventory data
const inventoryItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    stock: 250,
    price: 15000,
    supplier: "Pharma Co.",
    expiry: "2025-12-31",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    stock: 120,
    price: 45000,
    supplier: "MediPharm",
    expiry: "2025-10-15",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    category: "Vitamins",
    stock: 300,
    price: 25000,
    supplier: "HealthPlus",
    expiry: "2026-05-20",
  },
  {
    id: 4,
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    stock: 180,
    price: 18000,
    supplier: "Pharma Co.",
    expiry: "2025-11-30",
  },
  {
    id: 5,
    name: "Cetirizine 10mg",
    category: "Allergy",
    stock: 90,
    price: 22000,
    supplier: "MediPharm",
    expiry: "2025-09-15",
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    category: "Digestive",
    stock: 15,
    price: 35000,
    supplier: "HealthPlus",
    expiry: "2025-08-25",
  },
  {
    id: 7,
    name: "Metformin 500mg",
    category: "Diabetes",
    stock: 8,
    price: 42000,
    supplier: "Pharma Co.",
    expiry: "2025-07-10",
  },
  {
    id: 8,
    name: "Atorvastatin 10mg",
    category: "Cholesterol",
    stock: 45,
    price: 55000,
    supplier: "MediPharm",
    expiry: "2025-06-20",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeCategory, setActiveCategory] = useState("all")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get unique categories for the filter tabs
  const categories = ["all", ...new Set(inventoryItems.map(item => item.category.toLowerCase()))]

  const filteredItems = inventoryItems.filter(
    (item) =>
      (activeCategory === "all" || item.category.toLowerCase() === activeCategory) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
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

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { color: "bg-green-50 text-green-700 border-green-200", label: "In Stock" }
    if (stock > 20) return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Low Stock" }
    return { color: "bg-red-50 text-red-700 border-red-200", label: "Critical" }
  }

  // Calculate stats
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.stock <= 20).length
  const expiringItems = inventoryItems.filter(item => {
    const expiryDate = new Date(item.expiry)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-light">Inventory</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <button className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
              <Plus size={16} className="mr-2" />
              Add Product
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Products</p>
                <h3 className="text-2xl font-light mt-2">{totalItems}</h3>
              </div>
              <Package size={20} className="text-gray-400" />
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Low Stock</p>
                <h3 className="text-2xl font-light mt-2">{lowStockItems}</h3>
              </div>
              <AlertTriangle size={20} className="text-yellow-500" />
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Expiring Soon</p>
                <h3 className="text-2xl font-light mt-2">{expiringItems}</h3>
              </div>
              <AlertTriangle size={20} className="text-red-500" />
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

          {/* Category Tabs */}
          <div className="px-6 pt-4">
            <div className="inline-flex bg-gray-50 rounded-full p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all ${
                    activeCategory === category
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category === "all" ? "All" : category}
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
                      <button className="flex items-center gap-1" onClick={() => handleSort("name")}>
                        Product Name
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("category")}>
                        Category
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("stock")}>
                        Stock
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("price")}>
                        Price
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("supplier")}>
                        Supplier
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("expiry")}>
                        Expiry Date
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => {
                    const stockStatus = getStockStatus(item.stock)
                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-6 font-medium text-gray-900">{item.name}</td>
                        <td className="py-4 pr-6 text-sm text-gray-600">{item.category}</td>
                        <td className="py-4 pr-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                            {item.stock} units
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-sm text-gray-900">₫{item.price.toLocaleString()}</td>
                        <td className="py-4 pr-6 text-sm text-gray-600">{item.supplier}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">{item.expiry}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{sortedItems.length}</span> of{" "}
              <span className="font-medium">{inventoryItems.length}</span> products
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