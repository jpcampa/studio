
// contexts/UserContext.tsx
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  type User as FirebaseUser,
  indexedDBLocalPersistence, // Importar persistencia
  setPersistence // Importar setPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setUser = (newUser: User | null) => {
    console.log("UserContext: setUser called with:", newUser);
    setUserState(newUser);
  };

  useEffect(() => {
    console.log("UserContext: useEffect for onAuthStateChanged mounting. Initial auth.currentUser:", auth?.currentUser);
    if (!auth) {
      console.error("UserContext: Firebase Auth instance is not available. Cannot subscribe to onAuthStateChanged. This usually means Firebase initialization failed in firebase.ts or is not complete yet.");
      setLoading(false);
      setUser(null);
      return;
    }
    console.log("UserContext: Auth object available. Attempting to set persistence...");

    let unsubscribeAuthStateChanged = () => {
      // Placeholder, será reemplazada por la función de desuscripción real
      console.log("UserContext: Unsubscribe placeholder called before real one was set.");
    };

    const setupAuthListener = () => {
      console.log("UserContext: Setting up onAuthStateChanged listener after persistence attempt.");
      unsubscribeAuthStateChanged = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          console.log("UserContext: onAuthStateChanged event triggered. Firebase user UID:", firebaseUser ? firebaseUser.uid : "null");
          if (firebaseUser) {
            console.log("UserContext: Firebase user detected (UID:", firebaseUser.uid, "). Attempting to fetch Firestore data.");
            if (!db) {
                console.error("UserContext: Firestore DB instance is not available. Cannot fetch user document. Setting basic profile.");
                const basicProfile: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
                };
                setUser(basicProfile);
                console.log("UserContext: User state updated with basic profile (no DB).");
                return; // setLoading(false) está en el finally
            }
            const userDocRef = doc(db, "users", firebaseUser.uid);
            console.log("UserContext: Attempting getDoc for userDocRef:", userDocRef.path);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const firestoreData = userDocSnap.data();
              console.log("UserContext: Firestore data successfully fetched:", firestoreData);
              const appUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firestoreData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuarie",
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
          } else {
            console.log("UserContext: No Firebase user (signed out). Setting user state to null.");
            setUser(null);
          }
        } catch (e) {
          console.error("UserContext: UNCAUGHT ERROR in onAuthStateChanged callback logic:", e);
          setUser(null); // Asegurar que el usuario se limpie en caso de error
        } finally {
          console.log("UserContext: (onAuthStateChanged callback finally block) Setting loading state to false.");
          setLoading(false);
        }
      });
    };

    setPersistence(auth, indexedDBLocalPersistence)
      .then(() => {
        console.log("UserContext: Firebase auth persistence set to indexedDBLocalPersistence successfully.");
        setupAuthListener();
      })
      .catch((error) => {
        console.error("UserContext: Error setting Firebase auth persistence to indexedDBLocalPersistence:", error);
        console.log("UserContext: Proceeding to set up onAuthStateChanged listener anyway (default persistence will be used).");
        setupAuthListener();
      });

    return () => {
      console.log("UserContext: Unsubscribing from onAuthStateChanged (UserContext unmounting).");
      if (typeof unsubscribeAuthStateChanged === 'function') {
        unsubscribeAuthStateChanged();
      }
    };
  }, []); 

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
    setLoading(true); // Marcar como cargando ANTES de la operación async
    try {
      await firebaseSignOut(auth);
      console.log("UserContext: Firebase sign out successful. onAuthStateChanged should handle state update to null and setLoading to false.");
      // setUser(null) and setLoading(false) are handled by onAuthStateChanged
      router.push('/login'); // Redirigir explícitamente aquí puede ser más rápido
    } catch (error) {
      console.error("UserContext: Error signing out: ", error);
      setUser(null); 
      setLoading(false); // Asegurar que loading se ponga a false en caso de error de logout
      router.push('/login'); 
    }
  };

  const updateUser = async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (user && db && auth) {
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
        throw error; // Re-lanzar para que la página de Settings pueda manejarlo
      }
    } else {
      const reason = !user ? "user is not authenticated" : !db ? "Firestore DB is not available" : "Auth is not available";
      console.error(`UserContext: updateUser called but ${reason}.`);
      throw new Error(`Usuario no autenticado o servicios de Firebase no disponibles para actualizar datos (${reason}).`);
    }
  };

  console.log("UserContext: Rendering provider. User:", user, "Loading:", loading);
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
