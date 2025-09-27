import { useState } from 'react'

interface SkillsAvailabilityProps {
  data: {
    skills: string[]
    availability: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function SkillsAvailability({ data, onUpdate, onNext, onBack }: SkillsAvailabilityProps) {
  const [skills, setSkills] = useState<string[]>(data.skills || [])
  const [availability, setAvailability] = useState(data.availability || 'weekends')

  const skillOptions = [
    'Teaching',
    'Healthcare',
    'Administration',
    'Technology',
    'Fundraising',
    'Event Planning'
  ]

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Flexible'
  ]

  const handleSkillChange = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ ...data, skills, availability })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {skillOptions.map(skill => (
            <label key={skill} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Availability</h3>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select availability</option>
          {availabilityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
        >
          Next Step
        </button>
      </div>
    </form>
  )
}