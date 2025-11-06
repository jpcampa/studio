
import { NextResponse, type NextRequest } from 'next/server';

interface DailyQuestionFromApi {
  numero: number;
  area: string;
  codigo: string;
  pregunta: string;
}

const clave = "SJDFgfds788sdfs8888KLLLL";

async function fetchExternalDailyQuestion(userId?: string | null): Promise<{ questions: DailyQuestionFromApi[], debugUrl: string }> {
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw).toString('base64');
  let externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=clima&token=${encodeURIComponent(token)}`;

  if (userId) {
    const base64UserId = btoa(userId);
    externalUrl += `&idusuario=${encodeURIComponent(base64UserId)}`;
  }

  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${errorText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.statusText}`);
  }
  
  const data = await response.json();
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray, debugUrl: externalUrl };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const { questions: externalQuestions, debugUrl } = await fetchExternalDailyQuestion(userId);
    
    const questions = externalQuestions.map(q => ({
      id: q.codigo,
      text: q.pregunta,
    }));

    return NextResponse.json({ questions, debugUrl });
  } catch (error) {
    console.error('Error in /api/daily-question proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error while proxying daily question.', details: errorMessage },
      { status: 500 }
    );
  }
}
