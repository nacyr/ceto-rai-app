'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  Heart, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Download,
  Calendar,
  Award,
  Activity
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'

interface DashboardStats {
  totalDonations: number
  totalAmount: number
  totalVolunteers: number
  totalUsers: number
  recentDonations: any[]
  recentVolunteers: any[]
  monthlyTrend: any[]
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalAmount: 0,
    totalVolunteers: 0,
    totalUsers: 0,
    recentDonations: [],
    recentVolunteers: [],
    monthlyTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, donationsResponse, volunteersResponse] = await Promise.all([
        fetch('/api/analytics?type=overview'),
        fetch('/api/donations?userId=' + user?.id),
        fetch('/api/volunteer?userId=' + user?.id)
      ])

      const statsData = await statsResponse.json()
      const donationsData = await donationsResponse.json()
      const volunteersData = await volunteersResponse.json()

      setStats({
        ...statsData,
        recentDonations: donationsData.slice(0, 5),
        recentVolunteers: Array.isArray(volunteersData) ? volunteersData.slice(0, 5) : [volunteersData]
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Ceto Rai Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your humanitarian efforts today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => router.push('/donate')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <Heart className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Make a Donation</h3>
            <p className="text-sm text-gray-600">Support our programs</p>
          </button>

          <button
            onClick={() => router.push('/volunteer')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <Users className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Volunteer</h3>
            <p className="text-sm text-gray-600">Join our team</p>
          </button>

          <button
            onClick={() => router.push('/programs')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <Award className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Our Programs</h3>
            <p className="text-sm text-gray-600">See our impact</p>
          </button>

          <button
            onClick={() => router.push('/reports')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <Download className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Download Reports</h3>
            <p className="text-sm text-gray-600">View your impact</p>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Donations"
            value={`$${stats.totalAmount.toLocaleString()}`}
            color="bg-green-500"
          />
          <StatCard
            icon={Heart}
            title="Donation Count"
            value={stats.totalDonations.toLocaleString()}
            color="bg-red-500"
          />
          <StatCard
            icon={Users}
            title="Volunteers"
            value={stats.totalVolunteers.toLocaleString()}
            color="bg-blue-500"
          />
          <StatCard
            icon={Activity}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            color="bg-purple-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
            </div>
            <div className="p-6">
              {stats.recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentDonations.map((donation: any) => (
                    <div key={donation.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${donation.amount?.toLocaleString()} to {donation.program}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No donations yet</p>
              )}
            </div>
          </div>

          {/* Recent Volunteers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Volunteers</h3>
            </div>
            <div className="p-6">
              {stats.recentVolunteers.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentVolunteers.map((volunteer: any) => (
                    <div key={volunteer.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {volunteer.skills?.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Available: {volunteer.availability}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                        volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No volunteers yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
            <p className="text-sm text-gray-600 mb-4">View your complete donation history and receipts</p>
            <button
              onClick={() => router.push('/dashboard/donations')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Donations
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Applications</h3>
            <p className="text-sm text-gray-600 mb-4">Track your volunteer applications and status</p>
            <button
              onClick={() => router.push('/dashboard/volunteers')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Applications
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Update your profile information and preferences</p>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}