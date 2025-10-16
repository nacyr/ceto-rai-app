import { useState } from 'react'
import { DonationManager } from './DonationManager'
import { VolunteerManager } from './VolunteerManager'
import { UserManager } from './UserManager'
import { Analytics } from './Analytics'
import { NotificationSystem } from './NotificationSystem'
import { AdminSettings } from './AdminSettings'
import { ExportManager } from './ExportManager'
import { Users, DollarSign, BarChart, UserCheck, Bell, Settings, Download } from 'lucide-react'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('volunteers')

  const tabs = [
    { id: 'volunteers', name: 'Volunteers', icon: Users },
    { id: 'donations', name: 'Donations', icon: DollarSign },
    { id: 'users', name: 'Users', icon: UserCheck },
    { id: 'analytics', name: 'Analytics', icon: BarChart },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'export', name: 'Export', icon: Download },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'volunteers':
        return <VolunteerManager />
      case 'donations':
        return <DonationManager />
      case 'users':
        return <UserManager />
      case 'analytics':
        return <Analytics />
      case 'notifications':
        return <NotificationSystem />
      case 'export':
        return <ExportManager />
      case 'settings':
        return <AdminSettings />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
