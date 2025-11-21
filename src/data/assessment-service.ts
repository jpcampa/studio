
"use client";

import type { AssessmentDimension } from './paths/pathTypes';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetches assessment dimensions from the internal API.
 * This is now the single source of truth for loading questions in the client.
 */
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  try {
    const response = await fetch('/api/assessment-questions');
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch assessment questions from API:", response.status, errorText);
      // Removed toast from here as it's a client hook and this is a service function.
      // Error handling should be done in the component calling this function.
      throw new Error(`Failed to fetch assessment questions (Error: ${response.status}).`);
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Client-side error fetching assessment questions:", error);
    // Re-throw the error so the calling component can handle it (e.g., show a toast).
    throw new Error("No se pudo conectar con el servidor para obtener las preguntas.");
  }
}
