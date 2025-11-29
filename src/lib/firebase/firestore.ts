import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from './config';
import { User, UserCreateData, Application, ApplicationCreateData, Position } from '@/types';

// User Operations
export const createOrUpdateUser = async (userData: UserCreateData): Promise<User> => {
  const firebaseUser = auth?.currentUser;
  if (!firebaseUser) {
    throw new Error('No authenticated user');
  }

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
    });
    const updatedSnap = await getDoc(userRef);
    return {
      uid: firebaseUser.uid,
      ...updatedSnap.data(),
    } as User;
  } else {
    // Create new user
    const newUser: Omit<User, 'uid'> = {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      role: 'user',
      createdAt: new Date(),
      hasApplied: false,
    };
    await setDoc(userRef, {
      ...newUser,
      createdAt: Timestamp.fromDate(newUser.createdAt),
    });
    return {
      uid: firebaseUser.uid,
      ...newUser,
    };
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: data.role,
      createdAt: data.createdAt?.toDate() || new Date(),
      hasApplied: data.hasApplied || false,
    };
  }
  return null;
};

export const updateUserHasApplied = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { hasApplied: true });
};

// Position Operations
export const getPositions = async (): Promise<Position[]> => {
  const positionsRef = collection(db, 'positions');
  const q = query(positionsRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Position[];
};

export const getPosition = async (positionId: string): Promise<Position | null> => {
  const positionRef = doc(db, 'positions', positionId);
  const positionSnap = await getDoc(positionRef);

  if (positionSnap.exists()) {
    return {
      id: positionSnap.id,
      ...positionSnap.data(),
    } as Position;
  }
  return null;
};

// Application Operations
export const createApplication = async (
  userId: string,
  applicationData: ApplicationCreateData
): Promise<Application> => {
  const applicationsRef = collection(db, 'applications');
  
  // Check if user already has an application
  const existingQuery = query(applicationsRef, where('userId', '==', userId));
  const existingSnap = await getDocs(existingQuery);
  
  if (!existingSnap.empty) {
    throw new Error('You have already submitted an application');
  }

  const submittedAt = new Date();
  const newApplication = {
    userId,
    profile: applicationData.profile,
    positions: applicationData.positions,
    submittedAt: Timestamp.fromDate(submittedAt),
    status: 'pending' as const,
  };

  const docRef = await addDoc(applicationsRef, newApplication);
  await updateUserHasApplied(userId);

  return {
    id: docRef.id,
    ...applicationData,
    userId,
    submittedAt,
    status: 'pending',
  };
};

export const getUserApplication = async (userId: string): Promise<Application | null> => {
  const applicationsRef = collection(db, 'applications');
  const q = query(applicationsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    userId: data.userId,
    profile: data.profile,
    positions: data.positions,
    submittedAt: data.submittedAt?.toDate() || new Date(),
    status: data.status,
    adminNotes: data.adminNotes,
  };
};

// Admin Operations
export const getApplications = async (
  limitCount: number = 50,
  lastDoc?: DocumentSnapshot
): Promise<{ applications: Application[]; lastDoc: DocumentSnapshot | null }> => {
  const applicationsRef = collection(db, 'applications');
  let q = query(applicationsRef, orderBy('submittedAt', 'desc'), limit(limitCount));

  if (lastDoc) {
    q = query(applicationsRef, orderBy('submittedAt', 'desc'), startAfter(lastDoc), limit(limitCount));
  }

  const snapshot = await getDocs(q);
  const applications = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      profile: data.profile,
      positions: data.positions,
      submittedAt: data.submittedAt?.toDate() || new Date(),
      status: data.status,
      adminNotes: data.adminNotes,
    };
  });

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { applications, lastDoc: lastVisible };
};

export const getApplication = async (applicationId: string): Promise<Application | null> => {
  const applicationRef = doc(db, 'applications', applicationId);
  const applicationSnap = await getDoc(applicationRef);

  if (applicationSnap.exists()) {
    const data = applicationSnap.data();
    return {
      id: applicationSnap.id,
      userId: data.userId,
      profile: data.profile,
      positions: data.positions,
      submittedAt: data.submittedAt?.toDate() || new Date(),
      status: data.status,
      adminNotes: data.adminNotes,
    };
  }
  return null;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: Application['status'],
  adminNotes?: string
): Promise<void> => {
  const applicationRef = doc(db, 'applications', applicationId);
  const updateData: { status: Application['status']; adminNotes?: string } = { status };
  
  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }
  
  await updateDoc(applicationRef, updateData);
};

export const getApplicationStats = async (): Promise<{
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  rejected: number;
  byPosition: Record<string, number>;
}> => {
  const applicationsRef = collection(db, 'applications');
  const snapshot = await getDocs(applicationsRef);

  const stats = {
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    byPosition: {} as Record<string, number>,
  };

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    stats.total++;
    stats[data.status as keyof typeof stats]++;

    data.positions?.forEach((pos: { positionName: string }) => {
      const posName = pos.positionName;
      stats.byPosition[posName] = (stats.byPosition[posName] || 0) + 1;
    });
  });

  return stats;
};
