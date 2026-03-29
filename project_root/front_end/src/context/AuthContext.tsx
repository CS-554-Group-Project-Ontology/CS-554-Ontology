import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import Loading from '../components/Loading';

interface AuthContextType {
  currentUser: User | null;
  refreshUser: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
