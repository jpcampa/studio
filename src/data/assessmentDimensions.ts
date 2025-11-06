
"use client";

import type { AssessmentDimension } from './paths/pathTypes';

const clave = "SJDFgfds788sdfs8888KLLLL";

// This function now exclusively fetches from the external URL.
// It's the single source of truth from the external API.
export async function getAssessmentDimensionsFromApi(): Promise<AssessmentDimension[]> {
    const fecha = new Date().toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
    const raw = `${clave}|${fecha}`;
    const token = Buffer.from(raw).toString('base64');
    const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=preguntas&token=${encodeURIComponent(token)}`;

    const response = await fetch(externalUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch external assessment questions. Status: ${response.status}`);
    }
    
    const questions = await response.json();
    return questions as AssessmentDimension[];
}

/**
 * API route that acts as a proxy.
 * It's called by client components AND server components that need the data.
 */
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
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
