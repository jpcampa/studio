
"use server";

import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "@/contexts/UserContext"; // Ensure User type is available

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  initialEmotionalState: z.coerce.number().min(1).max(5).optional(),
  agreeTerms: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones para registrarte.",
    })
  ),
});

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

export async function registerUser(prevState: any, formData: FormData) {
  console.log("RegisterUser action: Initiated.");
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("RegisterUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;
  console.log(`RegisterUser action: Validation successful for email: ${email}. Proceeding to Firebase Auth.`);

  if (!auth || !db) {
    console.error("RegisterUser action: Firebase auth or db service is not available.");
    return { message: "Servicio de Firebase no disponible. Contacta al administrador.", errors: {} };
  }

  try {
    console.log("RegisterUser action: Calling createUserWithEmailAndPassword...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log(`RegisterUser action: User successfully created in Firebase Auth. UID: ${firebaseUser.uid}`);

    // Email verification (optional, currently commented out)
    // console.log(`RegisterUser action: Attempting to send email verification to: ${firebaseUser.email}`);
    // await sendEmailVerification(firebaseUser);
    // console.log(`RegisterUser action: Email verification sent (or call skipped).`);

    const userDocRef = doc(db, "users", firebaseUser.uid);
    console.log(`RegisterUser action: Preparing to store user data in Firestore for UID: ${firebaseUser.uid}`);
    await setDoc(userDocRef, {
      uid: firebaseUser.uid,
      name,
      email,
      ageRange: ageRange || null,
      gender: gender || null,
      initialEmotionalState: initialEmotionalState || null,
      createdAt: serverTimestamp(),
    });
    console.log(`RegisterUser action: User data successfully stored in Firestore for UID: ${firebaseUser.uid}`);

    return { message: "Registro exitoso. Se ha enviado un correo de verificación (funcionalidad simulada)." };
  } catch (error: any) {
    let errorMessage = "Error al registrar el usuario.";
    console.error("RegisterUser action: Firebase registration process error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    if (error.code) { 
      errorMessage = `Error de Firebase (${error.code}): ${error.message}`;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este correo electrónico ya está en uso.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es demasiado débil (debe tener al menos 6 caracteres).";
          break;
        case "auth/invalid-email":
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
      }
    } else if (error instanceof Error) { 
        errorMessage = error.message;
    }
    
    console.error("RegisterUser action: Processed error message to be returned to client:", errorMessage);
    return { message: errorMessage, errors: {} };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  console.log("LoginUser action: Initiated.");
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("LoginUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  const { email, password } = validatedFields.data;
  console.log(`LoginUser action: Validation successful for email: ${email}. Proceeding to Firebase Auth.`);

  if (!auth) {
    console.error("LoginUser action: Firebase auth service is not available.");
    return { message: "Servicio de Firebase no disponible. Contacta al administrador.", errors: {} };
  }

  try {
    console.log("LoginUser action: Calling signInWithEmailAndPassword...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`LoginUser action: signInWithEmailAndPassword successful. UserCredential User UID: ${userCredential?.user?.uid}`);
    // User state will be handled by onAuthStateChanged in UserContext on the client
    return { message: "Inicio de sesión exitoso." };
  } catch (error: any) {
    let errorMessage = "Error al iniciar sesión.";
    console.error("LoginUser action: Firebase login process error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    if (error.code) { 
      errorMessage = `Error de Firebase (${error.code}): ${error.message}`;
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential": 
          errorMessage = "Correo electrónico o contraseña incorrectos.";
          break;
        case "auth/invalid-email":
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
      }
    } else if (error instanceof Error) { 
        errorMessage = error.message;
    }
    console.error("LoginUser action: Processed error message to be returned to client:", errorMessage);
    return { message: errorMessage, errors: {} };
  }
}
