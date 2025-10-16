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
let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

// Proceed with initialization only if essential config values appear to be present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("FIREBASE INITIALIZATION ERROR: API Key or Project ID is missing. Check your .env.local file and restart the server.");
} else {
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase Init: CRITICAL ERROR during initializeApp(firebaseConfig):", e);
      app = undefined;
    }
  } else {
    app = getApps()[0]!;
  }
}

// Initialize Auth and Firestore only if app was successfully initialized
if (app) {
  try {
    auth = getAuth(app);
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getAuth(app):", e);
    auth = undefined;
  }

  try {
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getFirestore(app):", e);
    db = undefined;
  }
} else {
  console.error("Firebase Init: Firebase app was NOT initialized. Auth and Firestore will not be available.");
  auth = undefined;
  db = undefined;
}

export { app, auth, db };
