
"use server";

import { z } from "zod";
import { encryptDataAES } from "@/lib/encryption";

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
  user?: ActionUser | null;
  generatedApiUrl?: string | null; // For testing: to display the generated URL
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
  
  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;

  // In a real app, user data would be saved to a database here.
  // For simulation, we construct the user object to be returned.
  const newUser: ActionUser = {
    id: crypto.randomUUID(),
    name,
    email,
    ageRange: ageRange || null,
    gender: gender || null,
    initialEmotionalState: initialEmotionalState || null,
  };

  console.log("Simulated RegisterUser action: Validation successful. Preparing API call for external service.");

  let generatedApiUrlForTest: string | null = null;

  try {
    const emailToEncrypt = { value: email };
    const passwordToEncrypt = { value: password }; // Encrypt the actual password

    const encryptedEmailPayload = encryptDataAES(emailToEncrypt);
    const encryptedPasswordPayload = encryptDataAES(passwordToEncrypt);

    const finalEncryptedEmailForUrl = encodeURIComponent(encryptedEmailPayload);
    const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);
    
    const apiKey = "4463"; // Hardcoded as per example
    const type = "registro";
    const baseUrl = "http://workwell.hl1448.dinaserver.com/wp-content/programacion/wscontenido.php";
    
    generatedApiUrlForTest = `${baseUrl}?apikey=${apiKey}&tipo=${type}&usuario=${finalEncryptedEmailForUrl}&password=${finalEncryptedPasswordForUrl}`;
    
    console.log("Simulated RegisterUser action: Constructed API URL (for testing):", generatedApiUrlForTest);

    // Perform the fetch call to the external API
    console.log("Simulated RegisterUser action: Attempting to call external API...");
    const apiResponse = await fetch(generatedApiUrlForTest);
    
    if (apiResponse.ok) {
      const responseText = await apiResponse.text(); // Or .json() if it returns JSON
      console.log("Simulated RegisterUser action: External API call successful. Response:", responseText);
      // Potentially handle success (e.g., if API confirms registration)
    } else {
      const errorText = await apiResponse.text();
      console.error(`Simulated RegisterUser action: External API call failed. Status: ${apiResponse.status}. Response: ${errorText}`);
      // Potentially handle failure (e.g., if API rejects registration)
      // For now, we'll still proceed with local registration success for the app demo.
    }
  } catch (error) {
    console.error("Simulated RegisterUser action: Error during external API call:", error);
    // Decide if this error should prevent user creation in your app or just be logged.
    // For now, we log and continue.
  }

  console.log("Simulated RegisterUser action: Created user:", newUser);
  return { 
    message: "Registro exitoso. Serás redirigido.", 
    user: newUser,
    generatedApiUrl: generatedApiUrlForTest 
  };
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
    // Derivamos el nombre del email para esta simulación de login directo.
    // El nombre completo del registro se usaría si el flujo de registro inicia sesión al usuario.
    const simulatedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const user: ActionUser = {
      id: crypto.randomUUID(), 
      name: simulatedName,
      email: email,
      ageRange: "18_24", // Default/random values
      gender: "other", // Default/random values
      initialEmotionalState: Math.floor(Math.random() * 5) + 1, // Default/random values
    };
    console.log("Simulated LoginUser action: Dynamic user login successful.", user);
    return { message: "Inicio de sesión exitoso.", user };
  }
}
