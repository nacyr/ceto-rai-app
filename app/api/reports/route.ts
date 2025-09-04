import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return `"${value.join(';')}"`
      } else if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      } else {
        return `"${String(value || '').replace(/"/g, '""')}"`
      }
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

// Helper function to format date for reports
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'donations'
    const format = searchParams.get('format') || 'json'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const program = searchParams.get('program')
    const status = searchParams.get('status')

    let data: any[] = []
    let filename = ''
    let reportData: any[] = []

    switch (type) {
      case 'donations':
        let donationsQuery = supabase
          .from('donations')
          .select('*, profiles!inner(full_name, email)')
          .order('created_at', { ascending: false })

        if (startDate) {
          donationsQuery = donationsQuery.gte('created_at', startDate)
        }
        
        if (endDate) {
          donationsQuery = donationsQuery.lte('created_at', endDate)
        }
        
        if (program) {
          donationsQuery = donationsQuery.eq('program', program)
        }
        
        if (status) {
          donationsQuery = donationsQuery.eq('status', status)
        }

        const donations = await donationsQuery
        
        reportData = donations.data?.map(donation => ({
          'Donation ID': donation.id,
          'Donor Name': donation.profiles?.full_name || 'Anonymous',
          'Email': donation.profiles?.email || 'N/A',
          'Amount': `$${(donation.amount || 0).toLocaleString()}`,
          'Program': donation.program,
          'Status': donation.status,
          'Date': formatDate(donation.created_at),
          'Created At': donation.created_at
        })) || []
        
        filename = `donations-report-${new Date().toISOString().split('T')[0]}`
        break

      case 'volunteers':
        let volunteersQuery = supabase
          .from('volunteers')
          .select('*, profiles!inner(full_name, email)')
          .order('created_at', { ascending: false })

        if (startDate) {
          volunteersQuery = volunteersQuery.gte('created_at', startDate)
        }
        
        if (endDate) {
          volunteersQuery = volunteersQuery.lte('created_at', endDate)
        }
        
        if (status) {
          volunteersQuery = volunteersQuery.eq('status', status)
        }

        const volunteers = await volunteersQuery
        
        reportData = volunteers.data?.map(volunteer => ({
          'Volunteer ID': volunteer.id,
          'Name': volunteer.profiles?.full_name || 'N/A',
          'Email': volunteer.profiles?.email || 'N/A',
          'Skills': (volunteer.skills || []).join(', '),
          'Availability': volunteer.availability,
          'Status': volunteer.status,
          'Application Date': formatDate(volunteer.created_at),
          'Created At': volunteer.created_at
        })) || []
        
        filename = `volunteers-report-${new Date().toISOString().split('T')[0]}`
        break

      case 'users':
        let usersQuery = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (startDate) {
          usersQuery = usersQuery.gte('created_at', startDate)
        }
        
        if (endDate) {
          usersQuery = usersQuery.lte('created_at', endDate)
        }

        const users = await usersQuery
        
        reportData = users.data?.map(user => ({
          'User ID': user.id,
          'Full Name': user.full_name,
          'Email': user.email,
          'Registration Date': formatDate(user.created_at),
          'Created At': user.created_at
        })) || []
        
        filename = `users-report-${new Date().toISOString().split('T')[0]}`
        break

      case 'monthly-summary':
        const monthlyData = await supabase
          .from('donations')
          .select('amount, created_at, program, status')
          .order('created_at', { ascending: true })

        const monthlySummary: { [key: string]: any } = {}
        
        monthlyData.data?.forEach(donation => {
          const month = new Date(donation.created_at).toISOString().slice(0, 7)
          if (!monthlySummary[month]) {
            monthlySummary[month] = {
              month,
              totalDonations: 0,
              totalAmount: 0,
              programs: {},
              statuses: {}
            }
          }
          
          monthlySummary[month].totalDonations++
          monthlySummary[month].totalAmount += donation.amount || 0
          
          const program = donation.program || 'Other'
          monthlySummary[month].programs[program] = (monthlySummary[month].programs[program] || 0) + 1
          
          const status = donation.status || 'pending'
          monthlySummary[month].statuses[status] = (monthlySummary[month].statuses[status] || 0) + 1
        })
        
        reportData = Object.values(monthlySummary).map(summary => ({
          'Month': summary.month,
          'Total Donations': summary.totalDonations,
          'Total Amount': `$${summary.totalAmount.toLocaleString()}`,
          'Programs': Object.entries(summary.programs).map(([program, count]) => `${program}: ${count}`).join('; '),
          'Statuses': Object.entries(summary.statuses).map(([status, count]) => `${status}: ${count}`).join('; ')
        }))
        
        filename = `monthly-summary-${new Date().toISOString().split('T')[0]}`
        break

      case 'impact-report':
        const [donationsImpact, volunteersImpact, usersImpact] = await Promise.all([
          supabase.from('donations').select('amount, program, status'),
          supabase.from('volunteers').select('skills, status'),
          supabase.from('profiles').select('count')
        ])

        const programs = ['Education Support', 'Healthcare Outreach', 'Women Empowerment', 'Humanitarian Aid']
        const programStats: { [key: string]: { donations: number; amount: number } } = {}
        
        programs.forEach(program => {
          programStats[program] = { donations: 0, amount: 0 }
        })
        
        donationsImpact.data?.forEach(donation => {
          const program = donation.program || 'Other'
          if (!programStats[program]) {
            programStats[program] = { donations: 0, amount: 0 }
          }
          programStats[program].donations++
          programStats[program].amount += donation.amount || 0
        })
        
        const skillStats: { [key: string]: number } = {}
        volunteersImpact.data?.forEach(volunteer => {
          volunteer.skills?.forEach(skill => {
            skillStats[skill] = (skillStats[skill] || 0) + 1
          })
        })
        
        reportData = [
          {
            'Metric': 'Total Users',
            'Value': usersImpact.data?.[0]?.count || 0
          },
          {
            'Metric': 'Total Donations',
            'Value': donationsImpact.data?.length || 0
          },
          {
            'Metric': 'Total Amount Raised',
            'Value': `$${(donationsImpact.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0).toLocaleString()}`
          },
          {
            'Metric': 'Total Volunteers',
            'Value': volunteersImpact.data?.length || 0
          },
          ...programs.map(program => ({
            'Metric': `${program} Donations`,
            'Value': `${programStats[program]?.donations || 0} ($${(programStats[program]?.amount || 0).toLocaleString()})`
          })),
          ...Object.entries(skillStats).map(([skill, count]) => ({
            'Metric': `${skill} Volunteers`,
            'Value': count
          }))
        ]
        
        filename = `impact-report-${new Date().toISOString().split('T')[0]}`
        break

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Format response based on requested format
    if (format === 'csv') {
      const csv = convertToCSV(reportData)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    } else {
      return NextResponse.json({
        data: reportData,
        filename,
        type,
        generatedAt: new Date().toISOString(),
        filters: {
          startDate,
          endDate,
          program,
          status
        }
      })
    }
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}