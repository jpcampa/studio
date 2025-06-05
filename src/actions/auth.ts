
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
// 'name' and 'email' fields in the API's 'data' object are themselves objects
// like: { value: "ENCRYPTED_JSON_STRING" }
// The ENCRYPTED_JSON_STRING, when decrypted, yields the actual name/email string.
const ApiLoginSuccessDataSchema = z.object({
  id: z.string().min(1, "El ID de usuario de la API no puede estar vacío."),
  name: z.object({
    value: z.string().min(1, "El valor encriptado del nombre en la API no puede estar vacío.")
  }),
  email: z.object({
    value: z.string().min(1, "El valor encriptado del email en la API no puede estar vacío.")
  }),
  ageRange: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  initialEmotionalState: z.coerce.number().min(1).max(5).nullable().optional(),
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
      debugApiUrl: undefined,
    };
  }
  
  const { name, email, password, ageRange, gender, initialEmotionalState } = validatedFields.data;

  console.log("RegisterUser action: Validation successful. Preparing for external API call.");
  
  const userId = crypto.randomUUID(); 

  const userDetailsToEncrypt = {
    id: userId, // Include the generated ID
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
      user: null,
      debugLoginApiUrl: undefined,
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
        user: null,
        debugLoginApiUrl: undefined,
    };
  }

  const finalEncryptedLoginDetailsForUrl = encodeURIComponent(encryptedLoginDetailsPayload);
  const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);
  
  const type = "login";
  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedLoginDetailsForUrl}&password=${finalEncryptedPasswordForUrl}`;
  console.log("LoginUser action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=ENCRYPTED_EMAIL_DETAILS&password=ENCRYPTED_PASSWORD`);

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
          console.log("LoginUser action: Input for name decryption:", validatedApiUserData.data.name.value);
          const decryptedName = decryptDataAES(validatedApiUserData.data.name.value);
          const actualName = (decryptedName && typeof decryptedName === 'string') ? decryptedName : null;
          console.log("LoginUser action: Decrypted name result:", actualName);

          console.log("LoginUser action: Input for email decryption:", validatedApiUserData.data.email.value);
          const decryptedEmail = decryptDataAES(validatedApiUserData.data.email.value);
          const actualEmail = (decryptedEmail && typeof decryptedEmail === 'string') ? decryptedEmail : null;
          console.log("LoginUser action: Decrypted email result:", actualEmail);
          
          if (!actualName || !actualEmail) {
            console.warn("LoginUser action: Failed to decrypt name/email from API response or decrypted data is not a string. Name:", actualName, "Email:", actualEmail, "Encrypted Name Value used:", validatedApiUserData.data.name.value, "Encrypted Email Value used:", validatedApiUserData.data.email.value);
            
            let errorDetail = "";
            if (!actualName && !actualEmail) errorDetail = "Falló la desencriptación del nombre y el email.";
            else if (!actualName) errorDetail = "Falló la desencriptación del nombre.";
            else errorDetail = "Falló la desencriptación del email.";
            
            const fullErrorMessage = `No se pudieron procesar los detalles del usuario. ${errorDetail} Esto puede deberse a una discrepancia en las claves de encriptación o a datos corruptos desde el servidor. Revisa la consola del servidor para más detalles de la desencriptación.`;

            return {
              message: "Error al procesar datos de usuario del servicio externo.",
              errors: { _form: [fullErrorMessage] },
              user: null,
              debugLoginApiUrl: generatedApiUrl,
            };
          }
          
          if (actualEmail.toLowerCase() !== email.toLowerCase()) {
            console.warn(`LoginUser action: Decrypted email (${actualEmail}) does not match login email (${email}). Potential issue.`);
          }

          const userFromApi: ActionUser = {
            id: validatedApiUserData.data.id,
            name: actualName, 
            email: actualEmail, 
            ageRange: validatedApiUserData.data.ageRange || null,
            gender: validatedApiUserData.data.gender || null,
            initialEmotionalState: validatedApiUserData.data.initialEmotionalState || null,
          };
          console.log("LoginUser action: External API reported 'OK', data validated, name/email decrypted. Login successful.");
          return { 
            message: "Inicio de sesión exitoso.", 
            user: userFromApi,
            debugLoginApiUrl: generatedApiUrl,
          };
        } else {
          console.warn("LoginUser action: External API reported 'OK' but user data from API is invalid/incomplete after Zod validation.", validatedApiUserData.error.flatten().fieldErrors, "Received data:", apiResult.data);
          return {
            message: "Respuesta de inicio de sesión incompleta o inválida del servicio externo (post-validación Zod).",
            errors: { _form: ["El servicio externo devolvió datos de usuario que no pasaron la validación de formato: " + JSON.stringify(validatedApiUserData.error.flatten().fieldErrors)] },
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
    
