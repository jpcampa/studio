
// contexts/UserContext.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect }
from 'react';
import { useRouter } from 'next/navigation';

// This User interface should be the single source of truth for user structure
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

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
  const [loading, setLoading] = useState(true); // Start true until localStorage is checked
  const router = useRouter();

  useEffect(() => {
    console.log("UserContext: useEffect (mount) - Attempting to load user from localStorage.");
    try {
      const storedUser = localStorage.getItem('workwell-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("UserContext: User loaded from localStorage:", parsedUser);
      } else {
        console.log("UserContext: No user found in localStorage.");
      }
    } catch (error) {
      console.error("UserContext: Failed to parse user from localStorage", error);
      localStorage.removeItem('workwell-user'); // Clear corrupted data if any
    }
    setLoading(false); // Done attempting to load from localStorage
    console.log("UserContext: Initial loading complete. Loading state:", false);
  }, []);

  const login = (userData: User) => {
    console.log("UserContext: login called with:", userData);
    setUser(userData);
    try {
      localStorage.setItem('workwell-user', JSON.stringify(userData));
      console.log("UserContext: User saved to localStorage.");
    } catch (error) {
      console.error("UserContext: Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    console.log("UserContext: logout called.");
    setUser(null);
    try {
      localStorage.removeItem('workwell-user');
      console.log("UserContext: User removed from localStorage.");
    } catch (error) {
      console.error("UserContext: Failed to remove user from localStorage", error);
    }
    router.push('/login');
  };

  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext: updateUser called with:", updatedData);
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      try {
        localStorage.setItem('workwell-user', JSON.stringify(newUser));
        console.log("UserContext: User updated in localStorage:", newUser);
      } catch (error) {
        console.error("UserContext: Failed to update user in localStorage", error);
        // Optionally re-throw or handle UI feedback for failed save
        throw error;
      }
      return Promise.resolve();
    }
    console.warn("UserContext: updateUser called but no user is authenticated.");
    return Promise.reject(new Error("Usuario no autenticado"));
  };

  console.log("UserContext: Rendering provider. User:", user, "Loading:", loading);
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
