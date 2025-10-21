import { Target, Eye, Award } from 'lucide-react'
import { ValueCard } from '@/app/types/types'

export const aboutMockData = {
  hero: {
    title: 'About Us',
    subtitle:
      'Learn about our journey, mission, and the dedicated team working to restore hope in communities worldwide.',
    backgroundImage: '/images/about-bg.jpg',
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      'Founded in 2018, the Ceto Rai Humanitarian Foundation began with a simple yet powerful vision: to create lasting change in the lives of vulnerable populations. What started as a small community initiative grew steadily and came into full force in 2023, touching and transforming the lives of thousands across the country.',
      'The name Ceto Rai translates to "New Dawn" in local dialects, symbolizing a fresh start and renewed hope for communities facing hardship. Every program we implement is guided by the belief that sustainable change comes from empowering communities to develop their own solutions.',
    ],
  },
  values: [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To uplift vulnerable communities through sustainable programs in education, healthcare, empowerment, and humanitarian aid.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'A world where every person has access to basic necessities and opportunities to thrive, regardless of their circumstances.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description:
        'Compassion, integrity, empowerment, sustainability, and community partnership guide everything we do.',
    },
  ] as ValueCard[],
}

// import { ValueCard } from "../app/types/types";
// import { Target, Eye, Award } from 'lucide-react';

// export const values: ValueCard[] = [
//   { 
//     icon: Target,
//     title: "Our Mission",
//     description:
//       "To uplift vulnerable communities through sustainable programs in education, healthcare, empowerment, and humanitarian aid.",
//   },
//   { 
//     icon: Eye,
//     title: "Our Vision",
//     description:
//       "A world where every person has access to basic necessities and opportunities to thrive, regardless of their circumstances.",
//   },
//   {
//     icon: Award,
//     title: "Our Values",
//     description:
//       "Compassion, integrity, empowerment, sustainability, and community partnership guide everything we do.",
//   },
// ];
