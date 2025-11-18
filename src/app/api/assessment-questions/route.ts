import { NextResponse } from 'next/server';
 
// Los tipos se definen directamente aquí para evitar dependencias conflictivas.
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
 
  console.log('API Route buildToken raw:', raw);
  console.log('API Route buildToken base64:', token);
 
  return token;
}
 
// Esta es la única función que hablará con la API externa.
async function fetchExternalAssessmentDimensions(): Promise<AssessmentDimension[]> {
  const token = buildToken();
 
  // ⚠️ IMPORTANTE: usar BACKTICKS, no comillas normales
  const externalUrl = `https://workwellfut.com/wp-content/programacion/traejson.php?archivo=preguntas&token=${encodeURIComponent(token)}`;
 
  console.log('API Route: Fetching from external URL:', externalUrl);
 
  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
 
  const text = await response.text();
  console.log('API Route: Raw response status:', response.status);
  console.log('API Route: Raw response body:', text);
 
  if (!response.ok) {
    throw new Error(
      `PHP devolvió error HTTP ${response.status} ${response.statusText} - body: ${text}`,
    );
  }
 
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error('API Route: JSON parse error from external response:', e);
    throw new Error('External assessment questions returned invalid JSON');
  }
 
  if (!Array.isArray(parsed)) {
    console.error(
      'API Route: Invalid format, expected an array of dimensions. Got:',
      parsed,
    );
    throw new Error('External assessment questions response is not an array');
  }
 
  return parsed as AssessmentDimension[];
}
 
export async function GET() {
  try {
    const questions = await fetchExternalAssessmentDimensions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in /api/assessment-questions proxy route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
 
    return NextResponse.json(
      {
        source: 'api-route-error',
        error: 'Internal Server Error while proxying assessment questions.',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}