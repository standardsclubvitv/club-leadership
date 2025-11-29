'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { onAuthStateChange, signInWithGoogle, signOut, handleRedirectResult } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  isRedirecting: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect result after page reload (for networks that need redirect auth)
  useEffect(() => {
    if (!mounted || redirectChecked) return;

    const checkRedirectResult = async () => {
      try {
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
      } finally {
        setRedirectChecked(true);
      }
    };

    checkRedirectResult();
  }, [mounted, redirectChecked]);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      setIsRedirecting(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setIsRedirecting(true);
      const result = await signInWithGoogle();
      
      // If result is null, redirect is happening - don't set loading to false
      if (result) {
        setUser(result);
        setLoading(false);
        setIsRedirecting(false);
      }
      // For redirect auth, the page will reload and onAuthStateChange will handle it
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      setIsRedirecting(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  // Show loading state until mounted to prevent hydration mismatch
  const contextValue: AuthContextType = {
    user,
    loading: !mounted || loading,
    signIn,
    logout,
    isRedirecting,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
