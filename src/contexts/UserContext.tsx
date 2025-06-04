
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { encryptDataAES, decryptDataAES } from '@/lib/encryption'; // Import encryption functions

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

const SIMULATED_USER_KEY = 'workwell-simulated-user';

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
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
    console.log("UserContext: useEffect to load from localStorage mounting.");
    try {
      const storedEncryptedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedEncryptedUser) {
        console.log("UserContext: Found data in localStorage. Attempting decryption.");
        const decryptedUser = decryptDataAES(storedEncryptedUser);
        if (decryptedUser) {
          setUser(decryptedUser as User);
          console.log("UserContext: User decrypted and set from localStorage:", decryptedUser);
        } else {
          console.warn("UserContext: Failed to decrypt user from localStorage or data was invalid. Clearing invalid storage.");
          localStorage.removeItem(SIMULATED_USER_KEY); // Remove invalid/corrupted data
        }
      } else {
        console.log("UserContext: No user data found in localStorage.");
      }
    } catch (error) {
      console.error("UserContext: Error during initial user load from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY); // Clear potentially corrupted data
    } finally {
      setLoading(false);
      console.log("UserContext: Initial load finished. Loading set to false.");
    }
  }, []);

  const login = useCallback((userData: User) => {
    console.log("UserContext: login function called with:", userData);
    try {
      const encryptedUserData = encryptDataAES(userData);
      localStorage.setItem(SIMULATED_USER_KEY, encryptedUserData);
      setUser(userData); // Set user state after successful encryption and storage
      console.log("UserContext: User encrypted and saved to localStorage.");
    } catch (error) {
      console.error("UserContext: Error encrypting/saving user to localStorage:", error);
      // Decide on error handling: maybe don't set user if storage fails? For now, we set it.
      setUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    console.log("UserContext: logout function called.");
    setUser(null);
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      console.log("UserContext: User removed from localStorage.");
    } catch (error) {
      console.error("UserContext: Error removing user from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext: updateUser called with:", updatedData);
    
    let finalUserToStore: User | null = null;

    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        finalUserToStore = newUser; // Capture for storage
        return newUser;
      }
      return null;
    });

    if (finalUserToStore) {
      try {
        const encryptedUser = encryptDataAES(finalUserToStore);
        localStorage.setItem(SIMULATED_USER_KEY, encryptedUser);
        console.log("UserContext: User updated, encrypted, and saved in localStorage:", finalUserToStore);
      } catch (error) {
        console.error("UserContext: Error encrypting/saving updated user in localStorage:", error);
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
