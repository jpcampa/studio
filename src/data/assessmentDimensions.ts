
"use client";

import type { AssessmentDimension } from './paths/pathTypes';

// Esta función ahora solo es utilizada por componentes de CLIENTE.
// Su única responsabilidad es llamar a nuestra propia ruta API interna, que actúa como proxy.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  const temporaryUrl = 'https://workwellfut.com/preguntaseval/assessment-questions.json';
  try {
    const response = await fetch(temporaryUrl, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch from temporary URL: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from client-side URL:", error);
    // En caso de error, devolvemos un array vacío para no romper la UI.
    // El error ya se muestra en la consola.
    return [];
  }
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
