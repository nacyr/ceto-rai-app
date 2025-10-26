import { Event } from "@/app/types/types";

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Health Screening',
    description:
      'Free health screening and medical consultation for community members. Our medical team will provide basic health checks, blood pressure monitoring, and health education.',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Community Center, Lagos',
    image: '/api/placeholder/400/250',
    attendees: 45,
    maxAttendees: 100,
    category: 'healthcare',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Educational Workshop for Children',
    description:
      'Interactive learning session focusing on literacy and numeracy skills for children aged 6-12. Includes educational games, storytelling, and skill-building activities.',
    date: '2024-02-20',
    time: '02:00 PM',
    location: 'Primary School, Abuja',
    image: '/api/placeholder/400/250',
    attendees: 32,
    maxAttendees: 50,
    category: 'education',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Fundraising Gala Dinner',
    description:
      'Annual fundraising event to support our ongoing humanitarian projects. Join us for an evening of inspiration, entertainment, and community building.',
    date: '2024-02-25',
    time: '07:00 PM',
    location: 'Grand Hotel, Victoria Island',
    image: '/api/placeholder/400/250',
    attendees: 120,
    maxAttendees: 200,
    category: 'fundraising',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Clean Water Initiative Launch',
    description:
      'Launch of our new clean water project providing access to safe drinking water for rural communities. Community leaders and stakeholders welcome.',
    date: '2024-01-30',
    time: '11:00 AM',
    location: 'Rural Community, Kano',
    image: '/api/placeholder/400/250',
    attendees: 85,
    maxAttendees: 100,
    category: 'community',
    status: 'completed',
  },
]
