'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, GoogleSignIn } from '@/components/auth';
import { Card, CardContent, LoadingSpinner, Alert } from '@/components/ui';
import { ArrowLeft, Shield } from 'lucide-react';
import { useState } from 'react';

const CLUB_LOGO_URL = 'https://standardsclubvitv.github.io/image-api/images/logo_club.png';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to apply page
      router.push('/apply');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (user) {
    return null;
  }

  const handleSuccess = () => {
    router.push('/apply');
  };

  const handleError = (err: Error) => {
    console.error('Auth error:', err);
    setError(err.message || 'Failed to sign in. Please try again.');
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
            <Image
              src={CLUB_LOGO_URL}
              alt="BIS Standards Club VIT Logo"
              width={64}
              height={64}
              className="mx-auto mb-4 rounded-2xl"
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome to BIS Club VIT</h1>
            <p className="text-gray-600 mt-2">Sign in to apply for board positions</p>
          </div>

          <Card variant="elevated">
            <CardContent className="p-8">
              {error && (
                <Alert type="error" className="mb-6">
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
          <div className="mt-6 flex items-start gap-3 text-sm text-gray-500">
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
