'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { AdminDonation } from '@/app/types/admin/types'
import { supabase } from '@/lib/supabaseClient'

export default function DonationsPage() {
  const [donations, setDonations] = useState<AdminDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
    
    setDonations(data || [])
    setTotalAmount(data?.reduce((sum, d) => sum + d.amount, 0) || 0)
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donations</h1>
        <div className="text-lg font-semibold text-teal-600">
          Total: {formatCurrency(totalAmount)}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => (
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
                  {formatDate(donation.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
