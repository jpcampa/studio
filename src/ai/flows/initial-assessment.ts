
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
  priorityAreas: z.array(z.string()).min(3, "Debe haber al menos 3 áreas prioritarias.").max(3, "Debe haber exactamente 3 áreas prioritarias.").describe('An array of the top 3 priority dimension names for the user (e.g., ["Calma en la Tormenta", "Mente Abierta, Cambio Ágil"]).'),
  feedback: z.string().min(1, "El feedback no puede estar vacío.").describe('A summary of the assessment results in Spanish.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// Schema for the direct AI response, where emotionalProfile is a JSON string of dimensionName: numericScore
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their NUMERIC assessment score (1-5). Keys are dimension names. Example: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": 3.2, \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": 4.5}"'),
  priorityAreas: z.array(z.string()).min(3).max(3).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().min(1).describe('A summary of the assessment results in Spanish.'),
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
  console.log("InitialAssessmentFlow: Input to flow (PromptTemplateInput) (first 1000 chars):", JSON.stringify(promptFlowInput, null, 2).substring(0,1000) + "...");
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

Based on all these item responses, please perform the following tasks IN SPANISH. ALL fields in your response are MANDATORY and your entire output must be a single valid JSON object matching the AIResponseSchema:

1.  **Emotional Profile (emotionalProfileJSON)**: For each of the 12 psychological dimensions listed below, provide a NUMERIC score from 1.0 to 5.0 (you can use one decimal place, e.g., 3.5) representing the user's current standing in that dimension. This score must be based on an integrated analysis of all items belonging to that dimension, considering any inverse scoring.
    **Crucially, the value for 'emotionalProfileJSON' MUST BE A STRING containing a valid JSON object where keys are the full dimension names (e.g., "Calma en la Tormenta (Regulación Emocional y Estrés)") and values are your NUMERIC scores (1.0-5.0) for each. Ensure all 12 dimensions are present as keys in this JSON string.**
    Dimension Names: {{#each dimensionNames}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}.
    Example for the 'emotionalProfileJSON' string field: "{\\"Calma en la Tormenta (Regulación Emocional y Estrés)\\": 3.2, \\"Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)\\": 4.5, \\"Foco y Constancia (Autorregulación y Responsabilidad)\\": 2.8, \\"Voz Propia (Autoafirmación y Expresión Personal)\\": 4.1, \\"Puentes que Conectan (Empatía y Conexión Interpersonal)\\": 3.0, \\"Espejo Interior (Insight y Autoconciencia)\\": 3.7, \\"Norte Vital (Propósito Vital y Dirección Personal)\\": 4.0, \\"Fortaleza Activa (Estilo de Afrontamiento)\\": 3.3, \\"Brújula Ética (Integridad y Coherencia Ética)\\": 4.6, \\"Raíz Propia (Responsabilidad Personal y Aceptación Consciente)\\": 2.5, \\"Red de Apoyo Consciente (Apoyo Social Percibido)\\": 3.8, \\"Valor Reconocido (Percepción de Valoración en el Trabajo)\\": 4.2}"

2.  **Priority Areas (priorityAreas)**: Identify EXACTLY 3 psychological dimensions (using their full names as provided in the input context, e.g., "Foco y Constancia (Autorregulación y Responsabilidad)") that you consider priority areas for the user to focus on for their development or well-being. These should be areas where improvement would be most beneficial, or where current scores (considering item inversions) suggest a significant need for attention. This field must be an array of 3 strings.

3.  **Feedback (feedback)**: Provide a concise (2-3 paragraphs), empathetic, and constructive overall summary of the assessment. This feedback must be encouraging, acknowledge potential strengths, and gently highlight areas for growth based on the profile. Avoid overly technical jargon. Frame it as a starting point for self-discovery. This field must be a non-empty string.

Ensure your entire response is a single, valid JSON object. Do not include any text outside of this JSON structure.
The \\\`emotionalProfileJSON\\\` field MUST BE A JSON STRING.
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
    console.log('InitialAssessmentFlow START: Received flowInput (PromptTemplateInput) (first 1000 chars):', JSON.stringify(flowInput, null, 2).substring(0, 1000) + '...');
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
    console.log('InitialAssessmentFlow: Prepared handlebarsInput (PromptHandlebarsInput) (first 1000 chars):', JSON.stringify(handlebarsInput, null, 2).substring(0,1000) + "...");

    const {output: aiResponse} = await prompt(handlebarsInput);
    console.log('InitialAssessmentFlow: Received RAW aiResponse from prompt (IMPORTANT FOR DEBUGGING JSON):', JSON.stringify(aiResponse, null, 2));

    if (!aiResponse) {
        console.error('InitialAssessmentFlow Error: AI response was null or undefined.');
        throw new Error('La respuesta de la IA fue nula o indefinida.');
    }
    if (typeof aiResponse.emotionalProfileJSON !== 'string' || aiResponse.emotionalProfileJSON.trim() === '') {
        console.error('InitialAssessmentFlow Error: aiResponse.emotionalProfileJSON is not a string or is empty. Received:', aiResponse.emotionalProfileJSON);
        throw new Error('La IA no proporcionó el perfil emocional como una cadena JSON válida.');
    }
    if (!aiResponse.priorityAreas || aiResponse.priorityAreas.length !== 3 || aiResponse.priorityAreas.some(area => typeof area !== 'string' || area.trim() === '')) {
        console.error('InitialAssessmentFlow Error: aiResponse.priorityAreas is missing, empty, not exactly 3 items, or contains invalid items. Received:', aiResponse.priorityAreas);
        throw new Error('La IA no identificó exactamente 3 áreas prioritarias válidas (strings no vacíos).');
    }
    if (typeof aiResponse.feedback !== 'string' || aiResponse.feedback.trim() === '') {
        console.error('InitialAssessmentFlow Error: aiResponse.feedback is not a string or is empty. Received:', aiResponse.feedback);
        throw new Error('La IA no proporcionó un feedback resumen válido (string no vacío).');
    }


    let parsedEmotionalProfile: Record<string, number>;
    try {
      console.log('InitialAssessmentFlow: Attempting to parse emotionalProfileJSON:', aiResponse.emotionalProfileJSON);
      parsedEmotionalProfile = JSON.parse(aiResponse.emotionalProfileJSON);
      console.log('InitialAssessmentFlow: Successfully parsed emotionalProfileJSON. Parsed object:', JSON.stringify(parsedEmotionalProfile, null, 2));

      // Validate that parsedEmotionalProfile is Record<string, number> and scores are within 1-5
      const validationResult = z.record(z.string(), z.number().min(1).max(5)).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("InitialAssessmentFlow Error: Parsed emotionalProfileJSON does not match Record<string, number> with scores 1-5:", validationResult.error.flatten(), "Original JSON String:", aiResponse.emotionalProfileJSON, "Parsed Object for Zod:", parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA no tiene el formato de mapa de puntuaciones numéricas esperado (1-5) o los nombres de las dimensiones no son strings.');
      }
      parsedEmotionalProfile = validationResult.data; // Use validated data
      if (Object.keys(parsedEmotionalProfile).length === 0) {
        console.error('InitialAssessmentFlow Error: Parsed emotionalProfile is an empty object.', parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA está vacío.');
      }
      // Ensure all dimension names are present as keys (optional, depends on strictness)
      if (dimensionNames.some(dn => !(dn in parsedEmotionalProfile))) {
        console.warn('InitialAssessmentFlow Warning: Not all expected dimensions were found in AI emotional profile. Missing ones will not have scores.', 
          'Expected:', dimensionNames, 'Received keys:', Object.keys(parsedEmotionalProfile));
        // Depending on requirements, you could throw an error here or fill missing ones with a default.
        // For now, we proceed with what was returned.
      }

    } catch (e: any) {
      console.error("InitialAssessmentFlow Error: Failed to parse emotionalProfileJSON string from AI response. Raw JSON string was:", `"${aiResponse.emotionalProfileJSON}"`, "Error message:", e.message, "Stack:", e.stack);
      throw new Error(`La IA devolvió un perfil emocional en formato JSON inválido. El JSON recibido fue: "${aiResponse.emotionalProfileJSON}". Error de parseo: ${e.message}`);
    }

    const finalOutput: InitialAssessmentOutput = {
      emotionalProfile: parsedEmotionalProfile,
      priorityAreas: aiResponse.priorityAreas,
      feedback: aiResponse.feedback,
    };
    console.log('InitialAssessmentFlow END: Returning finalOutput to action:', JSON.stringify(finalOutput, null, 2));
    return finalOutput;
  }
);
    

      