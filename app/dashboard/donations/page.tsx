'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { DonationHistory } from '@/app/components/dashboard/DonationHistory'
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  BarChart3,
  Download,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

interface DonationStats {
  totalAmount: number
  totalDonations: number
  averageDonation: number
  lastDonationDate: string
  favoriteProgram: string
  monthlyTrend: any[]
}

export default function DonationsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DonationStats>({
    totalAmount: 0,
    totalDonations: 0,
    averageDonation: 0,
    lastDonationDate: '',
    favoriteProgram: '',
    monthlyTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    if (user) {
      fetchDonationStats()
    }
  }, [user, timeFilter])

  const fetchDonationStats = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('donations')
        .select('*')
        .eq('user_id', user?.id)

      if (timeFilter !== 'all') {
        const date = new Date()
        if (timeFilter === '30d') {
          date.setDate(date.getDate() - 30)
        } else if (timeFilter === '90d') {
          date.setDate(date.getDate() - 90)
        } else if (timeFilter === '1y') {
          date.setFullYear(date.getFullYear() - 1)
        }
        query = query.gte('created_at', date.toISOString())
      }

      const { data: donations, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      if (donations && donations.length > 0) {
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
        const totalDonations = donations.length
        const averageDonation = totalAmount / totalDonations

        // Find favorite program
        const programCounts = donations.reduce((acc, d) => {
          acc[d.program] = (acc[d.program] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        const favoriteProgram = Object.keys(programCounts).reduce((a, b) => 
          programCounts[a] > programCounts[b] ? a : b, '')

        setStats({
          totalAmount,
          totalDonations,
          averageDonation,
          lastDonationDate: donations[0]?.created_at || '',
          favoriteProgram,
          monthlyTrend: [] // TODO: Calculate monthly trend
        })
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600 mt-1">Track your giving history and impact</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {formatCurrency(stats.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalDonations} donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {formatCurrency(stats.averageDonation)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per donation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Program</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600 capitalize">
              {stats.favoriteProgram || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most supported
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Donation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-teal-600">
              {stats.lastDonationDate ? formatDate(stats.lastDonationDate) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-lg shadow">
        <DonationHistory />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Make another donation or share your impact</CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => window.location.href = '/get-involved/donate'}
          >
            <Heart className="w-4 h-4 mr-2" />
            Make Another Donation
          </Button>
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Impact Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}