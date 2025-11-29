'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
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
  const redirectCheckComplete = useRef(false);
  const authListenerSet = useRef(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect result AND set up auth listener - do this ONCE on mount
  useEffect(() => {
    if (!mounted || redirectCheckComplete.current) return;
    redirectCheckComplete.current = true;

    const initializeAuth = async () => {
      try {
        // First, check for redirect result (for mobile auth)
        console.log('Initializing auth - checking redirect result...');
        const redirectUser = await handleRedirectResult();
        
        if (redirectUser) {
          console.log('Got user from redirect:', redirectUser.email);
          setUser(redirectUser);
          setLoading(false);
          return; // User is set, auth listener will confirm
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
      }

      // Set loading false if no redirect result - auth listener will handle rest
      // Keep loading true until auth listener fires
    };

    initializeAuth();
  }, [mounted]);

  // Set up auth state listener
  useEffect(() => {
    if (!mounted || authListenerSet.current) return;
    authListenerSet.current = true;

    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((authUser) => {
      console.log('Auth state changed:', authUser?.email || 'null');
      setUser(authUser);
      setLoading(false);
      setIsRedirecting(false);
    });

    return () => {
      unsubscribe();
      authListenerSet.current = false;
    };
  }, [mounted]);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setIsRedirecting(true);
      
      const result = await signInWithGoogle();
      
      // If result is null, redirect is happening - page will reload
      if (result) {
        // Popup auth succeeded
        setUser(result);
        setLoading(false);
        setIsRedirecting(false);
      }
      // For redirect auth, page reloads and handleRedirectResult handles it
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
