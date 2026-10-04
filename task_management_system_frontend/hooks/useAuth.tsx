'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { apiClient } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  loginAsDemoUser: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncBackendUser = useCallback(async (token: string) => {
    try {
      localStorage.setItem('auth_token', token);
      const res: any = await apiClient.post('/auth/sync');
      const syncedUser = res.user || res;
      setUser(syncedUser);
      return syncedUser;
    } catch (err: any) {
      console.error('Failed to sync user with backend:', err);
      // Fallback: try GET /auth/me
      try {
        const me: any = await apiClient.get('/auth/me');
        setUser(me);
        return me;
      } catch (meErr: any) {
        setError(meErr.message || 'Authentication synchronization failed');
        return null;
      }
    }
  }, []);

  useEffect(() => {
    // Check if demo token exists in local storage
    const savedToken = localStorage.getItem('auth_token');

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken();
          await syncBackendUser(idToken);
        } catch (err: any) {
          setError(err.message);
        }
      } else if (savedToken && savedToken.startsWith('mock-')) {
        // Restore demo session
        try {
          const me: any = await apiClient.get('/auth/me');
          setUser(me);
        } catch {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncBackendUser]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await syncBackendUser(idToken);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const demoToken = 'mock-google-token';
      localStorage.setItem('auth_token', demoToken);
      const me: any = await apiClient.get('/auth/me');
      setUser(me);
    } catch (err: any) {
      console.error('Demo Login Error:', err);
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('auth_token');
      await firebaseSignOut(auth).catch(() => {});
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      console.error('Logout Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        error,
        signInWithGoogle,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
