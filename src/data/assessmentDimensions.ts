
"use client";

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

export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    // Llamamos a nuestra propia API route que actúa como proxy
    const response = await fetch('/api/assessment-questions', {
      cache: 'no-store' // Asegura que siempre se obtengan los datos más recientes
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch assessment questions from internal API: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions:", error);
    // En caso de error, podríamos devolver un array vacío o lanzar el error
    // para que el componente que llama pueda manejarlo.
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
