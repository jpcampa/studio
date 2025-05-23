
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

// This is the schema the application expects from the flow.
const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.string())
    .describe('A map of emotional dimensions to their assessment (e.g., Autoestima: Nivel medio-bajo).'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority areas for the user.'),
  feedback: z.string().describe('A summary of the assessment results.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// This is a more AI-friendly schema where emotionalProfile is a JSON string.
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their assessment. Example: "{\\"Autoestima\\": \\"Nivel medio-bajo\\", \\"Estrés\\": \\"Alto\\"}"'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority areas for the user.'),
  feedback: z.string().describe('A summary of the assessment results.'),
});

export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  return initialAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  input: {schema: InitialAssessmentInputSchema},
  output: {schema: AIResponseSchema}, // AI outputs this schema
  prompt: `You are an AI assistant designed to provide personalized recommendations based on a psychological assessment.

You will analyze the user's answers to a questionnaire and provide an emotional profile, identify priority areas, and offer a summary of the results.

User's Answers (question ID: score):
{{#each answers}}
  {{@key}}: {{this}}
{{/each}}

Based on the answers, generate an emotional profile, identify the top 3 priority areas for the user, and provide a summary of the assessment results.

Output the emotional profile as a JSON string in the 'emotionalProfileJSON' field, where keys are emotional dimensions and values are their assessments (e.g., "{\\"Autoestima\\": \\"Nivel medio-bajo\\", \\"Estrés\\": \\"Alto\\"}").
Output the priority areas as an array of the top 3 priority areas for the user in the 'priorityAreas' field.
Output the summary of the assessment results as a concise paragraph in the 'feedback' field.

Ensure the response is in Spanish.
`,
});

const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: InitialAssessmentInputSchema,
    outputSchema: InitialAssessmentOutputSchema, // Flow promises the application-friendly schema
  },
  async (input): Promise<InitialAssessmentOutput> => {
    const {output: aiResponse} = await prompt(input); // aiResponse is of type AIResponseSchema

    if (!aiResponse || !aiResponse.emotionalProfileJSON || !aiResponse.priorityAreas || !aiResponse.feedback) {
      throw new Error('AI response was incomplete or did not match the expected AIResponseSchema.');
    }

    let parsedEmotionalProfile: Record<string, string>;
    try {
      parsedEmotionalProfile = JSON.parse(aiResponse.emotionalProfileJSON);
      // Further validate that the parsed object is indeed Record<string, string>
      const validationResult = z.record(z.string(), z.string()).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("Parsed emotionalProfileJSON does not match Record<string, string>:", validationResult.error);
        throw new Error('Parsed emotionalProfileJSON did not conform to the expected map structure.');
      }
      parsedEmotionalProfile = validationResult.data;
    } catch (e) {
      console.error("Failed to parse emotionalProfileJSON from AI response:", aiResponse.emotionalProfileJSON, e);
      throw new Error('AI returned an invalid JSON string for the emotional profile.');
    }

    return {
      emotionalProfile: parsedEmotionalProfile,
      priorityAreas: aiResponse.priorityAreas,
      feedback: aiResponse.feedback,
    };
  }
);
