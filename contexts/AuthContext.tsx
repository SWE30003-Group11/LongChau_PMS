// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, UserProfile, getUserProfile, UserRole } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  hasRole: (roles: UserRole[]) => boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  const refreshProfile = useCallback(async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)
    }
  }, [user])

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      // Skip if already initialized
      if (isInitialized) return

      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            // Fetch profile in parallel, don't wait
            getUserProfile(session.user.id).then(userProfile => {
              if (mounted && userProfile) {
                setProfile(userProfile)
              }
            })
          } else {
            setUser(null)
            setProfile(null)
          }
          setIsInitialized(true)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
          setProfile(null)
          setIsInitialized(true)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user)
          // Don't block on profile fetch
          getUserProfile(session.user.id).then(userProfile => {
            if (mounted && userProfile) {
              setProfile(userProfile)
            }
          })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [isInitialized])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Start sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Set user immediately
      if (data.user) {
        setUser(data.user)
        
        // Fetch profile asynchronously (don't wait)
        getUserProfile(data.user.id).then(userProfile => {
          if (userProfile) {
            setProfile(userProfile)
          }
        })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      })

      if (error) throw error

      // After successful signup, ensure profile exists
      if (data.user) {
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try to get the profile
        const profile = await getUserProfile(data.user.id)
        
        // If no profile exists, create one manually
        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              phone: phone,
              role: 'customer'
            })
            .single()
          
          if (profileError && profileError.code !== '23505') { // 23505 is unique violation
            console.warn('Failed to create profile:', profileError)
          }
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      // Clear state immediately for faster UX
      setUser(null)
      setProfile(null)
      
      // Then sign out from Supabase
      await supabase.auth.signOut()
      
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Already cleared state, just navigate
      router.push('/')
    }
  }, [router])

  const hasRole = useCallback((roles: UserRole[]) => {
    if (!profile) return false
    return roles.includes(profile.role)
  }, [profile])

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}