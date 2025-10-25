'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { ImpactTracker } from '@/app/components/dashboard/ImpactTracker'
import {
  Users,
  Heart,
  Award,
  BarChart3,
  Globe,
  Calendar,
  Download,
  Share2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Achievement, Donation, ImpactData } from '@/app/types/admin/types'
import { Progress } from '@/app/components/ui/progress'
import { supabase } from '@/lib/supabaseClient'

export default function ImpactPage() {
  const { user } = useAuth()
  const [impactData, setImpactData] = useState<ImpactData>({
    totalDonated: 0,
    totalDonations: 0,
    volunteerHours: 0,
    peopleHelped: 0,
    programsSupported: 0,
    impactScore: 0,
    monthlyImpact: [],
    achievements: []
  })
  const [loading, setLoading] = useState(true)

  // ✅ Typed and memoized function to fix ESLint warning
  const fetchImpactData = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)

      // Fetch donations data
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id)

      if (donationsError) throw donationsError

      // Fetch volunteer data
      const { data: volunteerApp, error: volunteerError } = await supabase
        .from('volunteer_applications')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (volunteerError && volunteerError.code !== 'PGRST116') {
        console.error('Error fetching volunteer data:', volunteerError)
      }

      // Calculate impact metrics
      const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
      const totalDonations = donations?.length || 0
      const programsSupported = new Set(donations?.map(d => d.program)).size || 0

      const peopleHelped = calculatePeopleHelped(donations || [])
      const impactScore =
        Math.floor(totalDonated / 10) +
        (volunteerApp?.status === 'approved' ? 100 : 0)

      // Mock achievements
      const achievements: Achievement[] = [
        {
          id: '1',
          title: 'First Donation',
          description: 'Made your first donation to support our cause',
          icon: '🎉',
          unlocked: totalDonations > 0,
          unlockedAt: donations?.[0]?.created_at
        },
        {
          id: '2',
          title: 'Generous Giver',
          description: 'Donated over $100 in total',
          icon: '💝',
          unlocked: totalDonated >= 100
        },
        {
          id: '3',
          title: 'Multi-Program Supporter',
          description: 'Supported 3 or more different programs',
          icon: '🌟',
          unlocked: programsSupported >= 3
        },
        {
          id: '4',
          title: 'Volunteer Hero',
          description: 'Approved as a volunteer',
          icon: '🦸',
          unlocked: volunteerApp?.status === 'approved',
          unlockedAt: volunteerApp?.updated_at
        },
        {
          id: '5',
          title: 'Impact Champion',
          description: 'Reached an impact score of 500+',
          icon: '🏆',
          unlocked: impactScore >= 500
        }
      ]

      setImpactData({
        totalDonated,
        totalDonations,
        volunteerHours: 0, // TODO: Compute later
        peopleHelped,
        programsSupported,
        impactScore,
        monthlyImpact: [], // TODO: Add trends
        achievements
      })
    } catch (error) {
      console.error('Error fetching impact data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // ✅ Clean useEffect with proper dependency
  useEffect(() => {
    fetchImpactData()
  }, [fetchImpactData])

  const calculatePeopleHelped = (donations: Donation[]): number => {
    return donations.reduce((total, donation) => {
      switch (donation.program) {
        case 'education':
          return total + Math.floor(donation.amount / 50)
        case 'healthcare':
          return total + Math.floor(donation.amount / 25)
        case 'humanitarian':
          return total + Math.floor(donation.amount / 10)
        default:
          return total + Math.floor(donation.amount / 30)
      }
    }, 0)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const nextMilestone = Math.ceil(impactData.impactScore / 100) * 100 || 100
  const milestoneProgress = (impactData.impactScore / nextMilestone) * 100

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
          <h1 className="text-3xl font-bold text-gray-900">Your Impact</h1>
          <p className="text-gray-600 mt-1">
            See the difference you&apos;re making in the world
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Impact</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        </div>
      </div>

      {/* Impact Score */}
      <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span>Your Impact Score</span>
          </CardTitle>
          <CardDescription className="text-teal-100">
            A measure of your total contribution to our mission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">{impactData.impactScore}</div>
            <div className="text-right">
              <div className="text-sm opacity-90">Next milestone</div>
              <div className="text-lg font-semibold">{nextMilestone}</div>
            </div>
          </div>
          <Progress value={milestoneProgress} className="bg-teal-400" />
          <div className="text-sm mt-2 opacity-90">
            {nextMilestone - impactData.impactScore} points to next milestone
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donated"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
          value={formatCurrency(impactData.totalDonated)}
          description={`Across ${impactData.totalDonations} donations`}
        />
        <StatCard
          title="People Helped"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={impactData.peopleHelped}
          description="Lives directly impacted"
        />
        <StatCard
          title="Programs Supported"
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          value={impactData.programsSupported}
          description="Different causes supported"
        />
        <StatCard
          title="Volunteer Hours"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={impactData.volunteerHours}
          description="Hours contributed"
        />
      </div>

      {/* Impact Tracker */}
      <ImpactTracker />

      {/* Achievements */}
      <AchievementsCard
        achievements={impactData.achievements}
        formatDate={formatDate}
      />

      {/* Impact Breakdown */}
      <ImpactBreakdown totalDonated={impactData.totalDonated} />

      {/* CTA */}
      <Card>
        <CardHeader>
          <CardTitle>Keep Making an Impact</CardTitle>
          <CardDescription>
            Continue your journey of making a positive difference
          </CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => (window.location.href = '/get-involved/donate')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Make Another Donation
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/dashboard/volunteer')}
          >
            <Users className="w-4 h-4 mr-2" />
            Volunteer Opportunities
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// --- Helper Components for Cleanliness ---

function StatCard({ title, icon, value, description }: { title: string; icon: React.ReactNode; value: string | number; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-teal-600">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function AchievementsCard({ achievements, formatDate }: { achievements: Achievement[]; formatDate: (date: string) => string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>Milestones you&apos;ve reached on your impact journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'border-teal-200 bg-teal-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      achievement.unlocked ? 'text-teal-900' : 'text-gray-600'
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      achievement.unlocked ? 'text-teal-700' : 'text-gray-500'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-teal-600 mt-1">
                      Unlocked on {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactBreakdown({ totalDonated }: { totalDonated: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Impact Breakdown</span>
        </CardTitle>
        <CardDescription>How your contributions are making a difference</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProgramImpact
            title="Education Program"
            color="blue"
            description="Supporting student scholarships and school supplies"
            value={Math.floor(totalDonated * 0.4 / 50)}
            label="Students helped"
          />
          <ProgramImpact
            title="Healthcare Program"
            color="green"
            description="Providing medical care and health education"
            value={Math.floor(totalDonated * 0.3 / 25)}
            label="People treated"
          />
          <ProgramImpact
            title="Humanitarian Aid"
            color="orange"
            description="Emergency relief and food assistance"
            value={Math.floor(totalDonated * 0.3 / 10)}
            label="Meals provided"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ProgramImpact({
  title,
  color,
  description,
  value,
  label
}: {
  title: string
  color: string
  description: string
  value: number
  label: string
}) {
  return (
    <div className={`flex items-center justify-between p-4 bg-${color}-50 rounded-lg`}>
      <div>
        <h4 className={`font-medium text-${color}-900`}>{title}</h4>
        <p className={`text-sm text-${color}-700`}>{description}</p>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold text-${color}-600`}>{value}</div>
        <div className={`text-sm text-${color}-600`}>{label}</div>
      </div>
    </div>
  )
}


// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/app/contexts/AuthContext'
// import { supabase } from '@/app/lib/supabase'
// import { ImpactTracker } from '@/app/components/dashboard/ImpactTracker'
// import { 
//   // TrendingUp, 
//   Users, 
//   Heart, 
//   Award,
//   BarChart3,
//   Globe,
//   // Target,
//   Calendar,
//   Download,
//   Share2
// } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
// import { Button } from '@/app/components/ui/button'
// import { Achievement, Donation, ImpactData } from '@/app/types/admin/types'
// import { Progress } from '@/app/components/ui/progress'


// export default function ImpactPage() {
//   const { user } = useAuth()
//   const [impactData, setImpactData] = useState<ImpactData>({
//     totalDonated: 0,
//     totalDonations: 0,
//     volunteerHours: 0,
//     peopleHelped: 0,
//     programsSupported: 0,
//     impactScore: 0,
//     monthlyImpact: [],
//     achievements: []
//   })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (user) {
//       fetchImpactData()
//     }
//   }, [user])

//   const fetchImpactData = async () => {
//     try {
//       setLoading(true)
      
//       // Fetch donations data
//       const { data: donations, error: donationsError } = await supabase
//         .from('donations')
//         .select('*')
//         .eq('user_id', user?.id)

//       if (donationsError) throw donationsError

//       // Fetch volunteer data
//       const { data: volunteerApp, error: volunteerError } = await supabase
//         .from('volunteer_applications')
//         .select('*')
//         .eq('user_id', user?.id)
//         .single()

//       if (volunteerError && volunteerError.code !== 'PGRST116') {
//         console.error('Error fetching volunteer data:', volunteerError)
//       }

//       // Calculate impact metrics
//       const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
//       const totalDonations = donations?.length || 0
//       const programsSupported = new Set(donations?.map(d => d.program)).size || 0
      
//       // Calculate people helped based on donation amounts and programs
//       const peopleHelped = calculatePeopleHelped(donations || [])
      
//       // Calculate impact score
//       const impactScore = Math.floor(totalDonated / 10) + (volunteerApp?.status === 'approved' ? 100 : 0)

//       // Mock achievements
//       const achievements: Achievement[] = [
//         {
//           id: '1',
//           title: 'First Donation',
//           description: 'Made your first donation to support our cause',
//           icon: '🎉',
//           unlocked: totalDonations > 0,
//           unlockedAt: donations?.[0]?.created_at
//         },
//         {
//           id: '2',
//           title: 'Generous Giver',
//           description: 'Donated over $100 in total',
//           icon: '💝',
//           unlocked: totalDonated >= 100,
//         },
//         {
//           id: '3',
//           title: 'Multi-Program Supporter',
//           description: 'Supported 3 or more different programs',
//           icon: '🌟',
//           unlocked: programsSupported >= 3,
//         },
//         {
//           id: '4',
//           title: 'Volunteer Hero',
//           description: 'Approved as a volunteer',
//           icon: '🦸',
//           unlocked: volunteerApp?.status === 'approved',
//           unlockedAt: volunteerApp?.updated_at
//         },
//         {
//           id: '5',
//           title: 'Impact Champion',
//           description: 'Reached an impact score of 500+',
//           icon: '🏆',
//           unlocked: impactScore >= 500,
//         }
//       ]

//       setImpactData({
//         totalDonated,
//         totalDonations,
//         volunteerHours: 0, // TODO: Calculate from volunteer activities
//         peopleHelped,
//         programsSupported,
//         impactScore,
//         monthlyImpact: [], // TODO: Calculate monthly trends
//         achievements
//       })
//     } catch (error) {
//       console.error('Error fetching impact data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const calculatePeopleHelped = (donations: Donation[]) => {
//     return donations.reduce((total, donation) => {
//       switch (donation.program) {
//         case 'education':
//           return total + Math.floor(donation.amount / 50) // $50 helps 1 student
//         case 'healthcare':
//           return total + Math.floor(donation.amount / 25) // $25 helps 1 person with healthcare
//         case 'humanitarian':
//           return total + Math.floor(donation.amount / 10) // $10 provides meals for 1 person
//         default:
//           return total + Math.floor(donation.amount / 30) // Default: $30 helps 1 person
//       }
//     }, 0)
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   }

//   const nextMilestone = Math.ceil(impactData.impactScore / 100) * 100
//   const milestoneProgress = (impactData.impactScore / nextMilestone) * 100

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Your Impact</h1>
//           <p className="text-gray-600 mt-1">See the difference you&apos;re making in the world</p>
//         </div>
//         <div className="flex space-x-3">
//           <Button variant="outline" className="flex items-center space-x-2">
//             <Share2 className="w-4 h-4" />
//             <span>Share Impact</span>
//           </Button>
//           <Button variant="outline" className="flex items-center space-x-2">
//             <Download className="w-4 h-4" />
//             <span>Download Report</span>
//           </Button>
//         </div>
//       </div>

//       {/* Impact Score */}
//       <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Award className="w-6 h-6" />
//             <span>Your Impact Score</span>
//           </CardTitle>
//           <CardDescription className="text-teal-100">
//             A measure of your total contribution to our mission
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-4xl font-bold">{impactData.impactScore}</div>
//             <div className="text-right">
//               <div className="text-sm opacity-90">Next milestone</div>
//               <div className="text-lg font-semibold">{nextMilestone}</div>
//             </div>
//           </div>
//           <Progress value={milestoneProgress} className="bg-teal-400" />
//           <div className="text-sm mt-2 opacity-90">
//             {nextMilestone - impactData.impactScore} points to next milestone
//           </div>
//         </CardContent>
//       </Card>

//       {/* Impact Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
//             <Heart className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-teal-600">
//               {formatCurrency(impactData.totalDonated)}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Across {impactData.totalDonations} donations
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">People Helped</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-teal-600">
//               {impactData.peopleHelped}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Lives directly impacted
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Programs Supported</CardTitle>
//             <Globe className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-teal-600">
//               {impactData.programsSupported}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Different causes supported
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-teal-600">
//               {impactData.volunteerHours}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Hours contributed
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Impact Tracker Component */}
//       <ImpactTracker />

//       {/* Achievements */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Award className="w-5 h-5" />
//             <span>Achievements</span>
//           </CardTitle>
//           <CardDescription>
//             Milestones you&apos;ve reached on your impact journey
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {impactData.achievements.map((achievement) => (
//               <div
//                 key={achievement.id}
//                 className={`p-4 rounded-lg border-2 ${
//                   achievement.unlocked
//                     ? 'border-teal-200 bg-teal-50'
//                     : 'border-gray-200 bg-gray-50 opacity-60'
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="text-2xl">{achievement.icon}</div>
//                   <div className="flex-1">
//                     <h4 className={`font-medium ${
//                       achievement.unlocked ? 'text-teal-900' : 'text-gray-600'
//                     }`}>
//                       {achievement.title}
//                     </h4>
//                     <p className={`text-sm ${
//                       achievement.unlocked ? 'text-teal-700' : 'text-gray-500'
//                     }`}>
//                       {achievement.description}
//                     </p>
//                     {achievement.unlocked && achievement.unlockedAt && (
//                       <p className="text-xs text-teal-600 mt-1">
//                         Unlocked on {formatDate(achievement.unlockedAt)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Impact Breakdown */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <BarChart3 className="w-5 h-5" />
//             <span>Impact Breakdown</span>
//           </CardTitle>
//           <CardDescription>
//             How your contributions are making a difference
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
//               <div>
//                 <h4 className="font-medium text-blue-900">Education Program</h4>
//                 <p className="text-sm text-blue-700">Supporting student scholarships and school supplies</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-bold text-blue-600">
//                   {Math.floor(impactData.totalDonated * 0.4 / 50)}
//                 </div>
//                 <div className="text-sm text-blue-600">Students helped</div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//               <div>
//                 <h4 className="font-medium text-green-900">Healthcare Program</h4>
//                 <p className="text-sm text-green-700">Providing medical care and health education</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-bold text-green-600">
//                   {Math.floor(impactData.totalDonated * 0.3 / 25)}
//                 </div>
//                 <div className="text-sm text-green-600">People treated</div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
//               <div>
//                 <h4 className="font-medium text-orange-900">Humanitarian Aid</h4>
//                 <p className="text-sm text-orange-700">Emergency relief and food assistance</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-bold text-orange-600">
//                   {Math.floor(impactData.totalDonated * 0.3 / 10)}
//                 </div>
//                 <div className="text-sm text-orange-600">Meals provided</div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Call to Action */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Keep Making an Impact</CardTitle>
//           <CardDescription>
//             Continue your journey of making a positive difference
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex space-x-4">
//           <Button 
//             className="bg-teal-600 hover:bg-teal-700"
//             onClick={() => window.location.href = '/get-involved/donate'}
//           >
//             <Heart className="w-4 h-4 mr-2" />
//             Make Another Donation
//           </Button>
//           <Button 
//             variant="outline"
//             onClick={() => window.location.href = '/dashboard/volunteer'}
//           >
//             <Users className="w-4 h-4 mr-2" />
//             Volunteer Opportunities
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }