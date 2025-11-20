
import type { AssessmentDimension } from './paths/pathTypes';
import { fetchExternalAssessmentDimensions } from './assessment-service';

// Esta función ahora actúa como un cliente para el servicio de datos
// y es la que debe ser usada por el resto de la aplicación.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  // En un entorno de servidor, podríamos llamar a fetch directamente.
  // Pero para mantener la consistencia y hacerlo funcionar en todas partes,
  // podríamos optar por tener una ruta API que haga de proxy.
  // Por ahora, asumimos que el componente que la llama sabe cómo manejar el fetch.
  return fetchExternalAssessmentDimensions();
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
