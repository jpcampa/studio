
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
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Send email verification
    // await sendEmailVerification(firebaseUser);

    // Store additional user data in Firestore
    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, {
      uid: firebaseUser.uid,
      name,
      email, // Storing email here too for easier access if needed, though it's in Auth
      ageRange: ageRange || null,
      gender: gender || null,
      initialEmotionalState: initialEmotionalState || null,
      createdAt: serverTimestamp(),
    });

    return { message: "Registro exitoso. Se ha enviado un correo de verificación (funcionalidad simulada)." };
  } catch (error: any) {
    let errorMessage = "Error al registrar el usuario.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Este correo electrónico ya está en uso.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña es demasiado débil.";
    }
    console.error("Firebase registration error:", error);
    return { message: errorMessage, errors: {} }; // Provide general error
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // User state will be handled by onAuthStateChanged in UserContext
    return { message: "Inicio de sesión exitoso." };
  } catch (error: any) {
    let errorMessage = "Error al iniciar sesión.";
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      errorMessage = "Correo electrónico o contraseña incorrectos.";
    }
    console.error("Firebase login error:", error);
    return { message: errorMessage, errors: {} }; // Provide general error
  }
}
