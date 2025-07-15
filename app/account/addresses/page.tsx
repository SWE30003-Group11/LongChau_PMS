"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  MapPin, 
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SavedAddress {
  id: string
  user_id: string
  label: string
  address: string
  is_default: boolean
  created_at: string
}

const labelIcons = {
  Home: Home,
  Work: Briefcase,
  Other: MapPin,
}

export default function SavedAddressesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
  const [label, setLabel] = useState("Home")
  const [address, setAddress] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('saved_addresses')
          .update({
            label,
            address,
            is_default: isDefault
          })
          .eq('id', editingAddress.id)

        if (error) throw error
        setSuccess("Address updated successfully!")
      } else {
        // Create new address
        const { error } = await supabase
          .from('saved_addresses')
          .insert({
            user_id: user!.id,
            label,
            address,
            is_default: isDefault
          })

        if (error) throw error
        setSuccess("Address added successfully!")
      }

      // If setting as default, update other addresses
      if (isDefault) {
        await supabase
          .from('saved_addresses')
          .update({ is_default: false })
          .eq('user_id', user!.id)
          .neq('id', editingAddress?.id || '')
      }

      resetForm()
      setIsDialogOpen(false)
      fetchAddresses()
    } catch (error: any) {
      setError(error.message || "Failed to save address")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setDeleting(addressId)
    try {
      const { error } = await supabase
        .from('saved_addresses')
        .delete()
        .eq('id', addressId)

      if (error) throw error
      
      setAddresses(addresses.filter(a => a.id !== addressId))
      setSuccess("Address deleted successfully!")
    } catch (error: any) {
      setError(error.message || "Failed to delete address")
    } finally {
      setDeleting(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      // First, set all addresses to non-default
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('user_id', user!.id)

      // Then set the selected address as default
      const { error } = await supabase
        .from('saved_addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      if (error) throw error
      
      fetchAddresses()
      setSuccess("Default address updated!")
    } catch (error: any) {
      setError(error.message || "Failed to update default address")
    }
  }

  const openEditDialog = (address: SavedAddress) => {
    setEditingAddress(address)
    setLabel(address.label)
    setAddress(address.address)
    setIsDefault(address.is_default)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingAddress(null)
    setLabel("Home")
    setAddress("")
    setIsDefault(false)
    setError("")
  }

  const getIcon = (label: string) => {
    const Icon = labelIcons[label as keyof typeof labelIcons] || MapPin
    return <Icon className="h-5 w-5" />
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
                <h1 className="text-3xl font-light mb-2">Saved Addresses</h1>
                <p className="text-gray-600">Manage your delivery addresses</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingAddress 
                          ? 'Update your saved address details' 
                          : 'Add a new address for faster checkout'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                      {error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-800">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="label">Label</Label>
                        <Select value={label} onValueChange={setLabel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">
                              <div className="flex items-center">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                              </div>
                            </SelectItem>
                            <SelectItem value="Work">
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Work
                              </div>
                            </SelectItem>
                            <SelectItem value="Other">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Other
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <textarea
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full min-h-[100px] rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="Enter your complete address including street, city, and postal code"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="isDefault" className="text-sm font-normal">
                          Set as default address
                        </Label>
                      </div>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {editingAddress ? 'Update' : 'Save'} Address
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Check className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved addresses</h3>
                <p className="text-gray-500 mb-6">
                  Add your addresses for faster checkout
                </p>
                <Button 
                  className="rounded-full"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((addr) => (
                <Card key={addr.id} className="relative">
                  {addr.is_default && (
                    <Badge 
                      className="absolute top-4 right-4 bg-green-100 text-green-800"
                      variant="secondary"
                    >
                      Default
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getIcon(addr.label)}
                      <span>{addr.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                      {addr.address}
                    </p>
                    <div className="flex space-x-2">
                      {!addr.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(addr.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(addr)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleting === addr.id}
                      >
                        {deleting === addr.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
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