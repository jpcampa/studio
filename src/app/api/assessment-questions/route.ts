
import { NextResponse } from 'next/server';
import type { AssessmentDimension } from '@/data/paths/pathTypes';

const clave = "SJDFgfds788sdfs8888KLLLL";
const externalUrl = `https://workwellfut.com/preguntaseval/assessment-questions.json`;

// Esta es la única función que hablará con la API externa.
// No se exporta porque solo se usa dentro de esta ruta.
async function fetchExternalAssessmentDimensions(): Promise<AssessmentDimension[]> {
    //const fecha = new Date().toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
    //const raw = `${clave}|${fecha}`;
    //const token = Buffer.from(raw).toString('base64');
   // const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=preguntas&token=${encodeURIComponent(token)}`;

    console.log("API Route: Fetching from external URL:", externalUrl);
    const response = await fetch(externalUrl, {
      cache: 'no-store', // Siempre obtener los datos más recientes
    });

    if (!response.ok) {
      console.error(`API Route: Failed to fetch from external URL. Status: ${response.status}`);
      throw new Error(`Failed to fetch external assessment questions. Status: ${response.status}`);
    }
    
    const questions = await response.json();
    return questions as AssessmentDimension[];
}

// El manejador GET de la ruta API que actúa como proxy.
export async function GET() {
  try {
    const questions = await fetchExternalAssessmentDimensions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in /api/assessment-questions proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error while proxying assessment questions.', details: errorMessage },
      { status: 500 }
    );
  }
}
