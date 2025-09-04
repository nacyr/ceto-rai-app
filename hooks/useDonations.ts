import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Database } from '@/types/database'

type Donation = Database['public']['Tables']['donations']['Row']
type DonationInsert = Database['public']['Tables']['donations']['Insert']

export function useDonations() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchDonations()
    }
  }, [user])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/donations?userId=${user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch donations')
      const data = await response.json()
      setDonations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createDonation = async (donation: DonationInsert) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation),
      })
      
      if (!response.ok) throw new Error('Failed to create donation')
      
      const newDonation = await response.json()
      setDonations([newDonation, ...donations])
      return newDonation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    donations,
    loading,
    error,
    createDonation,
    refreshDonations: fetchDonations,
  }
}
