import { useVolunteer } from '@/hooks/useVolunteer'
import { useAuth } from '@/app/contexts/AuthContext'

interface ReviewProps {
  data: {
    personalInfo: {
      fullName?: string
      phone?: string
      motivation?: string
    }
    skills: string[]
    availability: string
  }
  onBack: () => void
}

export function Review({ data, onBack }: ReviewProps) {
  const { user } = useAuth()
  const { applyVolunteer, loading, error } = useVolunteer()

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to submit your application')
      return
    }

    try {
      await applyVolunteer({
        user_id: user.id,
        skills: data.skills,
        availability: data.availability,
        status: 'pending'
      })
      alert('Volunteer application submitted successfully!')
    } catch (err) {
      console.error('Error submitting application:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Review Your Application</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium">Personal Information</h4>
            <p className="text-sm text-gray-600">Name: {data.personalInfo.fullName || 'Not provided'}</p>
            <p className="text-sm text-gray-600">Phone: {data.personalInfo.phone || 'Not provided'}</p>
          </div>

          <div>
            <h4 className="font-medium">Skills</h4>
            <p className="text-sm text-gray-600">{data.skills.join(', ') || 'None selected'}</p>
          </div>

          <div>
            <h4 className="font-medium">Availability</h4>
            <p className="text-sm text-gray-600">{data.availability || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !user}
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}