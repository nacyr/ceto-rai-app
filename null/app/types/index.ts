export interface NavigationItem {
  name: string;
  href: string;
}

export interface ImpactStat {
  icon: React.ReactNode;
  number: string;
  description: string;
}

export interface Program {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  impact: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface InvolvementOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonStyle: string;
}

export interface HeaderProps {
  currentPage: string;
  navigationItems: NavigationItem[];
  isMobileMenuOpen: boolean;
  onNavigation: (page: string) => void;
  onMobileMenuToggle: () => void;
}

export interface FooterProps {
  navigationItems: NavigationItem[];
  onNavigation: (page: string) => void;
}

export interface HomePageProps {
  onNavigation: (page: string) => void;
}