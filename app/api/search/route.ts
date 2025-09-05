import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Search query must be at least 2 characters' }, { status: 400 })
    }

    const searchTerm = query.toLowerCase()
    let results: any[] = []

    // Search across different tables based on type
    if (type === 'all' || type === 'profiles') {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (profileData) {
        results = results.concat(profileData.map(p => ({ ...p, type: 'profile' })))
      }
    }

    if (type === 'all' || type === 'donations') {
      const { data: donationData } = await supabase
        .from('donations')
        .select('*, profiles!inner(full_name, email)')
        .or(`program.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (donationData) {
        results = results.concat(donationData.map(d => ({ ...d, type: 'donation' })))
      }
    }

    if (type === 'all' || type === 'volunteers') {
      const { data: volunteerData } = await supabase
        .from('volunteers')
        .select('*, profiles!inner(full_name, email)')
        .or(`skills.cs.{${searchTerm}},availability.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (volunteerData) {
        results = results.concat(volunteerData.map(v => ({ ...v, type: 'volunteer' })))
      }
    }

    // Get total counts for pagination
    let totalCounts = { profiles: 0, donations: 0, volunteers: 0 }
    
    if (type === 'all') {
      const [profileCount, donationCount, volunteerCount] = await Promise.all([
        supabase.from('profiles').select('count', { count: 'exact' }).or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`),
        supabase.from('donations').select('count', { count: 'exact' }).or(`program.ilike.%${searchTerm}%`),
        supabase.from('volunteers').select('count', { count: 'exact' }).or(`skills.cs.{${searchTerm}},availability.ilike.%${searchTerm}%`)
      ])

      totalCounts = {
        profiles: profileCount.count || 0,
        donations: donationCount.count || 0,
        volunteers: volunteerCount.count || 0
      }
    }

    // Sort combined results by created_at if type is 'all'
    if (type === 'all') {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return NextResponse.json({
      results,
      totalCounts,
      pagination: {
        limit,
        offset,
        total: results.length
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// Advanced search with filters
export async function POST(request: Request) {
  try {
    const {
      query,
      filters = {},
      type = 'all',
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = await request.json()

    if (!query && Object.keys(filters).length === 0) {
      return NextResponse.json({ error: 'Either query or filters are required' }, { status: 400 })
    }

    let results: any[] = []
    let totalCount = 0

    // Build base queries based on type
    if (type === 'profiles' || type === 'all') {
      let profileQuery = supabase.from('profiles').select('*')

      if (query) {
        profileQuery = profileQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      }

      if (filters.createdAfter) {
        profileQuery = profileQuery.gte('created_at', filters.createdAfter)
      }

      if (filters.createdBefore) {
        profileQuery = profileQuery.lte('created_at', filters.createdBefore)
      }

      const { data } = await profileQuery
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (data) {
        results = results.concat(data.map(p => ({ ...p, type: 'profile' })))
        totalCount += count || 0
      }
    }

    if (type === 'donations' || type === 'all') {
      let donationQuery = supabase.from('donations').select('*, profiles!inner(full_name, email)')

      if (query) {
        donationQuery = donationQuery.or(`program.ilike.%${query}%,profiles.full_name.ilike.%${query}%`)
      }

      if (filters.status) {
        donationQuery = donationQuery.eq('status', filters.status)
      }

      if (filters.program) {
        donationQuery = donationQuery.eq('program', filters.program)
      }

      if (filters.minAmount) {
        donationQuery = donationQuery.gte('amount', filters.minAmount)
      }

      if (filters.maxAmount) {
        donationQuery = donationQuery.lte('amount', filters.maxAmount)
      }

      if (filters.createdAfter) {
        donationQuery = donationQuery.gte('created_at', filters.createdAfter)
      }

      if (filters.createdBefore) {
        donationQuery = donationQuery.lte('created_at', filters.createdBefore)
      }

      const { data } = await donationQuery
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      const { count } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })

      if (data) {
        results = results.concat(data.map(d => ({ ...d, type: 'donation' })))
        totalCount += count || 0
      }
    }

    if (type === 'volunteers' || type === 'all') {
      let volunteerQuery = supabase.from('volunteers').select('*, profiles!inner(full_name, email)')

      if (query) {
        volunteerQuery = volunteerQuery.or(`skills.cs.{${query}},availability.ilike.%${query}%,profiles.full_name.ilike.%${query}%`)
      }

      if (filters.status) {
        volunteerQuery = volunteerQuery.eq('status', filters.status)
      }

      if (filters.skills && filters.skills.length > 0) {
        volunteerQuery = volunteerQuery.contains('skills', filters.skills)
      }

      if (filters.availability) {
        volunteerQuery = volunteerQuery.eq('availability', filters.availability)
      }

      if (filters.createdAfter) {
        volunteerQuery = volunteerQuery.gte('created_at', filters.createdAfter)
      }

      if (filters.createdBefore) {
        volunteerQuery = volunteerQuery.lte('created_at', filters.createdBefore)
      }

      const { data } = await volunteerQuery
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      const { count } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })

      if (data) {
        results = results.concat(data.map(v => ({ ...v, type: 'volunteer' })))
        totalCount += count || 0
      }
    }

    // Sort combined results
    if (type === 'all') {
      results.sort((a, b) => {
        const aValue = a[sortBy] || a.created_at
        const bValue = b[sortBy] || b.created_at
        return sortOrder === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime()
      })
    }

    return NextResponse.json({
      results,
      totalCount,
      pagination: {
        limit,
        offset,
        total: results.length
      }
    })
  } catch (error) {
    console.error('Advanced search error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}