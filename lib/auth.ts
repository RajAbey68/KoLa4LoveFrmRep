import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type UserRole = 'admin' | 'staff' | 'partner' | 'agent' | 'guest';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  metadata?: {
    department?: string;
    propertyAccess?: string[];
    commissionRate?: number;
    managerEmail?: string;
  };
}

export const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_properties',
    'manage_bookings',
    'view_analytics',
    'manage_content',
    'manage_integrations',
    'view_financial_data',
    'manage_security',
  ],
  staff: [
    'manage_bookings',
    'view_analytics',
    'manage_content',
    'view_guest_data',
  ],
  partner: [
    'view_analytics',
    'manage_content',
    'view_bookings',
    'view_financial_data',
  ],
  agent: [
    'view_bookings',
    'manage_content',
    'view_guest_data',
  ],
  guest: [
    'view_public_content',
  ],
};

export const DEFAULT_PERMISSIONS = {
  admin: ROLE_PERMISSIONS.admin,
  staff: ROLE_PERMISSIONS.staff,
  partner: ROLE_PERMISSIONS.partner,
  agent: ROLE_PERMISSIONS.agent,
  guest: ROLE_PERMISSIONS.guest,
};

export async function createUserProfile(firebaseUser: FirebaseUser, role: UserRole = 'guest'): Promise<UserProfile> {
  const userProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email || 'User',
    role,
    permissions: DEFAULT_PERMISSIONS[role],
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
  return userProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
    } as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), updates);
}

export async function updateLastLogin(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    lastLoginAt: new Date(),
  });
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

export function canAccessAdminPanel(userRole: UserRole): boolean {
  return ['admin', 'staff', 'partner'].includes(userRole);
}

export function getAuthorizedEmails(): string[] {
  return [
    'RajAbey68@gmail.com',
    'Amir.laurie@gmail.com',
    'ota.kolake@gmail.com'
  ];
}

export function isAuthorizedUser(email: string): boolean {
  return getAuthorizedEmails().includes(email);
}

export function determineUserRole(email: string): UserRole {
  const authorizedEmails = getAuthorizedEmails();
  
  // Only allow access to authorized emails, no guests allowed
  if (!authorizedEmails.includes(email)) {
    throw new Error('Unauthorized access. Contact admin for access.');
  }
  
  if (email === 'RajAbey68@gmail.com') {
    return 'admin';
  }
  
  if (email === 'Amir.laurie@gmail.com' || email === 'ota.kolake@gmail.com') {
    return 'staff';
  }
  
  // This should never be reached due to the check above
  throw new Error('Unauthorized access. Contact admin for access.');
}