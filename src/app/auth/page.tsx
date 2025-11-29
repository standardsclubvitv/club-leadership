'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, GoogleSignIn } from '@/components/auth';
import { Card, CardContent, LoadingSpinner, Alert } from '@/components/ui';
import { ArrowLeft, Shield } from 'lucide-react';

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';

export default function AuthPage() {
  const { user, loading, isRedirecting } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const hasRedirected = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Prevent multiple redirects and handle navigation
    if (!loading && user && !hasRedirected.current && !isNavigating) {
      console.log('User authenticated, redirecting to /apply...');
      hasRedirected.current = true;
      setIsNavigating(true);
      
      // Small delay to ensure state is stable before navigation
      const timer = setTimeout(() => {
        router.replace('/apply');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router, isNavigating]);

  // Show loading state during redirect check, while redirecting, or navigating
  if (loading || isRedirecting || isNavigating) {
    let loadingText = 'Loading...';
    if (isNavigating) {
      loadingText = 'Redirecting to application...';
    } else if (isRedirecting) {
      loadingText = 'Signing in...';
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" text={loadingText} />
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Redirecting to application..." />
      </div>
    );
  }

  const handleSuccess = () => {
    // Navigation is handled by useEffect when user state changes
    // This ensures proper state synchronization
  };

  const handleError = (err: Error) => {
    console.error('Auth error:', err);
    
    // Provide user-friendly error messages
    let message = 'Failed to sign in. Please try again.';
    
    if (err.message.includes('popup')) {
      message = 'Sign-in popup was blocked. Please allow popups or try again.';
    } else if (err.message.includes('network')) {
      message = 'Network error. Please check your internet connection and try again.';
    } else if (err.message.includes('cancelled') || err.message.includes('closed')) {
      message = 'Sign-in was cancelled. Please try again when ready.';
    }
    
    setError(message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-white p-2 rounded-2xl shadow-md mb-4">
              <Image
                src={CLUB_LOGO_URL}
                alt="BIS Standards Club VIT Logo"
                width={60}
                height={60}
                className="rounded-xl"
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to BIS Club VIT</h1>
            <p className="text-gray-600 mt-2">Sign in to apply for board positions</p>
          </div>

          <Card variant="elevated">
            <CardContent className="p-8">
              {error && (
                <Alert type="error" className="mb-6" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <div className="space-y-6">
                <GoogleSignIn onSuccess={handleSuccess} onError={handleError} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Use your VIT email address to sign in with Google
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="mt-4 flex items-start gap-3 text-sm text-gray-500">
            <Shield className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <p>
              Your information is secure. We only use your email for authentication 
              and will never share your data with third parties.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BIS Standards Club VIT. All rights reserved.
      </footer>
    </div>
  );
}
