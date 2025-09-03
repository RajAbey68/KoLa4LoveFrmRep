'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserProfile, createUserProfile, getUserProfile, updateLastLogin, determineUserRole } from '@/lib/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.warn('Firebase authentication not configured');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      if (firebaseUser?.email) {
        try {
          // Check if user profile exists
          let profile = await getUserProfile(firebaseUser.uid);
          
          if (!profile) {
            // Create new user profile with appropriate role
            const role = determineUserRole(firebaseUser.email);
            profile = await createUserProfile(firebaseUser, role);
          } else {
            // Update last login
            await updateLastLogin(firebaseUser.uid);
          }
          
          setUserProfile(profile);
        } catch (authError: any) {
          // If user is not authorized, sign them out immediately
          console.error('Authentication error:', authError.message);
          await signOut(auth);
          throw new Error(authError.message || 'Unauthorized access. Contact admin for access.');
        }
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn('Firebase authentication not configured');
      return;
    }
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!auth) {
      // Firebase not configured, skip auth setup
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get or create user profile
          let profile = await getUserProfile(firebaseUser.uid);
          
          if (!profile && firebaseUser.email) {
            const role = determineUserRole(firebaseUser.email);
            profile = await createUserProfile(firebaseUser, role);
          }
          
          setUserProfile(profile);
        } catch (authError: any) {
          // If user is not authorized, sign them out immediately
          console.error('Unauthorized user detected:', authError.message);
          await signOut(auth);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}