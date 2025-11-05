
"use client";

import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { useTranslations } from '@/lib/translations';

// La URL de la API ahora apunta a nuestra ruta interna
const API_PROXY_URL = "/api/save-assessment"; 
const API_SAVE_TIMEOUT_MS = 20000; // Aumentamos un poco el timeout

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
  debugUrl?: string; // Todavía podemos recibir la URL de depuración del proxy
};

export async function saveAssessment(payloadToSave: AssessmentSavePayload): Promise<SaveResult> {
  const t = useTranslations();
  
  try {
    console.log("saveAssessment (Client): Sending payload to internal API proxy:", API_PROXY_URL);

    const response = await fetch(API_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadToSave),
      signal: AbortSignal.timeout(API_SAVE_TIMEOUT_MS),
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn("saveAssessment (Client): Internal API proxy returned an error. Status:", response.status, "Response:", result);
      // Usamos el mensaje que nos devuelve el proxy
      return { success: false, message: result.message || `Error en el proxy (HTTP ${response.status})`, debugUrl: result.debugUrl };
    }
    
    console.log("saveAssessment (Client): Success response from internal API proxy:", result);
    return { success: result.success, message: result.message, debugUrl: result.debugUrl };

  } catch (error: any) {
    let errorMessage = t.assessmentSavedErrorGeneric;
    if (error.name === 'AbortError') {
      errorMessage = t.assessmentSavedErrorTimeout;
    } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = t.assessmentSavedErrorFetchFailed;
    }
    console.error("saveAssessment (Client): Error calling internal API proxy:", error);
    return { success: false, message: errorMessage };
  }
}
