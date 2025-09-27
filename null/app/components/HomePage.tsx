'use client'

// File: pages/HomePage.tsx
import React from 'react';
import { GraduationCap, Heart, Users } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const impactStats = [
    {
      icon: <GraduationCap className="w-12 h-12 text-teal-600" />,
      number: '1,200+',
      description: 'children supported with school materials'
    },
    {
      icon: <Heart className="w-12 h-12 text-teal-600" />,
      number: '500+',
      description: 'individuals reached through health outreaches'
    },
    {
      icon: <Users className="w-12 h-12 text-teal-600" />,
      number: '300+',
      description: 'women empowered through skills training'
    }
  ];

  return (
    <div>
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, #0d9488 0%, #0f766e 100%)`
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Restoring Hope,
              <span className="block text-teal-300">Changing Lives</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Ceto Rai Humanitarian Foundation is committed to uplifting vulnerable 
              communities through education, healthcare, empowerment, and humanitarian aid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('about')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                About Us
              </button>
              <button 
                onClick={() => onNavigate('programs')}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Our Programs
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we're making measurable differences in communities across the region
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6">
                  {stat.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {stat.number}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join us in making a difference. Every hand counts.
          </h2>
          <p className="text-xl text-teal-100 mb-12 max-w-3xl mx-auto">
            Your support can transform lives and bring hope to those who need it most
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onNavigate('get-involved')}
              className="bg-white hover:bg-gray-100 text-teal-700 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Become a Volunteer
            </button>
            <button 
              onClick={() => onNavigate('get-involved')}
              className="bg-teal-800 hover:bg-teal-900 border-2 border-white text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Donate Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};