
import { NextResponse } from 'next/server';
import type { AssessmentDimension } from '@/data/paths/pathTypes';

const clave = "SJDFgfds788sdfs8888KLLLL";

// This function now exclusively fetches from the external URL.
// It's the single source of truth from the external API.
async function fetchExternalAssessmentQuestions(): Promise<AssessmentDimension[]> {
    const fecha = new Date().toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
    const raw = `${clave}|${fecha}`;
    const token = Buffer.from(raw).toString('base64');
    const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=preguntas&token=${encodeURIComponent(token)}`;

    const response = await fetch(externalUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch external assessment questions. Status: ${response.status}`);
    }
    
    const questions = await response.json();
    // Here we can add a Zod validation layer if we want to be extra safe
    return questions as AssessmentDimension[];
}

/**
 * API route that acts as a proxy.
 * It's called by client components AND server components that need the data.
 */
export async function GET() {
  try {
    const questions = await fetchExternalAssessmentQuestions();
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
