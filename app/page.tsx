'use client'

import { HomePage } from './components/HomePage';
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './components/pages/AboutPage';
import ProgramsPage from './components/pages/ProgramsPage';
import GetInvolvedPage from './components/pages/GetInvolvedPage';

interface NavigationItem {
  name: string;
  href: string;
}

const CetoRaiFoundation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    { name: 'Home', href: 'home' },
    { name: 'About Us', href: 'about' },
    { name: 'Our Programs', href: 'programs' },
    { name: 'Get Involved', href: 'get-involved' }
  ];

  const handleNavigation = (page: string): void => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderCurrentPage = (): React.ReactNode => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'get-involved':
        return <GetInvolvedPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        navigationItems={navigationItems}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigation={handleNavigation}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer
        navigationItems={navigationItems}
        onNavigation={handleNavigation}
      />
    </div>
  );
};

export default CetoRaiFoundation;
