
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

// Check for missing environment variables and log them by their expected NAMES
const missingEnvVarNames: string[] = [];
(Object.keys(ENV_VAR_NAMES) as Array<keyof typeof ENV_VAR_NAMES>).forEach((key) => {
  const envVarName = ENV_VAR_NAMES[key]; // e.g., "NEXT_PUBLIC_FIREBASE_API_KEY"
  if (!process.env[envVarName]) { // Checks if process.env.NEXT_PUBLIC_FIREBASE_API_KEY is missing
    missingEnvVarNames.push(envVarName); // Pushes the NAME of the missing variable
  }
});

if (missingEnvVarNames.length > 0) {
  console.error(
    "FIREBASE INITIALIZATION ERROR: The following Firebase environment variables are missing or empty. " +
    "For local development, ensure they are correctly set in your .env.local file (in the project root) " +
    "AND that you have RESTARTED your Next.js development server after changes. " +
    "For deployment, ensure they are set in your hosting provider's environment variable settings. Missing variable NAMES:",
    missingEnvVarNames.join(", ")
  );
}

// Log the configuration that will be attempted (partially hiding sensitive values for safety in logs)
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
let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

// Proceed with initialization only if essential config values appear to be present
// (this is a basic check; Firebase SDK will do more thorough validation)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("CRITICAL Firebase Init Error: API Key or Project ID is definitively missing from the config object. Firebase will not be initialized. Check environment variables and restart your server/deployment.");
} else {
  // Check if Firebase has already been initialized
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase Init: Firebase app initialized successfully. App Name:", app.name);
    } catch (e) {
      console.error("Firebase Init: CRITICAL ERROR during initializeApp(firebaseConfig):", e);
      console.error("Firebase Init: Config used was:", firebaseConfig); // Log the actual config used
      app = undefined; // Ensure app is undefined if initialization fails
    }
  } else {
    app = getApps()[0]!; // Use the already initialized app
    console.log("Firebase Init: Firebase app already initialized, using existing instance. App Name:", app.name);
  }
}


// Initialize Auth and Firestore only if app was successfully initialized
if (app) {
  try {
    auth = getAuth(app);
    console.log("Firebase Init: Firebase Auth initialized successfully.");
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getAuth(app):", e);
    auth = undefined; // Ensure auth is undefined if initialization fails
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Init: Firestore initialized successfully.");
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getFirestore(app):", e);
    db = undefined; // Ensure db is undefined if initialization fails
  }
} else {
  if (missingEnvVarNames.length === 0 && firebaseConfig.apiKey && firebaseConfig.projectId) {
    // This case means initializeApp itself failed for other reasons if config seemed present
    console.error("Firebase Init: Firebase app was NOT initialized despite environment variables appearing to be set. Auth and Firestore will not be available. Check for other errors from initializeApp.");
  } else {
     console.error("Firebase Init: Firebase app was NOT initialized, likely due to missing environment variables. Auth and Firestore will not be available.");
  }
  // Ensure auth and db are explicitly undefined if app didn't initialize
  auth = undefined;
  db = undefined;
}

export { app, auth, db };
    