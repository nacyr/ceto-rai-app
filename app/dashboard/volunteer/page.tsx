'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin,
  Heart,
  Award,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { VolunteerApplication, VolunteerOpportunity } from '@/app/types/admin/types'
import { supabase } from '@/lib/supabaseClient'


export default function VolunteerPage() {
  const { user } = useAuth()
  const [application, setApplication] = useState<VolunteerApplication | null>(null)
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchVolunteerData()
    }
  }, [user])

  const fetchVolunteerData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's volunteer application
      const { data: applicationData, error: appError } = await supabase
        .from('volunteer_applications')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (appError && appError.code !== 'PGRST116') {
        console.error('Error fetching application:', appError)
      } else if (applicationData) {
        setApplication(applicationData)
      }

      // Fetch available volunteer opportunities (mock data for now)
      const mockOpportunities: VolunteerOpportunity[] = [
        {
          id: '1',
          title: 'Education Program Assistant',
          description: 'Help with tutoring and educational activities for children',
          location: 'Community Center, Lagos',
          date: '2024-02-15',
          duration: '4 hours',
          skills_needed: ['Teaching', 'Patience', 'Communication'],
          spots_available: 5
        },
        {
          id: '2',
          title: 'Healthcare Support Volunteer',
          description: 'Assist with basic healthcare services and health education',
          location: 'Rural Health Clinic, Abuja',
          date: '2024-02-20',
          duration: '6 hours',
          skills_needed: ['Healthcare', 'First Aid', 'Empathy'],
          spots_available: 3
        },
        {
          id: '3',
          title: 'Food Distribution Coordinator',
          description: 'Help organize and distribute food packages to families in need',
          location: 'Distribution Center, Kano',
          date: '2024-02-25',
          duration: '8 hours',
          skills_needed: ['Organization', 'Physical Fitness', 'Leadership'],
          spots_available: 8
        }
      ]
      
      setOpportunities(mockOpportunities)
    } catch (error) {
      console.error('Error fetching volunteer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your volunteer activities and find new opportunities</p>
        </div>
        {!application && (
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => window.location.href = '/get-involved/volunteer'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply to Volunteer
          </Button>
        )}
      </div>

      {/* Application Status */}
      {application ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(application.status)}
              <span>Your Volunteer Application</span>
            </CardTitle>
            <CardDescription>
              Application submitted on {formatDate(application.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
              {application.status === 'pending' && (
                <span className="text-sm text-gray-500">
                  We&apos;ll review your application within 3-5 business days
                </span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600">Name: {application.full_name}</p>
                <p className="text-sm text-gray-600">Email: {application.email}</p>
                <p className="text-sm text-gray-600">Phone: {application.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                <p className="text-sm text-gray-600">Skills: {application.skills}</p>
                <p className="text-sm text-gray-600">Availability: {application.availability}</p>
              </div>
            </div>

            {application.status === 'approved' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Congratulations!</span>
                </div>
                <p className="text-green-700 mt-1">
                  Your volunteer application has been approved. You can now sign up for volunteer opportunities below.
                </p>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Application Not Approved</span>
                </div>
                <p className="text-red-700 mt-1">
                  Unfortunately, your application was not approved at this time. You can reapply after 30 days.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Become a Volunteer</span>
            </CardTitle>
            <CardDescription>
              Join our community of volunteers and make a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You haven&apos; t submitted a volunteer application yet. Apply now to start making an impact in your community.
            </p>
            <Button 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => window.location.href = '/get-involved/volunteer'}
            >
              <Heart className="w-4 h-4 mr-2" />
              Apply to Volunteer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Volunteer Opportunities */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Opportunities</h2>
        <div className="grid gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{opportunity.title}</span>
                  <Badge variant="outline">
                    {opportunity.spots_available} spots available
                  </Badge>
                </CardTitle>
                <CardDescription>{opportunity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(opportunity.date)} ({opportunity.duration})
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Skills Needed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills_needed.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {opportunity.spots_available} volunteers needed
                  </span>
                  <Button 
                    variant="outline"
                    disabled={!application || application.status !== 'approved'}
                    className="disabled:opacity-50"
                  >
                    {application?.status === 'approved' ? 'Sign Up' : 'Application Required'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Volunteer Stats (if approved) */}
      {application?.status === 'approved' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Volunteered</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">0</div>
              <p className="text-xs text-muted-foreground">Total hours contributed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">0</div>
              <p className="text-xs text-muted-foreground">Volunteer events completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">0</div>
              <p className="text-xs text-muted-foreground">Community impact points</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}