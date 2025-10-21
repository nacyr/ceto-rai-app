// mockData/homePage.ts
import { GraduationCap, Heart, Users, Handshake, Building, Globe } from "lucide-react";
import { ImpactStats } from "@/app/types/types";

export const homeContent = {
  hero: {
    title: "Restoring Hope, Changing Lives",
    subtitle:
      "Ceto Rai Humanitarian Foundation is committed to uplifting vulnerable communities through education, healthcare, empowerment, and humanitarian aid.",
    primaryButton: { text: "About Us", link: "/about" },
    secondaryButton: { text: "Our Programs", link: "/programs" },
  },
  impact: {
    title: "Impact",
    subtitle:
      "Together, we’re making measurable differences in communities across the region.",
  },
  cta: {
    title: "Join us in making a difference. Every hand counts.",
    subtitle:
      "Your support can transform lives and bring hope to those who need it most.",
    primaryButton: { text: "Become a Volunteer", link: "/get-involved/volunteer" },
    secondaryButton: { text: "Donate Now", link: "/get-involved/donate" },
  },
};

export const impactStats: ImpactStats[] = [
  { icon: GraduationCap, number: "1,200+", description: "children supported with school materials" },
  { icon: Heart, number: "500+", description: "individuals reached through health outreaches" },
  { icon: Users, number: "300+", description: "women empowered through skills training" },
  { icon: Handshake, number: "150+", description: "community partnerships established" },
  { icon: Building, number: "25+", description: "infrastructure projects completed" },
  { icon: Globe, number: "10+", description: "regions impacted across Nigeria" },
];

