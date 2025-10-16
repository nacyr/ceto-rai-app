'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

interface Event {
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

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Health Screening',
    description: 'Free health screening and medical consultation for community members. Our medical team will provide basic health checks, blood pressure monitoring, and health education.',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Community Center, Lagos',
    image: '/api/placeholder/400/250',
    attendees: 45,
    maxAttendees: 100,
    category: 'healthcare',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Educational Workshop for Children',
    description: 'Interactive learning session focusing on literacy and numeracy skills for children aged 6-12. Includes educational games, storytelling, and skill-building activities.',
    date: '2024-02-20',
    time: '02:00 PM',
    location: 'Primary School, Abuja',
    image: '/api/placeholder/400/250',
    attendees: 32,
    maxAttendees: 50,
    category: 'education',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Fundraising Gala Dinner',
    description: 'Annual fundraising event to support our ongoing humanitarian projects. Join us for an evening of inspiration, entertainment, and community building.',
    date: '2024-02-25',
    time: '07:00 PM',
    location: 'Grand Hotel, Victoria Island',
    image: '/api/placeholder/400/250',
    attendees: 120,
    maxAttendees: 200,
    category: 'fundraising',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Clean Water Initiative Launch',
    description: 'Launch of our new clean water project providing access to safe drinking water for rural communities. Community leaders and stakeholders welcome.',
    date: '2024-01-30',
    time: '11:00 AM',
    location: 'Rural Community, Kano',
    image: '/api/placeholder/400/250',
    attendees: 85,
    maxAttendees: 100,
    category: 'community',
    status: 'completed'
  }
];

const categoryColors = {
  education: 'bg-blue-100 text-blue-800',
  healthcare: 'bg-green-100 text-green-800',
  community: 'bg-purple-100 text-purple-800',
  fundraising: 'bg-orange-100 text-orange-800'
};

const statusColors = {
  upcoming: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800'
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.status === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-40 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in making a difference. Discover upcoming events, workshops, and community initiatives 
            that bring hope and positive change to communities across Nigeria.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {(['all', 'upcoming', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  filter === filterOption
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Registration</span>
                    <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                {event.status === 'upcoming' ? (
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : event.status === 'ongoing' ? (
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>Join Event</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2">
                    <span>Event Completed</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No events are currently available.' 
                : `No ${filter} events are currently available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}