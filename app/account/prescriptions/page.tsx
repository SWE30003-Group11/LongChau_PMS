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
  Plus,
  Eye
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Prescription {
  id: string
  user_id: string
  file_url: string
  file_name: string
  file_path?: string // <-- add this
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (user) {
      fetchPrescriptions()
    }
  }, [user])

  // Fetch prescriptions and generate signed URLs for preview
  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setPrescriptions(data || [])
      // Generate signed URLs for all prescriptions
      const urlMap: Record<string, string> = {}
      for (const p of data || []) {
        const filePath = p.file_path || extractFilePathFromUrl(p.file_url)
        if (filePath) {
          const { data: signed, error: signErr } = await supabase.storage.from('prescriptions').createSignedUrl(filePath, 60 * 60)
          if (signed?.signedUrl) {
            urlMap[p.id] = signed.signedUrl
          } else {
            urlMap[p.id] = p.file_url // fallback
          }
        }
      }
      setSignedUrls(urlMap)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper to extract file path from public URL
  function extractFilePathFromUrl(url: string): string | null {
    // Example: https://<project>.supabase.co/storage/v1/object/public/prescriptions/userid/filename.jpg
    const match = url.match(/prescriptions\/(.+)$/)
    return match ? match[1] : null
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
      const response = await fetch(signedUrls[prescription.id] || prescription.file_url)
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
      <TooltipProvider>
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
              <Button 
                className="rounded-full"
                onClick={() => router.push('/prescriptions')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Prescription
              </Button>
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
                <Button 
                  className="rounded-full"
                  onClick={() => router.push('/prescriptions')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Prescription
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription) => {
                const isImage = prescription.file_name.match(/\.(jpg|jpeg|png)$/i);
                const isPdf = prescription.file_name.match(/\.pdf$/i);
                return (
                  <Card key={prescription.id} className="overflow-hidden shadow-lg border border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {isImage && (
                            <img src={signedUrls[prescription.id] || prescription.file_url} alt="Preview" className="w-8 h-8 object-cover rounded shadow border" />
                          )}
                          {isPdf && (
                            <FileText className="w-8 h-8 text-red-500" />
                          )}
                          <span className="truncate max-w-[120px]" title={prescription.file_name}>{prescription.file_name}</span>
                        </CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="secondary" 
                              className={statusConfig[prescription.status].color + " cursor-help"}
                            >
                              {getStatusIcon(prescription.status)}
                              <span className="ml-1">{statusConfig[prescription.status].label}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              {prescription.status === 'pending' && 'Your prescription is awaiting review by a pharmacist.'}
                              {prescription.status === 'approved' && 'Your prescription has been approved and is valid for ordering medicines.'}
                              {prescription.status === 'rejected' && 'Your prescription was rejected. See reason below.'}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <CardDescription>
                        Uploaded on {format(new Date(prescription.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Type: {isImage ? 'Image' : isPdf ? 'PDF' : 'File'}</span>
                        <span>•</span>
                        <span>Size: {/* Not available, unless you store it */}</span>
                        {prescription.expiry_date && (
                          <><span>•</span><span>Expires: {format(new Date(prescription.expiry_date), 'MMM d, yyyy')}</span></>
                        )}
                      </div>
                      {prescription.status === 'approved' && prescription.approved_at && (
                        <div className="text-sm flex flex-col gap-1">
                          <span className="text-green-700 flex items-center gap-1">
                            <CheckCircle className="inline h-4 w-4 text-green-600" />
                            Approved on {format(new Date(prescription.approved_at), 'MMM d, yyyy')}
                          </span>
                          {prescription.approved_by && (
                            <span className="text-gray-500">By: {prescription.approved_by}</span>
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownload(prescription)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        {(isImage || isPdf) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPreviewUrl(signedUrls[prescription.id] || prescription.file_url)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        )}
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
                      {/* Status Timeline */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`h-2 w-2 rounded-full ${prescription.status === 'pending' ? 'bg-yellow-400' : prescription.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="h-1 w-8 bg-gray-200 rounded-full" />
                        <div className={`h-2 w-2 rounded-full ${prescription.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="h-1 w-8 bg-gray-200 rounded-full" />
                        <div className={`h-2 w-2 rounded-full ${prescription.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-xs text-gray-400">{prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {/* Modal for preview */}
          {previewUrl && (
            <Dialog open={!!previewUrl} onOpenChange={() => { setPreviewUrl(null); setImageDimensions(null); }}>
              <DialogContent
                className="flex flex-col items-center justify-center"
                style={
                  imageDimensions
                    ? {
                        width: Math.min(imageDimensions.width, 800),
                        height: Math.min(imageDimensions.height, 600),
                        aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                        maxWidth: '95vw',
                        maxHeight: '80vh',
                      }
                    : { maxWidth: '95vw', maxHeight: '80vh' }
                }
              >
                <DialogHeader>
                  <DialogTitle>Prescription Preview</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center w-full h-full">
                  {previewUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                    // @ts-ignore
                    <Zoom>
                      <img
                        src={previewUrl}
                        alt="Prescription Preview"
                        className="object-contain w-full h-full rounded shadow cursor-zoom-in"
                        onLoad={e => {
                          const img = e.currentTarget;
                          setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                        }}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          aspectRatio: imageDimensions ? `${imageDimensions.width} / ${imageDimensions.height}` : undefined,
                        }}
                      />
                    </Zoom>
                  ) : (
                    <PDFZoomViewer url={previewUrl} />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      </TooltipProvider>
    </ProtectedRoute>
  )
}

function PDFZoomViewer({ url }: { url: string }) {
  const [scale, setScale] = useState(1.0);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-2 flex gap-2">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="px-2 py-1 rounded bg-gray-200">-</button>
        <span className="text-sm">Zoom: {(scale * 100).toFixed(0)}%</span>
        <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="px-2 py-1 rounded bg-gray-200">+</button>
      </div>
      <iframe
        src={url}
        title="Prescription PDF"
        className="w-full rounded shadow border"
        style={{ height: '60vh', transform: `scale(${scale})`, transformOrigin: 'top left' }}
      />
    </div>
  );
}