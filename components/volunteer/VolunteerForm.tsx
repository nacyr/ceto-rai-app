import { useState } from 'react'
import { useVolunteer } from '@/hooks/useVolunteer'

export function VolunteerForm() {
  const [skills, setSkills] = useState<string[]>([])
  const [availability, setAvailability] = useState('weekends')
  const { applyVolunteer, loading, error } = useVolunteer()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await applyVolunteer({
        skills,
        availability,
      })
      // Show success message
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleSkillChange = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            'Teaching',
            'Healthcare',
            'Administration',
            'Technology',
            'Fundraising',
            'Event Planning'
          ].map((skill) => (
            <label key={skill} className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
              <span className="ml-2 text-sm text-gray-600">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
          Availability
        </label>
        <select
          id="availability"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="weekends">Weekends</option>
          <option value="weekdays">Weekdays</option>
          <option value="evenings">Evenings</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
