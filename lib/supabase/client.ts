// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for user roles
export type UserRole = 'customer' | 'pharmacist' | 'admin' | 'staff'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  date_of_birth?: string
  address?: string
  id_number?: string
  medical_conditions?: string
  allergies?: string
  created_at: string
  updated_at: string
  current_branch_id?: number // Add this line
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // First check if we have a valid userId
    if (!userId) {
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      // Silently return null for expected errors
      if (error.code === 'PGRST116') { // Row not found
        return null
      }
      
      // Only log unexpected errors in development
      if (process.env.NODE_ENV === 'development' && error.code !== 'PGRST116') {
        console.warn('Profile fetch error:', error.code, error.message)
      }
      
      return null
    }
    
    return data // will include current_branch_id
  } catch (error) {
    // Silently handle errors
    return null
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    return null
  }
}

export const updateUserBranch = async (userId: string, branchId: number) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ current_branch_id: branchId })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user branch:', error)
    return null
  }
}

// Role-based access control
export const checkUserRole = async (allowedRoles: UserRole[]): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    
    const profile = await getUserProfile(user.id)
    if (!profile) return false
    
    return allowedRoles.includes(profile.role)
  } catch (error) {
    return false
  }
}

// Sign out function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in signOut:', error)
  }
}