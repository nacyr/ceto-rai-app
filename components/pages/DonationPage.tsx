import { useState } from 'react'
import { DonationForm } from '../donations/DonationForm'
import { Toast } from '../common/Toast'

export function DonationPage() {
  const [showToast, setShowToast] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Make a Donation</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <DonationForm />
      </div>
      
      {showToast && (
        <Toast 
          message="Thank you for your donation!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}
