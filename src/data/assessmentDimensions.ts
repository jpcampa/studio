
import type { AssessmentDimension } from './paths/pathTypes';
import assessmentQuestions from '@/components/resources/assesment-questions.json';

// Esta función ahora simplemente devuelve los datos importados.
// Se mantiene por si en el futuro se quiere volver a una lógica más compleja.
export function getAssessmentDimensions(): AssessmentDimension[] {
  return assessmentQuestions as AssessmentDimension[];
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
