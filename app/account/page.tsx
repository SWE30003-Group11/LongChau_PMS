"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const { signIn, signUp, user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/account/dashboard'
      router.push(redirectUrl)
    }
  }, [user, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation first
    if (!email || !password || !fullName) {
      setError("Please fill in all required fields")
      return
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await signUp(email, password, fullName, phone)
      
      if (error) throw error

      setSuccess("Account created successfully! Please check your email to verify your account.")
      // Clear form
      setEmail("")
      setPassword("")
      setFullName("")
      setPhone("")
      
      // Switch to login after 3 seconds
      setTimeout(() => {
        setIsLogin(true)
        setSuccess(null)
      }, 3000)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation first
    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }
    
    setLoading(true)
    setError(null)

    const startTime = Date.now()

    try {
      const { error } = await signIn(email, password)
      
      if (error) throw error

      // Log performance
      console.log(`Sign in took ${Date.now() - startTime}ms`)

      // Don't wait for navigation, let useEffect handle it
    } catch (error) {
      setError((error as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/banner/auth.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-light mb-4">Welcome to Long Chau</h2>
            <p className="text-xl font-light opacity-90">Your trusted pharmacy partner</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-light">
              Long Chau
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Return to Store
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-light mb-4">{isLogin ? "Sign In" : "Create Account"}</h1>
            <p className="text-gray-600">
              {isLogin
                ? "Access your orders, prescriptions, and health records"
                : "Join Long Chau to manage your healthcare needs online"}
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="rounded-full"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    className="rounded-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                className="rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                className="rounded-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link href="/account/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full rounded-full bg-gray-900 hover:bg-gray-800" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setSuccess(null)
                }} 
                className="ml-2 text-gray-900 hover:underline font-medium"
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Terms and Privacy */}
          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to Long Chau's{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}