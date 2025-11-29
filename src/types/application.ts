import { PositionApplication } from './position';

export interface ProfileData {
  fullName: string;
  regNumber: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  photoURL?: string;
}

export interface Application {
  id: string;
  userId: string;
  profile: ProfileData;
  positions: PositionApplication[];
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  adminNotes?: string;
}

export interface ApplicationCreateData {
  profile: ProfileData;
  positions: PositionApplication[];
}
