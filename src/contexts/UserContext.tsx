
// contexts/UserContext.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  // getAuth, // No longer directly needed here if firebaseAuthInstance is used
  onAuthStateChanged,
  signOut as firebaseSignOut,
  setPersistence,
  indexedDBLocalPersistence,
  // browserLocalPersistence, // Use indexedDBLocalPersistence as primary
  type User as FirebaseUser,
  type Auth,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, type Firestore, updateDoc } from "firebase/firestore";
import { app, auth as firebaseAuthInstance, db as firestoreDbInstance } from '@/lib/firebase';

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
  logout: () => void;
  loading: boolean;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Standardized to user, setUser
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("UserContext: useEffect for onAuthStateChanged mounting.");
    if (!firebaseAuthInstance) {
      console.error("UserContext: Firebase Auth instance is not available at mount. Firebase might not be initialized correctly.");
      setLoading(false);
      return;
    }
    
    let persistenceAttempted = false;
    let unsubscribeAuth: (() => void) | null = null;

    const setAuthPersistenceAndSubscribe = async () => {
      if (persistenceAttempted) return;
      persistenceAttempted = true;

      try {
        await setPersistence(firebaseAuthInstance, indexedDBLocalPersistence);
        console.log("UserContext: Firebase auth persistence set to indexedDBLocalPersistence.");
      } catch (error) {
        console.error("UserContext: Error setting Firebase auth persistence:", error);
        // Fallback or error handling if persistence fails. Still proceed to subscribe.
      } finally {
        console.log("UserContext: Auth object available, proceeding to subscribe to onAuthStateChanged. Auth instance:", firebaseAuthInstance);
        unsubscribeAuth = onAuthStateChanged(firebaseAuthInstance, async (firebaseUser: FirebaseUser | null) => {
          console.log(`UserContext: onAuthStateChanged event. Firebase user UID: ${firebaseUser?.uid}`);
          if (firebaseUser) {
            try {
              console.log("UserContext: Firebase user found. Attempting to fetch Firestore data for UID:", firebaseUser.uid);
              if (!firestoreDbInstance) {
                console.error("UserContext: Firestore instance (db) is not available. Cannot fetch user profile.");
                const minimalUser: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuarie',
                };
                console.log("UserContext: setUser called with (Firestore unavailable):", minimalUser);
                setUser(minimalUser); // Use setUser
                setLoading(false);
                return;
              }
              const userDocRef = doc(firestoreDbInstance, "users", firebaseUser.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                const userDataFromFirestore = userDoc.data();
                const appUser: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: userDataFromFirestore.name || firebaseUser.displayName,
                  ageRange: userDataFromFirestore.ageRange,
                  gender: userDataFromFirestore.gender,
                  initialEmotionalState: userDataFromFirestore.initialEmotionalState,
                };
                console.log("UserContext: Firestore data found. setUser called with:", appUser);
                setUser(appUser); // Use setUser
              } else {
                console.warn(`UserContext: No Firestore document found for UID: ${firebaseUser.uid}. Creating a basic profile.`);
                const basicProfile: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuarie Nuevo',
                };
                if (firestoreDbInstance) { 
                   await setDoc(doc(firestoreDbInstance, "users", firebaseUser.uid), {
                      email: basicProfile.email,
                      name: basicProfile.name,
                   });
                }
                console.log("UserContext: Basic profile created in Firestore. setUser called with:", basicProfile);
                setUser(basicProfile); // Use setUser
              }
            } catch (error) {
              console.error("UserContext: Error fetching/setting user data from Firestore:", error);
              const fallbackUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuarie',
              };
              console.log("UserContext: setUser called with (Firestore error fallback):", fallbackUser);
              setUser(fallbackUser); // Use setUser
            } finally {
              console.log("UserContext: (Inside if firebaseUser) Setting loading state to false.");
              setLoading(false);
            }
          } else {
            console.log("UserContext: No Firebase user (signed out). setUser called with: null");
            setUser(null); // Use setUser
            console.log("UserContext: (Inside else !firebaseUser) Setting loading state to false.");
            setLoading(false);
          }
        });
      }
    };
    
    setAuthPersistenceAndSubscribe();

    return () => {
      if (unsubscribeAuth) {
        console.log("UserContext: Unsubscribing from onAuthStateChanged.");
        unsubscribeAuth();
      }
    };
  }, []); 

  const logout = async () => {
    console.log("UserContext: logout called.");
    if (!firebaseAuthInstance) {
        console.error("UserContext logout: Firebase Auth instance is not available.");
        setUser(null); // Use setUser
        router.push('/login');
        return;
    }
    try {
      await firebaseSignOut(firebaseAuthInstance);
      console.log("UserContext: Firebase sign out successful.");
      // setUser(null) will be handled by onAuthStateChanged
      router.push('/login');
    } catch (error) {
      console.error("UserContext: Firebase sign out error:", error);
      setUser(null); // Use setUser
      router.push('/login');
    }
  };

  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    console.log("UserContext: updateUser called with:", updatedData);
    if (user && user.id && firestoreDbInstance) { 
      try {
        const userDocRef = doc(firestoreDbInstance, "users", user.id);
        await updateDoc(userDocRef, updatedData);
        setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null); // Use setUser
        console.log("UserContext: User updated in Firestore and context:", updatedData);
        return Promise.resolve();
      } catch (error) {
        console.error("UserContext: Failed to update user in Firestore:", error);
        throw error;
      }
    } else {
      const errorMessage = `UserContext: updateUser failed. User: ${user ? user.id : 'null'}, DB: ${firestoreDbInstance ? 'available' : 'null'}`;
      console.warn(errorMessage);
      return Promise.reject(new Error(errorMessage || "Usuario no autenticado o base de datos no disponible."));
    }
  };

  // console.log("UserContext: Rendering provider. User:", user, "Loading:", loading);

  return (
    <UserContext.Provider value={{ user, logout, loading, updateUser }}>
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

    