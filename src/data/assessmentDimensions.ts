
import type { AssessmentDimension } from './paths/pathTypes';

// Esta función ahora solo se ejecuta en el lado del cliente.
// El flujo de IA y otros componentes de servidor usarán directamente la ruta de la API.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  if (typeof window === 'undefined') {
    // This case should ideally not be hit by client components.
    // If a server component needs this data, it should fetch from the API route.
    console.warn("getAssessmentDimensions called from server environment. This is not the intended use. Fetch from '/api/assessment-questions' instead.");
    // Returning an empty array to prevent crashes, but logging a warning.
    return [];
  }

  // Client environment: fetch from the internal API route.
  try {
    const response = await fetch('/api/assessment-questions', {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch from /api/assessment-questions: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from client-side:", error);
    throw error;
  }
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
