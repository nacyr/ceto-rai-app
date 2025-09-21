'use client';

import { DollarSign, Users, Handshake } from 'lucide-react';
import Link from 'next/link';

const involvementOptions = [
  {
    icon: <DollarSign className="w-8 h-8 text-teal-600" />,
    title: 'Donate',
    description: 'Your financial contribution directly supports our programs and helps us reach more communities.',
    href: '/get-involved/donate',
    buttonText: 'Donate Now',
    buttonStyle: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
  {
    icon: <Users className="w-8 h-8 text-teal-600" />,
    title: 'Volunteer',
    description: 'Join our team of dedicated volunteers and make a direct impact in communities we serve.',
    href: '/get-involved/volunteer',
    buttonText: 'Join Us',
    buttonStyle: 'bg-white hover:bg-gray-50 border-2 border-teal-600 text-teal-600',
  },
  {
    icon: <Handshake className="w-8 h-8 text-teal-600" />,
    title: 'Partner',
    description: 'Collaborate with us as a corporate partner to amplify our collective impact.',
    href: '/get-involved/partnership',
    buttonText: 'Partner With Us',
    buttonStyle: 'bg-white hover:bg-gray-50 border-2 border-teal-600 text-teal-600',
  },
];

export default function GetInvolvedPage() {
  
  // Render main Get Involved page
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Get Involved</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join our mission to restore hope and change lives through meaningful contribution
          </p>
        </div>
      </section>

      {/* Involvement Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {involvementOptions.map((option, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between text-center p-8 border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors">
                    {option.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.title}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                </div>
                <Link
                  href={option.href}
                  className={`${option.buttonStyle} px-6 py-3 rounded-lg font-semibold transition-all duration-300 block transform group-hover:scale-105 mt-auto`}
                >
                  {option.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Your Support Matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Your Support Matters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Direct Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Every contribution goes directly to program implementation, ensuring maximum impact 
                for the communities we serve. We maintain transparency in all our operations.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-gray-900 mb-2">$50 can provide:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• School supplies for 5 children</li>
                  <li>• Basic healthcare for 3 families</li>
                  <li>• Training materials for 2 women</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Community Partnership</h3>
              <p className="text-gray-600 leading-relaxed">
                We work closely with local communities to identify needs and develop sustainable 
                solutions that create lasting change beyond our direct intervention.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-gray-900 mb-2">Our Approach:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Community-led initiatives</li>
                  <li>• Sustainable development focus</li>
                  <li>• Local capacity building</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}