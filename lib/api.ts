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

export async function getDonationAnalytics(type: string, userId?: string, filters?: Record<string, string>) {
  let query = supabase
    .from('donations')
    .select()
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('donor_id', userId)
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  const { data, error } = await query

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

// Volunteer Management
export async function createVolunteerApplication(application: Database['public']['Tables']['volunteers']['Insert']) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert(application)
    .select()
    .single()

  if (error) throw error
  return data
}

// Analytics and Reports
export async function getDonationStats() {
  const { data: totalDonations, error: totalError } = await supabase
    .from('donations')
    .select('*', { count: 'exact' })

  const { data: pendingDonations, error: pendingError } = await supabase
    .from('donations')
    .select('*', { count: 'exact' })
    .eq('status', 'pending')

  const { data: completedDonations, error: completedError } = await supabase
    .from('donations')
    .select('*', { count: 'exact' })
    .eq('status', 'completed')

  const { data: totalAmount, error: amountError } = await supabase
    .from('donations')
    .select('amount')
    .eq('status', 'completed')

  if (totalError || pendingError || completedError || amountError) {
    throw totalError || pendingError || completedError || amountError
  }

  const totalRaised = totalAmount?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0

  return {
    totalCount: totalDonations?.length || 0,
    pendingCount: pendingDonations?.length || 0,
    completedCount: completedDonations?.length || 0,
    totalRaised
  }
}

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
export async function sendNotification(type: string, data: Record<string, unknown>) {
  // This would integrate with your email service
  // For now, we'll log the notification
  console.log(`Notification: ${type}`, data)
  return { success: true }
}
