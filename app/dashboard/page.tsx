'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  DollarSign,
  Target,
  Award,
  Clock,
  MapPin,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useDonations } from '@/hooks/useDonations'
import { useVolunteer } from '@/hooks/useVolunteer'
import { QuickActionProps, StatCardProps } from '../types/admin/types'
import { UserProgress } from '../components/dashboard/UserProgress'
import { ProfileSettings } from '../components/dashboard/ProfileSettings'

function StatCard({ title, value, change, changeType, icon: Icon, color, description }: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {change && (
            <p className={`text-sm mt-2 ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ title, description, href, icon: Icon, color, badge }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
              {title}
            </h3>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex items-center mt-3 text-sm text-teal-600 group-hover:text-teal-700">
            <span>Get started</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { profile, loading: profileLoading } = useProfile()
  const { donations, loading: donationsLoading } = useDonations()
  // const { application, loading: volunteerLoading } = useVolunteer()
  const { volunteerStatus, loading: volunteerLoading } = useVolunteer()
  
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  const loading = profileLoading || donationsLoading || volunteerLoading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your dashboard...</h2>
          <p className="text-gray-600">Please wait while we gather your latest information</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalDonated = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0
  const totalDonations = donations?.length || 0
  const averageDonation = totalDonations > 0 ? totalDonated / totalDonations : 0
  const isVolunteer = volunteerStatus?.status === 'active'

  
  // Calculate impact score (mock calculation)
  const impactScore = Math.round((totalDonated / 10) + (totalDonations * 5) + (isVolunteer ? 50 : 0))
  
  // Recent donations (last 3)
  const recentDonations = donations?.slice(0, 3) || []
  
  // Mock recent volunteers data
  const recentVolunteers = [
    { id: 1, name: 'Sarah Johnson', program: 'Education Support', hours: 12, avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', program: 'Healthcare Aid', hours: 8, avatar: 'MC' },
    { id: 3, name: 'Emily Davis', program: 'Community Outreach', hours: 15, avatar: 'ED' },
  ]

  const getGreeting = () => {
    const name = profile?.full_name?.split(' ')[0] || 'there'
    return `Good ${timeOfDay}, ${name}!`
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-12 text-white relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
                <p className="text-teal-100 text-lg mb-4">
                  Welcome back to your impact dashboard. Here&apos;s what&apos;s happening with your contributions.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Global Impact</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{impactScore}</div>
                    <div className="text-sm text-teal-100">Impact Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="text-sm text-gray-500">Choose your next step</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAction
            title="Make a Donation"
            description="Support our programs and make an immediate impact"
            href="/get-involved/donate"
            icon={Heart}
            color="bg-gradient-to-r from-red-500 to-pink-500"
            badge="Popular"
          />
          <QuickAction
            title="Volunteer"
            description="Join our community of volunteers and give your time"
            href="/dashboard/volunteer"
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <QuickAction
            title="View Programs"
            description="Explore all our programs and their impact"
            href="/programs"
            icon={Target}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <QuickAction
            title="Generate Report"
            description="Download your contribution and impact reports"
            href="/dashboard/reports"
            icon={BarChart3}
            color="bg-gradient-to-r from-purple-500 to-violet-500"
          />
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Impact Overview</h2>
          <Link 
            href="/dashboard/impact" 
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center"
          >
            View detailed impact
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Donated"
            value={`$${totalDonated.toLocaleString()}`}
            change="+12% from last month"
            changeType="positive"
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            description="Lifetime contributions"
          />
          <StatCard
            title="Donations Made"
            value={totalDonations}
            change="+3 this month"
            changeType="positive"
            icon={Heart}
            color="bg-gradient-to-r from-red-500 to-pink-500"
            description="Total number of donations"
          />
          <StatCard
            title="Average Donation"
            value={`$${averageDonation.toFixed(0)}`}
            change="Consistent giving"
            changeType="neutral"
            icon={TrendingUp}
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
            description="Per donation amount"
          />
          <StatCard
            title="Volunteer Status"
            value={isVolunteer ? "Active" : "Pending"}
            change={isVolunteer ? "Contributing time" : "Application in review"}
            changeType={isVolunteer ? "positive" : "neutral"}
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-violet-500"
            description="Community involvement"
          />
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-teal-600" />
                Recent Donations
              </h3>
              <Link 
                href="/dashboard/donations" 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{donation.program}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${donation.amount}</p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No donations yet</p>
                <Link 
                  href="/get-involved/donate"
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm mt-2 inline-block"
                >
                  Make your first donation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Active Volunteers
              </h3>
              <Link 
                href="/dashboard/volunteer" 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Join them
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{volunteer.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{volunteer.name}</p>
                      <p className="text-sm text-gray-600">{volunteer.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{volunteer.hours}h</p>
                    <p className="text-xs text-blue-600">This month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explore Your Dashboard</h2>
          <div className="text-sm text-gray-500">Manage your account and track progress</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/donations"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  Donation History
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  View detailed donation records and statistics
                </p>
                <div className="flex items-center mt-3 text-sm text-teal-600 group-hover:text-teal-700">
                  <span>Explore</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/volunteer"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  Volunteer Applications
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your volunteer status and opportunities
                </p>
                <div className="flex items-center mt-3 text-sm text-teal-600 group-hover:text-teal-700">
                  <span>Manage</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  Profile Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Update your profile and account preferences
                </p>
                <div className="flex items-center mt-3 text-sm text-teal-600 group-hover:text-teal-700">
                  <span>Configure</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Your Progress
            </h3>
          </div>
          <div className="p-6">
            <UserProgress />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 mr-2 text-orange-600" />
              Profile Settings
            </h3>
          </div>
          <div className="p-6">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </div>
  )
}