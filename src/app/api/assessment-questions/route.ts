
import { NextResponse } from 'next/server';

const EXTERNAL_QUESTIONS_URL = 'https://workwellfut.com/preguntaseval/assessment-questions.json';

export async function GET() {
  try {
    const response = await fetch(EXTERNAL_QUESTIONS_URL, {
      cache: 'no-store', // O una estrategia de revalidación como { next: { revalidate: 3600 } }
    });

    if (!response.ok) {
      // Si la petición a la URL externa falla, devolvemos un error claro
      return NextResponse.json(
        { error: `Failed to fetch external assessment questions. Status: ${response.status}` },
        { status: 502 } // Bad Gateway
      );
    }

    const questions = await response.json();
    
    // Devolvemos los datos obtenidos de la URL externa
    return NextResponse.json(questions);

  } catch (error) {
    console.error('Error in /api/assessment-questions proxy route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while proxying assessment questions.' },
      { status: 500 }
    );
  }
}
