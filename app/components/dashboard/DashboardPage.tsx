import { useProfile } from '@/hooks/useProfile'
import { useDonations } from '@/hooks/useDonations'
import { useVolunteer } from '@/hooks/useVolunteer'
import { formatCurrency } from '@/utils/formatters'
import { DonationHistory } from './DonationHistory'
import { UserProgress } from './UserProgress'
import { ProfileSettings } from './ProfileSettings'

export function DashboardPage() {
  const { profile } = useProfile()
  const { donations } = useDonations()
  const { volunteerStatus } = useVolunteer()

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-3">
          <ProfileSettings />
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-8">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Donated</h3>
              <p className="text-2xl font-semibold text-teal-600">{formatCurrency(totalDonated)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Volunteer Status</h3>
              <p className="text-2xl font-semibold text-teal-600">
                {volunteerStatus?.status || 'Not Applied'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Impact Score</h3>
              <p className="text-2xl font-semibold text-teal-600">
                {Math.floor(totalDonated / 100)}
              </p>
            </div>
          </div>

          <UserProgress />
          <DonationHistory />
        </div>
      </div>
    </div>
  )
}
