
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { encryptDataAES, decryptDataAES } from '@/lib/encryption'; 
import type { EmotionalEntry } from '@/data/emotionalEntriesStore';
import { overwriteEmotionalEntries, clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';


export interface User {
  id: string;
  email: string | null;
  name: string | null;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

const SIMULATED_USER_KEY = 'workwell-simulated-user';

interface LoginContextPayload {
  user: User;
  entries?: EmotionalEntry[] | null;
}

interface UserContextType {
  user: User | null;
  login: (loginData: LoginContextPayload) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedEncryptedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedEncryptedUser) {
        const decryptedUser = decryptDataAES(storedEncryptedUser);
        if (decryptedUser && typeof decryptedUser === 'object' && 'id' in decryptedUser) {
          setUser(decryptedUser as User);
        } else {
          setUser(null);
          localStorage.removeItem(SIMULATED_USER_KEY);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("UserContext: Error during initial user load from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((loginData: LoginContextPayload) => {
    if (!loginData || !loginData.user || !loginData.user.id) {
      console.error("UserContext: login function - Invalid user data provided. Aborting login.");
      setLoading(false);
      return;
    }
    try {
      const encryptedUserData = encryptDataAES(loginData.user);
      localStorage.setItem(SIMULATED_USER_KEY, encryptedUserData);
      setUser(loginData.user);
      
      // Handle emotional entries
      if (loginData.entries && Array.isArray(loginData.entries)) {
        overwriteEmotionalEntries(loginData.entries);
        console.log("UserContext: Emotional entries overwritten from login data.");
      } else {
        clearAllEmotionalEntries(); // Clear local entries if server provides none or fetch failed
        console.log("UserContext: Emotional entries cleared as none were provided or fetch failed during login.");
      }

      setLoading(false); 
    } catch (error) {
      console.error("UserContext: login function - Error encrypting/saving user or processing entries:", error);
      // Still set user for basic functionality if encryption/storage fails
      setUser(loginData.user); 
      if (loginData.entries && Array.isArray(loginData.entries)) {
         overwriteEmotionalEntries(loginData.entries); // Try to set entries anyway
      } else {
         clearAllEmotionalEntries();
      }
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setLoading(false); 
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      clearAllEmotionalEntries(); // Also clear emotional entries on logout
      console.log("UserContext: User and emotional entries removed from localStorage on logout.");
    } catch (error) {
      console.error("UserContext: logout function - Error removing data from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    let finalUserToStore: User | null = null;
    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        finalUserToStore = newUser;
        return newUser;
      }
      return null;
    });

    if (finalUserToStore) {
      try {
        const encryptedUser = encryptDataAES(finalUserToStore);
        localStorage.setItem(SIMULATED_USER_KEY, encryptedUser);
      } catch (error) {
        console.error("UserContext: updateUser - Error encrypting/saving updated user in localStorage:", error);
      }
    }
    return Promise.resolve();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

