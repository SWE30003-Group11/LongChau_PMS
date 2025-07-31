"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface PrescriptionStatus {
  hasPrescription: boolean
  isApproved: boolean
  isLoading: boolean
  error: string | null
}

export function usePrescription(productId?: number) {
  const { user } = useAuth()
  const [status, setStatus] = useState<PrescriptionStatus>({
    hasPrescription: false,
    isApproved: false,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    async function checkPrescriptionStatus() {
      if (!user) {
        setStatus({
          hasPrescription: false,
          isApproved: false,
          isLoading: false,
          error: null
        })
        return
      }

      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }))

        const { data: prescriptions, error } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        if (productId) {
          // Check if user has an approved prescription for this specific product
          const hasApprovedPrescriptionForProduct = prescriptions?.some(p => 
            p.status === 'approved' && 
            p.selected_products && 
            p.selected_products.includes(productId)
          )
          const hasPrescriptionForProduct = prescriptions?.some(p => 
            p.selected_products && 
            p.selected_products.includes(productId)
          )

          setStatus({
            hasPrescription: hasPrescriptionForProduct,
            isApproved: hasApprovedPrescriptionForProduct,
            isLoading: false,
            error: null
          })
        } else {
          // Check if user has any approved prescriptions (for general prescription status)
          const hasApprovedPrescription = prescriptions?.some(p => p.status === 'approved')
          const hasAnyPrescription = prescriptions && prescriptions.length > 0

          setStatus({
            hasPrescription: hasAnyPrescription,
            isApproved: hasApprovedPrescription,
            isLoading: false,
            error: null
          })
        }
      } catch (error: any) {
        setStatus({
          hasPrescription: false,
          isApproved: false,
          isLoading: false,
          error: error.message
        })
      }
    }

    checkPrescriptionStatus()
  }, [user, productId])

  return status
} 