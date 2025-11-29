import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from './config';
import { createOrUpdateUser, getUser } from './firestore';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
// Add additional scopes for better compatibility
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Check if we should use redirect (mobile devices)
const shouldUseRedirect = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if on mobile device or tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Also check for touch devices as additional indicator
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check if in standalone mode (PWA) or embedded browser
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for in-app browsers (Instagram, Facebook, etc.)
  const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter|Line/i.test(navigator.userAgent);
  
  return isMobile || isInAppBrowser || (isTouchDevice && isStandalone);
};

// Set persistence to local for better mobile support
const initializeAuth = async () => {
  if (auth) {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.error('Error setting persistence:', error);
    }
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  initializeAuth();
}

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const useRedirect = shouldUseRedirect();
    
    if (useRedirect) {
      // Use redirect for mobile devices - more reliable
      console.log('Using redirect auth for mobile device');
      await signInWithRedirect(auth, googleProvider);
      return null; // Redirect will reload the page
    }
    
    // Desktop: try popup first
    try {
      console.log('Using popup auth for desktop');
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Create or update user in Firestore
      const user = await createOrUpdateUser({
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL,
      });

      return user;
    } catch (popupError: unknown) {
      // If popup fails, fall back to redirect
      const error = popupError as { code?: string };
      console.log('Popup failed with code:', error.code);
      
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/network-request-failed' ||
        error.code === 'auth/internal-error'
      ) {
        console.log('Falling back to redirect auth...');
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw popupError;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Handle redirect result after page reload - MUST be called on page load
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    console.log('Checking for redirect result...');
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      console.log('Redirect result found, creating user...');
      const firebaseUser = result.user;
      const user = await createOrUpdateUser({
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL,
      });
      console.log('User created from redirect:', user?.email);
      return user;
    }
    
    console.log('No redirect result found');
    return null;
  } catch (error: unknown) {
    const err = error as { code?: string };
    // Ignore the error if it's just no redirect result
    if (err.code === 'auth/popup-closed-by-user') {
      return null;
    }
    console.error('Error handling redirect result:', error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const user = await getUser(firebaseUser.uid);
        callback(user);
      } catch (error) {
        console.error('Error getting user:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth?.currentUser || null;
};
