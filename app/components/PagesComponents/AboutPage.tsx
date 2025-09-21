'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, User } from 'lucide-react';
import { teamMembers } from '@/app/mock-data/teamMembers';
import { values } from '@/app/mock-data/about';

export default function AboutPage() {
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
                Founded in 2018, the Ceto Rai Humanitarian Foundation began with a simple yet powerful vision: to create lasting change in the lives of vulnerable populations. What started as a small community initiative grew steadily over the years and came into full force in 2023, touching and transforming the lives of thousands across the country.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The name Ceto Rai translates to New Dawn in local dialects, symbolizing a fresh start and renewed hope for communities facing hardship. Every program we implement is guided by the belief that sustainable change comes from empowering communities to develop their own solutions.
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
                  <value.icon className="w-8 h-8 text-teal-600" />
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals leading our mission to create lasting change in communities
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member) => (
              <Link
                key={member.id}
                href={`/about/${member.id}`}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs text-center p-6 bg-gray-50 rounded-xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-teal-600 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-teal-600">{member.role}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {teamMembers.map((member) => (
    <Link
      key={member.id}
      href={`/about/${member.id}`}
      className="block text-center p-6 bg-gray-50 rounded-xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300"
    >
      <div className="w-24 h-24 mx-auto mb-4">
        {member.profileImage ? (
          <Image
            src={member.profileImage}
            alt={member.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-teal-600 mx-auto" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
      <p className="text-teal-600">{member.role}</p>
    </Link>
  ))}
</div> */}