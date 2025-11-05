
import assessmentQuestions from './assessment-questions.json';
import type { Path } from './pathsData';

export interface AssessmentItem {
  id: string;
  text: string;
  weight: number;
  isInverse?: boolean;
}

export interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string;
}

// Esta función ahora puede ser usada tanto en cliente como en servidor
// ya que lee directamente del archivo JSON local.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  // Simplemente devuelve los datos importados.
  // La envoltura en Promise.resolve mantiene la interfaz asíncrona
  // por si en el futuro se vuelve a una fuente de datos externa.
  return Promise.resolve(assessmentQuestions as AssessmentDimension[]);
}


export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
