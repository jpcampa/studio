
// contexts/UserContext.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
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
    console.log("UserContext: Subscribing to onAuthStateChanged.");
    // setLoading(true) // Already set initially, and will be set to false inside callback
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("UserContext: onAuthStateChanged event. Firebase user UID:", firebaseUser ? firebaseUser.uid : "null");
      if (firebaseUser) {
        console.log("UserContext: Firebase user detected. Attempting to fetch Firestore data for UID:", firebaseUser.uid);
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
          console.error("UserContext: Error fetching Firestore document for UID:", firebaseUser.uid, error);
          // Fallback to basic user info from auth if Firestore fails
          const basicProfile: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
          };
          setUser(basicProfile);
          console.log("UserContext: User state updated with basic profile (due to Firestore error):", basicProfile);
        }
      } else {
        // User is signed out
        console.log("UserContext: No Firebase user (signed out). Setting user state to null.");
        setUser(null);
      }
      console.log("UserContext: Setting loading state to false.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("UserContext: Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  const logout = async () => {
    console.log("UserContext: Logout requested.");
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      console.log("UserContext: Firebase sign out successful.");
      // setUser(null) will be handled by onAuthStateChanged
      router.push('/login');
    } catch (error) {
      console.error("UserContext: Error signing out: ", error);
      // setLoading(false) will be handled by onAuthStateChanged setting user to null and loading to false
    }
    // setLoading(false) is handled by onAuthStateChanged
  };
  
  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (user) {
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
      console.error("UserContext: updateUser called but no user is authenticated.");
      throw new Error("Usuario no autenticado para actualizar datos.");
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
