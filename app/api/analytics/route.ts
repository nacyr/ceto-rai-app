import { supabase } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try { 
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const startDate = searchParams.get('startDate')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const endDate = searchParams.get('endDate')

    let data: unknown

    switch (type) {
      case 'overview':
        // Basic overview statistics
        const [donationsRes, volunteersRes, profilesRes] = await Promise.all([
          supabase.from('donations').select('count', { count: 'exact' }),
          supabase.from('volunteers').select('count', { count: 'exact' }),
          supabase.from('profiles').select('count', { count: 'exact' })
        ])

        const donationsAmount = await supabase.from('donations').select('amount')
        const totalAmount = donationsAmount.data?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0

        data = {
          totalDonations: donationsRes.data?.[0]?.count || 0,
          totalVolunteers: volunteersRes.data?.[0]?.count || 0,
          totalUsers: profilesRes.data?.[0]?.count || 0,
          totalAmount: totalAmount
        }
        break

      case 'donations-by-program':
        const donationsByProgram = await supabase
          .from('donations')
          .select('program, amount')
          .then(res => {
            const programStats: { [key: string]: { count: number; total: number } } = {}
            res.data?.forEach(donation => {
              const program = donation.program || 'Other'
              if (!programStats[program]) {
                programStats[program] = { count: 0, total: 0 }
              }
              programStats[program].count++
              programStats[program].total += donation.amount || 0
            })
            return programStats
          })

        data = donationsByProgram
        break

      case 'volunteers-by-skills':
        const volunteersBySkills = await supabase
          .from('volunteers')
          .select('skills')
          .then(res => {
            const skillsCount: { [key: string]: number } = {}
            res.data?.forEach(volunteer => {
              const skills = volunteer.skills || []
              skills.forEach((skill: string) => {
                skillsCount[skill] = (skillsCount[skill] || 0) + 1
              })
            })
            return skillsCount
          })

        data = volunteersBySkills
        break

      case 'donations-trend':
        const donationsTrend = await supabase
          .from('donations')
          .select('amount, created_at')
          .order('created_at', { ascending: true })
          .then(res => {
            const dailyTotals: { [key: string]: number } = {}
            res.data?.forEach(donation => {
              const date = new Date(donation.created_at).toISOString().split('T')[0]
              dailyTotals[date] = (dailyTotals[date] || 0) + (donation.amount || 0)
            })
            return Object.entries(dailyTotals).map(([date, total]) => ({ date, total }))
          })

        data = donationsTrend
        break

      case 'volunteers-by-status':
        const volunteersByStatus = await supabase
          .from('volunteers')
          .select('status')
          .then(res => {
            const statusCount: { [key: string]: number } = {}
            res.data?.forEach(volunteer => {
              const status = volunteer.status || 'pending'
              statusCount[status] = (statusCount[status] || 0) + 1
            })
            return statusCount
          })

        data = volunteersByStatus
        break

      case 'recent-activity':
        const [recentDonations, recentVolunteers, recentUsers] = await Promise.all([
          supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('volunteers').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
        ])

        data = {
          donations: recentDonations.data || [],
          volunteers: recentVolunteers.data || [],
          users: recentUsers.data || []
        }
        break

      case 'monthly-stats':
        const monthlyStats = await supabase
          .from('donations')
          .select('amount, created_at')
          .then(res => {
            const monthlyTotals: { [key: string]: { donations: number; amount: number } } = {}
            res.data?.forEach(donation => {
              const month = new Date(donation.created_at).toISOString().slice(0, 7)
              if (!monthlyTotals[month]) {
                monthlyTotals[month] = { donations: 0, amount: 0 }
              }
              monthlyTotals[month].donations++
              monthlyTotals[month].amount += donation.amount || 0
            })
            return Object.entries(monthlyTotals).map(([month, stats]) => ({ month, ...stats }))
          })

        data = monthlyStats
        break

      default:
        data = { error: 'Invalid analytics type' }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}