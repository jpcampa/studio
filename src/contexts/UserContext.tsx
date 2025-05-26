
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  login: (userData: User) => void; // Ensure login is defined in the type
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
    // Load user from localStorage on initial mount
    console.log("UserContext (Simulated): useEffect to load from localStorage mounting.");
    try {
      const storedUser = localStorage.getItem(SIMULATED_USER_KEY);
      if (storedUser) {
        console.log("UserContext (Simulated): Found user in localStorage:", storedUser);
        setUser(JSON.parse(storedUser));
      } else {
        console.log("UserContext (Simulated): No user found in localStorage.");
      }
    } catch (error) {
      console.error("UserContext (Simulated): Error loading user from localStorage:", error);
      localStorage.removeItem(SIMULATED_USER_KEY);
    } finally {
      setLoading(false);
      console.log("UserContext (Simulated): Initial load finished. Loading set to false.");
    }
  }, []);

  const login = useCallback((userData: User) => {
    console.log("UserContext (Simulated): login function called with:", userData);
    setUser(userData);
    try {
      localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(userData));
      console.log("UserContext (Simulated): User saved to localStorage.");
    } catch (error) {
      console.error("UserContext (Simulated): Error saving user to localStorage:", error);
    }
    // Redirection will be handled by the LoginForm's useEffect after contextUser updates
  }, []);

  const logout = useCallback(() => {
    console.log("UserContext (Simulated): logout function called.");
    setUser(null);
    try {
      localStorage.removeItem(SIMULATED_USER_KEY);
      console.log("UserContext (Simulated): User removed from localStorage.");
    } catch (error) {
      console.error("UserContext (Simulated): Error removing user from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext (Simulated): updateUser called with:", updatedData);
    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedData };
        try {
          localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(newUser));
          console.log("UserContext (Simulated): User updated in localStorage:", newUser);
        } catch (error) {
          console.error("UserContext (Simulated): Error updating user in localStorage:", error);
        }
        return newUser;
      }
      return null;
    });
    // Simulate async operation
    return Promise.resolve();
  }, []);

  // console.log("UserContext (Simulated): Rendering provider. User:", user, "Loading:", loading);

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
