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

export interface EmailStatus {
  sent: boolean;
  sentAt?: Date;
  error?: string;
  attempts: number;
}

export interface Application {
  id: string;
  userId: string;
  profile: ProfileData;
  positions: PositionApplication[];
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  adminNotes?: string;
  emailStatus?: EmailStatus;
}

export interface ApplicationCreateData {
  profile: ProfileData;
  positions: PositionApplication[];
}
