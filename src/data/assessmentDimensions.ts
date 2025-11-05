
import type { AssessmentDimension } from './paths/pathTypes';
import { getAssessmentQuestionsFromApi } from '@/app/api/assessment-questions/route';

// Esta función ahora es segura para ser llamada desde el cliente y el servidor.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  // Cuando se ejecuta en el lado del servidor (ej. en un Server Component o un AI Flow),
  // Next.js puede resolver esto directamente. En el cliente, hará una petición a la API.
  // La clave es que este archivo ya NO tiene 'use client'.
  if (typeof window === 'undefined') {
    // Entorno de servidor: llama directamente a la lógica de la API para evitar una llamada de red innecesaria.
    return getAssessmentQuestionsFromApi();
  } else {
    // Entorno de cliente: hace una petición a la ruta API interna.
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
      // En caso de error, podríamos devolver un array vacío o lanzar el error
      // para que el componente que llama lo maneje.
      throw error;
    }
  }
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
