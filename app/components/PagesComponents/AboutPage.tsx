'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, User } from 'lucide-react';
import { values as mockValues } from '@/mockData/about';
import { teamMembers as mockTeamMembers } from '@/mockData/teamMembers';
// import { supabase } from '../lib/supabase';
import { AboutContent, TeamMember } from '@/app/types/types';
import { supabase } from '@/lib/supabase';

export default function AboutPage() {
  // const supabase = createClientComponentClient();
  const [aboutData, setAboutData] = useState<AboutContent[]>([]);
  const [values] = useState(mockValues);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: aboutContent, error: aboutError } = await supabase
          .from('about_content')
          .select('*');
        if (!aboutError && aboutContent && aboutContent.length > 0) {
          setAboutData(aboutContent);
        }

        const { data: team, error: teamError } = await supabase
          .from('team_members')
          .select('*');
        if (!teamError && team && team.length > 0) {
          setTeamMembers(team);
        }
      } catch (err) {
        console.log('Supabase fetch failed, using fallback data', err);
      }
    };
    fetchData();
  },);

  // Extract page sections dynamically
  const hero = aboutData.find((s) => s.section === 'hero');
  const story = aboutData.find((s) => s.section === 'story');

  return (
    <div className="relative">
      {/* ✅ Hero Section with Background Image */}
      <section
        className="relative py-24 flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${
            hero?.background_image || '/images/about-bg.jpg'
          }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {hero?.title || 'About Us'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {hero?.subtitle ||
              'Learn about our journey, mission, and the dedicated team working to restore hope.'}
          </p>
        </div>
      </section>

      {/* ✅ Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              {story?.title || 'Our Story'}
            </h2>
            {(story?.paragraphs || [
              'Founded in 2018, the Ceto Rai Humanitarian Foundation began with a simple yet powerful vision: to create lasting change in the lives of vulnerable populations.',
              'The name Ceto Rai translates to “New Dawn,” symbolizing a fresh start and renewed hope for communities facing hardship.',
            ]).map((p, i) => (
              <p key={i} className="text-lg text-gray-600 mb-6 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center">
                <Heart className="w-32 h-32 text-teal-600/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Mission, Vision, and Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals leading our mission to create lasting change.
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


// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { Heart, User } from 'lucide-react';
// import { teamMembers } from '@/mockData/teamMembers';
// import { values } from '@/mockData/about';

// export default function AboutPage() {
//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="py-20 bg-gradient-to-br from-teal-50 to-teal-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">About Us</h1>
//             <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//               Learn about our journey, mission, and the dedicated team working to restore hope in communities worldwide
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Our Story Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div>
//               <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
//               <p className="text-lg text-gray-600 mb-6 leading-relaxed">
//                 Founded in 2018, the Ceto Rai Humanitarian Foundation began with a simple yet powerful vision: to create lasting change in the lives of vulnerable populations. What started as a small community initiative grew steadily over the years and came into full force in 2023, touching and transforming the lives of thousands across the country.
//               </p>
//               <p className="text-lg text-gray-600 mb-6 leading-relaxed">
//                 The name Ceto Rai translates to New Dawn in local dialects, symbolizing a fresh start and renewed hope for communities facing hardship. Every program we implement is guided by the belief that sustainable change comes from empowering communities to develop their own solutions.
//               </p>
//             </div>
//             <div className="relative">
//               <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl overflow-hidden shadow-2xl">
//                 <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center">
//                   <Heart className="w-32 h-32 text-teal-600/30" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Mission, Vision, Values Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             {values.map((value, index) => (
//               <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg">
//                 <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <value.icon className="w-8 h-8 text-teal-600" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {value.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Leadership Team Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Meet the dedicated individuals leading our mission to create lasting change in communities 
//             </p>
//           </div>
//           <div className="flex flex-wrap justify-center gap-6">
//             {teamMembers.map((member) => (
//               <Link
//                 key={member.id}
//                 href={`/about/${member.id}`}
//                 className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs text-center p-6 bg-gray-50 rounded-xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300"
//               >
//                 <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center">
//                   {member.image ? (
//                     <Image
//                       src={member.image}
//                       alt={member.name}
//                       width={80}
//                       height={80}
//                       className="rounded-full object-cover"
//                     />
//                   ) : (
//                     <User className="w-16 h-16 text-teal-600 mx-auto" />
//                   )}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
//                 <p className="text-teal-600">{member.role}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

