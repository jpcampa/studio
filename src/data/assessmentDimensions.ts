
"use client";

import type { AssessmentDimension } from './paths/pathTypes';
import { getAssessmentQuestionsFromApi } from '@/app/api/assessment-questions/route';

// Esta función ahora es segura para ser llamada desde el cliente y el servidor.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  // En el entorno del navegador (cliente), siempre llamaremos a la ruta de la API.
  if (typeof window !== 'undefined') {
    try {
      // Usamos una ruta relativa para que funcione en cualquier entorno (desarrollo, producción).
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

  // Si estamos en el servidor, llamamos directamente a la función lógica de la API.
  // Esto evita una llamada de red innecesaria del servidor a sí mismo.
  return getAssessmentQuestionsFromApi();
}


export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
