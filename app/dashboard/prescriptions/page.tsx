"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download, ArrowUpDown, CheckCircle, XCircle, Clock, FileText, AlertCircle, Activity } from "lucide-react"
import { motion } from "framer-motion"

// Mock prescriptions data
const prescriptions = [
  {
    id: "RX001",
    patient: "Nguyen Van A",
    doctor: "Dr. Tran Van B",
    date: "2024-06-01",
    status: "Approved",
    items: 2,
    notes: "Take with food.",
    branch: "District 1",
  },
  {
    id: "RX002",
    patient: "Le Thi C",
    doctor: "Dr. Pham Thi D",
    date: "2024-06-02",
    status: "Pending",
    items: 1,
    notes: "Check allergies.",
    branch: "District 2",
  },
  {
    id: "RX003",
    patient: "Tran Van E",
    doctor: "Dr. Nguyen Van F",
    date: "2024-06-03",
    status: "Rejected",
    items: 3,
    notes: "Incorrect dosage.",
    branch: "District 3",
  },
  {
    id: "RX004",
    patient: "Pham Thi G",
    doctor: "Dr. Le Van H",
    date: "2024-06-04",
    status: "Approved",
    items: 1,
    notes: "Monitor blood pressure.",
    branch: "District 7",
  },
  {
    id: "RX005",
    patient: "Hoang Van I",
    doctor: "Dr. Tran Thi J",
    date: "2024-06-05",
    status: "Pending",
    items: 4,
    notes: "Requires specialist consultation.",
    branch: "Thu Duc",
  },
];

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
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

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      (activeTab === "all" ||
        (activeTab === "approved" && prescription.status === "Approved") ||
        (activeTab === "pending" && prescription.status === "Pending") ||
        (activeTab === "rejected" && prescription.status === "Rejected")) &&
      (prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
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
      case "Approved":
        return <CheckCircle size={16} className="text-green-500" />
      case "Rejected":
        return <XCircle size={16} className="text-red-500" />
      case "Pending":
        return <Clock size={16} className="text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200"
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Calculate stats
  const totalPrescriptions = prescriptions.length
  const approvedCount = prescriptions.filter(p => p.status === "Approved").length
  const pendingCount = prescriptions.filter(p => p.status === "Pending").length
  const rejectedCount = prescriptions.filter(p => p.status === "Rejected").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-light">Prescriptions</h1>
            <p className="text-gray-500 mt-1">Manage and validate patient prescriptions</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Total</p>
                <h3 className="text-2xl font-light mt-2">{totalPrescriptions}</h3>
              </div>
              <FileText size={20} className="text-gray-400" />
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
                <p className="text-xs uppercase tracking-wider text-gray-500">Approved</p>
                <h3 className="text-2xl font-light mt-2">{approvedCount}</h3>
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
                <h3 className="text-2xl font-light mt-2">{pendingCount}</h3>
              </div>
              <Clock size={20} className="text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Rejected</p>
                <h3 className="text-2xl font-light mt-2">{rejectedCount}</h3>
              </div>
              <XCircle size={20} className="text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Alert for pending prescriptions */}
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 flex items-center"
          >
            <AlertCircle size={20} className="text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800">
              You have <span className="font-medium">{pendingCount} prescriptions</span> waiting for approval
            </p>
          </motion.div>
        )}

        {/* Main Table Card */}
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
                  placeholder="Search prescriptions..."
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
              {['all', 'approved', 'pending', 'rejected'].map((tab) => (
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
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("id")}>
                        Prescription ID
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("patient")}>
                        Patient
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("doctor")}>
                        Doctor
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">
                      <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                        Date
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="pb-3 pr-6">Branch</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Items</th>
                    <th className="pb-3 pr-6">Notes</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-6 font-medium text-gray-900">{prescription.id}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{prescription.patient}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{prescription.doctor}</td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{prescription.date}</td>
                      <td className="py-4 pr-6 text-sm text-gray-600">{prescription.branch}</td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center">
                          {getStatusIcon(prescription.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                            {prescription.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{prescription.items}</td>
                      <td className="py-4 pr-6 text-sm text-gray-600 max-w-xs truncate" title={prescription.notes}>
                        {prescription.notes}
                      </td>
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
              Showing <span className="font-medium">{sortedPrescriptions.length}</span> of{" "}
              <span className="font-medium">{prescriptions.length}</span> prescriptions
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