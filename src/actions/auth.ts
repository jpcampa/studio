
"use server";

import { z } from "zod";
import { encryptDataAES, decryptDataAES, forceEncryptStringAES, forceDecryptStringAES } from "@/lib/encryption";
import { UserProvider, useUser } from "@/contexts/UserContext"; // Assuming useUser can be used server-side, or we pass user object
import { t } from "@/lib/translations"; // Import translations for error messages
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore"; // Import NotebookEntry type

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

// Updated schema for the API response *data* part
const ApiLoginSuccessDataSchema = z.object({
  id: z.string().min(1, "El ID de usuario de la API no puede estar vacío.").describe("El ID del usuario, que podría estar encriptado como un string JSON {'iv':'...','data':'...'}"),
  name: z.object({
    value: z.string().min(1, "El valor encriptado/raw del nombre en la API no puede estar vacío.")
  }).describe("Contiene el nombre, posiblemente encriptado como un string JSON {'value':'nombreEncriptado'} o {'value':'nombreDirecto'} si la encriptación está desactivada."),
  email: z.object({
    value: z.string().min(1, "El valor encriptado/raw del email en la API no puede estar vacío.")
  }).describe("Contiene el email, similar estructura que el nombre."),
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
  data: any; // Can be various structures or an encrypted string
}

const API_TIMEOUT_MS = 15000;
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";

const EmotionalEntrySchema = z.object({
  id: z.string(),
  situation: z.string(),
  emotion: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
});
const FetchedEmotionalEntriesSchema = z.array(EmotionalEntrySchema);

// Schema for a single notebook entry from the API
const NotebookEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
  title: z.string(),
  content: z.string(),
  pathId: z.string().optional().nullable().transform(val => val ?? undefined),
});
const FetchedNotebookEntriesSchema = z.array(NotebookEntrySchema);


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
    id: userId, 
    name,
    email,
    ageRange: ageRange || null,
    gender: gender || null,
    initialEmotionalState: initialEmotionalState || null,
  };
  const passwordToEncrypt = { value: password };
  const nameToEncrypt = { value: name };
  const emailToEncrypt = { value: email };

  const encryptedUserDetailsPayload = encryptDataAES(userDetailsToEncrypt);
  const encryptedPasswordPayload = encryptDataAES(passwordToEncrypt);
  const encryptedNamedPayload = encryptDataAES(nameToEncrypt);
  const encryptedEmailPayload = encryptDataAES(emailToEncrypt);

  const finalEncryptedUserDetailsForUrl = encodeURIComponent(encryptedUserDetailsPayload);
  const finalEncryptedNameForUrl = encodeURIComponent(encryptedNamedPayload);
  const finalEncryptedEmailForUrl = encodeURIComponent(encryptedEmailPayload);
  const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);

  const type = "registro";

  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedUserDetailsForUrl}&name=${finalEncryptedNameForUrl}&email=${finalEncryptedEmailForUrl}&password=${finalEncryptedPasswordForUrl}`;
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
        message: t.registrationSuccessLoginPrompt,
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
  debugFetchNotebookUrl?: string;
  fetchedEmotionalEntries?: EmotionalEntry[] | null;
  fetchedNotebookEntries?: NotebookEntry[] | null;
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
      fetchedEmotionalEntries: null,
      fetchedNotebookEntries: null,
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
        fetchedEmotionalEntries: null,
        fetchedNotebookEntries: null,
    };
  }

  const finalEncryptedLoginDetailsForUrl = encodeURIComponent(encryptedLoginDetailsPayload);
  const finalEncryptedPasswordForUrl = encodeURIComponent(encryptedPasswordPayload);

  const loginType = "login";
  const generatedLoginApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${loginType}&usuario=${finalEncryptedLoginDetailsForUrl}&password=${finalEncryptedPasswordForUrl}`;
  console.log("LoginUser action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${loginType}&usuario=ENCRYPTED_EMAIL_DETAILS&password=ENCRYPTED_PASSWORD`);

  try {
    console.log("LoginUser action: Attempting to call external API. URL:", generatedLoginApiUrl.substring(0,150) + "...");
    const loginSignal = AbortSignal.timeout(API_TIMEOUT_MS);
    const loginApiResponse = await fetch(generatedLoginApiUrl, { signal: loginSignal });

    let loginResponseText = "";
    try {
        loginResponseText = await loginApiResponse.text();
        console.log("LoginUser action: External API call status:", loginApiResponse.status, "Raw Response Text:", loginResponseText);
    } catch (textError: any) {
        console.warn(`LoginUser action: External API call failed or could not read text. Status: ${loginApiResponse.status}. Error reading text:`, textError.message);
        return {
            message: `Error del servicio de inicio de sesión (HTTP ${loginApiResponse.status}): No se pudo leer la respuesta.`,
            errors: { _form: [`El servicio de inicio de sesión devolvió un error (HTTP ${loginApiResponse.status}) y no se pudo leer el cuerpo. Inténtalo más tarde.`] },
            user: null,
            debugLoginApiUrl: generatedLoginApiUrl,
            fetchedEmotionalEntries: null,
            fetchedNotebookEntries: null,
        };
    }

    if (!loginApiResponse.ok) {
      console.warn(`LoginUser action: External API call failed. Status: ${loginApiResponse.status}. Response: ${loginResponseText}`);
      return {
        message: `Error del servicio de inicio de sesión (HTTP ${loginApiResponse.status}): ${loginResponseText.substring(0,100)}`,
        errors: { _form: [`El servicio de inicio de sesión devolvió un error (HTTP ${loginApiResponse.status}). Inténtalo más tarde.`] },
        user: null,
        debugLoginApiUrl: generatedLoginApiUrl,
        fetchedEmotionalEntries: null,
        fetchedNotebookEntries: null,
      };
    }

    let loginApiResult: ExternalApiResponse;
    try {
      loginApiResult = JSON.parse(loginResponseText);
      console.log("LoginUser action: Parsed API Response JSON:", loginApiResult);
    } catch (jsonError: any) {
      console.warn("LoginUser action: Failed to parse JSON response from external API.", jsonError, "Raw text was:", loginResponseText);
      return {
        message: "Error al procesar la respuesta del servicio de inicio de sesión. Respuesta no válida.",
        errors: { _form: ["El servicio de inicio de sesión devolvió una respuesta inesperada."] },
        user: null,
        debugLoginApiUrl: generatedLoginApiUrl,
        fetchedEmotionalEntries: null,
        fetchedNotebookEntries: null,
      };
    }

    if (loginApiResult.status === "OK") {
      if (loginApiResult.data) {
        const validatedApiUserData = ApiLoginSuccessDataSchema.safeParse(loginApiResult.data);
        if (validatedApiUserData.success) {
          console.log("LoginUser action: API user data validated successfully by Zod:", JSON.stringify(validatedApiUserData.data, null, 2));

          let actualName: string | null = null;
          let actualEmail: string | null = null;
          let actualId: string | null = null;

          const rawNameFromApi = validatedApiUserData.data.name.value;
          const decryptedNamePayload = decryptDataAES(rawNameFromApi);
          if (decryptedNamePayload && typeof decryptedNamePayload === 'object' && 'value' in decryptedNamePayload && typeof (decryptedNamePayload as { value: unknown }).value === 'string') {
            actualName = (decryptedNamePayload as { value: string }).value;
          }

          const rawEmailFromApi = validatedApiUserData.data.email.value;
          const decryptedEmailPayload = decryptDataAES(rawEmailFromApi);
          if (decryptedEmailPayload && typeof decryptedEmailPayload === 'object' && 'value' in decryptedEmailPayload && typeof (decryptedEmailPayload as { value: unknown }).value === 'string') {
            actualEmail = (decryptedEmailPayload as { value: string }).value;
          }
          
          const rawIdFromApi = validatedApiUserData.data.id;
          const decryptedId = forceDecryptStringAES(rawIdFromApi); // ID is directly encrypted string
          if (decryptedId) {
            actualId = decryptedId;
          } else {
            actualId = rawIdFromApi; // Fallback if decryption fails, though unlikely if encryption was successful
          }


          if (!actualName || !actualEmail || !actualId) {
            let errorDetail = "";
            if (!actualName) errorDetail += "nombre ";
            if (!actualEmail) errorDetail += "email ";
            if (!actualId) errorDetail += "ID ";
            errorDetail = errorDetail.trim().replace(/ /g, ', ');
            const fullErrorMessage = `No se pudieron procesar los detalles del usuario. Falló la extracción o desencriptación de: ${errorDetail}.`;
            console.warn("LoginUser action: Extraction/Decryption failed. Name:", actualName, "Email:", actualEmail, "ID:", actualId);
            return {
              message: "Error al procesar datos de usuario del servicio externo.",
              errors: { _form: [fullErrorMessage] },
              user: null,
              debugLoginApiUrl: generatedLoginApiUrl,
              fetchedEmotionalEntries: null,
              fetchedNotebookEntries: null,
            };
          }

          const userFromApi: ActionUser = {
            id: actualId,
            name: actualName,
            email: actualEmail,
            ageRange: validatedApiUserData.data.ageRange || null,
            gender: validatedApiUserData.data.gender || null,
            initialEmotionalState: validatedApiUserData.data.initialEmotionalState || null,
          };
          console.log("LoginUser action: User login successful. Now fetching activities and notebook entries...");

          // --- Fetch emotional activities ---
          const activitiesResult = await fetchUserActivities(actualId);
          let fetchedEmotionalEntries: EmotionalEntry[] | null = null;
          if (activitiesResult.success && activitiesResult.entries) {
            fetchedEmotionalEntries = activitiesResult.entries;
            console.log("LoginUser action: Successfully fetched and validated emotional entries via fetchUserActivities:", fetchedEmotionalEntries.length, "entries.");
          } else {
            console.warn("LoginUser action: Failed to fetch emotional entries via fetchUserActivities. Error:", activitiesResult.error);
          }
          // --- End fetching emotional activities ---
          
          // --- Fetch notebook entries ---
          const notebookResult = await fetchNotebookEntries(actualId);
          let fetchedNotebookEntries: NotebookEntry[] | null = null;
          if (notebookResult.success && notebookResult.entries) {
            fetchedNotebookEntries = notebookResult.entries;
            console.log("LoginUser action: Successfully fetched and validated notebook entries:", fetchedNotebookEntries.length, "entries.");
          } else {
            console.warn("LoginUser action: Failed to fetch notebook entries. Error:", notebookResult.error);
          }
          // --- End fetching notebook entries ---

          return {
            message: t.loginSuccessMessage,
            user: userFromApi,
            debugLoginApiUrl: generatedLoginApiUrl,
            debugFetchNotebookUrl: notebookResult.debugApiUrl,
            fetchedEmotionalEntries: fetchedEmotionalEntries,
            fetchedNotebookEntries: fetchedNotebookEntries,
          };

        } else {
          console.warn("LoginUser action: External API reported 'OK' but user data invalid.", validatedApiUserData.error.flatten().fieldErrors, "Data:", loginApiResult.data);
          return {
            message: "Respuesta de inicio de sesión incompleta del servicio externo.",
            errors: { _form: ["El servicio externo devolvió datos de usuario no válidos: " + JSON.stringify(validatedApiUserData.error.flatten().fieldErrors)] },
            user: null,
            debugLoginApiUrl: generatedLoginApiUrl,
            fetchedEmotionalEntries: null,
            fetchedNotebookEntries: null,
          };
        }
      } else {
         console.warn("LoginUser action: External API reported 'OK' but 'data' is null/missing.");
          return {
            message: "El servicio de inicio de sesión no devolvió los datos del usuario.",
            errors: { _form: ["El servicio externo no proporcionó la información necesaria."] },
            user: null,
            debugLoginApiUrl: generatedLoginApiUrl,
            fetchedEmotionalEntries: null,
            fetchedNotebookEntries: null,
          };
      }
    } else if (loginApiResult.status === "NOOK") {
      console.warn("LoginUser action: External API reported 'NOOK'. Message:", loginApiResult.message);
      return {
        message: loginApiResult.message || "Credenciales inválidas o error del servicio.",
        errors: { _form: [loginApiResult.message || "No se pudo iniciar sesión."] },
        user: null,
        debugLoginApiUrl: generatedLoginApiUrl,
        fetchedEmotionalEntries: null,
        fetchedNotebookEntries: null,
      };

    } else {
      console.warn("LoginUser action: External API reported an unknown status.", loginApiResult);
      return {
        message: "Respuesta desconocida del servicio de inicio de sesión externo.",
        errors: { _form: ["El servicio externo devolvió un estado inesperado."] },
        user: null,
        debugLoginApiUrl: generatedLoginApiUrl,
        fetchedEmotionalEntries: null,
        fetchedNotebookEntries: null,
      };
    }

  } catch (error: any) {
    console.warn("LoginUser action: Error during API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante el inicio de sesión.";
    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = "No se pudo conectar con el servicio de inicio de sesión (tiempo de espera agotado).";
    } else if (error.message && error.message.includes('fetch failed')) {
        errorMessage = "Fallo en la comunicación con el servicio de inicio de sesión.";
    }
    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      user: null,
      debugLoginApiUrl: generatedLoginApiUrl,
      fetchedEmotionalEntries: null,
      fetchedNotebookEntries: null,
    };
  }
}

export type DeleteAccountState = {
  errors?: {
    _form?: string[];
    email?: string[]; 
  };
  message?: string | null;
  success?: boolean;
  debugDeleteApiUrl?: string;
};

const deleteUserPayloadSchema = z.object({
  email: z.string().email("El correo electrónico proporcionado no es válido."),
});

export async function deleteUserAccount(
  userEmail: string, 
  prevState: DeleteAccountState,
): Promise<DeleteAccountState> {
  console.log(`DeleteUserAccount action: Initiated for email: ${userEmail}.`);

  const validatedEmail = deleteUserPayloadSchema.safeParse({ email: userEmail });
  if (!validatedEmail.success) {
      console.warn("DeleteUserAccount action: Invalid email provided to action.", validatedEmail.error.flatten().fieldErrors);
      return {
          errors: { _form: [t.deleteAccountErrorMessage], email: validatedEmail.error.flatten().fieldErrors.email },
          message: "Error interno: el correo electrónico para la baja no es válido.",
          success: false,
          debugDeleteApiUrl: undefined,
      };
  }

  const emailToDelete = validatedEmail.data.email;

  const deletePayloadToEncrypt = { email: emailToDelete };
  let encryptedDeletePayload;
  try {
    encryptedDeletePayload = encryptDataAES(deletePayloadToEncrypt);
  } catch (encError: any) {
    console.error("DeleteUserAccount action: Error during encryption:", encError);
    return {
        message: "Error interno al preparar los datos para la baja.",
        errors: { _form: ["No se pudieron encriptar los datos para la baja de forma segura."] },
        success: false,
        debugDeleteApiUrl: undefined,
    };
  }

  const finalEncryptedPayloadForUrl = encodeURIComponent(encryptedDeletePayload);
  const type = "baja";
  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedPayloadForUrl}`;
  console.log("DeleteUserAccount action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=ENCRYPTED_DELETE_PAYLOAD`);

  try {
    console.log("DeleteUserAccount action: Attempting to call external API. URL:", generatedApiUrl.substring(0,150) + "...");
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const apiResponse = await fetch(generatedApiUrl, { signal });

    let responseText = "";
    try {
        responseText = await apiResponse.text();
        console.log("DeleteUserAccount action: External API call status:", apiResponse.status, "Raw Response Text:", responseText);
    } catch (textError: any) {
        console.warn(`DeleteUserAccount action: External API call failed or could not read text. Status: ${apiResponse.status}. Error reading text:`, textError.message);
        return {
            message: `Error del servicio de baja (HTTP ${apiResponse.status}): No se pudo leer la respuesta.`,
            errors: { _form: [`El servicio de baja devolvió un error (HTTP ${apiResponse.status}) y no se pudo leer el cuerpo. Inténtalo más tarde.`] },
            success: false,
            debugDeleteApiUrl: generatedApiUrl,
        };
    }

    if (!apiResponse.ok) {
      console.warn(`DeleteUserAccount action: External API call failed. Status: ${apiResponse.status}. Response: ${responseText}`);
      return {
        message: `Error del servicio de baja (HTTP ${apiResponse.status}): ${responseText.substring(0,100)}`,
        errors: { _form: [`El servicio de baja devolvió un error (HTTP ${apiResponse.status}). Inténtalo más tarde.`] },
        success: false,
        debugDeleteApiUrl: generatedApiUrl,
      };
    }

    let apiResult: ExternalApiResponse;
    try {
      apiResult = JSON.parse(responseText);
      console.log("DeleteUserAccount action: Parsed API Response JSON:", apiResult);
    } catch (jsonError: any) {
      console.warn("DeleteUserAccount action: Failed to parse JSON response from external API.", jsonError, "Raw text was:", responseText);
      return {
        message: "Error al procesar la respuesta del servicio de baja. Respuesta no válida.",
        errors: { _form: ["El servicio de baja devolvió una respuesta inesperada."] },
        success: false,
        debugDeleteApiUrl: generatedApiUrl,
      };
    }

    if (apiResult.status === "OK") {
      console.log("DeleteUserAccount action: External API reported 'OK'. User deletion successful in backend.");
      return {
        message: t.deleteAccountSuccessMessage,
        success: true,
        errors: {},
        debugDeleteApiUrl: generatedApiUrl,
      };
    } else if (apiResult.status === "NOOK") {
      console.warn("DeleteUserAccount action: External API reported 'NOOK'. Message:", apiResult.message);
      return {
        message: apiResult.message || t.deleteAccountErrorMessage,
        errors: { _form: [apiResult.message || t.deleteAccountErrorMessage] },
        success: false,
        debugDeleteApiUrl: generatedApiUrl,
      };
    } else {
      console.warn("DeleteUserAccount action: External API reported an unknown status.", apiResult);
      return {
        message: "Respuesta desconocida del servicio de baja externo.",
        errors: { _form: ["El servicio externo devolvió un estado inesperado para la baja."] },
        success: false,
        debugDeleteApiUrl: generatedApiUrl,
      };
    }

  } catch (error: any) {
    console.warn("DeleteUserAccount action: Error during external API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante la baja de la cuenta.";

    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = "No se pudo conectar con el servicio de baja (tiempo de espera agotado).";
        console.warn("DeleteUserAccount action: API call timed out after", API_TIMEOUT_MS, "ms.");
    } else if (error.message && error.message.includes('fetch failed')) {
        errorMessage = "Fallo en la comunicación con el servicio de baja. Verifica tu conexión o el estado del servicio externo.";
    }

    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      success: false,
      debugDeleteApiUrl: generatedApiUrl,
    };
  }
}

// --- Change Password ---
export type ChangePasswordState = {
  errors?: {
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
  debugChangePasswordApiUrl?: string;
};

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, t.passwordTooShortError),
  confirmNewPassword: z.string().min(6, t.passwordTooShortError),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: t.passwordsDoNotMatchError,
  path: ["confirmNewPassword"], 
});

export async function changePassword(
  userEmail: string,
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  console.log(`ChangePassword action: Initiated for email: ${userEmail}.`);

  if (!userEmail) {
    console.warn("ChangePassword action: User email not provided to action.");
    return {
      errors: { _form: [t.userEmailMissingError] },
      message: t.userEmailMissingError,
      success: false,
      debugChangePasswordApiUrl: undefined,
    };
  }

  const validatedFields = changePasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.warn("ChangePassword action: Validation failed.", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: t.validationError, 
      success: false,
      debugChangePasswordApiUrl: undefined,
    };
  }

  const { newPassword } = validatedFields.data;
  console.log("ChangePassword action: Validation successful. Preparing for external API call.");

  const changePasswordPayloadToEncrypt = { email: userEmail, newPassword: newPassword };
  let encryptedChangePasswordPayload;
  try {
    encryptedChangePasswordPayload = encryptDataAES(changePasswordPayloadToEncrypt);
  } catch (encError: any) {
    console.error("ChangePassword action: Error during encryption:", encError);
    return {
      message: "Error interno al preparar los datos para el cambio de contraseña.",
      errors: { _form: ["No se pudieron encriptar los datos de forma segura."] },
      success: false,
      debugChangePasswordApiUrl: undefined,
    };
  }

  const finalEncryptedPayloadForUrl = encodeURIComponent(encryptedChangePasswordPayload);
  const type = "cambiocontraseña";
  const generatedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=${finalEncryptedPayloadForUrl}`;
  console.log("ChangePassword action: Constructed API URL (for server logging):", `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&usuario=ENCRYPTED_CHANGE_PASSWORD_PAYLOAD`);

  try {
    console.log("ChangePassword action: Attempting to call external API. URL:", generatedApiUrl.substring(0, 150) + "...");
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const apiResponse = await fetch(generatedApiUrl, { signal });

    let responseText = "";
    try {
      responseText = await apiResponse.text();
      console.log("ChangePassword action: External API call status:", apiResponse.status, "Raw Response Text:", responseText);
    } catch (textError: any) {
      console.warn(`ChangePassword action: External API call failed or could not read text. Status: ${apiResponse.status}. Error reading text:`, textError.message);
      return {
        message: `Error del servicio de cambio de contraseña (HTTP ${apiResponse.status}): No se pudo leer la respuesta.`,
        errors: { _form: [`El servicio de cambio de contraseña devolvió un error (HTTP ${apiResponse.status}) y no se pudo leer el cuerpo. Inténtalo más tarde.`] },
        success: false,
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    }

    if (!apiResponse.ok) {
      console.warn(`ChangePassword action: External API call failed. Status: ${apiResponse.status}. Response: ${responseText}`);
      return {
        message: `Error del servicio de cambio de contraseña (HTTP ${apiResponse.status}): ${responseText.substring(0, 100)}`,
        errors: { _form: [`El servicio de cambio de contraseña devolvió un error (HTTP ${apiResponse.status}). Inténtalo más tarde.`] },
        success: false,
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    }

    let apiResult: ExternalApiResponse;
    try {
      apiResult = JSON.parse(responseText);
      console.log("ChangePassword action: Parsed API Response JSON:", apiResult);
    } catch (jsonError: any) {
      console.warn("ChangePassword action: Failed to parse JSON response from external API.", jsonError, "Raw text was:", responseText);
      return {
        message: "Error al procesar la respuesta del servicio de cambio de contraseña. Respuesta no válida.",
        errors: { _form: ["El servicio de cambio de contraseña devolvió una respuesta inesperada."] },
        success: false,
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    }

    if (apiResult.status === "OK") {
      console.log("ChangePassword action: External API reported 'OK'. Password change successful.");
      return {
        message: t.passwordChangedSuccessMessage,
        success: true,
        errors: {}, 
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    } else if (apiResult.status === "NOOK") {
      console.warn("ChangePassword action: External API reported 'NOOK'. Message:", apiResult.message);
      return {
        message: apiResult.message || t.passwordChangeGenericError,
        errors: { _form: [apiResult.message || t.passwordChangeGenericError] },
        success: false,
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    } else {
      console.warn("ChangePassword action: External API reported an unknown status.", apiResult);
      return {
        message: "Respuesta desconocida del servicio de cambio de contraseña.",
        errors: { _form: ["El servicio de cambio de contraseña devolvió un estado inesperado."] },
        success: false,
        debugChangePasswordApiUrl: generatedApiUrl,
      };
    }

  } catch (error: any) {
    console.warn("ChangePassword action: Error during external API call or processing:", error);
    let errorMessage = "Ocurrió un error inesperado durante el cambio de contraseña.";

    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
      errorMessage = "No se pudo conectar con el servicio de cambio de contraseña (tiempo de espera agotado).";
      console.warn("ChangePassword action: API call timed out after", API_TIMEOUT_MS, "ms.");
    } else if (error.message && error.message.includes('fetch failed')) {
      errorMessage = "Fallo en la comunicación con el servicio de cambio de contraseña. Verifica tu conexión o el estado del servicio externo.";
    }

    return {
      message: errorMessage,
      errors: { _form: [errorMessage] },
      success: false,
      debugChangePasswordApiUrl: generatedApiUrl,
    };
  }
}

// --- Fetch User Activities ---
export async function fetchUserActivities(
  userId: string
): Promise<{ success: boolean; entries?: EmotionalEntry[]; error?: string }> {
  console.log(`fetchUserActivities action: Initiated for userId: ${userId}.`);

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.warn("fetchUserActivities action: Invalid or missing userId.");
    return { success: false, error: "ID de usuario inválido." };
  }

  let encryptedUserIdForActivities: string;
  try {
    encryptedUserIdForActivities = forceEncryptStringAES(userId);
  } catch (encError: any) {
    console.error("fetchUserActivities action: Error encrypting userId:", encError);
    return { success: false, error: "Error al preparar el ID de usuario para la solicitud." };
  }

  const activitiesType = "getactividades";
  const activitiesApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${activitiesType}&usuario=${encodeURIComponent(encryptedUserIdForActivities)}`;
  console.log("fetchUserActivities action: Fetching activities from URL:", activitiesApiUrl.substring(0, 150) + "...");

  try {
    const activitiesSignal = AbortSignal.timeout(API_TIMEOUT_MS); // Reusing API_TIMEOUT_MS
    const activitiesResponse = await fetch(activitiesApiUrl, { signal: activitiesSignal });
    const activitiesResponseText = await activitiesResponse.text();
    console.log("fetchUserActivities action: API call status:", activitiesResponse.status, "Raw Response Text:", activitiesResponseText);

    if (!activitiesResponse.ok) {
      console.warn("fetchUserActivities action: Failed to fetch activities. Status:", activitiesResponse.status, "Response:", activitiesResponseText);
      return { success: false, error: `Error del servidor de actividades (HTTP ${activitiesResponse.status}): ${activitiesResponseText.substring(0, 100)}` };
    }

    const activitiesApiResult: ExternalApiResponse = JSON.parse(activitiesResponseText);
    if (activitiesApiResult.status === "OK" && activitiesApiResult.data !== undefined) { 
      let potentialEntriesArray: any = null;

      if (Array.isArray(activitiesApiResult.data)) {
        console.log("fetchUserActivities: Data from API is already an array.");
        potentialEntriesArray = activitiesApiResult.data;
      } else if (typeof activitiesApiResult.data === 'string') {
        console.log("fetchUserActivities: Data from API is a string, attempting decryption.");
        const decrypted = decryptDataAES(activitiesApiResult.data);
        if (decrypted && Array.isArray(decrypted)) {
          console.log("fetchUserActivities: Successfully decrypted API data into an array.");
          potentialEntriesArray = decrypted;
        } else {
          console.warn("fetchUserActivities: Decrypted API data is not an array or decryption failed. Decrypted data:", decrypted);
        }
      } else {
        console.warn("fetchUserActivities: API data is neither an array nor a string. Data:", activitiesApiResult.data);
      }

      if (potentialEntriesArray && Array.isArray(potentialEntriesArray)) {
        // Transform array of arrays to array of objects if necessary
        const transformedEntries = potentialEntriesArray.map((rawEntry: any) => {
          if (Array.isArray(rawEntry) && rawEntry.length >= 5) {
            // Assuming structure: [idactividad, fecha, idusuario, situation, emotion]
            // And that rawEntry[1] (fecha) is a parseable date string
            let timestamp = rawEntry[1];
            try {
                // Attempt to convert to ISO string if not already
                // This assumes rawEntry[1] is a string that new Date() can parse.
                // If it's already ISO, new Date().toISOString() is idempotent for valid ISO strings.
                timestamp = new Date(rawEntry[1]).toISOString();
            } catch (dateError) {
                console.warn(`fetchUserActivities: Could not parse date string "${rawEntry[1]}" for entry ID ${rawEntry[0]}. Using original.`, dateError);
                // If parsing fails, use the original string and let Zod validation catch it if it's truly invalid.
            }
            return {
              id: String(rawEntry[0]),
              timestamp: timestamp, 
              situation: String(rawEntry[3]),
              emotion: String(rawEntry[4]),
            };
          }
          // If rawEntry is already an object (potentially from a previous transformation or direct from API)
          // or if it's not an array of the expected length, return it as is for Zod to validate.
          return rawEntry;
        }).filter(entry => entry && typeof entry === 'object'); // Filter out any nulls or non-objects from bad transformations

        console.log("fetchUserActivities: Transformed entries before Zod validation:", JSON.stringify(transformedEntries, null, 2).substring(0,500) + "...");
        const validationResult = FetchedEmotionalEntriesSchema.safeParse(transformedEntries);
        if (validationResult.success) {
          console.log("fetchUserActivities: Successfully validated fetched/decrypted emotional entries:", validationResult.data.length, "entries.");
          return { success: true, entries: validationResult.data };
        } else {
          const zodErrorDetails = validationResult.error.flatten();
          let errorSummary = "Error de validación.";
          if (zodErrorDetails.formErrors.length > 0) {
            errorSummary = zodErrorDetails.formErrors.join(", ");
          } else if (Object.keys(zodErrorDetails.fieldErrors).length > 0) {
            const fieldErrors = zodErrorDetails.fieldErrors as Record<string, string[]|undefined>;
            const firstFieldErrorKey = Object.keys(fieldErrors)[0];
            const firstFieldErrorMessage = fieldErrors[firstFieldErrorKey]?.[0];
            errorSummary = `Error en campo '${firstFieldErrorKey}': ${firstFieldErrorMessage}`;
          }
          console.warn("fetchUserActivities: Fetched/decrypted emotional entries validation failed:", zodErrorDetails);
          console.warn("fetchUserActivities: Data that failed Zod validation (after transformation):", JSON.stringify(transformedEntries, null, 2).substring(0,1000) + "...");
          return { success: false, error: `Datos de actividades recibidos no son válidos. Detalle: ${errorSummary.substring(0,150)} (Revise consola del servidor para más info)` };
        }
      } else {
         console.warn("fetchUserActivities: No valid array of entries obtained after processing API data.");
         return { success: false, error: "No se pudieron procesar los datos de actividades." };
      }
    } else if (activitiesApiResult.status === "OK" && activitiesApiResult.data === undefined) {
        console.log("fetchUserActivities: API reported 'OK' but 'data' field is undefined. Assuming no activities or empty list.");
        return { success: true, entries: [] }; // Success, but no entries
    }
     else {
      console.warn("fetchUserActivities: Activities API reported 'NOOK' or missing data. Message:", activitiesApiResult.message);
      return { success: false, error: `El servidor de actividades indicó un problema: ${activitiesApiResult.message || 'Error desconocido.'}` };
    }
  } catch (error: any) {
    console.error("fetchUserActivities action: Error during API call or processing:", error);
    let errorMessage = "Error de red al obtener actividades.";
    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
      errorMessage = "Tiempo de espera agotado al conectar con el servidor de actividades.";
    } else if (error.message && error.message.includes('fetch failed')) {
      errorMessage = "Fallo en la comunicación con el servidor de actividades.";
    }
    return { success: false, error: errorMessage };
  }
}

// --- Fetch User Notebook Entries ---
export async function fetchNotebookEntries(
  userId: string
): Promise<{ success: boolean; entries?: NotebookEntry[]; error?: string; debugApiUrl?: string; }> {
  console.log(`fetchNotebookEntries action: Initiated for userId: ${userId}.`);

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.warn("fetchNotebookEntries action: Invalid or missing userId.");
    return { success: false, error: "ID de usuario inválido." };
  }

  let encryptedUserId: string;
  try {
    encryptedUserId = forceEncryptStringAES(userId);
  } catch (encError: any) {
    console.error("fetchNotebookEntries action: Error encrypting userId:", encError);
    return { success: false, error: "Error al preparar el ID de usuario para la solicitud." };
  }

  const notebookType = "getcuaderno";
  const notebookApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${notebookType}&usuario=${encodeURIComponent(encryptedUserId)}`;
  console.log("fetchNotebookEntries action: Fetching from URL:", notebookApiUrl.substring(0, 150) + "...");
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('workwell-debug-notebook-fetch-url', notebookApiUrl);
  }

  try {
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const response = await fetch(notebookApiUrl, { signal });
    const responseText = await response.text();
    console.log("fetchNotebookEntries action: API call status:", response.status, "Raw Response Text:", responseText.substring(0, 500) + "...");

    if (!response.ok) {
      console.warn("fetchNotebookEntries action: Failed. Status:", response.status, "Response:", responseText);
      return { success: false, error: `Error del servidor del cuaderno (HTTP ${response.status}): ${responseText.substring(0, 100)}`, debugApiUrl: notebookApiUrl };
    }

    const apiResult: ExternalApiResponse = JSON.parse(responseText);
    if (apiResult.status === "OK" && apiResult.data !== undefined) {
      let potentialEntriesArray: any = null;

      if (Array.isArray(apiResult.data)) {
        potentialEntriesArray = apiResult.data;
      } else if (typeof apiResult.data === 'string') {
        const decrypted = decryptDataAES(apiResult.data);
        if (decrypted && Array.isArray(decrypted)) {
          potentialEntriesArray = decrypted;
        } else {
          console.warn("fetchNotebookEntries: Decrypted data is not an array or decryption failed.");
        }
      }

      if (potentialEntriesArray && Array.isArray(potentialEntriesArray)) {
        const transformedEntries = potentialEntriesArray.map((rawEntry: any) => {
            if (Array.isArray(rawEntry) && rawEntry.length >= 4) {
                // Assuming structure [idcuaderno, fechahora, titulo, contenido, (opcional) pathId]
                let timestamp = rawEntry[1];
                try {
                    timestamp = new Date(rawEntry[1]).toISOString();
                } catch(e) {
                    console.warn(`Could not parse notebook date ${rawEntry[1]}. Using original.`);
                }
                return {
                    id: String(rawEntry[0]),
                    timestamp: timestamp,
                    title: String(rawEntry[2]),
                    content: String(rawEntry[3]),
                    pathId: rawEntry.length > 4 ? String(rawEntry[4]) : null,
                };
            }
            return rawEntry;
        }).filter(entry => entry && typeof entry === 'object');

        console.log("fetchNotebookEntries: Transformed notebook entries before Zod validation:", JSON.stringify(transformedEntries, null, 2).substring(0, 500) + "...");
        const validationResult = FetchedNotebookEntriesSchema.safeParse(transformedEntries);
        
        if (validationResult.success) {
          console.log("fetchNotebookEntries: Successfully validated entries:", validationResult.data.length);
          return { success: true, entries: validationResult.data, debugApiUrl: notebookApiUrl };
        } else {
          console.warn("fetchNotebookEntries: Zod validation failed for notebook entries:", validationResult.error.flatten());
          return { success: false, error: "Datos de cuaderno recibidos no son válidos.", debugApiUrl: notebookApiUrl };
        }
      } else {
        console.warn("fetchNotebookEntries: No valid array of entries obtained.");
        return { success: false, error: "No se pudieron procesar los datos del cuaderno.", debugApiUrl: notebookApiUrl };
      }
    } else if (apiResult.status === "OK" && apiResult.data === undefined) {
      return { success: true, entries: [], debugApiUrl: notebookApiUrl };
    } else {
      console.warn("fetchNotebookEntries: API reported 'NOOK'. Message:", apiResult.message);
      return { success: false, error: `El servidor del cuaderno indicó un problema: ${apiResult.message || 'Error desconocido.'}`, debugApiUrl: notebookApiUrl };
    }
  } catch (error: any) {
    console.error("fetchNotebookEntries action: Error during API call/processing:", error);
    let errorMessage = "Error de red al obtener el cuaderno.";
    if (error.name === 'AbortError') {
      errorMessage = "Tiempo de espera agotado al conectar con el servidor del cuaderno.";
    }
    return { success: false, error: errorMessage, debugApiUrl: notebookApiUrl };
  }
}

      

    


