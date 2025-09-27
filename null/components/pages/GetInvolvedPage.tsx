import { useState } from 'react'
import { DonationPage } from './DonationPage'
import { VolunteerPage } from './VolunteerPage'

export function GetInvolvedPage() {
  const [activePage, setActivePage] = useState<'main' | 'donate' | 'volunteer'>('main')

  if (activePage === 'donate') return <DonationPage />
  if (activePage === 'volunteer') return <VolunteerPage />

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
        Get Involved
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={() => setActivePage('donate')}
          className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-bold text-teal-600 mb-4">Make a Donation</h2>
          <p className="text-gray-600">
            Support our programs and help us make a difference in the community.
          </p>
        </button>

        <button
          onClick={() => setActivePage('volunteer')}
          className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-bold text-teal-600 mb-4">Become a Volunteer</h2>
          <p className="text-gray-600">
            Join our team and contribute your skills to meaningful causes.
          </p>
        </button>
      </div>
    </div>
  )
}
