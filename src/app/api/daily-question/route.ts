
import { NextResponse, type NextRequest } from 'next/server';
import { forceEncryptStringAES } from '@/lib/encryption';

// Updated interface to match the new API response structure
interface DailyQuestionFromApi {
  numero: number;
  area: string;
  codigo: string;
  pregunta: string;
}

const clave = "SJDFgfds788sdfs8888KLLLL";

// This is the only function that talks to the external API.
async function fetchExternalDailyQuestion(userId?: string | null): Promise<{ questions: DailyQuestionFromApi[], url: string }> {
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw).toString('base64');
  let externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=clima&token=${encodeURIComponent(token)}`;

  if (userId) {
    const encryptedUserId = forceEncryptStringAES(userId);
    externalUrl += `&idusuario=${encodeURIComponent(encryptedUserId)}`;
  }

  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${errorText}`);
    // Throwing an error will be caught by the GET handler's try...catch block
    throw new Error(`Failed to fetch external daily question. Status: ${response.statusText}`);
  }
  
  const data = await response.json();
  // The API might return a single object or an array of objects. We'll normalize it to always be an array.
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray as DailyQuestionFromApi[], url: externalUrl };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const { questions: externalQuestions, url: calledUrl } = await fetchExternalDailyQuestion(userId);
    
    // Adapt the response from the external API to our internal DailyQuestion format
    // Map 'codigo' to 'id' and 'pregunta' to 'text'
    const questions = externalQuestions.map(q => ({
      id: q.codigo,
      text: q.pregunta,
    }));

    // Return both the questions and the debug URL
    return NextResponse.json({ questions, debugUrl: calledUrl });
  } catch (error) {
    console.error('Error in /api/daily-question proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error while proxying daily question.', details: errorMessage },
      { status: 500 }
    );
  }
}
