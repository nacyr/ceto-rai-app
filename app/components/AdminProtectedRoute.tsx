'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

export default function AdminProtectedRoute({ 
  children, 
  fallbackPath = '/login',
  showUnauthorized = true 
}: AdminProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(fallbackPath);
      return;
    }

    // Check if user has admin role
    const userRole = user.user_metadata?.role;
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
      setIsAuthorized(false);
      if (!showUnauthorized) {
        router.push('/dashboard'); // Redirect non-admin users to dashboard
      }
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, router, fallbackPath, showUnauthorized]);

  // Show loading state
  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Access
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your permissions...
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized message
  if (!isAuthorized && showUnauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Go Back
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Security Notice</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              If you believe you should have access to this page, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
}