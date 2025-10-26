export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  image: string;
  bio: string;
  education: string[];
  achievements: string[];
  specializations: string[]; 
  profileImage?: string;
}

export interface ValueCard {
  icon: React.ElementType; // ✅ instead of ReactNode
  title: string;
  description: string;
}

export interface ImpactStats {
  icon: React.ElementType;
  number: string;
  description: string;
}

// types.ts
export interface DonationOption {
  id: string;
  amount: number;
  description: string;
  impact: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  icon: string; // We'll use string identifiers for icons in JSON
  color: string;
}

export interface DonorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAnonymous: boolean;
}

export interface DonatePageProps {
  onBack: () => void;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface DonationFormData {
  amount: number;
  program: string;
  donorInfo: DonorInfo;
}

export interface DonationData {
  amount: number;
  donorName: string;
  donorEmail: string;
  program: string;
  timestamp: string;
}

export interface DonationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  bankDetails: BankDetails;
  donationData: DonationFormData;
}

export interface DonationSuccessPageProps {
  redirectDelay?: number; // in seconds, default 10
  redirectTo?: string; // redirect path, default '/donate'
  donationAmount?: number;
  donorName?: string;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // in milliseconds
  onClose: () => void;
}


export interface PartnershipPageProps {
  onBack: () => void;
}

export interface PartnershipType {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  commitment: string;
  icon: React.ReactNode;
  color: string;
}
 
export interface PartnershipApplication {
  organizationType: string;
  organizationName: string;
  contactPerson: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  organizationSize: string;
  industry: string;
  partnershipTypes: string[];
  previousPartnerships: string;
  proposedContribution: string;
  expectedOutcomes: string;
  timeline: string;
  budget: string;
  additionalInfo: string;
}

export interface ExchangeRate {
  rate: number;
  lastUpdated: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface HeaderProps {
  navigationItems: NavigationItem[];
}

export interface FooterProps {
  navigationItems: NavigationItem[];
}


export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    primaryButton: { text: string; link: string };
    secondaryButton: { text: string; link: string };
  };
  impact: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: { text: string; link: string };
    secondaryButton: { text: string; link: string };
  };
}

export interface AboutData {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  values: ValueCard[]
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  maxAttendees: number;
  category: 'education' | 'healthcare' | 'community' | 'fundraising';
  status: 'upcoming' | 'ongoing' | 'completed';
}