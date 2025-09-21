'use client';

import React, { useState } from 'react';
import { Menu, X, Heart, User, LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  href: string;
}

interface HeaderProps {
  navigationItems: NavigationItem[];
}

const Header: React.FC<HeaderProps> = ({ navigationItems }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Ceto Rai
              </h1>
              <p className="text-sm text-gray-600">Humanitarian Foundation</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-all duration-300 relative group ${
                  pathname === item.href
                    ? 'text-teal-600'
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 ${
                    pathname === item.href
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors duration-300 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
