'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { handleRedirectResult } from '@/lib/firebase';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Handle the redirect result from Google
        const user = await handleRedirectResult();
        
        if (user) {
          // Successfully authenticated - redirect to apply page
          console.log('Auth callback: User authenticated, redirecting...');
          window.location.href = '/apply';
        } else {
          // No redirect result - check if already authenticated via Firebase
          // Give it a moment then redirect
          setTimeout(() => {
            window.location.href = '/apply';
          }, 1000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Redirecting to sign in...');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      }
    };

    processAuth();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <LoadingSpinner size="lg" text="Redirecting..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text="Completing sign in..." />
    </div>
  );
}
