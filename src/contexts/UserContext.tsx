
// contexts/UserContext.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; // auth and db can be undefined if Firebase init failed
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface User {
  id: string; // Firebase UID
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
  const [user, setUserState] = useState<User | null>(null); // user is the state, setUserState is the setter
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Wrapper for setUser to log changes
  const setUser = (newUser: User | null) => {
    console.log("UserContext: setUser called with:", newUser);
    setUserState(newUser); // Correctly calls the setter for the 'user' state variable
  };

  useEffect(() => {
    console.log("UserContext: useEffect for onAuthStateChanged mounting.");
    if (!auth) {
      console.error("UserContext: Firebase Auth instance is not available. Cannot subscribe to onAuthStateChanged. This usually means Firebase initialization failed in firebase.ts or is not complete yet.");
      setLoading(false);
      setUser(null);
      return;
    }
    console.log("UserContext: Auth object available, proceeding to subscribe to onAuthStateChanged. Auth instance:", auth);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("UserContext: onAuthStateChanged event. Firebase user UID:", firebaseUser ? firebaseUser.uid : "null");
      if (firebaseUser) {
        console.log("UserContext: Firebase user detected. Attempting to fetch Firestore data for UID:", firebaseUser.uid);
        if (!db) {
            console.error("UserContext: Firestore DB instance is not available. Cannot fetch user document. Setting basic profile.");
            const basicProfile: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
            };
            setUser(basicProfile);
            setLoading(false);
            return;
        }
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            console.log("UserContext: Firestore data successfully fetched:", firestoreData);
            const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firestoreData.name || firebaseUser.displayName,
              ageRange: firestoreData.ageRange,
              gender: firestoreData.gender,
              initialEmotionalState: firestoreData.initialEmotionalState,
            };
            setUser(appUser);
            console.log("UserContext: User state updated with Firestore data:", appUser);
          } else {
            console.warn("UserContext: Firestore document not found for UID:", firebaseUser.uid, ". Setting basic profile from Auth.");
            const basicProfile: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
            };
            setUser(basicProfile);
            console.log("UserContext: User state updated with basic profile (Firestore doc missing):", basicProfile);
          }
        } catch (error) {
          console.error("UserContext: Error fetching/processing Firestore document for UID:", firebaseUser.uid, error);
          const basicProfile: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
          };
          setUser(basicProfile);
          console.log("UserContext: User state updated with basic profile (due to Firestore error):", basicProfile);
        } finally {
          console.log("UserContext: (Inside if firebaseUser) Setting loading state to false.");
          setLoading(false);
        }
      } else {
        console.log("UserContext: No Firebase user (signed out). Setting user state to null.");
        setUser(null);
        console.log("UserContext: (Inside else !firebaseUser) Setting loading state to false.");
        setLoading(false);
      }
    });

    return () => {
      console.log("UserContext: Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // Removed 'auth' from dependencies to prevent re-subscription if auth instance itself changes, which is rare and usually not intended for this effect.

  const logout = async () => {
    console.log("UserContext: Logout requested.");
    if (!auth) {
      console.error("UserContext: Logout failed, Firebase Auth instance is not available.");
      setUser(null);
      setLoading(false);
      router.push('/login');
      return;
    }
    console.log("UserContext: Setting loading to true for logout.");
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      console.log("UserContext: Firebase sign out successful. onAuthStateChanged will handle state update.");
      // setUser(null) and setLoading(false) are now primarily handled by onAuthStateChanged
    } catch (error) {
      console.error("UserContext: Error signing out: ", error);
      setUser(null); // Ensure user state is cleared on error
      setLoading(false);
      router.push('/login'); // Fallback redirect
    }
  };

  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (user && db && auth) { // CORRECTED: use 'user' (the state variable)
      console.log("UserContext: updateUser called for UID:", user.id, "with data:", updatedData);
      const userDocRef = doc(db, "users", user.id);
      try {
        await setDoc(userDocRef, {
          ...updatedData,
          updatedAt: serverTimestamp()
        }, { merge: true });

        setUser(prevUser => prevUser ? ({ ...prevUser, ...updatedData }) : null);
        console.log("UserContext: User data updated successfully in Firestore and local state.");
      } catch (error) {
        console.error("UserContext: Error updating user data in Firestore: ", error);
        throw error;
      }
    } else {
      const reason = !user ? "user is not authenticated" : !db ? "Firestore DB is not available" : "Auth is not available"; // CORRECTED: use 'user'
      console.error(`UserContext: updateUser called but ${reason}.`);
      throw new Error(`Usuario no autenticado o servicios de Firebase no disponibles para actualizar datos (${reason}).`);
    }
  };

  console.log("UserContext: Rendering provider. User:", user, "Loading:", loading); // CORRECTED: use 'user'
  return (
    <UserContext.Provider value={{ user: user, logout, loading, updateUser }}>
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
