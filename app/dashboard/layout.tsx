'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Home, 
  Heart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  FileText,
  Bell,
  User,
  Shield,
  Search,
  ChevronDown,
  Activity,
  Award,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview and quick actions' },
    { name: 'My Donations', href: '/dashboard/donations', icon: Heart, description: 'Track your contributions' },
    { name: 'Volunteer', href: '/dashboard/volunteer', icon: Users, description: 'Volunteer opportunities' },
    { name: 'Impact', href: '/dashboard/impact', icon: BarChart3, description: 'See your impact metrics' },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText, description: 'Generate and download reports' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account preferences' },
  ]

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield, description: 'Administrative overview' },
    { name: 'Manage Donations', href: '/admin/donations', icon: Heart, description: 'Donation management' },
    { name: 'Manage Volunteers', href: '/admin/volunteers', icon: Users, description: 'Volunteer management' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'System analytics' },
  ]

  const isCurrentPath = (href: string) => {
    return pathname === href
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-blue-600">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <Image 
                src="/images/logo/ceto_rai_logo.jpg" 
                alt="Ceto Rai Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">Ceto Rai</span>
          </Link>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.email}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = isCurrentPath(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-teal-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Admin Section */}
          {user?.user_metadata?.role === 'admin' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center px-3 mb-4">
                <Shield className="w-4 h-4 text-orange-500 mr-2" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = isCurrentPath(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/help"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Help & Support
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Enhanced Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-300 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Enhanced Search */}
            <div className="relative flex flex-1 max-w-md">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="block h-full w-full border border-gray-300 rounded-lg py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm"
              />
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 text-center">No new notifications</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/get-involved/donate"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Donate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}