
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
    .record(z.string(), z.number().min(1).max(5)) // item ID to score
    .describe('A map of question item identifiers to Likert scale responses (1-5).'),
});
export type InitialAssessmentInput = z.infer<typeof InitialAssessmentInputSchema>;

const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.string()) // Dimension name to textual assessment
    .describe('A map of emotional dimensions to their assessment (e.g., "Calma en la Tormenta": "Nivel medio-bajo").'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().describe('A summary of the assessment results in Spanish.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// Schema for the direct AI response, where emotionalProfile is a JSON string
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their assessment. Keys are dimension names. Example: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": \\"Nivel adecuado\\", \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": \\"Fortaleza notable\\"}"'),
  priorityAreas: z.array(z.string()).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().describe('A summary of the assessment results in Spanish.'),
});

// Schema for the data actually passed to the prompt's Handlebars template logic by the flow
const PromptTemplateInputSchema = z.object({
  answers: z.record(z.string(), z.number().min(1).max(5)),
  itemDetails: z.record(z.string(), z.object({
    text: z.string().describe('The text of the question item.'),
    dimensionName: z.string().describe('The name of the dimension this item belongs to.'),
    isInverse: z.boolean().optional().describe('True if the item scoring should be considered inverted for interpretation.'),
  })).describe('Details about each question item, including its text, dimension, and if it is inversely scored.'),
});
type PromptTemplateInput = z.infer<typeof PromptTemplateInputSchema>;

// New schema for the actual data passed to the Handlebars template engine via the prompt object
const PromptHandlebarsInputSchema = z.object({
  itemsTextArray: z.array(z.string()).describe('An array of strings, each representing a formatted question and answer.'),
});
type PromptHandlebarsInput = z.infer<typeof PromptHandlebarsInputSchema>;


export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  // Prepare itemDetails from assessmentDimensions to provide context
  const itemDetails: Record<string, { text: string, dimensionName: string, isInverse?: boolean }> = {};
  assessmentDimensions.forEach(dim => {
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
  return initialAssessmentFlow(promptFlowInput);
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  input: {schema: PromptHandlebarsInputSchema}, // Prompt now expects this simpler schema
  output: {schema: AIResponseSchema},
  prompt: `You are an AI assistant specialized in interpreting psychological questionnaire responses to provide a personalized profile.
The user has answered a series of items rated on a 1-5 Likert scale (1=Strongly Disagree/Very Infrequently, 5=Strongly Agree/Very Frequently).
For items marked with "(Interpretación Inversa)" in their text, a lower score (e.g., 1 or 2) actually indicates a more positive or desirable state for that specific item, and a higher score (e.g., 4 or 5) indicates a less desirable state. Please take this inversion into account for your analysis of those specific items when evaluating the overall dimension.

User's Answers (Dimension - Item Text (Inverse status if applicable): Score):
{{#each itemsTextArray}}
  {{{this}}}
{{/each}}

Based on all these item responses, please perform the following tasks IN SPANISH. ALL fields in your response are MANDATORY:

1.  **Emotional Profile (emotionalProfileJSON)**: For each of the 12 psychological dimensions, provide a concise textual assessment of the user's current standing in that dimension. Examples: "Nivel medio-bajo", "Fortaleza notable", "Área de mejora clara", "Adecuado, con potencial de crecimiento", "Parece ser un desafío actual". This assessment must be based on an integrated analysis of all items belonging to that dimension, considering any inverse scoring. Format this entire profile as a single, valid JSON string where keys are the full dimension names (e.g., "Calma en la Tormenta (Regulación Emocional y Estrés)") and values are your textual assessments for each. Ensure all 12 dimensions are present as keys in the JSON.
    Example for emotionalProfileJSON field: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": \\"Nivel adecuado con algunos desafíos puntuales\\", \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": \\"Fortaleza notable\\"}"

2.  **Priority Areas (priorityAreas)**: Identify EXACTLY 3 psychological dimensions (using their full names as provided in the input context, e.g., "Foco y Constancia (Autorregulación y Responsabilidad)") that you consider priority areas for the user to focus on for their development or well-being. These should be areas where improvement would be most beneficial, or where current scores (considering item inversions) suggest a significant need for attention. This field must be an array of 3 strings.

3.  **Feedback (feedback)**: Provide a concise (2-3 paragraphs), empathetic, and constructive overall summary of the assessment. This feedback must be encouraging, acknowledge potential strengths, and gently highlight areas for growth based on the profile. Avoid overly technical jargon. Frame it as a starting point for self-discovery. This field must be a non-empty string.

Ensure all textual output (assessments in the JSON, priority area names, and the overall feedback) is in Spanish.
`,
});

const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: PromptTemplateInputSchema, // Flow's external input (from initialAssessment wrapper)
    outputSchema: InitialAssessmentOutputSchema, // Flow's output to the application
  },
  async (flowInput: PromptTemplateInput): Promise<InitialAssessmentOutput> => {
    console.log('InitialAssessmentFlow: Received flowInput (PromptTemplateInput):', JSON.stringify(flowInput, null, 2).substring(0, 1000) + '...');

    // Transform flowInput to PromptHandlebarsInput
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
    const handlebarsInput: PromptHandlebarsInput = { itemsTextArray };
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

    let parsedEmotionalProfile: Record<string, string>;
    try {
      console.log('InitialAssessmentFlow: Attempting to parse emotionalProfileJSON:', aiResponse.emotionalProfileJSON);
      parsedEmotionalProfile = JSON.parse(aiResponse.emotionalProfileJSON);
      const validationResult = z.record(z.string(), z.string()).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("InitialAssessmentFlow Error: Parsed emotionalProfileJSON does not match Record<string, string>:", validationResult.error.flatten(), "Original JSON:", aiResponse.emotionalProfileJSON, "Parsed Object:", parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA no tiene el formato de mapa esperado.');
      }
      parsedEmotionalProfile = validationResult.data;
      if (Object.keys(parsedEmotionalProfile).length === 0) {
        console.error('InitialAssessmentFlow Error: Parsed emotionalProfile is an empty object.', parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA está vacío.');
      }
    } catch (e: any) {
      console.error("InitialAssessmentFlow Error: Failed to parse emotionalProfileJSON from AI response:", aiResponse.emotionalProfileJSON, "Error:", e.message);
      throw new Error('La IA devolvió un perfil emocional en formato JSON inválido.');
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
