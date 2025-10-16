import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Clock,
  DollarSign,
  Calendar,
  User,
  MoreHorizontal,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'

interface Donation {
  id: string;
  amount: number;
  program: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  donor_id: string;
  payment_method?: string;
  transaction_id?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function DonationManager() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [selectedDonations, setSelectedDonations] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'donor'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const programs = [
    'Education Support',
    'Healthcare Access',
    'Food Security',
    'Emergency Relief',
    'Community Development'
  ]

  useEffect(() => {
    fetchDonations()
  }, [])

  useEffect(() => {
    filterAndSortDonations()
  }, [donations, searchTerm, statusFilter, programFilter, dateRange, sortBy, sortOrder])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          profiles:donor_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortDonations = () => {
    let filtered = [...donations]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter)
    }

    // Program filter
    if (programFilter !== 'all') {
      filtered = filtered.filter(donation => donation.program === programFilter)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateRange) {
        case '7d':
          filterDate.setDate(now.getDate() - 7)
          break
        case '30d':
          filterDate.setDate(now.getDate() - 30)
          break
        case '90d':
          filterDate.setDate(now.getDate() - 90)
          break
      }
      
      filtered = filtered.filter(donation => 
        new Date(donation.created_at) >= filterDate
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'donor':
          aValue = a.profiles?.full_name || ''
          bValue = b.profiles?.full_name || ''
          break
        case 'date':
        default:
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredDonations(filtered)
  }

  const updateDonationStatus = async (id: string, status: 'completed' | 'pending' | 'failed') => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation.id === id ? { ...donation, status } : donation
      ))
    } catch (error) {
      console.error('Error updating donation status:', error)
    }
  }

  const handleBulkStatusUpdate = async (status: 'completed' | 'pending' | 'failed') => {
    if (selectedDonations.length === 0) return

    try {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .in('id', selectedDonations)

      if (error) throw error
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        selectedDonations.includes(donation.id) ? { ...donation, status } : donation
      ))
      setSelectedDonations([])
    } catch (error) {
      console.error('Error updating donation statuses:', error)
    }
  }

  const exportDonations = () => {
    const csvContent = [
      ['ID', 'Donor Name', 'Email', 'Amount', 'Program', 'Status', 'Date', 'Transaction ID'].join(','),
      ...filteredDonations.map(donation => [
        donation.id,
        donation.profiles?.full_name || 'Anonymous',
        donation.profiles?.email || '',
        donation.amount,
        donation.program,
        donation.status,
        formatDate(donation.created_at),
        donation.transaction_id || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)
  const completedAmount = filteredDonations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donation Management</h2>
          <p className="text-gray-600">Monitor and manage all donation transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchDonations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportDonations}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredDonations.length} donations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(completedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredDonations.filter(d => d.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredDonations.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredDonations.filter(d => d.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Programs</option>
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as any)
                setSortOrder(order as any)
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="donor-asc">Donor A-Z</option>
              <option value="donor-desc">Donor Z-A</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDonations.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedDonations.length} donation{selectedDonations.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Mark Pending
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('failed')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Mark Failed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDonations([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donations Table */}
      <Card>
        <CardContent className="p-0">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || programFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No donations have been made yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedDonations.length === filteredDonations.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDonations(filteredDonations.map(d => d.id))
                          } else {
                            setSelectedDonations([])
                          }
                        }}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.includes(donation.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDonations(prev => [...prev, donation.id])
                            } else {
                              setSelectedDonations(prev => prev.filter(id => id !== donation.id))
                            }
                          }}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {donation.profiles?.full_name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donation.profiles?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(donation.amount)}
                        </div>
                        {donation.transaction_id && (
                          <div className="text-xs text-gray-500">
                            ID: {donation.transaction_id}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{donation.program}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(donation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(donation.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <select
                            value={donation.status}
                            onChange={(e) => updateDonationStatus(donation.id, e.target.value as any)}
                            className="text-xs rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
