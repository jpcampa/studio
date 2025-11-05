
import { NextResponse } from 'next/server';
import assessmentQuestions from '@/data/assessment-questions.json';

export async function GET() {
  try {
    // Ahora los datos se leen directamente del archivo JSON importado
    return NextResponse.json(assessmentQuestions);

  } catch (error) {
    console.error('Error in /api/assessment-questions:', error);
    // Este error solo ocurriría si el archivo JSON está corrupto o no se encuentra
    return NextResponse.json(
      { error: 'Internal Server Error while serving assessment questions.' },
      { status: 500 }
    );
  }
}
