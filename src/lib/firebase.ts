
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// These values are read from your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Enhanced debugging for Firebase initialization
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase().replace("FIREBASE_","FIREBASE_")}`);

if (missingVars.length > 0) {
  console.error(
    "FIREBASE INITIALIZATION ERROR: The following Firebase environment variables are missing or empty in your .env.local file:",
    missingVars.join(", ")
  );
  console.error(
    "Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in .env.local and that you have RESTARTED your Next.js development server."
  );
}

const configForLogging = {
  apiKey: firebaseConfig.apiKey ? `AIzaSy...${firebaseConfig.apiKey.slice(-5)} (present)` : 'MISSING_OR_EMPTY!',
  authDomain: firebaseConfig.authDomain || 'MISSING_OR_EMPTY!',
  projectId: firebaseConfig.projectId || 'MISSING_OR_EMPTY!',
  storageBucket: firebaseConfig.storageBucket || 'MISSING_OR_EMPTY!',
  messagingSenderId: firebaseConfig.messagingSenderId || 'MISSING_OR_EMPTY!',
  appId: firebaseConfig.appId || 'MISSING_OR_EMPTY!',
};
console.log("Firebase Init - Attempting to use Config:", configForLogging);


// Initialize Firebase
let app: FirebaseApp | undefined = undefined; // Initialize as undefined
let auth: Auth | undefined = undefined; // Initialize as undefined
let db: Firestore | undefined = undefined; // Initialize as undefined

if (Object.values(configForLogging).some(value => value === 'MISSING_OR_EMPTY!')) {
    console.error("CRITICAL Firebase Init Error: One or more Firebase config values are missing or empty. Firebase will not be initialized correctly. Please check .env.local and restart your server.");
}

// Check if Firebase has already been initialized
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("CRITICAL Firebase Init Error: API Key or Project ID is definitively missing from the config object passed to initializeApp. Check .env.local and server restart.");
  }
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase Init: Firebase app initialized successfully. App Name:", app.name);
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during initializeApp(firebaseConfig):", e);
    console.error("Firebase Init: Config used was:", firebaseConfig);
    app = undefined; // Ensure app is undefined if init fails
  }
} else {
  app = getApps()[0]!;
  console.log("Firebase Init: Firebase app already initialized, using existing instance. App Name:", app.name);
}

// Initialize Auth and Firestore only if app was successfully initialized
if (app) {
  try {
    auth = getAuth(app);
    console.log("Firebase Init: Firebase Auth initialized successfully.");
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getAuth(app):", e);
    auth = undefined; // Ensure auth is undefined if init fails
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Init: Firestore initialized successfully.");
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getFirestore(app):", e);
    db = undefined; // Ensure db is undefined if init fails
  }
} else {
  console.error("Firebase Init: Firebase app was not initialized. Auth and Firestore will not be available.");
  auth = undefined;
  db = undefined;
}

export { app, auth, db };
