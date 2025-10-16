import { useState } from 'react'
import { useDonations } from '@/hooks/useDonations'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Filter, Download, Search, Calendar, DollarSign, Heart, Users, Stethoscope } from 'lucide-react'

export function DonationHistory() {
  const { donations, loading } = useDonations()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const getProgramIcon = (program: string) => {
    switch (program.toLowerCase()) {
      case 'education':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'healthcare':
        return <Stethoscope className="h-4 w-4 text-green-500" />
      case 'humanitarian':
        return <Heart className="h-4 w-4 text-red-500" />
      default:
        return <DollarSign className="h-4 w-4 text-teal-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDonations = donations
    .filter(donation => {
      if (filter !== 'all' && donation.program !== filter) return false
      if (searchTerm && !donation.program.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount
        case 'program':
          return a.program.localeCompare(b.program)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Donation History</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Programs</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="humanitarian">Humanitarian</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="program">Sort by Program</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <div key={donation.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getProgramIcon(donation.program)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {donation.program}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status || 'completed')}`}>
                        {donation.status || 'completed'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(donation.created_at)}
                      </p>
                      {donation.id && (
                        <p className="text-xs text-gray-400">
                          ID: {donation.id.toString().slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(donation.amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    One-time
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by making your first donation.'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Make a Donation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
