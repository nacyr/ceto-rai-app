import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { 
  Users, 
  Search, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Calendar
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  status?: 'pending' | 'approved' | 'rejected'
}

export function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, statusFilter])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Add mock status for demonstration - in real app, this would be a column in the database
      const usersWithStatus = data.map(user => ({
        ...user,
        status: Math.random() > 0.7 ? 'pending' : Math.random() > 0.5 ? 'approved' : 'rejected'
      })) as User[]

      setUsers(usersWithStatus)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      // In a real app, you would update the user status in the database
      // For now, we'll just update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status } : user
        )
      )

      console.log(`User ${userId} status updated to ${status}`)
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <X className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const pendingCount = users.filter(user => user.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user registrations and approvals</p>
        </div>
        <div className="text-sm text-gray-500">
          {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            size="sm"
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
            size="sm"
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No users have registered yet.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{user.full_name || 'No name provided'}</h3>
                    {getStatusBadge(user.status || 'pending')}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                </div>
              </div>
              
              {user.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => updateUserStatus(user.id, 'approved')}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => updateUserStatus(user.id, 'rejected')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}