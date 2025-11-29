'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User } from '@/types';
import { onAuthStateChange, signInWithGoogle, signOut, handleRedirectResult } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  logout: () => Promise<void>;
  isRedirecting: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const initComplete = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Single initialization effect - handles both redirect result and auth listener
  useEffect(() => {
    if (!mounted || initComplete.current) return;
    initComplete.current = true;

    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        // Check for redirect result first (for mobile auth returning from Google)
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          console.log('User from redirect:', redirectUser.email);
          setUser(redirectUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Redirect check error:', error);
      }

      // Set up auth state listener - this will fire with current auth state
      unsubscribe = onAuthStateChange((authUser) => {
        console.log('Auth state:', authUser?.email || 'not signed in');
        setUser(authUser);
        setLoading(false);
        setIsRedirecting(false);
      });
    };

    initialize();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [mounted]);

  const signIn = useCallback(async (): Promise<User | null> => {
    try {
      setIsRedirecting(true);
      const result = await signInWithGoogle();
      
      if (result) {
        // Popup succeeded - set user directly
        setUser(result);
        setIsRedirecting(false);
        return result;
      }
      // If null, redirect is happening - page will reload
      return null;
    } catch (error) {
      console.error('Sign in error:', error);
      setIsRedirecting(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, []);

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
