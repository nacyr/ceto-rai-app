import { useState } from 'react'

interface InterestsProps {
  data: {
    interests?: string[]
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function Interests({ data, onUpdate, onNext, onBack }: InterestsProps) {
  const [interests, setInterests] = useState<string[]>(data.interests || [])

  const programOptions = [
    'Youth Mentoring',
    'Educational Workshops',
    'Community Outreach',
    'Healthcare Support',
    'Environmental Programs',
    'Administrative Support',
    'Event Planning',
    'Fundraising'
  ]

  const handleInterestChange = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter(i => i !== interest)
      : [...interests, interest]
    setInterests(newInterests)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ interests })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Program Interests</h3>
        <p className="mt-1 text-sm text-gray-600">
          Select the programs you're interested in volunteering for
        </p>
      </div>

      <div className="space-y-4">
        {programOptions.map((program) => (
          <label key={program} className="flex items-center">
            <input
              type="checkbox"
              checked={interests.includes(program)}
              onChange={() => handleInterestChange(program)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-3 text-sm text-gray-700">{program}</span>
          </label>
        ))}
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
          Next
        </button>
      </div>
    </form>
  )
}