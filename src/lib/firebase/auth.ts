import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  browserPopupRedirectResolver,
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

// Check if popup is likely to be blocked
const isPopupBlocked = (): boolean => {
  // Some mobile browsers and strict networks block popups
  if (typeof window === 'undefined') return false;
  
  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobile;
};

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    // Try popup first, fall back to redirect on failure
    const useRedirect = isPopupBlocked();
    
    if (useRedirect) {
      // Use redirect for mobile devices and networks that block popups
      await signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver);
      return null; // Redirect will reload the page
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      const firebaseUser = result.user;

      // Create or update user in Firestore
      const user = await createOrUpdateUser({
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL,
      });

      return user;
    } catch (popupError: unknown) {
      // If popup fails (blocked, closed, or network issues), try redirect
      const error = popupError as { code?: string };
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/network-request-failed'
      ) {
        console.log('Popup failed, falling back to redirect...');
        await signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver);
        return null;
      }
      throw popupError;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Handle redirect result after page reload
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    if (result && result.user) {
      const firebaseUser = result.user;
      const user = await createOrUpdateUser({
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL,
      });
      return user;
    }
    return null;
  } catch (error) {
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
