
import type { AssessmentDimension } from './paths/pathTypes';
import { unstable_noStore as noStore } from 'next/cache';

// La función para obtener las preguntas desde el proxy de API
async function fetchFromApi(): Promise<AssessmentDimension[]> {
  noStore();
  try {
    // Usamos una URL absoluta cuando llamamos desde el servidor
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/assessment-questions`, { cache: 'no-store' });

    if (!response.ok) {
        console.error("Error fetching from API, status:", response.status);
        const errorData = await response.json().catch(() => ({ details: 'Could not parse error JSON' }));
        throw new Error(`Failed to fetch from API: ${response.statusText}. Details: ${errorData.details || 'No details'}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from API proxy:", error);
    throw error;
  }
}

export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  console.log("Using API proxy to fetch assessment dimensions.");
  return fetchFromApi();
}
export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
