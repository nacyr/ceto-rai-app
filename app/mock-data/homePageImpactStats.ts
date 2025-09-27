import { GraduationCap, Heart, Users } from "lucide-react";
import { ImpactStats } from "../types/types";

// className="w-12 h-12 text-teal-600" 
export const impactStats: ImpactStats[] = [
    {
      icon: GraduationCap,
      number: '1,200+',
      description: 'children supported with school materials'
    },
    {
      icon: Heart,
      number: '500+',
      description: 'individuals reached through health outreaches'
    },
    {
      icon: Users,
      number: '300+',
      description: 'women empowered through skills training'
    }
]