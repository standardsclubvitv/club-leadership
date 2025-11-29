export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  hasApplied: boolean;
}

export interface UserCreateData {
  email: string;
  displayName: string;
  photoURL: string | null;
}
