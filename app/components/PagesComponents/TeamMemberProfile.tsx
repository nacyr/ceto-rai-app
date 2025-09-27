'use client'

import React from 'react';
import Image from 'next/image';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Heart, ArrowLeft } from 'lucide-react';
import { TeamMember } from '@/app/types/types';
import Link from 'next/link';

interface TeamMemberProfileProps {
  member: TeamMember;
}

const TeamMemberProfile: React.FC<TeamMemberProfileProps> = ({ member }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
            href={'/about'}           
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-8 transition-colors"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Team</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-teal-600" />
                  )}
              </div>
              <div className="text-center md:text-left text-white">
                <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
                <p className="text-2xl text-teal-100 mb-4">{member.role}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {member.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-600" />
                <span className="text-gray-700">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-600" />
                <span className="text-gray-700">{member.phone}</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-6 h-6 text-teal-600 mr-3" />
              About {member.name.split(' ')[0]}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {member.bio}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Education */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-teal-600 mr-2" />
                  Education
                </h3>
                <div className="space-y-3">
                  {member.education.map((edu, index) => (
                    <div key={index} className="p-3 bg-teal-50 rounded-lg">
                      <p className="text-sm font-medium text-teal-800">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-teal-600 mr-2" />
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {member.achievements.map((achievement, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Specializations
                </h3>
                <div className="space-y-2">
                  {member.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Want to connect with {member.name.split(' ')[0]}?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${member.email}`}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
                <a
                  href={`tel:${member.phone}`}
                  className="border border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProfile;