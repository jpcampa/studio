
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
import { assessmentDimensions } from '@/data/assessmentDimensions'; // Import dimensions data

const InitialAssessmentInputSchema = z.object({
  answers: z
    .record(z.string(), z.number().min(1).max(5)) // item ID to Likert scale score
    .describe('A map of question item identifiers to Likert scale responses (1-5).'),
});
export type InitialAssessmentInput = z.infer<typeof InitialAssessmentInputSchema>;

const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.number().min(1).max(5)) // Dimension NAME to NUMERIC score (1-5)
    .describe('A map of emotional dimension names to their numeric assessment score (1-5, e.g., "Calma en la Tormenta": 3.5).'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority dimension names for the user (e.g., ["Calma en la Tormenta", "Mente Abierta, Cambio Ágil"]).'),
  feedback: z.string().describe('A summary of the assessment results in Spanish.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// Schema for the direct AI response, where emotionalProfile is a JSON string of dimensionName: numericScore
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their NUMERIC assessment score (1-5). Keys are dimension names. Example: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": 3.2, \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": 4.5}"'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().describe('A summary of the assessment results in Spanish.'),
});

const PromptTemplateInputSchema = z.object({
  answers: z.record(z.string(), z.number().min(1).max(5)),
  itemDetails: z.record(z.string(), z.object({
    text: z.string().describe('The text of the question item.'),
    dimensionName: z.string().describe('The name of the dimension this item belongs to.'),
    isInverse: z.boolean().optional().describe('True if the item scoring should be considered inverted for interpretation.'),
  })).describe('Details about each question item, including its text, dimension, and if it is inversely scored.'),
});
type PromptTemplateInput = z.infer<typeof PromptTemplateInputSchema>;

const PromptHandlebarsInputSchema = z.object({
  itemsTextArray: z.array(z.string()).describe('An array of strings, each representing a formatted question and answer with its dimension context.'),
  dimensionNames: z.array(z.string()).describe('An array of all dimension names for reference.'),
});
type PromptHandlebarsInput = z.infer<typeof PromptHandlebarsInputSchema>;


export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  const itemDetails: Record<string, { text: string, dimensionName: string, isInverse?: boolean }> = {};
  const dimensionNames: string[] = [];
  assessmentDimensions.forEach(dim => {
    dimensionNames.push(dim.name);
    dim.items.forEach(item => {
      itemDetails[item.id] = {
        text: item.text,
        dimensionName: dim.name,
        isInverse: item.isInverse
      };
    });
  });

  const promptFlowInput: PromptTemplateInput = {
    answers: input.answers,
    itemDetails: itemDetails,
  };
  console.log("InitialAssessmentFlow: Input to flow (PromptTemplateInput):", JSON.stringify(promptFlowInput, null, 2).substring(0,1000) + "...");
  return initialAssessmentFlow(promptFlowInput, dimensionNames);
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  input: {schema: PromptHandlebarsInputSchema},
  output: {schema: AIResponseSchema},
  prompt: `You are an AI assistant specialized in interpreting psychological questionnaire responses to provide a personalized profile.
The user has answered a series of items rated on a 1-5 Likert scale (1=Strongly Disagree/Very Infrequently, 5=Strongly Agree/Very Frequently).
For items marked with "(Interpretación Inversa)" in their text, a lower score (e.g., 1 or 2) actually indicates a more positive or desirable state for that specific item, and a higher score (e.g., 4 or 5) indicates a less desirable state. Please take this inversion into account for your analysis of those specific items when evaluating the overall dimension.

User's Answers (Dimension - Item Text (Inverse status if applicable): Score):
{{#each itemsTextArray}}
  {{{this}}}
{{/each}}

Based on all these item responses, please perform the following tasks IN SPANISH. ALL fields in your response are MANDATORY:

1.  **Emotional Profile (emotionalProfileJSON)**: For each of the 12 psychological dimensions listed below, provide a NUMERIC score from 1.0 to 5.0 (you can use one decimal place, e.g., 3.5) representing the user's current standing in that dimension. This score must be based on an integrated analysis of all items belonging to that dimension, considering any inverse scoring. Format this entire profile as a single, valid JSON string where keys are the full dimension names (e.g., "Calma en la Tormenta (Regulación Emocional y Estrés)") and values are your NUMERIC scores (1.0-5.0) for each. Ensure all 12 dimensions are present as keys in the JSON.
    Dimension Names: {{#each dimensionNames}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}.
    Example for emotionalProfileJSON field: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": 3.2, \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": 4.5, ...}"

2.  **Priority Areas (priorityAreas)**: Identify EXACTLY 3 psychological dimensions (using their full names as provided in the input context, e.g., "Foco y Constancia (Autorregulación y Responsabilidad)") that you consider priority areas for the user to focus on for their development or well-being. These should be areas where improvement would be most beneficial, or where current scores (considering item inversions) suggest a significant need for attention. This field must be an array of 3 strings.

3.  **Feedback (feedback)**: Provide a concise (2-3 paragraphs), empathetic, and constructive overall summary of the assessment. This feedback must be encouraging, acknowledge potential strengths, and gently highlight areas for growth based on the profile. Avoid overly technical jargon. Frame it as a starting point for self-discovery. This field must be a non-empty string.

Ensure all textual output (priority area names, and the overall feedback) is in Spanish. The emotionalProfileJSON must contain numeric scores.
`,
});

// The flow now accepts dimensionNames as a second parameter
const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: PromptTemplateInputSchema, // Flow's external input
    outputSchema: InitialAssessmentOutputSchema, // Flow's output to the application
  },
  async (flowInput: PromptTemplateInput, dimensionNames: string[]): Promise<InitialAssessmentOutput> => {
    console.log('InitialAssessmentFlow: Received flowInput (PromptTemplateInput):', JSON.stringify(flowInput, null, 2).substring(0, 1000) + '...');
    console.log('InitialAssessmentFlow: Received dimensionNames:', dimensionNames);

    const itemsTextArray: string[] = [];
    const currentAnswers = flowInput.answers;
    const currentItemDetails = flowInput.itemDetails;

    for (const itemId in currentAnswers) {
      if (Object.prototype.hasOwnProperty.call(currentAnswers, itemId)) {
        const answer = currentAnswers[itemId];
        const detail = currentItemDetails[itemId];
        if (detail) {
          itemsTextArray.push(
            `${detail.dimensionName} - "${detail.text}" ${detail.isInverse ? '(Interpretación Inversa)' : ''}: ${answer}`
          );
        } else {
           console.warn(`InitialAssessmentFlow: No details found for itemId: ${itemId}. Skipping this item for prompt.`);
        }
      }
    }
    const handlebarsInput: PromptHandlebarsInput = { itemsTextArray, dimensionNames };
    console.log('InitialAssessmentFlow: Prepared handlebarsInput (PromptHandlebarsInput):', JSON.stringify(handlebarsInput, null, 2).substring(0,1000) + "...");

    const {output: aiResponse} = await prompt(handlebarsInput);
    console.log('InitialAssessmentFlow: Received aiResponse from prompt:', JSON.stringify(aiResponse, null, 2));

    if (!aiResponse || !aiResponse.emotionalProfileJSON || !aiResponse.priorityAreas || !aiResponse.feedback) {
      console.error('InitialAssessmentFlow Error: AI response was incomplete or did not match the expected AIResponseSchema.', aiResponse);
      throw new Error('La respuesta de la IA fue incompleta o no tuvo el formato esperado.');
    }
     if (aiResponse.priorityAreas.length === 0) {
      console.error('InitialAssessmentFlow Error: AI response priorityAreas is an empty array.', aiResponse);
      throw new Error('La IA no identificó áreas prioritarias.');
    }
    if (aiResponse.feedback.trim() === '') {
      console.error('InitialAssessmentFlow Error: AI response feedback is an empty string.', aiResponse);
      throw new Error('La IA no proporcionó un feedback resumen.');
    }

    let parsedEmotionalProfile: Record<string, number>;
    try {
      console.log('InitialAssessmentFlow: Attempting to parse emotionalProfileJSON:', aiResponse.emotionalProfileJSON);
      parsedEmotionalProfile = JSON.parse(aiResponse.emotionalProfileJSON);
      // Validate that parsedEmotionalProfile is Record<string, number>
      const validationResult = z.record(z.string(), z.number().min(1).max(5)).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("InitialAssessmentFlow Error: Parsed emotionalProfileJSON does not match Record<string, number>:", validationResult.error.flatten(), "Original JSON:", aiResponse.emotionalProfileJSON, "Parsed Object:", parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA no tiene el formato de mapa de puntuaciones numéricas esperado.');
      }
      parsedEmotionalProfile = validationResult.data; // Use validated data
      if (Object.keys(parsedEmotionalProfile).length === 0) {
        console.error('InitialAssessmentFlow Error: Parsed emotionalProfile is an empty object.', parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA está vacío.');
      }
      // Ensure all dimension names are present as keys (optional, depends on strictness)
      if (dimensionNames.some(dn => !(dn in parsedEmotionalProfile))) {
        console.warn('InitialAssessmentFlow Warning: Not all expected dimensions were found in AI emotional profile.', parsedEmotionalProfile, dimensionNames);
        // Depending on requirements, you could throw an error here or fill missing ones with a default.
        // For now, we proceed with what was returned.
      }

    } catch (e: any) {
      console.error("InitialAssessmentFlow Error: Failed to parse emotionalProfileJSON from AI response:", aiResponse.emotionalProfileJSON, "Error:", e.message);
      throw new Error('La IA devolvió un perfil emocional en formato JSON inválido o con tipos incorrectos.');
    }

    const finalOutput: InitialAssessmentOutput = {
      emotionalProfile: parsedEmotionalProfile,
      priorityAreas: aiResponse.priorityAreas,
      feedback: aiResponse.feedback,
    };
    console.log('InitialAssessmentFlow: Returning finalOutput to action:', JSON.stringify(finalOutput, null, 2));
    return finalOutput;
  }
);

    