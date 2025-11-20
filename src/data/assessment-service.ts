
// src/data/assessment-service.ts
import type { AssessmentDimension } from './paths/pathTypes';
import { unstable_noStore as noStore } from 'next/cache';

// Esta es la única función que hablará con la API externa.
// Puede ser llamada de forma segura tanto desde rutas de API como desde Componentes de Servidor.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  noStore();
  const externalUrl = `https://firebasestorage.googleapis.com/v0/b/workwell-c4rlk.firebasestorage.app/o/assessment-questions.json?alt=media&token=02f5710e-38c0-4a29-90d5-0e3681acf4c4`;
  
  console.log('Assessment Service: Fetching from new Firebase Storage URL:', externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Could not read error body');
    console.error(
      `Assessment Service: External API Error HTTP ${response.status}`,
      errorText
    );
    throw new Error(
      `Firebase Storage returned error HTTP ${response.status}: ${errorText}`
    );
  }

  const text = await response.text();
  
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      console.error('Assessment Service: Invalid format, expected an array. Got:', parsed);
      throw new Error('External assessment questions response is not an array');
    }
    return parsed as AssessmentDimension[];
  } catch (e) {
    console.error('Assessment Service: JSON parse error from external response:', e);
    console.error('Raw text that failed parsing:', text);
    throw new Error('External assessment questions returned invalid JSON');
  }
}

