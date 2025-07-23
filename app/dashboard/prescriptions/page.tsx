"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Download, ArrowUpDown, CheckCircle, XCircle, Clock, FileText, AlertCircle, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import { format } from "date-fns"
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, profiles:profiles!prescriptions_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (error) return setLoading(false);
    setPrescriptions(data || []);
    // Generate signed URLs
    const urlMap: Record<string, string> = {};
    for (const p of data || []) {
      const filePath = p.file_path || extractFilePathFromUrl(p.file_url);
      if (filePath) {
        const { data: signed } = await supabase.storage.from('prescriptions').createSignedUrl(filePath, 60 * 60);
        if (signed?.signedUrl) urlMap[p.id] = signed.signedUrl;
        else urlMap[p.id] = p.file_url;
      }
    }
    setSignedUrls(urlMap);
    setLoading(false);
  }

  function extractFilePathFromUrl(url: string): string | null {
    const match = url.match(/prescriptions\/(.+)$/);
    return match ? match[1] : null;
  }

  async function handleApprove(id: string) {
    setReviewingId(id);
    await supabase.from('prescriptions').update({ status: 'approved', approved_at: new Date().toISOString(), rejection_reason: null }).eq('id', id);
    setReviewingId(null);
    fetchPrescriptions();
  }

  async function handleReject(id: string) {
    setReviewingId(id);
    await supabase.from('prescriptions').update({ status: 'rejected', rejection_reason: rejectionReason }).eq('id', id);
    setReviewingId(null);
    setRejectionReason("");
    fetchPrescriptions();
  }

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      (activeTab === "all" ||
        (activeTab === "approved" && p.status === "approved") ||
        (activeTab === "pending" && p.status === "pending") ||
        (activeTab === "rejected" && p.status === "rejected")) &&
      (p.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.profiles?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    }
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }
    return 0;
  });

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
  const approvedCount = prescriptions.filter(p => p.status === "approved").length
  const pendingCount = prescriptions.filter(p => p.status === "pending").length
  const rejectedCount = prescriptions.filter(p => p.status === "rejected").length

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
                    <th className="pb-3 pr-6">File</th>
                    <th className="pb-3 pr-6">User</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Uploaded</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrescriptions.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-6">
                        <button onClick={() => setPreviewUrl(signedUrls[p.id] || p.file_url)} className="text-blue-600 underline flex items-center gap-2">
                          <FileText size={16} />
                          {p.file_name}
                        </button>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900">{p.profiles?.full_name || p.user_id}</td>
                      <td className="py-4 pr-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-600">{format(new Date(p.created_at), 'MMM d, yyyy')}</td>
                      <td className="py-4 flex gap-2 items-center">
                        {p.status === 'pending' && (
                          <>
                            <button disabled={reviewingId === p.id} onClick={() => handleApprove(p.id)} className="px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200">Approve</button>
                            <button disabled={reviewingId === p.id} onClick={() => setReviewingId(p.id)} className="px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200">Reject</button>
                            {reviewingId === p.id && (
                              <div className="flex gap-2 items-center ml-2">
                                <input type="text" placeholder="Reason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="border px-2 py-1 rounded text-xs" />
                                <button onClick={() => handleReject(p.id)} className="px-2 py-1 rounded bg-red-500 text-white text-xs">Confirm</button>
                              </div>
                            )}
                          </>
                        )}
                        {p.status !== 'pending' && <span className="text-gray-400 text-xs">Done</span>}
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
        {/* Preview modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
              <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900">&times;</button>
              <Zoom>
                <img src={previewUrl} alt="Prescription Preview" className="max-h-[60vh] rounded shadow cursor-zoom-in mx-auto" />
              </Zoom>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}