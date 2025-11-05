
import { NextResponse } from 'next/server';
import { encryptDataAES } from '@/lib/encryption';
import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, { score: number; weight: number }>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

// Esta es la nueva ruta de API que actúa como proxy
export async function POST(request: Request) {
  try {
    const payloadToSave: AssessmentSavePayload = await request.json();

    // La lógica de encriptación y construcción de URL ahora vive aquí, en el servidor
    const encryptedPayload = encryptDataAES(payloadToSave);
    const saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;

    console.log("API Route (save-assessment): Attempting to save. URL:", saveUrl.substring(0, 150) + "...");

    const saveResponse = await fetch(saveUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("API Route (save-assessment): API call failed. Status:", saveResponse.status, "Text:", saveResponseText);
      // Reenviamos una respuesta de error al cliente
      return NextResponse.json(
        { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 100)}`, debugUrl: saveUrl },
        { status: 502 } // 502 Bad Gateway es apropiado para un error del servidor proxy
      );
    }
    
    // Intentamos parsear la respuesta del servidor final
    try {
        const finalApiResult = JSON.parse(saveResponseText);
         return NextResponse.json({ success: finalApiResult.status === 'OK', message: finalApiResult.message, debugUrl: saveUrl });
    } catch (e) {
        // Si la respuesta no es JSON pero la petición fue OK, lo consideramos un éxito parcial
        console.warn("API Route (save-assessment): API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return NextResponse.json({ success: true, message: "Guardado, pero la respuesta del servidor no fue JSON.", debugUrl: saveUrl });
    }

  } catch (error: any) {
    console.error("API Route (save-assessment): Internal error.", error);
    let errorMessage = "Error interno en el proxy de guardado.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    }
    // Devolvemos un error 500 al cliente
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
