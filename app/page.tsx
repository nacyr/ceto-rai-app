'use client';

import React from 'react';
import { HomePage } from './components/HomePage';

/**
 * The landing page of the Ceto Rai Humanitarian Foundation website.
 * 
 * In the App Router, navigation is handled via Next.js routing
 * (e.g., /about, /programs, /get-involved) instead of useState page switching.
 */
const CetoRaiFoundation: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HomePage />
      </main>
    </div>
  );
};

export default CetoRaiFoundation;