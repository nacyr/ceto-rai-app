'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { FooterProps } from '../types/types';


const Footer: React.FC<FooterProps> = ({ navigationItems }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image 
                  src="/images/logo/ceto_rai_logo.jpg" 
                  alt="Ceto Rai Logo" 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ceto Rai</h3>
                <p className="text-gray-400">Humanitarian Foundation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Dedicated to restoring hope and changing lives through sustainable 
              community development programs across education, healthcare, and empowerment.
            </p>
            <div className="flex space-x-4">
              <a 
                href="Facebook: https://www.facebook.com/share/17KWrzzPno/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://x.com/Ceto_Rai?t=eEIQuBs2EOb_-3pDucBYZw&s=09" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/ceto_rai?igsh=ZWg2d29kNGtmYmJt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400" />
                {/* <span className="text-gray-300" href="mailto:info@cetorai.org">info@cetorai.org</span> */}
                <a
                  href="mailto:cetoraifoundation@gmail.com"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  cetoraifoundation@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400" />
                <span className="text-gray-300">+234 708-536-7549</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-1" />
                <span className="text-gray-300">Taraba State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Ceto Rai Humanitarian Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// 'use client'

// import React from 'react';
// import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// interface NavigationItem {
//   name: string;
//   href: string;
// }

// interface FooterProps {
//   navigationItems: NavigationItem[];
//   onNavigation: (page: string) => void;
// }

// const Footer: React.FC<FooterProps> = ({ navigationItems, onNavigation }) => {
//   return (
//     <footer className="bg-gray-900 text-white py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-4 gap-8">
//           <div className="md:col-span-2">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
//                 <Heart className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold">Ceto Rai</h3>
//                 <p className="text-gray-400">Humanitarian Foundation</p>
//               </div>
//             </div>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Dedicated to restoring hope and changing lives through sustainable 
//               community development programs across education, healthcare, and empowerment.
//             </p>
//             <div className="flex space-x-4">
//               <Facebook className="w-6 h-6 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors" />
//               <Twitter className="w-6 h-6 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors" />
//               <Instagram className="w-6 h-6 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors" />
//               <Linkedin className="w-6 h-6 text-gray-400 hover:text-teal-400 cursor-pointer transition-colors" />
//             </div>
//           </div>

//           <div>
//             <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
//             <nav className="flex flex-col space-y-3">
//               {navigationItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => onNavigation(item.href)}
//                   className="text-left text-gray-300 hover:text-teal-400 transition-colors"
//                 >
//                   {item.name}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div>
//             <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-5 h-5 text-teal-400" />
//                 <span className="text-gray-300">info@cetorai.org</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Phone className="w-5 h-5 text-teal-400" />
//                 <span className="text-gray-300">+234 800 123 4567</span>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <MapPin className="w-5 h-5 text-teal-400 mt-1" />
//                 <span className="text-gray-300">Lagos, Nigeria</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-12 pt-8 text-center">
//           <p className="text-gray-400">
//             © 2025 Ceto Rai Humanitarian Foundation. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;