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
