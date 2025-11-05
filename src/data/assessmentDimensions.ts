
import type { Path } from './pathsData';

export interface AssessmentItem {
  id: string;
  text: string;
  weight: number;
  isInverse?: boolean;
}

export interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string;
}

// Fetch assessment questions from the local JSON file
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    // Since this file is in the server, we use dynamic import for the local JSON
    const data = await import('./assessment-questions.json');
    // The default export of a JSON module is the JSON content itself.
    return data.default as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from local JSON:", error);
    throw new Error("No se pudieron cargar las preguntas de la evaluación desde el servidor.");
  }
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
