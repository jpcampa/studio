
import type { AssessmentDimension, AssessmentItem } from './paths/pathTypes';

// Ahora este archivo es solo para la función de acceso y los tipos

export function getAssessmentDimensions(): AssessmentDimension[] {
  // En un futuro, esto podría hacer un fetch o leer desde un servicio
  // Por ahora, asumimos que los datos están disponibles de alguna forma
  // pero el componente que lo usa no debería saber cómo se obtienen.
  // Esta capa de abstracción es útil.
  // Dejamos un array vacío como fallback seguro.
  console.error("getAssessmentDimensions: Esta función está obsoleta y no debería ser la fuente principal de datos. Los datos están incrustados en la página.");
  return [];
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
