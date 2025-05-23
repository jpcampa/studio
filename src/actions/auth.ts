
"use server";

import { z } from "zod";
import { User } from "@/contexts/UserContext";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  initialEmotionalState: z.coerce.number().min(1).max(5).optional(),
  agreeTerms: z.preprocess(
    (val) => val === "on" || val === true, // HTML checkbox envía "on" o booleano
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

  // Simulate database interaction & email verification
  console.log("Registering user:", validatedFields.data);
  
  // In a real app, you'd save to DB and send verification email.
  // For this mock, we'll assume success.
  const mockUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    ageRange: validatedFields.data.ageRange,
    gender: validatedFields.data.gender,
    initialEmotionalState: validatedFields.data.initialEmotionalState,
  };

  return { user: mockUser, message: "Registro exitoso. Por favor, inicia sesión." };
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

  // Simulate checking credentials
  console.log("Logging in user:", validatedFields.data);
  
  // For mock purposes, "successfully" log in any user that passes schema validation.
  // In a real app, you would check credentials against a database.
  const emailPrefix = validatedFields.data.email.split('@')[0] || "Usuarie";
  const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  
  const mockUser: User = {
    id: Math.random().toString(36).substr(2, 9), // Generate a dynamic ID
    name: displayName, // Use the capitalized email prefix or a default
    email: validatedFields.data.email,
    // Other user fields (ageRange, gender, etc.) are not part of the login form,
    // so they won't be populated here. They are optional in the User interface.
  };
  return { user: mockUser, message: "Inicio de sesión exitoso." };
}

