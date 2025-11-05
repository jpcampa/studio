
import { NextResponse } from 'next/server';

const EXTERNAL_QUESTIONS_URL = 'https://workwellfut.com/preguntaseval/assessment-questions.json';

export async function GET() {
  try {
    const response = await fetch(EXTERNAL_QUESTIONS_URL, {
      cache: 'no-store', // Asegura que siempre se obtengan los datos más recientes
    });

    if (!response.ok) {
      // Si la respuesta de la API externa no es exitosa, devolvemos un error
      return NextResponse.json(
        { error: `Failed to fetch questions from external source: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Devolvemos los datos obtenidos con una respuesta exitosa
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/assessment-questions:', error);
    // Si hay un error en la petición fetch (ej. de red), devolvemos un error de servidor
    return NextResponse.json(
      { error: 'Internal Server Error while fetching assessment questions.' },
      { status: 500 }
    );
  }
}
