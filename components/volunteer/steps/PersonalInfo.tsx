import { useState } from 'react'

export function PersonalInfo({ data, onUpdate, onNext }) {
  const [form, setForm] = useState(data.personalInfo)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate({ ...data, personalInfo: form })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          required
          value={form.fullName || ''}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          required
          value={form.phone || ''}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Why do you want to volunteer with us?
        </label>
        <textarea
          required
          rows={4}
          value={form.motivation || ''}
          onChange={(e) => setForm({ ...form, motivation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div className="flex justify-end">
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
