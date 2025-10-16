import { useDonations } from '@/hooks/useDonations'
import { useAuth } from '@/app/contexts/AuthContext'
import { Trophy, Target, TrendingUp, Award, Star, Gift } from 'lucide-react'

export function UserProgress() {
  const { donations } = useDonations()
  const { user } = useAuth()
  
  const calculateProgress = () => {
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
    const nextMilestone = Math.ceil(totalDonated / 1000) * 1000
    return {
      current: totalDonated,
      next: nextMilestone,
      percentage: (totalDonated / nextMilestone) * 100
    }
  }

  const progress = calculateProgress()
  const impactPoints = Math.floor(donations.reduce((sum, d) => sum + d.amount, 0) / 100)
  const programsSupported = new Set(donations.map(d => d.program)).size

  // Calculate user level based on total donated
  const getUserLevel = (totalDonated: number) => {
    if (totalDonated >= 10000) return { level: 'Champion', icon: Trophy, color: 'text-yellow-500' }
    if (totalDonated >= 5000) return { level: 'Hero', icon: Award, color: 'text-purple-500' }
    if (totalDonated >= 2000) return { level: 'Advocate', icon: Star, color: 'text-blue-500' }
    if (totalDonated >= 500) return { level: 'Supporter', icon: Gift, color: 'text-green-500' }
    return { level: 'Beginner', icon: Target, color: 'text-gray-500' }
  }

  const userLevel = getUserLevel(progress.current)
  const LevelIcon = userLevel.icon

  // Calculate achievements
  const achievements = [
    {
      id: 'first_donation',
      title: 'First Steps',
      description: 'Made your first donation',
      unlocked: donations.length > 0,
      icon: Gift
    },
    {
      id: 'multi_program',
      title: 'Well Rounded',
      description: 'Supported multiple programs',
      unlocked: programsSupported >= 2,
      icon: Star
    },
    {
      id: 'consistent_giver',
      title: 'Consistent Giver',
      description: 'Made 5+ donations',
      unlocked: donations.length >= 5,
      icon: TrendingUp
    },
    {
      id: 'major_donor',
      title: 'Major Donor',
      description: 'Donated $1000+',
      unlocked: progress.current >= 1000,
      icon: Trophy
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.unlocked)

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your Impact Journey</h2>
            <p className="text-sm text-gray-500 mt-1">Track your progress and achievements</p>
          </div>
          <div className="flex items-center space-x-2">
            <LevelIcon className={`h-6 w-6 ${userLevel.color}`} />
            <span className={`text-sm font-medium ${userLevel.color}`}>
              {userLevel.level}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress to Next Milestone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to ${progress.next}</span>
            <span className="text-sm text-gray-500">{Math.round(progress.percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ${(progress.next - progress.current).toFixed(2)} to go
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-100">
            <p className="text-2xl font-bold text-teal-600">
              {donations.length}
            </p>
            <p className="text-sm text-gray-600 font-medium">Donations Made</p>
            <p className="text-xs text-gray-500 mt-1">
              {donations.length > 0 ? 'Keep it up!' : 'Start your journey'}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">
              {programsSupported}
            </p>
            <p className="text-sm text-gray-600 font-medium">Programs Supported</p>
            <p className="text-xs text-gray-500 mt-1">
              {programsSupported >= 3 ? 'Amazing reach!' : 'Expand your impact'}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <p className="text-2xl font-bold text-purple-600">
              {impactPoints}
            </p>
            <p className="text-sm text-gray-600 font-medium">Impact Points</p>
            <p className="text-xs text-gray-500 mt-1">
              {impactPoints >= 100 ? 'High impact!' : 'Growing strong'}
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Achievements</h3>
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlockedAchievements.slice(0, 4).map((achievement) => {
                const AchievementIcon = achievement.icon
                return (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <AchievementIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-900">{achievement.title}</p>
                      <p className="text-xs text-green-700">{achievement.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Target className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">No achievements yet</p>
              <p className="text-xs text-gray-400">Make your first donation to get started!</p>
            </div>
          )}
        </div>

        {/* Next Goals */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Next Goals</h3>
          <div className="space-y-2">
            {achievements.filter(a => !a.unlocked).slice(0, 2).map((goal) => {
              const GoalIcon = goal.icon
              return (
                <div key={goal.id} className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <GoalIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">{goal.title}</p>
                    <p className="text-xs text-gray-500">{goal.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
