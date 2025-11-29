import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);

  return { adminApp, adminDb, adminAuth };
};

export const getAdminFirestore = (): Firestore => {
  if (!adminDb) {
    initializeFirebaseAdmin();
  }
  return adminDb;
};

export const getAdminAuth = (): Auth => {
  if (!adminAuth) {
    initializeFirebaseAdmin();
  }
  return adminAuth;
};

export const verifyIdToken = async (token: string) => {
  const auth = getAdminAuth();
  return auth.verifyIdToken(token);
};
