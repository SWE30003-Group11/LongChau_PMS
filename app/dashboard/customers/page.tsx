"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash2, ArrowUpDown, Mail, Phone, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCustomer, setEditCustomer] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user:profiles(*)')
        .not('user_id', 'is', null);
      if (ordersError) {
        setCustomers([]);
        setLoading(false);
        return;
      }
      // Extract unique users
      const userMap: Record<string, any> = {};
      (orders || []).forEach((o: any) => {
        if (o.user && o.user.id) userMap[o.user.id] = o.user;
      });
      const uniqueUsers = Object.values(userMap);
      setCustomers(uniqueUsers);
      setLoading(false);
    } catch (e: any) {
      setCustomers([]);
      setLoading(false);
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      (activeTab === "all" ||
        (activeTab === "active" && customer.status === "Active") ||
        (activeTab === "inactive" && customer.status === "Inactive") ||
        (activeTab === "new" && customer.status === "New")) &&
      (customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)),
  )

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
      case "Active":
        return "bg-green-50 text-green-700 border-green-200"
      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-200"
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  async function handleEditSave() {
    if (!editCustomer) return;
    setEditLoading(true);
    await supabase.from('profiles').update({
      full_name: editCustomer.full_name,
      phone: editCustomer.phone,
      address: editCustomer.address,
    }).eq('id', editCustomer.id);
    setEditLoading(false);
    setEditCustomer(null);
    fetchCustomers();
  }

  async function handleDeleteConfirm() {
    if (!deleteCustomer) return;
    setDeleteLoading(true);
    await supabase.from('profiles').delete().eq('id', deleteCustomer.id);
    setDeleteLoading(false);
    setDeleteCustomer(null);
    fetchCustomers();
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
            <h1 className="text-3xl font-light">Customers</h1>
            <p className="text-gray-500 mt-1">Manage your customer database</p>
          </motion.div>
          {/* Remove Add Customer button */}
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-light mt-2">{customers.length}</h3>
              </div>
              <Users size={20} className="text-gray-400" />
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Active Customers</p>
                <h3 className="text-2xl font-light mt-2">{customers.filter((c) => c.status === "Active").length}</h3>
              </div>
              <Users size={20} className="text-green-500" />
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
                <p className="text-xs uppercase tracking-wider text-gray-500">New Customers</p>
                <h3 className="text-2xl font-light mt-2">{customers.filter((c) => c.status === "New").length}</h3>
              </div>
              <Users size={20} className="text-blue-500" />
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
                  placeholder="Search customers..."
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

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="inline-flex bg-gray-50 rounded-full p-1">
              {['all', 'active', 'inactive', 'new'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
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
                    <th className="pb-3 pr-6">Name</th>
                    <th className="pb-3 pr-6">Role</th>
                    <th className="pb-3 pr-6">Contact</th>
                    <th className="pb-3 pr-6">Address</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {customer.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{customer.full_name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-700">{customer.role}</td>
                      <td className="py-4 pr-6">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Mail size={14} className="text-gray-400 mr-2" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={14} className="text-gray-400 mr-2" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{customer.address || '-'}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setEditCustomer({ ...customer })}>
                            <Edit size={16} />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-700 transition-colors" onClick={() => setDeleteCustomer(customer)}>
                            <Trash2 size={16} />
                          </button>
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
              Showing <span className="font-medium">{sortedCustomers.length}</span> of{" "}
              <span className="font-medium">{customers.length}</span> customers
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
        {/* Edit Customer Dialog */}
        <Dialog open={!!editCustomer} onOpenChange={open => { if (!open) setEditCustomer(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Update customer information and save changes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-full-name">Full Name</Label>
                <Input
                  id="edit-full-name"
                  value={editCustomer?.full_name || ""}
                  onChange={e => setEditCustomer((c: any) => ({ ...c, full_name: e.target.value }))}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editCustomer?.phone || ""}
                  onChange={e => setEditCustomer((c: any) => ({ ...c, phone: e.target.value }))}
                  placeholder="Phone"
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editCustomer?.address || ""}
                  onChange={e => setEditCustomer((c: any) => ({ ...c, address: e.target.value }))}
                  placeholder="Address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
              <Button onClick={handleEditSave} disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Customer Dialog */}
        <Dialog open={!!deleteCustomer} onOpenChange={open => { if (!open) setDeleteCustomer(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
              <DialogDescription>Are you sure you want to delete this customer? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCustomer(null)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} disabled={deleteLoading} variant="destructive">{deleteLoading ? "Deleting..." : "Delete"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}