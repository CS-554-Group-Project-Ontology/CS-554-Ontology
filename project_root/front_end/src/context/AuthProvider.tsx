import React, { useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import Loading from '../components/Loading';
import { AuthContext } from './AuthContext';

async function getToken() {
  const auth = getAuth();
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const listener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return () => listener();
  }, []);

  async function refreshUser() {
    const auth = getAuth();
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setCurrentUser({ ...auth.currentUser });
    }
  }

  const value = useMemo(
    () => ({ currentUser, refreshUser, getToken }),
    [currentUser, refreshUser],
  );

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
