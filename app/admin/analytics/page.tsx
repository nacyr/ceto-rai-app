'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    donationsByProgram: [],
    volunteersBySkills: [],
    donationsTrend: [],
    volunteersByStatus: [],
    monthlyStats: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.user_metadata?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchAnalytics()
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      const [donationsByProgram, volunteersBySkills, donationsTrend, volunteersByStatus, monthlyStats] = await Promise.all([
        fetch('/api/analytics?type=donations-by-program').then(res => res.json()),
        fetch('/api/analytics?type=volunteers-by-skills').then(res => res.json()),
        fetch('/api/analytics?type=donations-trend').then(res => res.json()),
        fetch('/api/analytics?type=volunteers-by-status').then(res => res.json()),
        fetch('/api/analytics?type=monthly-stats').then(res => res.json())
      ])

      setAnalytics({
        donationsByProgram,
        volunteersBySkills,
        donationsTrend,
        volunteersByStatus,
        monthlyStats
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Detailed insights and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Programs</CardTitle>
            <CardDescription>Active donation programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.donationsByProgram.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer Skills</CardTitle>
            <CardDescription>Unique skills registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.volunteersBySkills.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>Donation trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{analytics.monthlyStats.length}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Donations by Program</CardTitle>
            <CardDescription>Distribution across programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.donationsByProgram.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.program}</span>
                  <span className="font-medium">${item.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer Status</CardTitle>
            <CardDescription>Current volunteer distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.volunteersByStatus.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.status}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}