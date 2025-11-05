
"use client"; // Importante: Marcar como componente de cliente para que fetch se ejecute en el navegador

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

// Función para cargar las preguntas desde la URL externa
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    const response = await fetch('https://workwellfut.com/preguntaseval/assessment-questions.json', {
      cache: 'no-store' // Asegura que siempre se obtengan los datos más recientes
    });
    if (!response.ok) {
      throw new Error(`Error al cargar las preguntas: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from external URL:", error);
    // En caso de error, podríamos devolver un array vacío o lanzar un error para que el componente que llama lo maneje.
    // Lanzar el error es más explícito.
    throw new Error("No se pudieron cargar las preguntas de la evaluación. Por favor, revisa la conexión y la URL.");
  }
}


export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
