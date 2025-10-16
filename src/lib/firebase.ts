// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Define the NAMES of the environment variables your app expects
const ENV_VAR_NAMES = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID"
};

// Construct Firebase configuration using these environment variables
const firebaseConfig = {
  apiKey: process.env[ENV_VAR_NAMES.apiKey],
  authDomain: process.env[ENV_VAR_NAMES.authDomain],
  projectId: process.env[ENV_VAR_NAMES.projectId],
  storageBucket: process.env[ENV_VAR_NAMES.storageBucket],
  messagingSenderId: process.env[ENV_VAR_NAMES.messagingSenderId],
  appId: process.env[ENV_VAR_NAMES.appId],
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This check prevents re-initializing the app on every hot-reload
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // In a real app, you might want to handle this more gracefully
    throw new Error("Could not initialize Firebase. Please check your configuration.");
  }
} else {
  app = getApps()[0]!;
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
