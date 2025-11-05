
import assessmentQuestions from './assessment-questions.json';

export interface AssessmentItem {
  id: string;
  text: string;
  weight: number; // The weight of the question in the calculation
  isInverse?: boolean; // Optional: true if a lower score is better for the user
}

export interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string; // NEW: Explicitly link dimension to a path ID
}

// Simulate fetching data from an API
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  // In a real app, this would be a fetch call to an external API:
  // const response = await fetch('https://api.example.com/assessment-questions');
  // const data = await response.json();
  // For now, we'll just return the imported JSON data.
  // We add a small delay to simulate network latency.
  await new Promise(resolve => setTimeout(resolve, 50));
  return assessmentQuestions as AssessmentDimension[];
}

export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
