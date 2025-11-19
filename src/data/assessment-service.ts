// src/data/assessment-service.ts
import type { AssessmentDimension } from './paths/pathTypes';
import { unstable_noStore as noStore } from 'next/cache';

// Helper para construir el token exactamente como lo espera PHP
function buildToken(): string {
  const clave = 'SJDFgfds788sdfs8888KLLLL';

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Formato "YYYY-MM-DD HH:mm:ss"
  const fecha = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw, 'utf8').toString('base64');

  return token;
}

// Esta es la única función que hablará con la API externa.
// Puede ser llamada de forma segura tanto desde rutas de API como desde Componentes de Servidor.
export async function fetchExternalAssessmentDimensions(): Promise<AssessmentDimension[]> {
  noStore();
  const token = buildToken();
  const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=preguntas&token=${encodeURIComponent(token)}`;
  
  console.log('Assessment Service: Fetching from external URL:', externalUrl);

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
      `PHP API returned error HTTP ${response.status}: ${errorText}`
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
