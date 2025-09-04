'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Heart, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Award,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdminStats {
  totalDonations: number
  totalAmount: number
  totalVolunteers: number
  totalUsers: number
  pendingDonations: number
  pendingVolunteers: number
  monthlyTrend: any[]
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalDonations: 0,
    totalAmount: 0,
    totalVolunteers: 0,
    totalUsers: 0,
    pendingDonations: 0,
    pendingVolunteers: 0,
    monthlyTrend: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.user_metadata?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/analytics?type=overview')
      const data = await response.json()
      
      const donationsResponse = await fetch('/api/donations?status=pending')
      const pendingDonations = await donationsResponse.json()
      
      const volunteersResponse = await fetch('/api/volunteer?status=pending')
      const pendingVolunteers = await volunteersResponse.json()

      setStats({
        ...data,
        pendingDonations: pendingDonations.length || 0,
        pendingVolunteers: pendingVolunteers.length || 0
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, description, icon: Icon, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Ceto Rai administration panel</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button 
          variant="outline" 
          className="h-auto py-4"
          onClick={() => router.push('/admin/donations')}
        >
          <Heart className="mr-2 h-4 w-4" />
          Manage Donations
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4"
          onClick={() => router.push('/admin/volunteers')}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Volunteers
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4"
          onClick={() => router.push('/admin/analytics')}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4"
          onClick={() => router.push('/reports')}
        >
          <Activity className="mr-2 h-4 w-4" />
          Generate Reports
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations"
          value={`$${stats.totalAmount.toLocaleString()}`}
          description="All donations received"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Volunteers"
          value={stats.totalVolunteers.toString()}
          description="Active volunteers"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Donations"
          value={stats.pendingDonations.toString()}
          description="Awaiting approval"
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Pending Volunteers"
          value={stats.pendingVolunteers.toString()}
          description="Applications to review"
          icon={Award}
          color="bg-purple-500"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          description="Registered users"
          icon={TrendingUp}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Donations"
          value={stats.totalDonations.toString()}
          description="Individual donations"
          icon={Heart}
          color="bg-red-500"
        />
      </div>
    </div>
  )
}