// app/(main)/assessment/page.tsx
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient.tsx';
//import AssessmentPageClient from '../src/components/assessment/AssessmentPageClient.tsx';

interface AssessmentItem {
  id: string;
  text: string;
  weight: number;
  isInverse?: boolean;
}

interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string;
}

async function getAssessmentDimensions(): Promise<{
  dimensions: AssessmentDimension[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/assessment-questions`, {
      cache: 'no-store',
      // si estás en el mismo dominio / hosting,
      // con fetch('/api/assessment-questions') también valdría
    });

    const text = await res.text();
    console.log('[PAGE /assessment] raw /api/assessment-questions:', text);

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('[PAGE /assessment] JSON parse error:', err);
      return {
        dimensions: null,
        error: 'La API de preguntas devolvió una respuesta no JSON.',
      };
    }

    if (!res.ok || (data && typeof data === 'object' && (data as any).source === 'api-route-error')) {
      return {
        dimensions: null,
        error:
          (data as any)?.details ||
          `Error HTTP ${res.status} al cargar las preguntas del cuestionario.`,
      };
    }

    if (!Array.isArray(data)) {
      console.error('[PAGE /assessment] Formato inesperado, no es array:', data);
      return {
        dimensions: null,
        error: 'La API de preguntas devolvió un formato inesperado.',
      };
    }

    return { dimensions: data as AssessmentDimension[], error: null };
  } catch (e) {
    console.error('[PAGE /assessment] Error inesperado:', e);
    return {
      dimensions: null,
      error: 'No se ha podido conectar con la API de preguntas.',
    };
  }
}

export default async function AssessmentPage() {
  const { dimensions, error } = await getAssessmentDimensions();

  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
      initialError={error}
    />
  );
}
