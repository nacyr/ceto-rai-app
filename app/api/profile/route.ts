import { NextResponse } from 'next/server'
import { createProfile, updateProfile, getProfile } from '@/lib/api'
import { supabase } from '@/lib/supabaseServer'

// Create a new profile
export async function POST(request: Request) {
  try {
    const profile = await request.json()
    const data = await createProfile(profile)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Update existing profile
export async function PUT(request: Request) {
  try {
    const profile = await request.json()
    const data = await updateProfile(profile)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Get profile(s) with filtering options
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const admin = searchParams.get('admin') === 'true'
    const email = searchParams.get('email')

    let data

    if (admin) {
      // Admin endpoints
      if (email) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select()
          .eq('email', email)
          .single()
        
        if (error) throw error
        data = profileData
      } else {
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        data = profilesData
      }
    } else {
      // User endpoints
      if (!userId) throw new Error('userId is required')
      data = await getProfile(userId)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
