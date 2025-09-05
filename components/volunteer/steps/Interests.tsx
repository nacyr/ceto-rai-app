import { useState } from 'react'

interface InterestsProps {
  data: {
    interests: string[]
    experience: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function Interests({ data, onUpdate, onNext, onBack }: InterestsProps) {
  const [interests, setInterests] = useState<string[]>(data.interests || [])
  const [experience, setExperience] = useState(data.experience || '')

  const programInterests = [
    'Education Support',
    'Healthcare Outreach',
    'Women Empowerment',
    'Humanitarian Aid'
  ]

  const handleInterestChange = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ ...data, interests, experience })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Program Interests</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {programInterests.map(program => (
            <label key={program} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={interests.includes(program)}
                onChange={() => handleInterestChange(program)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2">{program}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          rows={4}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Tell us about your relevant experience..."
        />
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