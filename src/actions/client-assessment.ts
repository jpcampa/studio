
"use client";

import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { encryptDataAES } from '@/lib/encryption';
import { useTranslations } from '@/lib/translations';

// NEW: Server Action to save assessment data to the external API
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_SAVE_TIMEOUT_MS = 15000;

interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, { score: number; weight: number }>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

export type SaveResult = {
  success: boolean;
  message: string;
  debugUrl?: string;
};

export async function saveAssessment(payloadToSave: AssessmentSavePayload): Promise<SaveResult> {
  const t = useTranslations();
  let saveUrlForDebug = "";
  try {
    const encryptedPayload = encryptDataAES(payloadToSave);
    saveUrlForDebug = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;
    
    console.log("saveAssessment (Client): Attempting to save assessment. URL (payload encrypted):", saveUrlForDebug.substring(0, 150) + "...");

    const saveResponse = await fetch(saveUrlForDebug, { signal: AbortSignal.timeout(API_SAVE_TIMEOUT_MS) });
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("saveAssessment (Client): Failed to save assessment to API. Status:", saveResponse.status, "Response Text:", saveResponseText);
      return { success: false, message: t.assessmentSavedErrorNetworkMessage.replace("{status}", saveResponse.status.toString()).replace("{details}", saveResponseText.substring(0, 100)), debugUrl: saveUrlForDebug };
    }

    const saveApiResult = JSON.parse(saveResponseText);
    if (saveApiResult.status === "OK") {
      console.log("saveAssessment (Client): Assessment successfully saved to API. Response:", saveApiResult);
      return { success: true, message: t.assessmentSavedSuccessMessage, debugUrl: saveUrlForDebug };
    } else {
      console.warn("saveAssessment (Client): API reported 'NOOK'. Message:", saveApiResult.message, "Full Response:", saveApiResult);
      return { success: false, message: t.assessmentSavedErrorMessageApi.replace("{message}", saveApiResult.message || t.errorOccurred), debugUrl: saveUrlForDebug };
    }

  } catch (error: any) {
    let errorMessage = t.assessmentSavedErrorGeneric;
    if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
      errorMessage = t.assessmentSavedErrorTimeout;
    } else if (error instanceof SyntaxError) {
      errorMessage = "Error procesando la respuesta del servidor de guardado (JSON inválido).";
    } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = t.assessmentSavedErrorFetchFailed;
    }
    console.error("saveAssessment (Client): Error saving assessment:", error, "URL attempted:", saveUrlForDebug);
    return { success: false, message: errorMessage, debugUrl: saveUrlForDebug };
  }
}
