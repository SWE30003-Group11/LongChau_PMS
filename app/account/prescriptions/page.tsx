"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Download,
  Calendar,
  AlertCircle,
  Loader2,
  Plus
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Prescription {
  id: string
  user_id: string
  file_url: string
  file_name: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  expiry_date?: string
  created_at: string
}

const statusConfig = {
  pending: { label: 'Pending Review', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800' },
}

export default function PrescriptionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPrescriptions()
    }
  }, [user])

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrescriptions(data || [])
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a valid image (JPEG, PNG) or PDF file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      setUploadError("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setUploading(true)
    setUploadError("")
    setUploadSuccess("")

    try {
      // Upload file to Supabase storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName)

      // Create prescription record
      const { error: dbError } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_name: selectedFile.name,
          status: 'pending'
        })

      if (dbError) throw dbError

      setUploadSuccess("Prescription uploaded successfully!")
      setSelectedFile(null)
      setIsDialogOpen(false)
      fetchPrescriptions()
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload prescription")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (prescription: Prescription) => {
    try {
      const response = await fetch(prescription.file_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = prescription.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading prescription:', error)
    }
  }

  const getStatusIcon = (status: Prescription['status']) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-4 w-4" />
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => router.push('/account/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-light mb-2">My Prescriptions</h1>
                <p className="text-gray-600">Upload and manage your prescription documents</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Prescription</DialogTitle>
                    <DialogDescription>
                      Upload a clear photo or scan of your prescription. Accepted formats: JPEG, PNG, PDF (max 5MB)
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    {uploadError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {uploadError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {uploadSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                          {uploadSuccess}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="prescription-file">Select File</Label>
                      <Input
                        id="prescription-file"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="cursor-pointer"
                      />
                    </div>

                    {selectedFile && (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setSelectedFile(null)
                          setUploadError("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Prescriptions List */}
          {prescriptions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No prescriptions uploaded</h3>
                <p className="text-gray-500 mb-6">
                  Upload your prescriptions to order medicines online
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Prescription
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {prescription.file_name}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={statusConfig[prescription.status].color}
                      >
                        {getStatusIcon(prescription.status)}
                        <span className="ml-1">{statusConfig[prescription.status].label}</span>
                      </Badge>
                    </div>
                    <CardDescription>
                      Uploaded on {format(new Date(prescription.created_at), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prescription.status === 'approved' && prescription.approved_at && (
                      <div className="text-sm">
                        <p className="text-gray-600">
                          <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                          Approved on {format(new Date(prescription.approved_at), 'MMM d, yyyy')}
                        </p>
                        {prescription.expiry_date && (
                          <p className="text-gray-600 mt-1">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Expires on {format(new Date(prescription.expiry_date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    )}

                    {prescription.status === 'rejected' && prescription.rejection_reason && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800 text-sm">
                          {prescription.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownload(prescription)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {prescription.status === 'approved' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => router.push(`/shop?prescription=${prescription.id}`)}
                        >
                          Order Medicine
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}