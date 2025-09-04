'use client'

import React from 'react';
import { Heart, Target, Eye, Award, User } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
}

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    { name: 'Dr. Sarah Johnson', role: 'Executive Director' },
    { name: 'Michael Chen', role: 'Program Director' },
    { name: 'Amina Hassan', role: 'Operations Manager' }
  ];

  const values: ValueCard[] = [
    {
      icon: <Target className="w-8 h-8 text-teal-600" />,
      title: 'Our Mission',
      description: 'To uplift vulnerable communities through sustainable programs in education, healthcare, empowerment, and humanitarian aid.'
    },
    {
      icon: <Eye className="w-8 h-8 text-teal-600" />,
      title: 'Our Vision',
      description: 'A world where every person has access to basic necessities and opportunities to thrive, regardless of their circumstances.'
    },
    {
      icon: <Award className="w-8 h-8 text-teal-600" />,
      title: 'Our Values',
      description: 'Compassion, integrity, empowerment, sustainability, and community partnership guide everything we do.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Learn about our journey, mission, and the dedicated team working to restore hope in communities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2018, Ceto Rai Humanitarian Foundation began with a simple but powerful vision: 
                to create lasting change in the lives of the most vulnerable populations. What started as 
                a small community initiative has grown into a comprehensive humanitarian organization 
                serving thousands across West Africa.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our name "Ceto Rai" translates to "New Dawn" in local dialects, symbolizing the fresh 
                start and renewed hope we bring to communities facing hardship. Every program we develop 
                is rooted in the belief that sustainable change comes from empowering communities to 
                build their own solutions.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center">
                  <Heart className="w-32 h-32 text-teal-600/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;