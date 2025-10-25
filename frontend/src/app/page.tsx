'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebase';
import AuthPage from '@/components/AuthPage';
import SQLRunner from '@/components/SQLRunner';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('username', user.displayName || user.email?.split('@')[0] || 'User');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('username');
        localStorage.removeItem('firebaseUser');
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return <SQLRunner onLogout={handleLogout} />;
}
