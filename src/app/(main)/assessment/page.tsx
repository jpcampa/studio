// app/(main)/assessment/page.tsx
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { getAssessmentDimensions } from '@/data/assessmentDimensions'; // Se importa la función correcta

// Ahora usamos la función directamente desde el servicio unificado
async function fetchDimensionsForPage(): Promise<{
  dimensions: AssessmentDimension[] | null;
  error: string | null;
}> {
  try {
    // Se llama a la función correcta que está diseñada para este propósito
    const dimensions = await getAssessmentDimensions();
    return { dimensions, error: null };
  } catch (e) {
    console.error('[PAGE /assessment] Error inesperado al llamar a getAssessmentDimensions:', e);
    return {
      dimensions: null,
      error: 'No se ha podido conectar con la API de preguntas.',
    };
  }
}

export default async function AssessmentPage() {
  const { dimensions, error } = await fetchDimensionsForPage();

  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
      initialError={error}
    />
  );
}
