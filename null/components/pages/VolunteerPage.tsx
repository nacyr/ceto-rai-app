import { useState } from 'react'
import { VolunteerForm } from '../volunteer/VolunteerForm'
import { Toast } from '../common/Toast'

export function VolunteerPage() {
  const [showToast, setShowToast] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Volunteer With Us</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <VolunteerForm />
      </div>
      
      {showToast && (
        <Toast 
          message="Application submitted successfully!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}
