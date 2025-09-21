'use client'

import React from 'react';
import { GraduationCap, Heart, Users, Handshake, ChevronRight } from 'lucide-react';

interface Program {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  impact: string;
}

const ProgramsPage: React.FC = () => {
  const programs: Program[] = [
    {
      title: 'Education Support',
      description: 'Comprehensive educational support including school materials, scholarships, and teacher training.',
      icon: <GraduationCap className="w-12 h-12 text-teal-600" />,
      features: ['School supplies', 'Scholarships', 'Teacher training', 'Infrastructure'],
      impact: 'Supported 1,200+ children'
    },
    {
      title: 'Healthcare Outreach',
      description: 'Mobile health clinics, preventive care programs, and health education for underserved communities.',
      icon: <Heart className="w-12 h-12 text-teal-600" />,
      features: ['Mobile clinics', 'Vaccination', 'Health education', 'Emergency support'],
      impact: 'Reached 500+ individuals'
    },
    {
      title: 'Women Empowerment',
      description: 'Skills training and microfinance programs to help women achieve economic independence.',
      icon: <Users className="w-12 h-12 text-teal-600" />,
      features: ['Skills training', 'Microfinance', 'Leadership', 'Entrepreneurship'],
      impact: 'Empowered 300+ women'
    },
    {
      title: 'Humanitarian Aid',
      description: 'Emergency relief services, disaster response, and food security programs.',
      icon: <Handshake className="w-12 h-12 text-teal-600" />,
      features: ['Emergency relief', 'Disaster response', 'Food security', 'Crisis support'],
      impact: 'Aided 800+ families'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Our Programs</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive initiatives designed to address the root causes of poverty and inequality
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  {program.icon}
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">{program.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <ChevronRight className="w-4 h-4 text-teal-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-teal-800 font-semibold">{program.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
