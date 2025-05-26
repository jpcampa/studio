
"use server";

import { z } from "zod";

// Define the User interface that actions will deal with
// This should be compatible with the User interface in UserContext
export interface ActionUser {
  id: string;
  name: string;
  email: string;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

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

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    ageRange?: string[];
    gender?: string[];
    initialEmotionalState?: string[];
    agreeTerms?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  console.log("Simulated RegisterUser action: Initiated.");
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("Simulated RegisterUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }
  console.log("Simulated RegisterUser action: Validation successful for email:", validatedFields.data.email);
  // In a real app, user data would be saved here.
  return { message: "Registro simulado exitoso. Por favor, inicia sesión." };
}


export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null; // Include user for successful login
};


export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  console.log("Simulated LoginUser action: Initiated.");
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("Simulated LoginUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  const { email, password } = validatedFields.data;
  console.log(`Simulated LoginUser action: Validation successful for email: ${email}.`);

  // Simulate user check
  if (email === 'user@example.com' && password === 'password123') {
    const user: ActionUser = {
      id: 'simulated-id-1',
      name: 'Usuarie Ejemplo',
      email: 'user@example.com',
      ageRange: "25_34",
      gender: "prefer_not_to_say",
      initialEmotionalState: 3,
    };
    console.log("Simulated LoginUser action: Hardcoded user login successful.");
    return { message: "Inicio de sesión exitoso.", user };
  } else {
     // For demo, accept any other valid email/password if not the hardcoded one
     // This allows login after a simulated registration
    console.log(`Simulated LoginUser action: Attempting login for non-hardcoded user: ${email}`);
    const simulatedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const user: ActionUser = {
      id: crypto.randomUUID(), // Generate a random ID for other users
      name: simulatedName,
      email: email,
      // You can add default/random values for other fields if needed
      ageRange: "18_24",
      gender: "other",
      initialEmotionalState: Math.floor(Math.random() * 5) + 1,
    };
    console.log("Simulated LoginUser action: Dynamic user login successful.", user);
    return { message: "Inicio de sesión exitoso.", user };
  }

  // This part might not be reached if the above 'else' catches all other valid formats
  // console.log("Simulated LoginUser action: Credentials invalid.");
  // return { message: "Credenciales inválidas." };
}
