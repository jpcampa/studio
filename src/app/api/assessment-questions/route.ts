
import { NextResponse } from 'next/server';
import type { AssessmentDimension } from '@/data/paths/pathTypes';

const externalUrl = `https://workwellfut.com/preguntaseval/assessment-questions.json`;

async function fetchExternalAssessmentDimensions(): Promise<AssessmentDimension[]> {
  console.log("API Route: Fetching from external URL:", externalUrl);
  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`API Route: Failed to fetch from external URL. Status: ${response.statusText}`);
    throw new Error(`Failed to fetch external assessment questions. Status: ${response.statusText}`);
  }
  
  const questions = await response.json();
  return questions as AssessmentDimension[];
}

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
