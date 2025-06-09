
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
    // console.log("UserContext: Mounting. Attempting to load user from localStorage.");
    setLoading(true);
    try {
      const storedEncryptedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedEncryptedUser) {
        // console.log("UserContext: Found data in localStorage. Attempting decryption.");
        const decryptedUser = decryptDataAES(storedEncryptedUser);
        if (decryptedUser && typeof decryptedUser === 'object' && 'id' in decryptedUser) {
          setUser(decryptedUser as User);
          // console.log("UserContext: User DECRYPTED and SET from localStorage:", decryptedUser);
        } else {
          setUser(null);
          // console.warn("UserContext: Failed to decrypt user or data was invalid. Clearing invalid storage. User set to null.");
          localStorage.removeItem(SIMULATED_USER_KEY);
        }
      } else {
        setUser(null);
        // console.log("UserContext: No user data found in localStorage. User set to null.");
      }
    } catch (error) {
      setUser(null);
      console.error("UserContext: Error during initial user load from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY);
    } finally {
      // console.log("UserContext: FINALLY block. Setting loading to false.");
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    // console.log("UserContext: login function CALLED with userData:", userData);
    if (!userData || !userData.id) {
      console.error("UserContext: login function - Invalid userData provided (null or missing id). Aborting login.");
      setLoading(false); // Ensure loading is false if login aborts early
      return;
    }
    try {
      const encryptedUserData = encryptDataAES(userData);
      localStorage.setItem(SIMULATED_USER_KEY, encryptedUserData);
      setUser(userData);
      setLoading(false); 
      // console.log("UserContext: login function - User encrypted, saved to localStorage, and SET in context. Loading set to false.");
    } catch (error) {
      console.error("UserContext: login function - Error encrypting/saving user to localStorage:", error);
      setUser(userData); 
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // console.log("UserContext: logout function CALLED.");
    setUser(null);
    setLoading(false); 
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      // console.log("UserContext: logout function - User removed from localStorage.");
    } catch (error) {
      console.error("UserContext: logout function - Error removing user from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    // console.log("UserContext: updateUser CALLED with updatedData:", updatedData);
    
    let finalUserToStore: User | null = null;

    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        finalUserToStore = newUser;
        // console.log("UserContext: updateUser - New user object for context:", newUser);
        return newUser;
      }
      // console.log("UserContext: updateUser - prevUser was null, not updating.");
      return null;
    });

    if (finalUserToStore) {
      try {
        const encryptedUser = encryptDataAES(finalUserToStore);
        localStorage.setItem(SIMULATED_USER_KEY, encryptedUser);
        // console.log("UserContext: updateUser - User updated, encrypted, and SAVED in localStorage.");
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
