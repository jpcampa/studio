
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
  .map(([key]) => `NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase().replace("FIREBASE_","FIREBASE_")}`); // Reconstruct env var name

if (missingVars.length > 0) {
  console.error(
    "FIREBASE INITIALIZATION ERROR: The following Firebase environment variables are missing or empty in your .env.local file:",
    missingVars.join(", ")
  );
  console.error(
    "Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in .env.local and that you have RESTARTED your Next.js development server."
  );
}

// Log the config being used (masking API key for safety in logs, though it's client-side)
const configForLogging = { 
  ...firebaseConfig, 
  apiKey: firebaseConfig.apiKey ? `AIzaSy...${firebaseConfig.apiKey.slice(-5)} (present)` : 'MISSING!' 
};
console.log("Firebase Init - Attempting to use Config:", configForLogging);


// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if Firebase has already been initialized
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) { // Basic check
    console.error("CRITICAL Firebase Init Error: API Key or Project ID is definitively missing from the config object passed to initializeApp. Check .env.local and server restart.");
    // To prevent further errors, we might avoid initializing if critical parts are missing
    // However, Firebase itself will throw an error, which is what we're seeing.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };

