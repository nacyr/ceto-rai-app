import { supabase } from './supabase'
import { Database } from '../types/database'

// Profile Management
export async function createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(profile: Database['public']['Tables']['profiles']['Update']) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Donation Management
export async function createDonation(donation: Database['public']['Tables']['donations']['Insert']) {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDonationHistory(userId: string) {
  const { data, error } = await supabase
    .from('donations')
    .select()
    .eq('donor_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      profiles!inner(email, full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDonationsByStatus(status: string) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      profiles!inner(email, full_name)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateDonationStatus(id: string, status: string, adminNote?: string) {
  const { data, error } = await supabase
    .from('donations')
    .update({ 
      status, 
      admin_note: adminNote,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateVolunteerStatus(id: string, status: string, adminNote?: string) {
  const { data, error } = await supabase
    .from('volunteers')
    .update({ 
      status, 
      admin_note: adminNote,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDonationAnalytics(type: string, filters?: Record<string, string>) {
  const { data, error } = await supabase
    .from('donations')
    .select()
    .eq('donor_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVolunteerStatus(userId: string) {
  const { data, error } = await supabase
    .from('volunteers')
    .select()
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getAllVolunteers() {
  const { data, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      profiles!inner(email, full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVolunteersByStatus(status: string) {
  const { data, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      profiles!inner(email, full_name)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVolunteerStats() {
  const { data: totalVolunteers, error: totalError } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })

  const { data: activeVolunteers, error: activeError } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  const { data: pendingVolunteers, error: pendingError } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact' })
    .eq('status', 'pending')

  if (totalError || activeError || pendingError) throw totalError || activeError || pendingError

  return {
    totalCount: totalVolunteers?.length || 0,
    activeCount: activeVolunteers?.length || 0,
    pendingCount: pendingVolunteers?.length || 0
  }
}

// Analytics and Reports
export async function getDashboardStats() {
  const [donationStats, volunteerStats] = await Promise.all([
    getDonationStats(),
    getVolunteerStats()
  ])

  return {
    donations: donationStats,
    volunteers: volunteerStats
  }
}

// Email and Notification Utilities
export async function sendNotification(type: string, data: any) {
  // This would integrate with your email service
  // For now, we'll log the notification
  console.log(`Notification: ${type}`, data)
  return { success: true }
}
