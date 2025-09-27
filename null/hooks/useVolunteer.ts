import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Database } from '@/types/database'

type Volunteer = Database['public']['Tables']['volunteers']['Row']
type VolunteerInsert = Database['public']['Tables']['volunteers']['Insert']

export function useVolunteer() {
  const { user } = useAuth()
  const [volunteerStatus, setVolunteerStatus] = useState<Volunteer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchVolunteerStatus()
    }
  }, [user])

  const fetchVolunteerStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/volunteer?userId=${user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch volunteer status')
      const data = await response.json()
      setVolunteerStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const applyVolunteer = async (application: VolunteerInsert) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      })
      
      if (!response.ok) throw new Error('Failed to submit volunteer application')
      
      const newStatus = await response.json()
      setVolunteerStatus(newStatus)
      return newStatus
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    volunteerStatus,
    loading,
    error,
    applyVolunteer,
  }
}
