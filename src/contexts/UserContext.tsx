
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firestoreData.name || firebaseUser.displayName,
            ageRange: firestoreData.ageRange,
            gender: firestoreData.gender,
            initialEmotionalState: firestoreData.initialEmotionalState,
          });
        } else {
          // User exists in Auth but not in Firestore (e.g. created directly in Firebase console)
          // Or, if registration didn't complete Firestore write yet
          // For simplicity, we'll create a basic user profile if it's missing,
          // or you might want to redirect to a profile completion page.
          const basicProfile: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
          };
          // Optionally, create the document in Firestore if it's missing
          // await setDoc(userDocRef, { 
          //   uid: firebaseUser.uid, 
          //   email: firebaseUser.email, 
          //   name: basicProfile.name,
          //   createdAt: serverTimestamp()
          // }, { merge: true }); // merge true to avoid overwriting if race condition
          setUser(basicProfile);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // setUser(null) will be handled by onAuthStateChanged
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      // setLoading(false) will be handled by onAuthStateChanged setting user to null
    }
  };
  
  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (user) {
      const userDocRef = doc(db, "users", user.id);
      try {
        await setDoc(userDocRef, { 
          ...updatedData, 
          updatedAt: serverTimestamp() 
        }, { merge: true });
        
        setUser(prevUser => prevUser ? ({ ...prevUser, ...updatedData }) : null);
      } catch (error) {
        console.error("Error updating user data in Firestore: ", error);
        throw error; // Re-throw to be caught by the calling component
      }
    } else {
      throw new Error("Usuario no autenticado para actualizar datos.");
    }
  };

  // login function is no longer needed here as onAuthStateChanged handles user state
  // The actual login process is handled by the server action `loginUser`

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
