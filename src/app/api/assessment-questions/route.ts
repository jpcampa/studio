
import { NextResponse } from 'next/server';
import { getAssessmentDimensionsFromApi } from '@/data/assessmentDimensions';
import type { AssessmentDimension } from '@/data/paths/pathTypes';


// API route that acts as a proxy.
// It's called by client components.
export async function GET() {
  try {
    const questions = await getAssessmentDimensionsFromApi();
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
