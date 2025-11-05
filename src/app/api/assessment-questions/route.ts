
import { NextResponse } from 'next/server';
import type { AssessmentDimension } from '@/data/paths/pathTypes';

const EXTERNAL_QUESTIONS_URL = 'https://workwellfut.com/preguntaseval/assessment-questions.json';

/**
 * Lógica de negocio para obtener las preguntas.
 * Exportada para poder ser llamada directamente desde el servidor.
 */
export async function getAssessmentQuestionsFromApi(): Promise<AssessmentDimension[]> {
    const response = await fetch(EXTERNAL_QUESTIONS_URL, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch external assessment questions. Status: ${response.status}`);
    }
    const questions = await response.json();
    return questions as AssessmentDimension[];
}

/**
 * Ruta de API que actúa como proxy.
 */
export async function GET() {
  try {
    const questions = await getAssessmentQuestionsFromApi();
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
