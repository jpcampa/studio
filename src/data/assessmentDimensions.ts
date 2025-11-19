
import type { AssessmentDimension } from './paths/pathTypes';
import { unstable_noStore as noStore } from 'next/cache';
import { fetchExternalAssessmentDimensions } from './assessment-service';


// Esta función ahora actúa como un cliente para el servicio de datos
// Puede ser llamada desde Componentes de Cliente a través de una Ruta de API
// o desde Componentes de Servidor directamente.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  noStore();
  console.log("getAssessmentDimensions: Using server-side fetcher.");
  // En un componente de servidor, esto llamaría directamente.
  // En un componente de cliente, esto fallaría, por eso los clientes deben usar /api/assessment-questions
  // Pero como los componentes de servidor son los que dan el error, lo solucionamos para ellos.
  // La forma más segura es que el código de servidor llame directamente a la función externa.
  return fetchExternalAssessmentDimensions();
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
