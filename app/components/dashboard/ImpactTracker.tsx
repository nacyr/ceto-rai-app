import { useDonations } from '@/hooks/useDonations'
import { formatCurrency } from '@/utils/formatters'

export function ImpactTracker() {
  const { donations } = useDonations()

  const impactMetrics = {
    studentsHelped: Math.floor(donations.reduce((sum, d) => 
      d.program === 'education' ? sum + (d.amount / 100) : sum, 0)),
    mealsProvided: Math.floor(donations.reduce((sum, d) => 
      d.program === 'humanitarian' ? sum + (d.amount / 10) : sum, 0)),
    healthcareBeneficiaries: Math.floor(donations.reduce((sum, d) => 
      d.program === 'healthcare' ? sum + (d.amount / 50) : sum, 0))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <p className="text-2xl font-bold text-teal-600">
            {impactMetrics.studentsHelped}
          </p>
          <p className="text-sm text-gray-600">Students Supported</p>
        </div>
        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <p className="text-2xl font-bold text-teal-600">
            {impactMetrics.mealsProvided}
          </p>
          <p className="text-sm text-gray-600">Meals Provided</p>
        </div>
        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <p className="text-2xl font-bold text-teal-600">
            {impactMetrics.healthcareBeneficiaries}
          </p>
          <p className="text-sm text-gray-600">Healthcare Recipients</p>
        </div>
      </div>
    </div>
  )
}
