"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash2, ArrowUpDown, Package, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/AuthContext"

export default function InventoryPage() {
  const { profile } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [editProduct, setEditProduct] = useState<any | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSupplier, setFilterSupplier] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    if (!profile?.current_branch_id) {
      setProducts([])
      setSuppliers([])
      setLoading(false)
      return
    }
    // Fetch products with supplier and inventory info for current branch
    const { data: productsData, error: prodErr } = await supabase
      .from("products")
      .select("*, supplier:suppliers(*), inventory:inventory(*)")
    const { data: suppliersData, error: supErr } = await supabase
      .from("suppliers").select("*")
    if (prodErr || supErr) {
      setError("Failed to load data")
      setLoading(false)
      return
    }
    // Only keep inventory for current branch
    const branchId = profile.current_branch_id
    const productsWithBranchInventory = (productsData || []).map((p: any) => ({
      ...p,
      inventory: (p.inventory || []).filter((inv: any) => inv.branch_id === branchId)
    }))
    setProducts(productsWithBranchInventory)
    setSuppliers(suppliersData || [])
    setLoading(false)
  }

  // Add/Edit Product
  function openAddProduct() {
    setEditProduct(null)
    setForm({})
    setShowAddEdit(true)
  }
  function openEditProduct(product: any) {
    setEditProduct(product)
    setForm({ ...product, supplier_id: product.supplier_id || product.supplier?.id })
    setShowAddEdit(true)
  }
  function closeAddEdit() {
    setShowAddEdit(false)
    setEditProduct(null)
    setForm({})
  }
  async function handleSaveProduct() {
    setSaving(true)
    setError(null)
    try {
      if (editProduct) {
        // Update
        const { error } = await supabase.from("products").update(form).eq("id", editProduct.id)
        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase.from("products").insert(form)
        if (error) throw error
      }
      closeAddEdit()
      fetchData()
    } catch (e: any) {
      setError(e.message || "Failed to save product")
    } finally {
      setSaving(false)
    }
  }
  // Delete Product
  function openDeleteProduct(product: any) {
    setDeleteProduct(product)
    setShowDelete(true)
  }
  function closeDelete() {
    setShowDelete(false)
    setDeleteProduct(null)
  }
  async function handleDeleteProduct() {
    if (!deleteProduct) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteProduct.id)
      if (error) throw error
      closeDelete()
      fetchData()
    } catch (e: any) {
      setError(e.message || "Failed to delete product")
    } finally {
      setSaving(false)
    }
  }
  // Update Stock
  async function handleUpdateStock(product: any, newQty: number) {
    setSaving(true)
    setError(null)
    try {
      const branchId = profile?.current_branch_id
      if (!branchId) throw new Error('No branch selected')
      const inv = (product.inventory || []).find((inv: any) => inv.branch_id === branchId)
      if (inv) {
        const { error } = await supabase.from("inventory").update({ quantity: newQty }).eq("id", inv.id)
        if (error) throw error
      } else {
        // Insert new inventory record for this branch
        const { error } = await supabase.from("inventory").insert({ product_id: product.id, branch_id: branchId, quantity: newQty })
        if (error) throw error
      }
      fetchData()
    } catch (e: any) {
      setError(e.message || "Failed to update stock")
    } finally {
      setSaving(false)
    }
  }

  // Filtering, sorting, and UI logic
  const categories = ["all", ...Array.from(new Set(products.map(p => (p.category || "").toLowerCase())))]
  const supplierOptions = ["all", ...Array.from(new Set(products.map(p => p.supplier?.name).filter(Boolean)))]

  const filteredItems = products.filter(
    (item) =>
      (activeCategory === "all" || (item.category || "").toLowerCase() === activeCategory) &&
      (filterCategory === "all" || (item.category || "").toLowerCase() === filterCategory) &&
      (filterSupplier === "all" || (item.supplier?.name || "") === filterSupplier) &&
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase())),
  )
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortField) return 0
    const fieldA = a[sortField]
    const fieldB = b[sortField]
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
    }
    return 0
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / productsPerPage)
  const paginatedItems = sortedItems.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  // Add this function for sorting
  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Calculate stats using inventory quantity
  const totalItems = products.length
  const lowStockItems = products.filter(item => (item.inventory?.[0]?.quantity ?? 0) <= 20).length
  const expiringItems = products.filter(item => {
    const expiryDate = item.inventory?.[0]?.expiry_date ? new Date(item.inventory[0].expiry_date) : null
    if (!expiryDate) return false
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  }).length

  function getStockStatus(stock: number) {
    if (stock > 100) return { color: "bg-green-50 text-green-700 border-green-200", label: "In Stock" }
    if (stock > 20) return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Low Stock" }
    return { color: "bg-red-50 text-red-700 border-red-200", label: "Critical" }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
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
            <h1 className="text-3xl font-light">Inventory</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <button className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center" onClick={openAddProduct}>
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
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => setShowFilter((v) => !v)}
                type="button"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
            {showFilter && (
              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select
                    className="rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:border-gray-400"
                    value={filterCategory}
                    onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Supplier</label>
                  <select
                    className="rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:border-gray-400"
                    value={filterSupplier}
                    onChange={e => { setFilterSupplier(e.target.value); setCurrentPage(1); }}
                  >
                    {supplierOptions.map((sup) => (
                      <option key={sup} value={sup}>{sup === "all" ? "All Suppliers" : sup}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
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
                  {paginatedItems.map((item) => {
                    const stock = item.inventory?.[0]?.quantity ?? 0
                    const expiry = item.inventory?.[0]?.expiry_date ?? "-"
                    const stockStatus = getStockStatus(stock)
                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pr-6 font-medium text-gray-900">{item.name}</td>
                        <td className="py-4 pr-6 text-sm text-gray-600">{item.category}</td>
                        <td className="py-4 pr-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>{stock} units</span>
                          {/* Inline stock update for staff */}
                          <input
                            type="number"
                            min={0}
                            className="ml-2 w-20 border rounded px-2 py-1 text-xs"
                            value={stock}
                            onChange={e => handleUpdateStock(item, Number(e.target.value))}
                            disabled={saving}
                          />
                        </td>
                        <td className="py-4 pr-6 text-sm text-gray-900">₫{item.price?.toLocaleString()}</td>
                        <td className="py-4 pr-6 text-sm text-gray-600">{item.supplier?.name}</td>
                        <td className="py-4 pr-6 text-sm text-gray-900">{expiry}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors" onClick={() => openEditProduct(item)}>
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-700 transition-colors" onClick={() => openDeleteProduct(item)}>
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
              Showing <span className="font-medium">{paginatedItems.length}</span> of <span className="font-medium">{sortedItems.length}</span> products
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

      {/* Add/Edit Product Modal */}
      <Dialog open={showAddEdit} onOpenChange={setShowAddEdit}>
        <DialogContent className="max-w-3xl w-full p-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl border border-gray-100 overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
          <div className="sticky top-0 z-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-t-3xl px-8 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between">
            <DialogTitle className="text-2xl font-light tracking-wide text-gray-900">{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogClose asChild>
              <button className="rounded-full p-2 hover:bg-gray-100 transition-colors"><span className="sr-only">Close</span><svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </DialogClose>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSaveProduct();
            }}
            className="space-y-8 px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            <div className="col-span-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">Basic Information</h3>
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Name</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.name || ""} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Generic Name</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.generic_name || ""} onChange={e => setForm((f: any) => ({ ...f, generic_name: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Category</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.category || ""} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Price</label>
              <input type="number" className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.price || ""} onChange={e => setForm((f: any) => ({ ...f, price: Number(e.target.value) }))} required />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Original Price</label>
              <input type="number" className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.original_price || ""} onChange={e => setForm((f: any) => ({ ...f, original_price: Number(e.target.value) }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Image URL</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.image || ""} onChange={e => setForm((f: any) => ({ ...f, image: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Prescription Required</label>
              <select className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.prescription_required ? "true" : "false"} onChange={e => setForm((f: any) => ({ ...f, prescription_required: e.target.value === "true" }))}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">In Stock</label>
              <select className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.in_stock ? "true" : "false"} onChange={e => setForm((f: any) => ({ ...f, in_stock: e.target.value === "true" }))}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Manufacturer</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.manufacturer || ""} onChange={e => setForm((f: any) => ({ ...f, manufacturer: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Pack Size</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.pack_size || ""} onChange={e => setForm((f: any) => ({ ...f, pack_size: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Strength</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.strength || ""} onChange={e => setForm((f: any) => ({ ...f, strength: e.target.value }))} />
            </div>
            <div className="col-span-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-wide mt-4">Details</h3>
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
              <textarea className="w-full border rounded-xl px-4 py-2 min-h-[60px] bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.description || ""} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Active Ingredient</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.active_ingredient || ""} onChange={e => setForm((f: any) => ({ ...f, active_ingredient: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Mechanism of Action</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.mechanism_of_action || ""} onChange={e => setForm((f: any) => ({ ...f, mechanism_of_action: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Indications</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.indications || ""} onChange={e => setForm((f: any) => ({ ...f, indications: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Warranty</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.warranty || ""} onChange={e => setForm((f: any) => ({ ...f, warranty: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Storage</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.storage || ""} onChange={e => setForm((f: any) => ({ ...f, storage: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Pregnancy Category</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.pregnancy_category || ""} onChange={e => setForm((f: any) => ({ ...f, pregnancy_category: e.target.value }))} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm mb-1 font-medium text-gray-700">Lactation</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.lactation || ""} onChange={e => setForm((f: any) => ({ ...f, lactation: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 font-medium text-gray-700">Images (comma separated)</label>
              <input className="w-full border rounded-xl px-4 py-2 bg-white/80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm" value={form.images || ""} onChange={e => setForm((f: any) => ({ ...f, images: e.target.value }))} />
            </div>
            {/* Sticky footer for actions */}
            <DialogFooter className="col-span-2 flex justify-end gap-4 mt-4 sticky bottom-0 bg-gradient-to-t from-white/90 to-transparent pt-6 pb-2 z-10">
              <button type="submit" className="px-8 py-3 bg-gray-900 text-white rounded-full text-lg font-semibold shadow hover:bg-gray-800 transition-colors" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <DialogClose asChild>
                <button type="button" className="px-8 py-3 border rounded-full text-lg font-semibold">Cancel</button>
              </DialogClose>
            </DialogFooter>
            {error && <div className="text-red-500 text-sm mt-2 col-span-2">{error}</div>}
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this product?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <button type="button" className="px-4 py-2 border rounded">Cancel</button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button type="button" className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteProduct} disabled={saving}>{saving ? "Deleting..." : "Delete"}</button>
            </AlertDialogAction>
          </AlertDialogFooter>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}