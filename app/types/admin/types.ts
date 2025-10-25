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

export interface UserSettings {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  timezone: string
  language: string
  currency: string
}

export interface NotificationSettings {
  emailDonationReceipts: boolean
  emailVolunteerUpdates: boolean
  emailImpactReports: boolean
  emailNewsletter: boolean
  smsReminders: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  monthlyReport: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'donors-only'
  showDonationHistory: boolean
  showVolunteerActivity: boolean
  allowDataExport: boolean
  marketingEmails: boolean
  thirdPartySharing: boolean
}

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
  description?: string
}

export interface QuickActionProps {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badge?: string
}


export interface SystemSettings {
  // General Settings
  site_name: string
  site_description: string
  contact_email: string
  support_email: string
  
  // Security Settings
  require_email_verification: boolean
  enable_two_factor: boolean
  session_timeout: number
  max_login_attempts: number
  
  // Donation Settings
  min_donation_amount: number
  max_donation_amount: number
  default_currency: string
  enable_recurring_donations: boolean
  
  // Volunteer Settings
  auto_approve_volunteers: boolean
  require_background_check: boolean
  volunteer_application_limit: number
  
  // Notification Settings
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  notification_frequency: string
  
  // System Settings
  maintenance_mode: boolean
  debug_mode: boolean
  api_rate_limit: number
  backup_frequency: string
}

export interface SystemStats {
  total_users: number
  total_donations: number
  total_volunteers: number
  system_uptime: string
  database_size: string
  last_backup: string
}

export interface MonthlyTrend {
  month: string
  total: number
  donations?: number
  volunteers?: number
  users?: number
}

export interface AdminStats {
  totalDonations: number
  totalAmount: number
  totalVolunteers: number
  totalUsers: number
  pendingDonations: number
  pendingVolunteers: number
  monthlyTrend: MonthlyTrend[]
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx'
  dateRange: {
    start: string
    end: string
  }
  filters: {
    status?: string
    program?: string
    skills?: string[]
    [key: string]: string | number | string[] | undefined // // <-- 👈 add this line
  }
  includeFields: string[]
}

export interface ExportJob {
  id: string
  type: 'donations' | 'volunteers' | 'users'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
  downloadUrl?: string
  recordCount?: number
  error?: string
}


export interface AdminNotification {
  id: string
  type: 'volunteer_pending' | 'donation_failed' | 'user_registration' | 'system_alert' | 'approval_needed'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  created_at: string
  data?: unknown
}

export interface NotificationStats {
  pendingVolunteers: number
  failedDonations: number
  newUsers: number
  systemAlerts: number
  totalUnread: number
}


export interface VolunteerApplication {
  id: string
  full_name: string
  email: string
  phone: string
  skills: string
  availability: string
  motivation: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface VolunteerOpportunity {
  id: string
  title: string
  description: string
  location: string
  date: string
  duration: string
  skills_needed: string[]
  spots_available: number
}

export interface DonationStats {
  totalAmount: number
  totalDonations: number
  averageDonation: number
  lastDonationDate: string
  favoriteProgram: string
  monthlyTrend: MonthlyTrend[]
}

export interface MonthlySummaryItem {
  month: string
  totalDonations: number
  totalAmount: number
  programs: Record<string, number>
  statuses: Record<string, number>
}

export interface VolunteerProfile {
  full_name: string
  email: string
}

export interface Volunteer {
  id: string
  status: string
  skills?: string[]
  availability?: string
  created_at: string
  profiles?: VolunteerProfile
}

export interface DonationProfile {
  full_name: string
  email: string
}

export interface AdminDonation {
  id: string
  amount: number
  program: string | null
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  profiles?: DonationProfile | null
}


export interface AdmindonationManager {
  id: string;
  amount: number;
  program: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  donor_id: string;
  payment_method?: string;
  transaction_id?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}


export interface AnalyticsData {
  overview: {
    totalDonations: number;
    totalAmount: number;
    totalVolunteers: number;
    totalUsers: number;
    monthlyGrowth: number;
  };
  donationsByProgram: Array<{
    program: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  donationsTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  volunteerStats: {
    pending: number;
    approved: number;
    rejected: number;
    totalApplications: number;
  };
  topDonors: Array<{
    name: string;
    email: string;
    totalAmount: number;
    donationCount: number;
  }>;
  recentActivity: Array<{
    type: 'donation' | 'volunteer' | 'user';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

export interface AdminUserManager {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  status?: 'pending' | 'approved' | 'rejected'
}


export interface AdminVolunteerManager {
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