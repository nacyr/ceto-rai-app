import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { Toast } from '../common/Toast'

export function ProfileSettings() {
  const { profile, updateProfile, loading } = useProfile()
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setShowToast(true)
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {showToast && (
        <Toast 
          message="Profile updated successfully!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}
