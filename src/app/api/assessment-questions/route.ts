
import { NextResponse, type NextRequest } from 'next/server';
import { fetchExternalAssessmentDimensions } from '@/data/assessment-service';
 
export async function GET(request: NextRequest) {
  try {
    const questions = await fetchExternalAssessmentDimensions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in /api/assessment-questions proxy route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
 
    return NextResponse.json(
      {
        source: 'api-route-error',
        error: 'Internal Server Error while proxying assessment questions.',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
