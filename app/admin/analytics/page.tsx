'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AdminProtectedRoute from '@/app/components/AdminProtectedRoute'
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'

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
    // Remove the manual admin check since AdminProtectedRoute handles it
    if (user) {
      fetchAnalytics()
    }
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
    <AdminProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your foundation's performance</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donations by Program</CardTitle>
                <CardDescription>Distribution of donations across programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.donationsByProgram.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.program}</span>
                      <span className="font-medium">₦{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteers by Skills</CardTitle>
                <CardDescription>Volunteer distribution by skill set</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.volunteersBySkills.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.skill}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donations Trend</CardTitle>
                <CardDescription>Monthly donation trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.donationsTrend.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.month}</span>
                      <span className="font-medium">₦{item.amount.toLocaleString()}</span>
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
        )}
      </div>
    </AdminProtectedRoute>
  )
}