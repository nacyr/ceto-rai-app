'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  // Globe, 
  Eye, 
  EyeOff,
  Save,
  Trash2,
  Download,
  // Upload,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
// import { Badge } from '@/app/components/ui/badge'
import { toast } from 'react-hot-toast'
import { NotificationSettings, PrivacySettings, UserSettings } from '@/app/types/admin/types'


export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // --- state declarations (same as yours) ---
  const [userSettings, setUserSettings] = useState<UserSettings>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    timezone: 'UTC',
    language: 'en',
    currency: 'USD'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailDonationReceipts: true,
    emailVolunteerUpdates: true,
    emailImpactReports: true,
    emailNewsletter: false,
    smsReminders: false,
    pushNotifications: true,
    weeklyDigest: true,
    monthlyReport: true
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showDonationHistory: false,
    showVolunteerActivity: true,
    allowDataExport: true,
    marketingEmails: false,
    thirdPartySharing: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // ✅ FIX HERE: wrap loadUserSettings in useCallback
  const loadUserSettings = useCallback(async () => {
    try {
      setLoading(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profile) {
        setUserSettings({
          fullName: profile.full_name || '',
          email: user?.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          timezone: profile.timezone || 'UTC',
          language: profile.language || 'en',
          currency: profile.currency || 'USD'
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.email]) // 👈 include dependencies you use inside

  // ✅ Include it here safely
  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user, loadUserSettings])

// export default function SettingsPage() {
//   const { user, signOut } = useAuth()
//   const [activeTab, setActiveTab] = useState('profile')
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

//   // Settings state
//   const [userSettings, setUserSettings] = useState<UserSettings>({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     country: '',
//     timezone: 'UTC',
//     language: 'en',
//     currency: 'USD'
//   })

//   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
//     emailDonationReceipts: true,
//     emailVolunteerUpdates: true,
//     emailImpactReports: true,
//     emailNewsletter: false,
//     smsReminders: false,
//     pushNotifications: true,
//     weeklyDigest: true,
//     monthlyReport: true
//   })

//   const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
//     profileVisibility: 'private',
//     showDonationHistory: false,
//     showVolunteerActivity: true,
//     allowDataExport: true,
//     marketingEmails: false,
//     thirdPartySharing: false
//   })

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })

//   // useEffect(() => {
//   //   if (user) {
//   //     loadUserSettings()
//   //   }
//   // }, [user])

//   const loadUserSettings = async () => {
//     try {
//       setLoading(true)
      
//       // Load user profile data
//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user?.id)
//         .single()

//       if (profile) {
//         setUserSettings({
//           fullName: profile.full_name || '',
//           email: user?.email || '',
//           phone: profile.phone || '',
//           address: profile.address || '',
//           city: profile.city || '',
//           country: profile.country || '',
//           timezone: profile.timezone || 'UTC',
//           language: profile.language || 'en',
//           currency: profile.currency || 'USD'
//         })
//       }

//       // Load notification settings (mock data for now)
//       // In a real app, these would be stored in the database
      
//     } catch (error) {
//       console.error('Error loading settings:', error)
//       toast.error('Failed to load settings')
//     } finally {
//       setLoading(false)
//     }
//   }

  

  const saveProfileSettings = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userSettings.fullName,
          phone: userSettings.phone,
          address: userSettings.address,
          city: userSettings.city,
          country: userSettings.country,
          timezone: userSettings.timezone,
          language: userSettings.language,
          currency: userSettings.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) throw error

      toast.success('Profile settings saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile settings')
    } finally {
      setLoading(false)
    }
  }

  const saveNotificationSettings = async () => {
    try {
      setLoading(true)
      
      // In a real app, save to database
      // For now, just show success message
      toast.success('Notification settings saved successfully!')
    } catch (error) {
      console.error('Error saving notifications:', error)
      toast.error('Failed to save notification settings')
    } finally {
      setLoading(false)
    }
  }

  const savePrivacySettings = async () => {
    try {
      setLoading(true)
      
      // In a real app, save to database
      toast.success('Privacy settings saved successfully!')
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('Failed to save privacy settings')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      setLoading(true)
      
      // Mock data export
      const exportData = {
        profile: userSettings,
        donations: [], // Would fetch from database
        volunteer: [], // Would fetch from database
        settings: {
          notifications: notificationSettings,
          privacy: privacySettings
        },
        exportedAt: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ceto-rai-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading(true)
      
      // In a real app, this would soft-delete the account
      // and handle data cleanup according to privacy laws
      
      toast.success('Account deletion request submitted. You will receive a confirmation email.')
      setShowDeleteConfirm(false)
      
      // Sign out the user
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'account', label: 'Account', icon: CreditCard }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userSettings.fullName}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userSettings.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support if needed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userSettings.phone}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={userSettings.country}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="ZA">South Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={userSettings.city}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={userSettings.timezone}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Africa/Lagos">Lagos</option>
                  <option value="Africa/Nairobi">Nairobi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={userSettings.language}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="sw">Swahili</option>
                  <option value="ha">Hausa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={userSettings.currency}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={userSettings.address}
                onChange={(e) => setUserSettings(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your full address"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveProfileSettings}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified about your activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries({
                  emailDonationReceipts: 'Donation receipts and confirmations',
                  emailVolunteerUpdates: 'Volunteer opportunity updates',
                  emailImpactReports: 'Monthly impact reports',
                  emailNewsletter: 'Newsletter and organization updates'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Other Notifications</h3>
              <div className="space-y-4">
                {Object.entries({
                  smsReminders: 'SMS reminders for volunteer activities',
                  pushNotifications: 'Browser push notifications',
                  weeklyDigest: 'Weekly activity digest',
                  monthlyReport: 'Monthly summary report'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveNotificationSettings}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy & Security Settings */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    profileVisibility: e.target.value as 'public' | 'private' | 'donors-only'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="private">Private - Only visible to you</option>
                  <option value="donors-only">Donors Only - Visible to other donors</option>
                  <option value="public">Public - Visible to everyone</option>
                </select>
              </div>

              <div className="space-y-4">
                {Object.entries({
                  showDonationHistory: 'Show my donation history to others',
                  showVolunteerActivity: 'Show my volunteer activities to others',
                  allowDataExport: 'Allow me to export my data',
                  marketingEmails: 'Receive marketing emails from partners',
                  thirdPartySharing: 'Allow sharing anonymized data with research partners'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings[key as keyof PrivacySettings] as boolean}
                        onChange={(e) => setPrivacySettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={savePrivacySettings}
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Privacy Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password for security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={changePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download a copy of all your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You can request a complete export of all your data including donations, volunteer activities, and account information.
              </p>
              <Button
                onClick={exportData}
                disabled={loading}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export My Data</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Delete Account</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Once you delete your account, there is no going back. This will permanently delete your profile, donations history, and all associated data.
                      </p>
                    </div>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Are you absolutely sure? This action cannot be undone. Type &quot;DELETE&quot; to confirm:
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        onClick={deleteAccount}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Yes, Delete My Account
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowDeleteConfirm(false)}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}