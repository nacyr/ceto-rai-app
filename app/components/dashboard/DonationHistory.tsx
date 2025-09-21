import { useDonations } from '@/hooks/useDonations'
import { formatCurrency, formatDate } from '@/utils/formatters'

export function DonationHistory() {
  const { donations, loading } = useDonations()

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Donation History</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {donations.map((donation) => (
            <li key={donation.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">{donation.program}</p>
                  <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(donation.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
