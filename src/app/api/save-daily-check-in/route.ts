
import { NextResponse } from 'next/server';
import { encryptDataAES } from '@/lib/encryption';

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface CheckInData {
  userId: string;
  questionCode: string;
  answer: string;
}

export async function POST(request: Request) {
  let saveUrl = "";
  try {
    const body: CheckInData = await request.json();
    const { userId, questionCode, answer } = body;

    if (!userId || !questionCode || !answer) {
      return NextResponse.json({ success: false, message: "Faltan datos en la petición." }, { status: 400 });
    }

    const payloadToEncrypt = {
        idusuario: userId,
        codigo: questionCode,
        respuesta: answer,
    };
    
    const encryptedPayload = encryptDataAES(payloadToEncrypt);
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardaclima&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log("API Route (save-daily-check-in): Attempting to save. URL (payload encrypted):", saveUrl.substring(0, 150) + "...");

    const saveResponse = await fetch(saveUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(API_TIMEOUT_MS) 
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("API Route (save-daily-check-in): API call failed. Status:", saveResponse.status, "Text:", saveResponseText);
      return NextResponse.json(
        { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 100)}`, debugUrl: saveUrl },
        { status: 502 }
      );
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return NextResponse.json({ success: true, message: finalApiResult.message || "Respuesta guardada.", debugUrl: saveUrl });
        } else {
           return NextResponse.json({ success: false, message: finalApiResult.message || "El servidor externo indicó un error.", debugUrl: saveUrl }, { status: 400 });
        }
    } catch (e) {
        console.warn("API Route (save-daily-check-in): API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return NextResponse.json({ success: true, message: "Guardado, pero la respuesta del servidor no fue JSON.", debugUrl: saveUrl });
    }

  } catch (error: any) {
    console.error("API Route (save-daily-check-in): Internal error.", error);
    let errorMessage = "Error interno en el proxy de guardado.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    }
    return NextResponse.json(
      { success: false, message: errorMessage, debugUrl: saveUrl },
      { status: 500 }
    );
  }
}

    