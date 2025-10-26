'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import { Event } from '../types/types'
import { mockEvents } from '@/mockData/events'

const categoryColors = {
  education: 'bg-blue-100 text-blue-800',
  healthcare: 'bg-green-100 text-green-800',
  community: 'bg-purple-100 text-purple-800',
  fundraising: 'bg-orange-100 text-orange-800',
}

const statusColors = {
  upcoming: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 800)
  }, [])

  const filteredEvents = events.filter(
    (event) => filter === 'all' || event.status === filter
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in making a difference. Discover upcoming events, workshops,
            and community initiatives that bring hope and positive change to
            communities across Nigeria.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex space-x-1">
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
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}
                  >
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees}/{event.maxAttendees} attendees
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Registration</span>
                      <span>
                        {Math.round(
                          (event.attendees / event.maxAttendees) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(event.attendees / event.maxAttendees) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom-Right Button */}
                <div className="mt-auto flex justify-end">
                  {event.status === 'upcoming' ? (
                    <button className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center space-x-2">
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : event.status === 'ongoing' ? (
                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2">
                      <span>Join Event</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center space-x-2">
                      <span>Event Completed</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No events are currently available.'
                : `No ${filter} events are currently available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
