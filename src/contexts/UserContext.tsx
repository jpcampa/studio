
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
    console.log("UserContext: useEffect[initialLoad] - Mounting. Attempting to load user from localStorage.");
    setLoading(true); // Ensure loading is true at the start of the effect
    try {
      const storedEncryptedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedEncryptedUser) {
        console.log("UserContext: useEffect[initialLoad] - Found data in localStorage. Attempting decryption.");
        const decryptedUser = decryptDataAES(storedEncryptedUser);
        if (decryptedUser && typeof decryptedUser === 'object' && 'id' in decryptedUser) {
          setUser(decryptedUser as User);
          console.log("UserContext: useEffect[initialLoad] - User DECRYPTED and SET from localStorage:", decryptedUser);
        } else {
          setUser(null); // Explicitly set to null if decryption fails or data is invalid
          console.warn("UserContext: useEffect[initialLoad] - Failed to decrypt user or data was invalid. Clearing invalid storage. User set to null.");
          localStorage.removeItem(SIMULATED_USER_KEY);
        }
      } else {
        setUser(null); // Explicitly set to null if no user data in storage
        console.log("UserContext: useEffect[initialLoad] - No user data found in localStorage. User set to null.");
      }
    } catch (error) {
      setUser(null); // Explicitly set to null on error
      console.error("UserContext: useEffect[initialLoad] - Error during initial user load from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY);
    } finally {
      console.log("UserContext: useEffect[initialLoad] - FINALLY block. Setting loading to false.");
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    console.log("UserContext: login function CALLED with userData:", JSON.stringify(userData, null, 2));
    if (!userData || !userData.id) {
      console.error("UserContext: login function - Invalid userData provided (null or missing id). Aborting login.");
      return;
    }
    try {
      const encryptedUserData = encryptDataAES(userData);
      localStorage.setItem(SIMULATED_USER_KEY, encryptedUserData);
      setUser(userData);
      setLoading(false); // User is now logged in, so not loading
      console.log("UserContext: login function - User encrypted, saved to localStorage, and SET in context. Loading set to false.");
    } catch (error) {
      console.error("UserContext: login function - Error encrypting/saving user to localStorage:", error);
      // Potentially set user even if storage fails, or handle error more gracefully
      setUser(userData);
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log("UserContext: logout function CALLED.");
    setUser(null);
    setLoading(false); // Not loading, as user is now definitively null
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      console.log("UserContext: logout function - User removed from localStorage.");
    } catch (error) {
      console.error("UserContext: logout function - Error removing user from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext: updateUser CALLED with updatedData:", updatedData);
    
    let finalUserToStore: User | null = null;

    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        finalUserToStore = newUser;
        console.log("UserContext: updateUser - New user object for context:", JSON.stringify(newUser, null, 2));
        return newUser;
      }
      console.log("UserContext: updateUser - prevUser was null, not updating.");
      return null;
    });

    if (finalUserToStore) {
      try {
        const encryptedUser = encryptDataAES(finalUserToStore);
        localStorage.setItem(SIMULATED_USER_KEY, encryptedUser);
        console.log("UserContext: updateUser - User updated, encrypted, and SAVED in localStorage.");
      } catch (error) {
        console.error("UserContext: updateUser - Error encrypting/saving updated user in localStorage:", error);
      }
    }
    return Promise.resolve();
  }, []);

  // Log context state changes for easier debugging
  useEffect(() => {
    console.log("UserContext: STATE CHANGE - User:", JSON.stringify(user, null, 2), "Loading:", loading);
  }, [user, loading]);

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
