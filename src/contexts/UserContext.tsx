
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { encryptDataAES, decryptDataAES } from '@/lib/encryption'; 
import type { EmotionalEntry } from '@/data/emotionalEntriesStore';
import { overwriteEmotionalEntries, clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import type { NotebookEntry } from '@/data/therapeuticNotebookStore'; // Import NotebookEntry
import { overwriteNotebookEntries, clearAllNotebookEntries } from '@/data/therapeuticNotebookStore'; // Import notebook store functions


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
  emotionalEntries?: EmotionalEntry[] | null;
  notebookEntries?: NotebookEntry[] | null; 
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
  const [loading, setLoading] = useState(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    console.log("UserContext MOUNT_EFFECT: Starting initial user load from localStorage.");
    setLoading(true);
    try {
      const storedEncryptedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedEncryptedUser) {
        const decryptedUser = decryptDataAES(storedEncryptedUser);
        if (decryptedUser && typeof decryptedUser === 'object' && 'id' in decryptedUser && typeof (decryptedUser as User).id === 'string' && (decryptedUser as User).id.trim() !== '') {
          setUser(decryptedUser as User);
          console.log("UserContext MOUNT_EFFECT: User loaded from localStorage:", decryptedUser);
        } else {
          setUser(null);
          localStorage.removeItem(SIMULATED_USER_KEY);
          console.log("UserContext MOUNT_EFFECT: Invalid user data in localStorage or decryption failed. Cleared.");
        }
      } else {
        setUser(null);
        console.log("UserContext MOUNT_EFFECT: No user found in localStorage.");
      }
    } catch (error) {
      setUser(null);
      console.error("UserContext MOUNT_EFFECT: Error during initial user load from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY);
    } finally {
      setLoading(false);
      console.log("UserContext MOUNT_EFFECT: Initial user load finished. loading set to false.");
    }
  }, []);

  const login = useCallback((loginData: LoginContextPayload) => {
    console.log("UserContext LOGIN_FUNC_START: Received loginData:", JSON.stringify(loginData).substring(0,500));
    
    if (!loginData || !loginData.user || typeof loginData.user.id !== 'string' || loginData.user.id.trim() === '') {
      let reason = "loginData or loginData.user is null/undefined.";
      if (loginData && loginData.user) {
        if (typeof loginData.user.id !== 'string') reason = "loginData.user.id is not a string.";
        else if (loginData.user.id.trim() === '') reason = "loginData.user.id is an empty string.";
      }
      console.error(`UserContext LOGIN_FUNC_GUARD: Invalid user data provided. Reason: ${reason} Aborting login. Received:`, loginData);
      setLoading(false); // Ensure loading is false if login aborts early
      return;
    }

    try {
      const encryptedUserData = encryptDataAES(loginData.user);
      localStorage.setItem(SIMULATED_USER_KEY, encryptedUserData);
      setUser(loginData.user);
      console.log("UserContext LOGIN_FUNC_TRY: setUser called with:", loginData.user);
      
      // Handle emotional entries
      if (loginData.emotionalEntries && Array.isArray(loginData.emotionalEntries)) {
        overwriteEmotionalEntries(loginData.emotionalEntries);
        console.log("UserContext LOGIN_FUNC_TRY: Emotional entries overwritten from login data. Count:", loginData.emotionalEntries.length);
      } else {
        clearAllEmotionalEntries(); 
        console.log("UserContext LOGIN_FUNC_TRY: Emotional entries cleared (none provided or fetch failed).");
      }

      // Handle notebook entries
      if (loginData.notebookEntries && Array.isArray(loginData.notebookEntries)) {
        overwriteNotebookEntries(loginData.notebookEntries);
        console.log("UserContext LOGIN_FUNC_TRY: Notebook entries overwritten from login data. Count:", loginData.notebookEntries.length);
      } else {
        clearAllNotebookEntries();
        console.log("UserContext LOGIN_FUNC_TRY: Notebook entries cleared (none provided or fetch failed).");
      }

      setLoading(false);
      console.log("UserContext LOGIN_FUNC_TRY: setLoading(false) called. User state should be updated.");
    } catch (error) {
      console.error("UserContext LOGIN_FUNC_CATCH: Error during login process (encrypting/saving user or processing entries):", error);
      // Attempt to set user even if localStorage fails, but log the error
      setUser(loginData.user); 
      console.log("UserContext LOGIN_FUNC_CATCH: setUser (fallback) called with:", loginData.user);
      if (loginData.emotionalEntries && Array.isArray(loginData.emotionalEntries)) {
         overwriteEmotionalEntries(loginData.emotionalEntries);
      } else {
         clearAllEmotionalEntries();
      }
      if (loginData.notebookEntries && Array.isArray(loginData.notebookEntries)) {
        overwriteNotebookEntries(loginData.notebookEntries);
      } else {
        clearAllNotebookEntries();
      }
      setLoading(false);
      console.log("UserContext LOGIN_FUNC_CATCH: setLoading(false) (fallback) called.");
    }
  }, []);

  const logout = useCallback(() => {
    console.log("UserContext LOGOUT_FUNC: Logging out user.");
    setUser(null);
    setLoading(false); // Important to set loading to false so pages don't hang
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      clearAllEmotionalEntries();
      clearAllNotebookEntries(); // Also clear notebook entries on logout
      console.log("UserContext LOGOUT_FUNC: User, emotional, and notebook entries removed from localStorage.");
    } catch (error) {
      console.error("UserContext LOGOUT_FUNC: Error removing data from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext UPDATE_USER_FUNC: Attempting to update user with data:", updatedData);
    let finalUserToStore: User | null = null;
    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        finalUserToStore = newUser;
        console.log("UserContext UPDATE_USER_FUNC: New user object for state:", newUser);
        return newUser;
      }
      console.warn("UserContext UPDATE_USER_FUNC: No previous user to update.");
      return null;
    });

    if (finalUserToStore) {
      try {
        const encryptedUser = encryptDataAES(finalUserToStore);
        localStorage.setItem(SIMULATED_USER_KEY, encryptedUser);
        console.log("UserContext UPDATE_USER_FUNC: Updated user saved to localStorage.");
      } catch (error) {
        console.error("UserContext UPDATE_USER_FUNC: Error encrypting/saving updated user in localStorage:", error);
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
