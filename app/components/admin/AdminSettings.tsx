'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  // Mail, 
  Globe, 
  Database,
  Users,
  DollarSign,
  Bell,
  // Eye,
  // EyeOff,
  Check,
  // X,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Switch } from '@/app/components/ui/switch'
import { SystemSettings, SystemStats } from '@/app/types/admin/types'


export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'CETO RAI',
    site_description: 'Empowering communities through education and support',
    contact_email: 'contact@cetorai.org',
    support_email: 'support@cetorai.org',
    require_email_verification: true,
    enable_two_factor: false,
    session_timeout: 30,
    max_login_attempts: 5,
    min_donation_amount: 5,
    max_donation_amount: 10000,
    default_currency: 'USD',
    enable_recurring_donations: true,
    auto_approve_volunteers: false,
    require_background_check: true,
    volunteer_application_limit: 100,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    notification_frequency: 'daily',
    maintenance_mode: false,
    debug_mode: false,
    api_rate_limit: 1000,
    backup_frequency: 'daily'
  })

  const [stats, setStats] = useState<SystemStats>({
    total_users: 0,
    total_donations: 0,
    total_volunteers: 0,
    system_uptime: '0 days',
    database_size: '0 MB',
    last_backup: 'Never'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // const [showApiKey, setShowApiKey] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
    fetchStats()
  }, [])

  const fetchSettings = async () => {
    try {
      // In a real app, you'd fetch from a settings table
      // For now, we'll use localStorage or default values
      const savedSettings = localStorage.getItem('admin_settings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total donations
      const { count: totalDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })

      // Get total volunteers
      const { count: totalVolunteers } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })

      setStats({
        total_users: totalUsers || 0,
        total_donations: totalDonations || 0,
        total_volunteers: totalVolunteers || 0,
        system_uptime: '15 days, 3 hours',
        database_size: '245 MB',
        last_backup: new Date().toLocaleDateString()
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // In a real app, you'd save to a database
      localStorage.setItem('admin_settings', JSON.stringify(settings))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      localStorage.removeItem('admin_settings')
      fetchSettings()
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-gray-600 mr-2" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
            <p className="text-gray-600">Configure system settings and preferences</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_donations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_volunteers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{stats.system_uptime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{stats.database_size}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold">{stats.last_backup}</div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Settings Content */}
      <Card>
        <CardContent className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <Input
                      value={settings.site_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                      value={settings.site_description}
                      onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <Input
                      type="email"
                      value={settings.support_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, support_email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Require Email Verification
                      </label>
                      <p className="text-xs text-gray-500">Users must verify their email before accessing the system</p>
                    </div>
                    <Switch
                      checked={settings.require_email_verification}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_email_verification: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                      <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.enable_two_factor}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_two_factor: checked }))}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.session_timeout}
                        onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <Input
                        type="number"
                        value={settings.max_login_attempts}
                        onChange={(e) => setSettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Donation Settings</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Amount ($)
                      </label>
                      <Input
                        type="number"
                        value={settings.min_donation_amount}
                        onChange={(e) => setSettings(prev => ({ ...prev, min_donation_amount: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Amount ($)
                      </label>
                      <Input
                        type="number"
                        value={settings.max_donation_amount}
                        onChange={(e) => setSettings(prev => ({ ...prev, max_donation_amount: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select
                        value={settings.default_currency}
                        onChange={(e) => setSettings(prev => ({ ...prev, default_currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Enable Recurring Donations
                      </label>
                      <p className="text-xs text-gray-500">Allow users to set up monthly recurring donations</p>
                    </div>
                    <Switch
                      checked={settings.enable_recurring_donations}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_recurring_donations: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Volunteer Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Auto-approve Volunteers
                      </label>
                      <p className="text-xs text-gray-500">Automatically approve volunteer applications</p>
                    </div>
                    <Switch
                      checked={settings.auto_approve_volunteers}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_approve_volunteers: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Require Background Check
                      </label>
                      <p className="text-xs text-gray-500">Require background check for volunteer approval</p>
                    </div>
                    <Switch
                      checked={settings.require_background_check}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_background_check: checked }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Limit per Month
                    </label>
                    <Input
                      type="number"
                      value={settings.volunteer_application_limit}
                      onChange={(e) => setSettings(prev => ({ ...prev, volunteer_application_limit: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-500">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-xs text-gray-500">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.sms_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <p className="text-xs text-gray-500">Send browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push_notifications: checked }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={settings.notification_frequency}
                      onChange={(e) => setSettings(prev => ({ ...prev, notification_frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Maintenance Mode
                      </label>
                      <p className="text-xs text-gray-500">Put the system in maintenance mode</p>
                    </div>
                    <div className="flex items-center">
                      {settings.maintenance_mode && (
                        <Badge variant="destructive" className="mr-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      <Switch
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Debug Mode
                      </label>
                      <p className="text-xs text-gray-500">Enable debug logging and error details</p>
                    </div>
                    <Switch
                      checked={settings.debug_mode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, debug_mode: checked }))}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Rate Limit (requests/hour)
                      </label>
                      <Input
                        type="number"
                        value={settings.api_rate_limit}
                        onChange={(e) => setSettings(prev => ({ ...prev, api_rate_limit: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.backup_frequency}
                        onChange={(e) => setSettings(prev => ({ ...prev, backup_frequency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}