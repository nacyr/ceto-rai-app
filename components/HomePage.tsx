import React from 'react';
import { useRouter } from 'next/router';
import { GraduationCap } from 'heroicons-react';

const impactStats = [
  {
    icon: <GraduationCap className="w-12 h-12 text-teal-600" />,
    number: '1,200+',
    description: 'children supported with school materials',
    link: '/programs#education'
  },
  // ...existing code...
];

const HomePage = () => {
  const router = useRouter();

  const onNavigate = (link) => {
    router.push(link);
  };

  return (
    <div>
      {/* ...existing code... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {impactStats.map((stat, index) => (
          <div
            key={index}
            onClick={() => onNavigate(stat.link)}
            className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            {stat.icon}
            <div className="mt-4">
              <h2 className="text-3xl font-bold">{stat.number}</h2>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('volunteer')}
          className="bg-white hover:bg-gray-100 text-teal-700 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
        >
          Become a Volunteer
        </button>
      </div>
      {/* ...existing code... */}
    </div>
  );
};

export default HomePage;