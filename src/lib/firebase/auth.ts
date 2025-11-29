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
googleProvider.addScope('email');
googleProvider.addScope('profile');

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

if (typeof window !== 'undefined') {
  initializeAuth();
}

// Always use popup - it's more reliable across devices
// The issue with redirect is that getRedirectResult doesn't always work
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    console.log('Starting Google sign-in with popup...');
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    console.log('Popup sign-in successful:', firebaseUser.email);
    
    // Create or update user in Firestore
    const user = await createOrUpdateUser({
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
    });

    return user;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error('Sign-in error:', err.code, err.message);
    throw error;
  }
};

// Keep for backwards compatibility but mainly rely on onAuthStateChange
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = await createOrUpdateUser({
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL,
      });
      return user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
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
        // User is signed in - create or get user from Firestore
        let user = await getUser(firebaseUser.uid);
        
        // If user doesn't exist in Firestore yet, create them
        if (!user) {
          user = await createOrUpdateUser({
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL,
          });
        }
        
        callback(user);
      } catch (error) {
        console.error('Error getting/creating user:', error);
        // Still try to create a basic user object
        try {
          const user = await createOrUpdateUser({
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL,
          });
          callback(user);
        } catch {
          callback(null);
        }
      }
    } else {
      callback(null);
    }
  });
};

export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth?.currentUser || null;
};
