'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { formatDate } from '@/utils/formatters'

interface Notification {
  id: string
  type: 'volunteer_pending' | 'donation_failed' | 'user_registration' | 'system_alert' | 'approval_needed'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  created_at: string
  data?: any
}

interface NotificationStats {
  pendingVolunteers: number
  failedDonations: number
  newUsers: number
  systemAlerts: number
  totalUnread: number
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    pendingVolunteers: 0,
    failedDonations: 0,
    newUsers: 0,
    systemAlerts: 0,
    totalUnread: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchStats()
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteers' },
        () => fetchNotifications()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' },
        () => fetchNotifications()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      // Generate notifications based on current data
      const notifications: Notification[] = []

      // Check for pending volunteers
      const { data: pendingVolunteers } = await supabase
        .from('volunteers')
        .select('*, profiles:user_id(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      pendingVolunteers?.forEach(volunteer => {
        notifications.push({
          id: `volunteer_${volunteer.id}`,
          type: 'volunteer_pending',
          title: 'New Volunteer Application',
          message: `${volunteer.profiles?.full_name || 'Unknown'} has applied to volunteer`,
          priority: 'medium',
          read: false,
          created_at: volunteer.created_at,
          data: volunteer
        })
      })

      // Check for failed donations
      const { data: failedDonations } = await supabase
        .from('donations')
        .select('*, profiles:user_id(full_name)')
        .eq('status', 'failed')
        .order('created_at', { ascending: false })
        .limit(5)

      failedDonations?.forEach(donation => {
        notifications.push({
          id: `donation_${donation.id}`,
          type: 'donation_failed',
          title: 'Failed Donation',
          message: `Donation of $${donation.amount} from ${donation.profiles?.full_name || 'Unknown'} failed`,
          priority: 'high',
          read: false,
          created_at: donation.created_at,
          data: donation
        })
      })

      // Check for new user registrations (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(5)

      newUsers?.forEach(user => {
        notifications.push({
          id: `user_${user.id}`,
          type: 'user_registration',
          title: 'New User Registration',
          message: `${user.full_name || 'Unknown'} has registered`,
          priority: 'low',
          read: false,
          created_at: user.created_at,
          data: user
        })
      })

      // Sort notifications by priority and date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      notifications.sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setNotifications(notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get pending volunteers count
      const { count: pendingVolunteers } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Get failed donations count
      const { count: failedDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed')

      // Get new users count (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString())

      const totalUnread = (pendingVolunteers || 0) + (failedDonations || 0) + (newUsers || 0)

      setStats({
        pendingVolunteers: pendingVolunteers || 0,
        failedDonations: failedDonations || 0,
        newUsers: newUsers || 0,
        systemAlerts: 0,
        totalUnread
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volunteer_pending': return <Users className="h-4 w-4" />
      case 'donation_failed': return <DollarSign className="h-4 w-4" />
      case 'user_registration': return <Users className="h-4 w-4" />
      case 'system_alert': return <AlertTriangle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-gray-600 mr-2" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600">Stay updated with important alerts and pending actions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {stats.totalUnread > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Volunteers</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVolunteers}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Donations</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedDonations}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsers}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnread}</div>
            <p className="text-xs text-muted-foreground">
              Requires action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Notifications</CardTitle>
            {notifications.length > 5 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show All (${notifications.length})`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {displayedNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              {getTypeIcon(notification.type)}
                              <span className="ml-2">{notification.title}</span>
                            </DialogTitle>
                            <DialogDescription>
                              {notification.message}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Priority</label>
                              <Badge className={`ml-2 ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Created</label>
                              <p className="text-sm text-gray-900">{formatDate(notification.created_at)}</p>
                            </div>
                            {notification.data && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">Additional Information</label>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                  {JSON.stringify(notification.data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}