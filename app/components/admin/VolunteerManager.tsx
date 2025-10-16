import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { formatDate } from '@/utils/formatters'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Clock,
  Users,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  ChevronDown,
  Star,
  Award,
  FileText
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'

interface Volunteer {
  id: string;
  user_id: string;
  skills: string[];
  availability: string;
  experience: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  phone?: string;
  location?: string;
  emergency_contact?: string;
  background_check?: boolean;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function VolunteerManager() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)

  const availableSkills = [
    'Teaching',
    'Healthcare',
    'Construction',
    'Technology',
    'Administration',
    'Fundraising',
    'Event Planning',
    'Social Media',
    'Photography',
    'Translation',
    'Counseling',
    'Legal Aid'
  ]

  useEffect(() => {
    fetchVolunteers()
  }, [])

  useEffect(() => {
    filterAndSortVolunteers()
  }, [volunteers, searchTerm, statusFilter, skillFilter, dateRange, sortBy, sortOrder])

  const fetchVolunteers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVolunteers(data || [])
    } catch (error) {
      console.error('Error fetching volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortVolunteers = () => {
    let filtered = [...volunteers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(volunteer =>
        volunteer.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        volunteer.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(volunteer => volunteer.status === statusFilter)
    }

    // Skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(volunteer => 
        volunteer.skills.includes(skillFilter)
      )
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
      
      filtered = filtered.filter(volunteer => 
        new Date(volunteer.created_at) >= filterDate
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.profiles?.full_name || ''
          bValue = b.profiles?.full_name || ''
          break
        case 'status':
          aValue = a.status
          bValue = b.status
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

    setFilteredVolunteers(filtered)
  }

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setVolunteers(prev => prev.map(volunteer => 
        volunteer.id === id ? { ...volunteer, status } : volunteer
      ))
    } catch (error) {
      console.error('Error updating volunteer status:', error)
    }
  }

  const handleBulkStatusUpdate = async (status: 'pending' | 'approved' | 'rejected') => {
    if (selectedVolunteers.length === 0) return

    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status })
        .in('id', selectedVolunteers)

      if (error) throw error
      
      // Update local state
      setVolunteers(prev => prev.map(volunteer => 
        selectedVolunteers.includes(volunteer.id) ? { ...volunteer, status } : volunteer
      ))
      setSelectedVolunteers([])
    } catch (error) {
      console.error('Error updating volunteer statuses:', error)
    }
  }

  const exportVolunteers = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Skills', 'Status', 'Applied Date', 'Location', 'Phone', 'Availability'].join(','),
      ...filteredVolunteers.map(volunteer => [
        volunteer.id,
        volunteer.profiles?.full_name || '',
        volunteer.profiles?.email || '',
        volunteer.skills.join('; '),
        volunteer.status,
        formatDate(volunteer.created_at),
        volunteer.location || '',
        volunteer.phone || '',
        volunteer.availability || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const VolunteerDetailModal = ({ volunteer }: { volunteer: Volunteer }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          {volunteer.profiles?.full_name || 'Volunteer Details'}
        </DialogTitle>
        <DialogDescription>
          Complete volunteer application information
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-sm text-gray-900">{volunteer.profiles?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900">{volunteer.profiles?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm text-gray-900">{volunteer.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-sm text-gray-900">{volunteer.location || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Skills & Availability */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Skills & Availability
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Skills</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {volunteer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Availability</label>
              <p className="text-sm text-gray-900">{volunteer.availability || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Experience & Motivation */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Experience & Motivation
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Previous Experience</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{volunteer.experience || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Motivation</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{volunteer.motivation || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Application Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <div className="mt-1">
                {getStatusBadge(volunteer.status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Applied Date</label>
              <p className="text-sm text-gray-900">{formatDate(volunteer.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button
            onClick={() => updateStatus(volunteer.id, 'approved')}
            className="bg-green-600 hover:bg-green-700"
            disabled={volunteer.status === 'approved'}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => updateStatus(volunteer.id, 'rejected')}
            variant="destructive"
            disabled={volunteer.status === 'rejected'}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => updateStatus(volunteer.id, 'pending')}
            variant="outline"
            disabled={volunteer.status === 'pending'}
          >
            <Clock className="h-4 w-4 mr-2" />
            Mark Pending
          </Button>
        </div>
      </div>
    </DialogContent>
  )

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
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
          <p className="text-gray-600">Review and manage volunteer applications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchVolunteers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportVolunteers}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredVolunteers.length}</div>
            <p className="text-xs text-muted-foreground">
              All volunteer applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredVolunteers.filter(v => v.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active volunteers
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
              {filteredVolunteers.filter(v => v.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredVolunteers.filter(v => v.status === 'rejected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Not approved
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
                placeholder="Search volunteers..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Skills</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
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
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="status-asc">Status A-Z</option>
              <option value="status-desc">Status Z-A</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedVolunteers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedVolunteers.length} volunteer{selectedVolunteers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('approved')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve All
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
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedVolunteers([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Volunteers Table */}
      <Card>
        <CardContent className="p-0">
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || skillFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No volunteer applications have been submitted yet.'
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
                        checked={selectedVolunteers.length === filteredVolunteers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVolunteers(filteredVolunteers.map(v => v.id))
                          } else {
                            setSelectedVolunteers([])
                          }
                        }}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedVolunteers.includes(volunteer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVolunteers(prev => [...prev, volunteer.id])
                            } else {
                              setSelectedVolunteers(prev => prev.filter(id => id !== volunteer.id))
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
                              {volunteer.profiles?.full_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {volunteer.profiles?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{volunteer.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(volunteer.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(volunteer.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedVolunteer(volunteer)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            {selectedVolunteer && <VolunteerDetailModal volunteer={selectedVolunteer} />}
                          </Dialog>
                          <select
                            value={volunteer.status}
                            onChange={(e) => updateStatus(volunteer.id, e.target.value as any)}
                            className="text-xs rounded border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
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
