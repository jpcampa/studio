

export interface AssessmentItem {
  id: string;
  text: string;
  weight: number; // The weight of the question in the calculation
  isInverse?: boolean; // Optional: true if a lower score is better for the user
}

export interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string; // NEW: Explicitly link dimension to a path ID
}

// Fetch assessment questions from the external URL
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    const response = await fetch('https://workwellfut.com/preguntaseval/assessment-questions.json', {
      cache: 'no-store' // Asegura que siempre se obtengan los datos más recientes
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch assessment questions: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from URL:", error);
    // En caso de error, podríamos devolver un array vacío o lanzar el error
    // para que el componente que lo llama muestre un mensaje de error al usuario.
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
