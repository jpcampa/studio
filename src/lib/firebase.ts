
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Define the EXPECTED NAMES of the environment variables
const EXPECTED_ENV_VARS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

// Your web app's Firebase configuration
// These values are read from your .env.local file (for local development)
// or from the hosting environment variables (for deployment).
const firebaseConfig = {
  apiKey: process.env[EXPECTED_ENV_VARS.apiKey],
  authDomain: process.env[EXPECTED_ENV_VARS.authDomain],
  projectId: process.env[EXPECTED_ENV_VARS.projectId],
  storageBucket: process.env[EXPECTED_ENV_VARS.storageBucket],
  messagingSenderId: process.env[EXPECTED_ENV_VARS.messagingSenderId],
  appId: process.env[EXPECTED_ENV_VARS.appId],
};

// Enhanced debugging for Firebase initialization
const missingEnvVarNames: string[] = [];
(Object.keys(EXPECTED_ENV_VARS) as Array<keyof typeof EXPECTED_ENV_VARS>).forEach((key) => {
  const envVarName = EXPECTED_ENV_VARS[key];
  if (!process.env[envVarName]) { // Check if process.env.NEXT_PUBLIC_FIREBASE_... is missing
    missingEnvVarNames.push(envVarName); // Log the expected environment variable NAME
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

if (missingEnvVarNames.length > 0 || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("CRITICAL Firebase Init Error: One or more Firebase config values are missing or empty. Firebase will not be initialized correctly. Please check environment variables and restart your server/deployment.");
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("CRITICAL Firebase Init Error: API Key or Project ID is definitively missing from the config object passed to initializeApp. Check .env.local (for local dev) or hosting environment variables (for deployment) and server restart.");
    }
} else {
  // Check if Firebase has already been initialized
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase Init: Firebase app initialized successfully. App Name:", app.name);
    } catch (e) {
      console.error("Firebase Init: CRITICAL ERROR during initializeApp(firebaseConfig):", e);
      console.error("Firebase Init: Config used was:", firebaseConfig); // Log the actual config used
      app = undefined;
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
    auth = undefined;
  }

  try {
    db = getFirestore(app);
    console.log("Firebase Init: Firestore initialized successfully.");
  } catch (e) {
    console.error("Firebase Init: CRITICAL ERROR during getFirestore(app):", e);
    db = undefined;
  }
} else {
  if (missingEnvVarNames.length === 0 && firebaseConfig.apiKey && firebaseConfig.projectId) {
    // This case means initializeApp itself failed for other reasons if config seemed present
    console.error("Firebase Init: Firebase app was not initialized despite environment variables appearing to be set. Auth and Firestore will not be available.");
  } else {
    // This case means env vars were indeed missing as detected by missingEnvVarNames
     console.error("Firebase Init: Firebase app was not initialized due to missing environment variables. Auth and Firestore will not be available.");
  }
  auth = undefined;
  db = undefined;
}

export { app, auth, db };
