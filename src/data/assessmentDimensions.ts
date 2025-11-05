
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

// Función para cargar las preguntas desde la ruta de API interna
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    // Apuntamos a nuestra propia API route que actúa como proxy
    const response = await fetch('/api/assessment-questions', {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Error al cargar las preguntas desde la API interna: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from internal API:", error);
    throw new Error("No se pudieron cargar las preguntas de la evaluación. Por favor, revisa la conexión y la API interna.");
  }
}


export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
