'use server';
/**
 * @fileOverview An AI agent for conducting an initial psychological assessment.
 *
 * - initialAssessment - A function that handles the initial assessment process.
 * - InitialAssessmentInput - The input type for the initialAssessment function.
 * - InitialAssessmentOutput - The return type for the initialAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialAssessmentInputSchema = z.object({
  answers: z
    .record(z.string(), z.number())
    .describe('A map of question identifiers to Likert scale responses (1-5).'),
});
export type InitialAssessmentInput = z.infer<typeof InitialAssessmentInputSchema>;

const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.string())
    .describe('A map of emotional dimensions to their assessment (e.g., Autoestima: Nivel medio-bajo).'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority areas for the user.'),
  feedback: z.string().describe('A summary of the assessment results.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  return initialAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  input: {schema: InitialAssessmentInputSchema},
  output: {schema: InitialAssessmentOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized recommendations based on a psychological assessment.

You will analyze the user's answers to a questionnaire and provide an emotional profile, identify priority areas, and offer a summary of the results.

User's Answers (question ID: score):
{{#each answers}}
  {{@key}}: {{this}}
{{/each}}

Based on the answers, generate an emotional profile, identify the top 3 priority areas for the user, and provide a summary of the assessment results.

Output the emotional profile as a map of emotional dimensions to their assessment (e.g., Autoestima: Nivel medio-bajo).
Output the priority areas as an array of the top 3 priority areas for the user.
Output the summary of the assessment results as a concise paragraph.

Ensure the response is in Spanish.
`,
});

const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: InitialAssessmentInputSchema,
    outputSchema: InitialAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // It's crucial that the AI's output strictly matches the InitialAssessmentOutputSchema.
    // If 'output' is null or doesn't match, the calling action will handle it.
    if (!output) {
      // This case should ideally be handled by Genkit's schema validation,
      // but as a fallback, we ensure a proper error structure.
      throw new Error('AI response did not match the expected output schema.');
    }
    return output;
  }
);
