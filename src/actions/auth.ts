
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
};

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: null | any; // Assuming data is null based on example
}

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  console.log("RegisterUser action: Initiated.");
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error("RegisterUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación en los datos ingresados.",
      user: null,
    };
  }
  
  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;

  console.log("RegisterUser action: Validation successful. Preparing for external API call.");

  try {
    const emailToEncrypt = { value: email };
    const passwordToEncrypt = { value: password };

    const encryptedEmailPayload = encryptDataAES(emailToEncrypt);
    const encryptedPasswordPayload = encryptDataAES(passwordToEncrypt);

    const finalEncryptedEmailForUrl = encodeURIComponent(encryptedEmailPayload);
    const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);
    
    const apiKey = "4463";
    const type = "registro";
    const baseUrl = "http://workwell.hl1448.dinaserver.com/wp-content/programacion/wscontenido.php";
    
    const generatedApiUrl = `${baseUrl}?apikey=${apiKey}&tipo=${type}&usuario=${finalEncryptedEmailForUrl}&password=${finalEncryptedPasswordForUrl}`;
    console.log("RegisterUser action: Constructed API URL (for server logging):", generatedApiUrl);

    console.log("RegisterUser action: Attempting to call external API...");
    const apiResponse = await fetch(generatedApiUrl);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text().catch(() => "No se pudo leer el cuerpo del error.");
      console.error(`RegisterUser action: External API call failed. Status: ${apiResponse.status}. Response: ${errorText}`);
      return {
        message: `Error del servicio externo (HTTP ${apiResponse.status}): ${errorText.substring(0,100)}`,
        errors: { _form: [`El servicio de registro devolvió un error (HTTP ${apiResponse.status}). Inténtalo más tarde.`] },
        user: null,
      };
    }

    let apiResult: ExternalApiResponse;
    try {
      apiResult = await apiResponse.json();
      console.log("RegisterUser action: External API call successful. Parsed Response:", apiResult);
    } catch (jsonError) {
      console.error("RegisterUser action: Failed to parse JSON response from external API.", jsonError);
      const responseText = await apiResponse.text().catch(() => "No se pudo leer la respuesta de texto."); 
      console.error("RegisterUser action: Raw text response from API:", responseText);
      return {
        message: "Error al procesar la respuesta del servicio de registro. Respuesta no válida.",
        errors: { _form: ["El servicio de registro devolvió una respuesta inesperada. Inténtalo más tarde."] },
        user: null,
      };
    }

    if (apiResult.status === "OK") {
      console.log("RegisterUser action: External API reported 'OK'. Registration successful. User should now log in.");
      return { 
        message: "¡Registro completado! Ahora puedes iniciar sesión.", 
        user: null, // User is not returned, login is a separate step
      };
    } else if (apiResult.status === "NOOK") {
      console.error("RegisterUser action: External API reported 'NOOK'. Message:", apiResult.message);
      return {
        message: apiResult.message || "El servicio de registro externo indicó un problema.",
        errors: { _form: [apiResult.message || "No se pudo completar el registro con el servicio externo."] },
        user: null,
      };
    } else {
      console.error("RegisterUser action: External API reported an unknown status.", apiResult);
      return {
        message: "Respuesta desconocida del servicio de registro externo.",
        errors: { _form: ["El servicio de registro externo devolvió un estado inesperado."] },
        user: null,
      };
    }

  } catch (error: any) {
    console.error("RegisterUser action: Error during external API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante el registro.";
    if (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT') { 
        errorMessage = "No se pudo conectar con el servicio de registro (tiempo de espera agotado).";
    } else if (error.message.includes('fetch failed')) { 
        errorMessage = "Fallo en la comunicación con el servicio de registro. Verifica tu conexión.";
    }
    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      user: null,
    };
  }
}


export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null; 
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
    console.log(`Simulated LoginUser action: Attempting login for non-hardcoded user: ${email}`);
    const simulatedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const user: ActionUser = {
      id: crypto.randomUUID(), 
      name: simulatedName,
      email: email,
      ageRange: "18_24", 
      gender: "other", 
      initialEmotionalState: Math.floor(Math.random() * 5) + 1, 
    };
    console.log("Simulated LoginUser action: Dynamic user login successful.", user);
    return { message: "Inicio de sesión exitoso.", user };
  }
}

