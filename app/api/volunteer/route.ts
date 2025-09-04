import { NextResponse } from 'next/server'
import { createVolunteerApplication, getVolunteerStatus, getAllVolunteers, getVolunteersByStatus, updateVolunteerStatus, getVolunteerStats } from '@/lib/api'

// Create a new volunteer application
export async function POST(request: Request) {
  try {
    const application = await request.json()
    const data = await createVolunteerApplication(application)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Get volunteers with filtering options
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const admin = searchParams.get('admin') === 'true'

    let data

    if (admin) {
      // Admin endpoints
      if (status) {
        data = await getVolunteersByStatus(status)
      } else if (searchParams.get('stats') === 'true') {
        data = await getVolunteerStats()
      } else {
        data = await getAllVolunteers()
      }
    } else {
      // User endpoints
      if (!userId) throw new Error('userId is required')
      data = await getVolunteerStatus(userId)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Update volunteer status (admin only)
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      throw new Error('id and status are required')
    }

    const data = await updateVolunteerStatus(id, status)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
