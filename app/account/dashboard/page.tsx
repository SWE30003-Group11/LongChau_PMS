"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Package, 
  Heart,
  Settings,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react"
import { supabase, updateUserProfile, UserProfile } from "@/lib/supabase/client"
import { format } from "date-fns"

export default function AccountDashboardPage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Form states
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [allergies, setAllergies] = useState("")

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalPrescriptions: 0,
    favoriteProducts: 0,
    savedAddresses: 0
  })

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setPhone(profile.phone || "")
      setDateOfBirth(profile.date_of_birth || "")
      setAddress(profile.address || "")
      setIdNumber(profile.id_number || "")
      setMedicalConditions(profile.medical_conditions || "")
      setAllergies(profile.allergies || "")
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    if (!user) return

    try {
      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch prescriptions count
      const { count: prescriptionsCount } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch favorite products count
      const { count: favoritesCount } = await supabase
        .from('favorite_products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Fetch saved addresses count
      const { count: addressesCount } = await supabase
        .from('saved_addresses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setStats({
        totalOrders: ordersCount || 0,
        totalPrescriptions: prescriptionsCount || 0,
        favoriteProducts: favoritesCount || 0,
        savedAddresses: addressesCount || 0
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Prepare updates object with proper typing
      const updates: Partial<UserProfile> = {
        full_name: fullName,
        phone: phone || undefined,
        date_of_birth: dateOfBirth || undefined,
        address: address || undefined,
        id_number: idNumber || undefined,
        medical_conditions: medicalConditions || undefined,
        allergies: allergies || undefined,
      }

      const result = await updateUserProfile(user!.id, updates)
      
      if (result) {
        setSuccess("Profile updated successfully!")
        await refreshProfile()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Show loading state while profile is being fetched
  if (!user || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm mb-8 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl bg-gray-100">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-light mb-1">{profile.full_name || 'User'}</h1>
                  <p className="text-gray-500">{profile.email}</p>
                  {profile.role !== 'customer' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                      {profile.role}
                    </span>
                  )}
                </div>
              </div>
              {profile.role !== 'customer' && (
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to PMS Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                  </div>
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Prescriptions</p>
                    <p className="text-2xl font-semibold">{stats.totalPrescriptions}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Favorites</p>
                    <p className="text-2xl font-semibold">{stats.favoriteProducts}</p>
                  </div>
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Saved Addresses</p>
                    <p className="text-2xl font-semibold">{stats.savedAddresses}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-white p-1 shadow-sm">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="medical">Medical Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <Check className="h-4 w-4" />
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          className="rounded-full"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="rounded-full"
                          placeholder="+84 123 456 789"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="rounded-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idNumber">ID Number</Label>
                        <Input
                          id="idNumber"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          className="rounded-full"
                          placeholder="Enter your ID number"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="rounded-full"
                          placeholder="Enter your full address"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="rounded-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>
                    Keep your medical information up to date for better healthcare service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicalConditions">Medical Conditions</Label>
                        <textarea
                          id="medicalConditions"
                          value={medicalConditions}
                          onChange={(e) => setMedicalConditions(e.target.value)}
                          className="w-full min-h-[100px] rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="List any medical conditions (e.g., diabetes, hypertension)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <textarea
                          id="allergies"
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          className="w-full min-h-[100px] rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="List any allergies (e.g., penicillin, latex, food allergies)"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="rounded-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Save Medical Information
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Password</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Change your password to keep your account secure
                      </p>
                      <Button 
                        variant="outline" 
                        className="rounded-full"
                        onClick={() => router.push('/account/change-password')}
                      >
                        Change Password
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Account Created</h3>
                      <p className="text-sm text-gray-500">
                        {profile.created_at && format(new Date(profile.created_at), 'MMMM d, yyyy')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Last Updated</h3>
                      <p className="text-sm text-gray-500">
                        {profile.updated_at && format(new Date(profile.updated_at), 'MMMM d, yyyy \'at\' h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}