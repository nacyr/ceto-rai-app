import { useState } from 'react'
import { useDonations } from '@/hooks/useDonations'
import { useAuth } from '@/app/contexts/AuthContext'
import { formatCurrency } from '@/utils/formatters'

export function DonationForm() {
  const [amount, setAmount] = useState('')
  const [program, setProgram] = useState('education')
  const { createDonation, loading, error } = useDonations()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to make a donation')
      return
    }
    
    try {
      await createDonation({
        amount: parseFloat(amount),
        program,
        donor_id: user.id,
        status: 'pending'
      })
      setAmount('')
      // Show success message
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Donation Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="program" className="block text-sm font-medium text-gray-700">
          Program
        </label>
        <select
          id="program"
          name="program"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          <option value="education">Education Support</option>
          <option value="healthcare">Healthcare Outreach</option>
          <option value="women">Women Empowerment</option>
          <option value="humanitarian">Humanitarian Aid</option>
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
        {loading ? 'Processing...' : 'Donate Now'}
      </button>
    </form>
  )
}
