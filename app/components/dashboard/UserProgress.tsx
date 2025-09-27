import { useDonations } from '@/hooks/useDonations'

export function UserProgress() {
  const { donations } = useDonations()
  
  const calculateProgress = () => {
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
    const nextMilestone = Math.ceil(totalDonated / 1000) * 1000
    return (totalDonated / nextMilestone) * 100
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Impact</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress to next milestone</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-teal-600">
              {donations.length}
            </p>
            <p className="text-sm text-gray-500">Donations Made</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-teal-600">
              {new Set(donations.map(d => d.program)).size}
            </p>
            <p className="text-sm text-gray-500">Programs Supported</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-teal-600">
              {Math.floor(donations.reduce((sum, d) => sum + d.amount, 0) / 100)}
            </p>
            <p className="text-sm text-gray-500">Impact Points</p>
          </div>
        </div>
      </div>
    </div>
  )
}
