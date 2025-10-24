export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  status?: 'pending' | 'approved' | 'rejected'
}


export interface ImpactData {
  totalDonated: number
  totalDonations: number
  volunteerHours: number
  peopleHelped: number
  programsSupported: number
  impactScore: number
  monthlyImpact: MonthlyImpact[]
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

export interface MonthlyImpact {
  month: string
  donated: number
  donations: number
  volunteerHours: number
  peopleHelped: number
  programsSupported: number
  impactScore: number
}

type ProgramType = "education" | "healthcare" | "humanitarian" | "other"

export interface Donation {
  program: ProgramType
  amount: number
}
