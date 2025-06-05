
"use server";

import { z } from "zod";
import { encryptDataAES, decryptDataAES } from "@/lib/encryption";

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

// Schema for the expected user data from the API on successful login
const ApiLoginSuccessDataSchema = z.object({
  id: z.string().min(1, "El ID de usuario de la API no puede estar vacío."),
  name: z.string().min(1, "El nombre de usuario de la API no puede estar vacío."),
  email: z.string().email("El email de la API es inválido."),
  ageRange: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  initialEmotionalState: z.number().min(1).max(5).nullable().optional(),
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
  debugApiUrl?: string;
};

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: any; // Can be user details object or null
}

const API_TIMEOUT_MS = 15000; // 15 seconds
const API_BASE_URL = "http://workwell.hl1448.dinaserver.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  console.log("RegisterUser action: Initiated.");
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.warn("RegisterUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación en los datos ingresados.",
      user: null,
    };
  }
  
  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;

  console.log("RegisterUser action: Validation successful. Preparing for external API call.");
  
  const userId = crypto.randomUUID(); 

  const userDetailsToEncrypt = {
    id: userId,
    name,
    email,
    ageRange: ageRange || null,
    gender: gender || null,
    initialEmotionalState: initialEmotionalState || null,
  };
  const passwordToEncrypt = { value: password };

  const encryptedUserDetailsPayload = encryptDataAES(userDetailsToEncrypt);
  const encryptedPasswordPayload = encryptDataAES(passwordToEncrypt);

  const finalEncryptedUserDetailsForUrl = encodeURIComponent(encryptedUserDetailsPayload);
  const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);
  
  const type = "registro";
  
  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedUserDetailsForUrl}&password=${finalEncryptedPasswordForUrl}`;
  console.log("RegisterUser action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=ENCRYPTED_DETAILS&password=ENCRYPTED_PASSWORD`);


  try {
    console.log("RegisterUser action: Attempting to call external API. URL:", generatedApiUrl.substring(0,150) + "...");
    
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const apiResponse = await fetch(generatedApiUrl, { signal });
    
    let responseText = "";
    try {
        responseText = await apiResponse.text();
        console.log("RegisterUser action: External API call status:", apiResponse.status, "Raw Response Text:", responseText);
    } catch (textError: any) {
        console.warn(`RegisterUser action: External API call failed or could not read text. Status: ${apiResponse.status}. Error reading text:`, textError.message);
        return {
            message: `Error del servicio externo (HTTP ${apiResponse.status}): No se pudo leer la respuesta.`,
            errors: { _form: [`El servicio de registro devolvió un error (HTTP ${apiResponse.status}) y no se pudo leer el cuerpo. Inténtalo más tarde.`] },
            user: null,
            debugApiUrl: generatedApiUrl,
        };
    }

    if (!apiResponse.ok) {
      console.warn(`RegisterUser action: External API call failed. Status: ${apiResponse.status}. Response: ${responseText}`);
      return {
        message: `Error del servicio externo (HTTP ${apiResponse.status}): ${responseText.substring(0,100)}`,
        errors: { _form: [`El servicio de registro devolvió un error (HTTP ${apiResponse.status}). Inténtalo más tarde.`] },
        user: null,
        debugApiUrl: generatedApiUrl,
      };
    }

    let apiResult: ExternalApiResponse;
    try {
      apiResult = JSON.parse(responseText);
      console.log("RegisterUser action: Parsed API Response JSON:", apiResult);
    } catch (jsonError: any) {
      console.warn("RegisterUser action: Failed to parse JSON response from external API.", jsonError, "Raw text was:", responseText);
      return {
        message: "Error al procesar la respuesta del servicio de registro. Respuesta no válida.",
        errors: { _form: ["El servicio de registro devolvió una respuesta inesperada. Inténtalo más tarde."] },
        user: null,
        debugApiUrl: generatedApiUrl,
      };
    }

    if (apiResult.status === "OK") {
      console.log("RegisterUser action: External API reported 'OK'. Registration successful. User should now log in.");
      return { 
        message: "¡Registro completado! Ahora puedes iniciar sesión.", 
        user: null, 
        debugApiUrl: generatedApiUrl,
      };
    } else if (apiResult.status === "NOOK") {
      console.warn("RegisterUser action: External API reported 'NOOK'. Message:", apiResult.message);
      return {
        message: apiResult.message || "El servicio de registro externo indicó un problema.",
        errors: { _form: [apiResult.message || "No se pudo completar el registro con el servicio externo."] },
        user: null,
        debugApiUrl: generatedApiUrl,
      };
    } else {
      console.warn("RegisterUser action: External API reported an unknown status.", apiResult);
      return {
        message: "Respuesta desconocida del servicio de registro externo.",
        errors: { _form: ["El servicio de registro externo devolvió un estado inesperado."] },
        user: null,
        debugApiUrl: generatedApiUrl,
      };
    }

  } catch (error: any) {
    console.warn("RegisterUser action: Error during external API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante el registro.";

    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = "No se pudo conectar con el servicio de registro (tiempo de espera agotado).";
        console.warn("RegisterUser action: API call timed out after", API_TIMEOUT_MS, "ms.");
    } else if (error.message && error.message.includes('fetch failed')) { 
        errorMessage = "Fallo en la comunicación con el servicio de registro. Verifica tu conexión o el estado del servicio externo.";
    }
    
    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      user: null,
      debugApiUrl: generatedApiUrl, 
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
  debugLoginApiUrl?: string;
};


export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  console.log("LoginUser action: Initiated.");
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.warn("LoginUser action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
      user: null
    };
  }

  const { email, password } = validatedFields.data;
  console.log(`LoginUser action: Validation successful for email: ${email}. Preparing for external API call.`);

  const loginDetailsToEncrypt = { email: email };
  const passwordToEncrypt = { value: password };

  let encryptedLoginDetailsPayload, encryptedPasswordPayload;
  try {
    encryptedLoginDetailsPayload = encryptDataAES(loginDetailsToEncrypt);
    encryptedPasswordPayload = encryptDataAES(passwordToEncrypt);
  } catch (encError: any) {
    console.error("LoginUser action: Error during encryption:", encError);
    return { 
        message: "Error interno al preparar los datos para el inicio de sesión.",
        errors: { _form: ["No se pudieron encriptar las credenciales de forma segura."] },
        user: null 
    };
  }

  const finalEncryptedLoginDetailsForUrl = encodeURIComponent(encryptedLoginDetailsPayload);
  const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);
  
  const type = "login";
  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedLoginDetailsForUrl}&password=${finalEncryptedPasswordForUrl}`;
  console.log("LoginUser action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=ENCRYPTED_EMAIL&password=ENCRYPTED_PASSWORD`);

  try {
    console.log("LoginUser action: Attempting to call external API. URL:", generatedApiUrl.substring(0,150) + "...");
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const apiResponse = await fetch(generatedApiUrl, { signal });

    let responseText = "";
    try {
        responseText = await apiResponse.text();
        console.log("LoginUser action: External API call status:", apiResponse.status, "Raw Response Text:", responseText);
    } catch (textError: any) {
        console.warn(`LoginUser action: External API call failed or could not read text. Status: ${apiResponse.status}. Error reading text:`, textError.message);
        return {
            message: `Error del servicio de inicio de sesión (HTTP ${apiResponse.status}): No se pudo leer la respuesta.`,
            errors: { _form: [`El servicio de inicio de sesión devolvió un error (HTTP ${apiResponse.status}) y no se pudo leer el cuerpo. Inténtalo más tarde.`] },
            user: null,
            debugLoginApiUrl: generatedApiUrl,
        };
    }

    if (!apiResponse.ok) {
      console.warn(`LoginUser action: External API call failed. Status: ${apiResponse.status}. Response: ${responseText}`);
      return {
        message: `Error del servicio de inicio de sesión (HTTP ${apiResponse.status}): ${responseText.substring(0,100)}`,
        errors: { _form: [`El servicio de inicio de sesión devolvió un error (HTTP ${apiResponse.status}). Inténtalo más tarde.`] },
        user: null,
        debugLoginApiUrl: generatedApiUrl,
      };
    }

    let apiResult: ExternalApiResponse;
    try {
      apiResult = JSON.parse(responseText);
      console.log("LoginUser action: Parsed API Response JSON:", apiResult);
    } catch (jsonError: any) {
      console.warn("LoginUser action: Failed to parse JSON response from external API.", jsonError, "Raw text was:", responseText);
      return {
        message: "Error al procesar la respuesta del servicio de inicio de sesión. Respuesta no válida.",
        errors: { _form: ["El servicio de inicio de sesión devolvió una respuesta inesperada."] },
        user: null,
        debugLoginApiUrl: generatedApiUrl,
      };
    }

    if (apiResult.status === "OK") {
      if (apiResult.data) {
        const validatedApiUserData = ApiLoginSuccessDataSchema.safeParse(apiResult.data);
        if (validatedApiUserData.success) {
          const userFromApi: ActionUser = {
            id: validatedApiUserData.data.id,
            name: validatedApiUserData.data.name,
            email: validatedApiUserData.data.email,
            ageRange: validatedApiUserData.data.ageRange || null,
            gender: validatedApiUserData.data.gender || null,
            initialEmotionalState: validatedApiUserData.data.initialEmotionalState || null,
          };
          console.log("LoginUser action: External API reported 'OK' and provided valid user data. Login successful.");
          return { 
            message: "Inicio de sesión exitoso.", 
            user: userFromApi,
            debugLoginApiUrl: generatedApiUrl,
          };
        } else {
          console.warn("LoginUser action: External API reported 'OK' but user data is invalid/incomplete.", validatedApiUserData.error.flatten().fieldErrors, "Received data:", apiResult.data);
          return {
            message: "Respuesta de inicio de sesión incompleta o inválida del servicio externo.",
            errors: { _form: ["El servicio externo devolvió datos de usuario inesperados."] },
            user: null,
            debugLoginApiUrl: generatedApiUrl,
          };
        }
      } else {
         console.warn("LoginUser action: External API reported 'OK' but 'data' field is null or missing. Cannot complete login.");
          return {
            message: "El servicio de inicio de sesión no devolvió los datos del usuario.",
            errors: { _form: ["El servicio externo no proporcionó la información necesaria para iniciar sesión."] },
            user: null,
            debugLoginApiUrl: generatedApiUrl,
          };
      }
    } else if (apiResult.status === "NOOK") {
      console.warn("LoginUser action: External API reported 'NOOK'. Message:", apiResult.message);
      return {
        message: apiResult.message || "Credenciales inválidas o error del servicio externo.",
        errors: { _form: [apiResult.message || "No se pudo iniciar sesión con el servicio externo."] },
        user: null,
        debugLoginApiUrl: generatedApiUrl,
      };
    } else {
      console.warn("LoginUser action: External API reported an unknown status.", apiResult);
      return {
        message: "Respuesta desconocida del servicio de inicio de sesión externo.",
        errors: { _form: ["El servicio externo devolvió un estado inesperado."] },
        user: null,
        debugLoginApiUrl: generatedApiUrl,
      };
    }

  } catch (error: any) {
    console.warn("LoginUser action: Error during external API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante el inicio de sesión.";

    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = "No se pudo conectar con el servicio de inicio de sesión (tiempo de espera agotado).";
        console.warn("LoginUser action: API call timed out after", API_TIMEOUT_MS, "ms.");
    } else if (error.message && error.message.includes('fetch failed')) { 
        errorMessage = "Fallo en la comunicación con el servicio de inicio de sesión. Verifica tu conexión o el estado del servicio externo.";
    }
    
    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      user: null,
      debugLoginApiUrl: generatedApiUrl,
    };
  }
}

    