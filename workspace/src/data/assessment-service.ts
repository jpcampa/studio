
"use client";

import type { AssessmentDimension } from './paths/pathTypes';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetches assessment dimensions from the internal API.
 * This is now the single source of truth for loading questions in the client.
 */
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  const { toast } = useToast();
  try {
    const response = await fetch('/api/assessment-questions');
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch assessment questions from API:", response.status, errorText);
      toast({
        title: "Error de Carga",
        description: `No se pudieron cargar las preguntas de la evaluación (Error: ${response.status}).`,
        variant: "destructive"
      });
      return [];
    }
    const data = await response.json();
    return data as AssessmentDimension[];
  } catch (error) {
    console.error("Client-side error fetching assessment questions:", error);
    toast({
        title: "Error de Red",
        description: "No se pudo conectar con el servidor para obtener las preguntas.",
        variant: "destructive"
    });
    return [];
  }
}
