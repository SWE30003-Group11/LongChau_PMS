"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Camera, FileText, Check, AlertCircle, Clock, Shield, Phone, MessageCircle, Image, File, X, Eye, Download, Trash2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface UploadedFile {
  id: string
  file: File
  preview?: string
  status: "uploading" | "processing" | "approved" | "rejected" | "pending"
  rejectionReason?: string
  approvedBy?: string
  approvedAt?: Date
  expiryDate?: Date
}

interface PrescriptionProduct {
  id: number
  name: string
  dosage: string
  quantity: number
  prescriptionRequired: true
}

// Mock products that require prescription
const prescriptionProducts: PrescriptionProduct[] = [
  {
    id: 2,
    name: "Amoxicillin 500mg",
    dosage: "500mg x 3 times daily",
    quantity: 1,
    prescriptionRequired: true
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    dosage: "20mg once daily",
    quantity: 1,
    prescriptionRequired: true
  }
]

export default function PrescriptionUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [prescriptionType, setPrescriptionType] = useState<"new" | "existing">("new")
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    idNumber: "",
    address: "",
    medicalConditions: "",
    allergies: ""
  })
  const [consultationRequested, setConsultationRequested] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { user, profile, loading } = useAuth();

  // Robust auto-fill: only fill fields that are empty
  useEffect(() => {
    if (profile) {
      setPatientInfo((prev) => ({
        fullName: prev.fullName || profile.full_name || "",
        dateOfBirth: prev.dateOfBirth || profile.date_of_birth || "",
        phone: prev.phone || profile.phone || "",
        idNumber: prev.idNumber || profile.id_number || "",
        address: prev.address || profile.address || "",
        medicalConditions: prev.medicalConditions || profile.medical_conditions || "",
        allergies: prev.allergies || profile.allergies || "",
      }));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (!user) {
      alert("You must be logged in to upload prescriptions.");
      return;
    }
    setIsUploading(true)
    const newFiles: UploadedFile[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const id = `file-${Date.now()}-${i}`
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }
      const uploadedFile: UploadedFile = {
        id,
        file,
        preview,
        status: "uploading"
      }
      newFiles.push(uploadedFile)
    }
    setUploadedFiles(prev => [...prev, ...newFiles])
    // Upload to Supabase Storage
    for (const uploadedFile of newFiles) {
      try {
        const filePath = `${user.id}/${Date.now()}-${uploadedFile.file.name}`
        const { data, error } = await supabase.storage.from('prescriptions').upload(filePath, uploadedFile.file, {
          cacheControl: '3600',
          upsert: false
        })
        if (error) throw error
        // Get public URL
        const { data: urlData } = supabase.storage.from('prescriptions').getPublicUrl(filePath)
        // Insert into prescriptions table
        await supabase.from('prescriptions').insert({
          user_id: user.id,
          file_url: urlData.publicUrl,
          file_name: uploadedFile.file.name,
        })
        setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? { ...f, status: "pending" } : f))
      } catch (err) {
        setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? { ...f, status: "rejected", rejectionReason: (err as Error).message } : f))
      }
    }
    setIsUploading(false)
  }

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  // Remove file
  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  // Submit prescription
  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one prescription")
      return
    }

    if (!patientInfo.fullName || !patientInfo.dateOfBirth || !patientInfo.phone) {
      alert("Please fill in all required patient information")
      return
    }

    // Simulate submission
    setIsUploading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate approval
    setUploadedFiles(prev => 
      prev.map(f => ({
        ...f,
        status: "approved" as const,
        approvedBy: "Dr. Nguyen Van A",
        approvedAt: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }))
    )
    
    setIsUploading(false)
    
    // Show success message
    alert("Prescription uploaded successfully! You can now purchase the prescribed medications.")
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-light mb-2">Upload Prescription</h1>
          <p className="text-gray-600">Upload your prescription to purchase prescription-only medications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Type Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4">Prescription Type</h2>
              <RadioGroup value={prescriptionType} onValueChange={(value: "new" | "existing") => setPrescriptionType(value)}>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="new" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">New Prescription</div>
                      <p className="text-sm text-gray-600">Upload a prescription from your doctor</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="existing" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Refill Existing Prescription</div>
                      <p className="text-sm text-gray-600">Use a previously approved prescription</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4">Upload Prescription</h2>
              
              <Tabs defaultValue="upload" className="mb-6">
                <TabsList className="grid w-full grid-cols-2 rounded-full">
                  <TabsTrigger value="upload" className="rounded-full">Upload File</TabsTrigger>
                  <TabsTrigger value="camera" className="rounded-full">Take Photo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-6">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                      isUploading && "opacity-50 pointer-events-none"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="prescription-upload"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <label htmlFor="prescription-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Accepts JPG, PNG, PDF (Max 10MB per file)
                      </p>
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="camera" className="mt-6">
                  <div className="text-center p-8 bg-gray-50 rounded-xl">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Button className="rounded-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Take a clear photo of your prescription
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Uploaded Files</h3>
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border",
                        file.status === "approved" && "border-green-200 bg-green-50",
                        file.status === "rejected" && "border-red-200 bg-red-50",
                        file.status === "pending" && "border-yellow-200 bg-yellow-50",
                        (file.status === "uploading" || file.status === "processing") && "border-blue-200 bg-blue-50"
                      )}
                    >
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img src={file.preview} alt="Prescription" className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <File className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        
                        {/* Status */}
                        {file.status === "uploading" && (
                          <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                        )}
                        {file.status === "processing" && (
                          <p className="text-xs text-blue-600 mt-1">Processing...</p>
                        )}
                        {file.status === "pending" && (
                          <p className="text-xs text-yellow-600 mt-1">Pending review</p>
                        )}
                        {file.status === "approved" && (
                          <div className="text-xs text-green-600 mt-1">
                            <p>Approved by {file.approvedBy}</p>
                            <p>Valid until: {file.expiryDate?.toLocaleDateString()}</p>
                          </div>
                        )}
                        {file.status === "rejected" && (
                          <p className="text-xs text-red-600 mt-1">{file.rejectionReason}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {file.preview && (
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === "uploading" || file.status === "processing"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter patient's full name"
                    value={patientInfo.fullName}
                    onChange={(e) => setPatientInfo({...patientInfo, fullName: e.target.value})}
                    className="rounded-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patientInfo.dateOfBirth}
                    onChange={(e) => setPatientInfo({...patientInfo, dateOfBirth: e.target.value})}
                    className="rounded-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                    className="rounded-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="idNumber">ID/Passport Number</Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter ID number"
                    value={patientInfo.idNumber}
                    onChange={(e) => setPatientInfo({...patientInfo, idNumber: e.target.value})}
                    className="rounded-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                    className="rounded-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder="List any existing medical conditions"
                    value={patientInfo.medicalConditions}
                    onChange={(e) => setPatientInfo({...patientInfo, medicalConditions: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="allergies">Allergies (if any)</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any known allergies"
                    value={patientInfo.allergies}
                    onChange={(e) => setPatientInfo({...patientInfo, allergies: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Products Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4">Select Products (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the products you want to purchase with this prescription
              </p>
              
              <div className="space-y-3">
                {prescriptionProducts.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id])
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                        }
                      }}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.dosage}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Consultation Option */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consultationRequested}
                  onChange={(e) => setConsultationRequested(e.target.checked)}
                  className="rounded mt-1"
                />
                <div>
                  <h3 className="font-medium mb-1">Request Pharmacist Consultation</h3>
                  <p className="text-sm text-gray-600">
                    Our licensed pharmacist will review your prescription and contact you if there are any questions
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0 || isUploading}
              className="w-full rounded-full py-6 text-lg"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-5 w-5 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Submit Prescription
                </>
              )}
            </Button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guidelines */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Prescription Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Prescription must be from a licensed doctor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Must be dated within the last 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Doctor's signature and stamp must be visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Patient information must match</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>No alterations or corrections allowed</span>
                </li>
              </ul>
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-medium">Your Privacy Matters</h3>
              </div>
              <p className="text-sm text-gray-700">
                All prescriptions are securely stored and only accessible by licensed pharmacists. 
                We comply with all healthcare privacy regulations.
              </p>
            </div>

            {/* Processing Time */}
            <div className="bg-amber-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-amber-600" />
                <h3 className="text-lg font-medium">Processing Time</h3>
              </div>
              <p className="text-sm text-gray-700">
                Prescriptions are typically reviewed within 15-30 minutes during business hours. 
                You'll receive an SMS notification once approved.
              </p>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Pharmacist: 1800 6928
                </Button>
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat Support
                </Button>
              </div>
            </div>

            {/* Sample Prescription */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Sample Prescription</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <Image className="h-32 w-full text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                Click to view a sample of an acceptable prescription format
              </p>
              <Button variant="outline" className="w-full mt-3 rounded-full">
                <Eye className="mr-2 h-4 w-4" />
                View Sample
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}