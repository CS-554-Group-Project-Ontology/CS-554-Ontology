import React from 'react';
import type { User } from 'firebase/auth';


interface AuthContextType {
  currentUser: User | null;
  refreshUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  refreshUser: async () => {},
  getToken: async () => null
});