
import type { AssessmentDimension, AssessmentItem } from './paths/pathTypes';

// This function is now just a placeholder and should not be used as a primary data source.
// The data is now imported directly into the page component from the JSON file.
export function getAssessmentDimensions(): AssessmentDimension[] {
  console.warn("getAssessmentDimensions is deprecated. Questions should be sourced from the API route.");
  return [];
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
