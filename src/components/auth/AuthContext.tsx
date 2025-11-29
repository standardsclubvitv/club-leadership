'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User } from '@/types';
import { onAuthStateChange, signInWithGoogle, signOut } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const listenerSet = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up auth state listener once
  useEffect(() => {
    if (!mounted || listenerSet.current) return;
    listenerSet.current = true;

    const unsubscribe = onAuthStateChange((authUser) => {
      console.log('Auth state changed:', authUser?.email || 'null');
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      listenerSet.current = false;
    };
  }, [mounted]);

  const signIn = useCallback(async (): Promise<User | null> => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        setUser(result);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Sign in error:', error);
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
