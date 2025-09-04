import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { formatCurrency, formatDate } from '@/utils/formatters'

export function DonationManager() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchDonations()
  }, [filter])

  const fetchDonations = async () => {
    let query = supabase
      .from('donations')
      .select(`
        *,
        profiles:donor_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setDonations(data || [])
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  const totalAmount = donations.reduce((sum, d: any) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Donations
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">
            Total: {formatCurrency(totalAmount)}
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Donor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation: any) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donation.profiles?.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(donation.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donation.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(donation.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
