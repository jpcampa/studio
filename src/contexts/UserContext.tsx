
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
  // Add any other fields that might come from Firestore
}

interface UserContextType {
  user: User | null;
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
    console.log("UserContext: useEffect for onAuthStateChanged mounting.");
    if (!auth) { // Check if auth is defined
      console.error("UserContext: Firebase Auth instance is not available. Cannot subscribe to onAuthStateChanged. This usually means Firebase initialization failed in firebase.ts.");
      setLoading(false); // Stop loading if auth is not available
      setUser(null); // Ensure user is null
      return; // Exit early
    }
    console.log("UserContext: Auth object available, proceeding to subscribe to onAuthStateChanged. Auth instance:", auth);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("UserContext: onAuthStateChanged event. Firebase user UID:", firebaseUser ? firebaseUser.uid : "null");
      if (firebaseUser) {
        console.log("UserContext: Firebase user detected. Attempting to fetch Firestore data for UID:", firebaseUser.uid);
        if (!db) { // Check if db is defined
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
            // Consider creating the doc if it's truly missing and expected
            // await setDoc(userDocRef, { uid: firebaseUser.uid, email: firebaseUser.email, name: basicProfile.name, createdAt: serverTimestamp() }, { merge: true });
            setUser(basicProfile);
            console.log("UserContext: User state updated with basic profile (Firestore doc missing):", basicProfile);
          }
        } catch (error) {
          console.error("UserContext: Error fetching/processing Firestore document for UID:", firebaseUser.uid, error);
          // Fallback to basic user info from auth if Firestore fails
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
        // User is signed out
        console.log("UserContext: No Firebase user (signed out). Setting user state to null.");
        setUser(null);
        console.log("UserContext: (Inside else !firebaseUser) Setting loading state to false.");
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("UserContext: Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  const logout = async () => {
    console.log("UserContext: Logout requested.");
    if (!auth) {
      console.error("UserContext: Logout failed, Firebase Auth instance is not available.");
      setUser(null); // Clear user state locally
      setLoading(false);
      router.push('/login'); // Redirect to login
      return;
    }
    setLoading(true); 
    try {
      await firebaseSignOut(auth);
      console.log("UserContext: Firebase sign out successful.");
      // setUser(null) and setLoading(false) will be handled by onAuthStateChanged
      // No need to push router here, onAuthStateChanged will handle user being null
      // and MainAppLayout or HomePage will redirect if necessary.
    } catch (error) {
      console.error("UserContext: Error signing out: ", error);
      setLoading(false); 
      setUser(null); 
      router.push('/login'); // Fallback redirect
    }
  };
  
  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (user && db && auth) { // Check for auth as well, user implies auth but good practice
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
        throw error; // Re-throw to be caught by the calling component
      }
    } else {
      console.error("UserContext: updateUser called but user is not authenticated, or Firestore DB/Auth is not available.");
      throw new Error("Usuario no autenticado o servicios de Firebase no disponibles para actualizar datos.");
    }
  };

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
