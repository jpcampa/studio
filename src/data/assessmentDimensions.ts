
"use client";

import type { AssessmentDimension } from './paths/pathTypes';

// La función para obtener las preguntas desde el proxy de API
async function fetchFromApi(): Promise<AssessmentDimension[]> {
  try {
    const response = await fetch('/api/assessment-questions', { cache: 'no-store' });
    if (!response.ok) {
        console.error("Error fetching from API, status:", response.status);
        throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from API proxy:", error);
    return [];
  }
}

// La función para obtener las preguntas desde la URL estática temporal
async function fetchFromUrl(): Promise<AssessmentDimension[]> {
  const temporaryUrl = 'https://workwellfut.com/preguntaseval/assessment-questions.json';
  try {
    const response = await fetch(temporaryUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch from temporary URL: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Error fetching assessment dimensions from client-side URL:", error);
    return [];
  }
}


export async function getAssessmentDimensions(useTestUrl = false): Promise<AssessmentDimension[]> {
  if (useTestUrl) {
    console.log("Using test URL to fetch assessment dimensions.");
    return fetchFromUrl();
  } else {
    console.log("Using API proxy to fetch assessment dimensions.");
    return fetchFromApi();
  }
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
