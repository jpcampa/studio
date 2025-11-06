
import { NextResponse } from 'next/server';

interface DailyQuestionFromApi {
  id: string;
  texto: string; // The external API uses 'texto'
}

// This is the only function that talks to the external API.
async function fetchExternalDailyQuestion(): Promise<DailyQuestionFromApi[]> {
  const clave = "SJDFgfds788sdfs8888KLLLL";
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw).toString('base64');
  const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=clima&token=${encodeURIComponent(token)}`;

  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${errorText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.statusText}`);
  }
  
  const questions = await response.json();
  return questions as DailyQuestionFromApi[];
}

export async function GET() {
  try {
    const externalQuestions = await fetchExternalDailyQuestion();
    
    // Adapt the response from the external API to our internal DailyQuestion format
    const questions = externalQuestions.map(q => ({
      id: q.id,
      text: q.texto,
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in /api/daily-question proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error while proxying daily question.', details: errorMessage },
      { status: 500 }
    );
  }
}
