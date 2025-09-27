import { NextResponse } from 'next/server'
import { createDonation, getDonationHistory, getAllDonations, getDonationsByStatus, updateDonationStatus, getDonationStats } from '@/lib/api'

// Create a new donation
export async function POST(request: Request) {
  try {
    const donation = await request.json()
    const data = await createDonation(donation)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Get donations with filtering options
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
        data = await getDonationsByStatus(status)
      } else if (searchParams.get('stats') === 'true') {
        data = await getDonationStats()
      } else {
        data = await getAllDonations()
      }
    } else {
      // User endpoints
      if (!userId) throw new Error('userId is required')
      data = await getDonationHistory(userId)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

// Update donation status (admin only)
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      throw new Error('id and status are required')
    }

    const data = await updateDonationStatus(id, status)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
