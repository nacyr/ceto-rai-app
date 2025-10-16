import { useState, useEffect } from 'react'
import { useDonations } from '@/hooks/useDonations'
import { formatCurrency } from '@/utils/formatters'
import { Users, Heart, Stethoscope, BookOpen, Utensils, Home, TrendingUp, Globe, Award } from 'lucide-react'

export function ImpactTracker() {
  const { donations } = useDonations()
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [animatedValues, setAnimatedValues] = useState({
    studentsHelped: 0,
    mealsProvided: 0,
    healthcareBeneficiaries: 0,
    familiesSupported: 0
  })

  // Filter donations based on timeframe
  const getFilteredDonations = () => {
    if (selectedTimeframe === 'all') return donations
    
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (selectedTimeframe) {
      case '30d':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '90d':
        cutoffDate.setDate(now.getDate() - 90)
        break
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return donations
    }
    
    return donations.filter(d => new Date(d.created_at) >= cutoffDate)
  }

  const filteredDonations = getFilteredDonations()

  // Calculate impact metrics with more detailed calculations
  const impactMetrics = {
    studentsHelped: Math.floor(filteredDonations.reduce((sum, d) => 
      d.program === 'education' ? sum + (d.amount / 100) : sum, 0)),
    mealsProvided: Math.floor(filteredDonations.reduce((sum, d) => 
      d.program === 'humanitarian' ? sum + (d.amount / 5) : sum, 0)),
    healthcareBeneficiaries: Math.floor(filteredDonations.reduce((sum, d) => 
      d.program === 'healthcare' ? sum + (d.amount / 50) : sum, 0)),
    familiesSupported: Math.floor(filteredDonations.reduce((sum, d) => 
      sum + (d.amount / 200), 0))
  }

  // Calculate total impact across all programs
  const totalImpact = Object.values(impactMetrics).reduce((sum, value) => sum + value, 0)
  const totalDonated = filteredDonations.reduce((sum, d) => sum + d.amount, 0)

  // Animate numbers on mount and when values change
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        studentsHelped: Math.floor(impactMetrics.studentsHelped * progress),
        mealsProvided: Math.floor(impactMetrics.mealsProvided * progress),
        healthcareBeneficiaries: Math.floor(impactMetrics.healthcareBeneficiaries * progress),
        familiesSupported: Math.floor(impactMetrics.familiesSupported * progress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues(impactMetrics)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [filteredDonations.length, selectedTimeframe])

  const impactCards = [
    {
      title: 'Students Supported',
      value: animatedValues.studentsHelped,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Through education programs',
      program: 'education'
    },
    {
      title: 'Meals Provided',
      value: animatedValues.mealsProvided,
      icon: Utensils,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'To families in need',
      program: 'humanitarian'
    },
    {
      title: 'Healthcare Recipients',
      value: animatedValues.healthcareBeneficiaries,
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Received medical care',
      program: 'healthcare'
    },
    {
      title: 'Families Supported',
      value: animatedValues.familiesSupported,
      icon: Home,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Across all programs',
      program: 'all'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-teal-600" />
              Your Global Impact
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              See the real-world difference your donations are making
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="1y">Past Year</option>
              <option value="90d">Past 90 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Impact</p>
              <p className="text-2xl font-bold text-teal-600">{totalImpact.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Lives touched</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Donated</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalDonated)}</p>
              <p className="text-xs text-gray-500">
                {selectedTimeframe === 'all' ? 'All time' : `Past ${selectedTimeframe}`}
              </p>
            </div>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {impactCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className={`${card.bgColor} rounded-lg p-4 border border-opacity-20`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                  {card.value > 0 && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${card.textColor} mb-1`}>
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-700">{card.title}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
            )
          })}
        </div>

        {/* Impact Breakdown */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <Award className="h-4 w-4 mr-2 text-teal-600" />
            Impact Breakdown by Program
          </h4>
          <div className="space-y-3">
            {[
              { program: 'Education', amount: filteredDonations.filter(d => d.program === 'education').reduce((sum, d) => sum + d.amount, 0), color: 'bg-blue-500' },
              { program: 'Healthcare', amount: filteredDonations.filter(d => d.program === 'healthcare').reduce((sum, d) => sum + d.amount, 0), color: 'bg-green-500' },
              { program: 'Humanitarian', amount: filteredDonations.filter(d => d.program === 'humanitarian').reduce((sum, d) => sum + d.amount, 0), color: 'bg-orange-500' }
            ].filter(p => p.amount > 0).map((program) => {
              const percentage = totalDonated > 0 ? (program.amount / totalDonated) * 100 : 0
              return (
                <div key={program.program} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${program.color}`}></div>
                    <span className="text-sm text-gray-700">{program.program}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${program.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(program.amount)}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        {totalImpact === 0 && (
          <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Start Making an Impact</h4>
            <p className="text-sm text-gray-500 mb-4">
              Your first donation will help us track the real-world impact you're creating.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <Heart className="h-4 w-4 mr-2" />
              Make Your First Donation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
