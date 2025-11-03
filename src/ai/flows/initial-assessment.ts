
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
  priorityAreas: z.array(z.string()).min(3, "Debe haber al menos 3 áreas prioritarias.").max(3, "Debe haber exactamente 3 áreas prioritarias.").describe('An array of the top 3 priority dimension names for the user (e.g., ["Calma en la Tormenta (Regulación Emocional y Estrés)", "Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)"]).'),
  feedback: z.string().min(1, "El feedback no puede estar vacío.").describe('A summary of the assessment results in Spanish.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// Schema for the direct AI response, where emotionalProfile is a JSON string of dimensionName: numericScore
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their NUMERIC assessment score (1-5). Keys are dimension names. Example: "{\\"Regulación Emocional y Estrés\\": 3.2, \\"Flexibilidad Mental y Adaptabilidad\\": 4.5}"'),
  priorityAreas: z.array(z.string()).min(3).max(3).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().min(1).describe('A summary of the assessment results in Spanish.'),
});

// Schema for the part of the input related to prompt template data (answers, item details)
const PromptTemplateInputSchema = z.object({
  answers: z.record(z.string(), z.number().min(1).max(5)),
  itemDetails: z.record(z.string(), z.object({
    text: z.string().describe('The text of the question item.'),
    dimensionName: z.string().describe('The name of the dimension this item belongs to.'),
    isInverse: z.boolean().optional().describe('True if the item scoring should be considered inverted for interpretation.'),
  })).describe('Details about each question item, including its text, dimension, and if it is inversely scored.'),
});
type PromptTemplateInput = z.infer<typeof PromptTemplateInputSchema>;

// NEW: Schema for the input to the flow itself, combining prompt input and dimension names
const FlowInternalInputSchema = z.object({
  promptData: PromptTemplateInputSchema,
  allDimensionNames: z.array(z.string()),
});
export type FlowInternalInput = z.infer<typeof FlowInternalInputSchema>;


// Schema for the data passed to the Handlebars template for the prompt
const PromptHandlebarsInputSchema = z.object({
  itemsTextArray: z.array(z.string()).describe('An array of strings, each representing a formatted question and answer with its dimension context.'),
  dimensionNamesForPrompt: z.array(z.string()).describe('An array of all dimension names for reference within the prompt.'),
});
type PromptHandlebarsInput = z.infer<typeof PromptHandlebarsInputSchema>;


export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  const itemDetails: Record<string, { text: string, dimensionName: string, isInverse?: boolean }> = {};
  const dimensionNames: string[] = []; // This will be the list of actual dimension names
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
  
  const flowEntryPointInput: FlowInternalInput = { // This object matches FlowInternalInputSchema
    promptData: promptFlowInput,
    allDimensionNames: dimensionNames, // Pass the populated dimensionNames array
  };
  console.log("InitialAssessment Function: Calling flow with flowEntryPointInput (first 1000 chars):", JSON.stringify(flowEntryPointInput, null, 2).substring(0,1000) + "...");
  return initialAssessmentFlow(flowEntryPointInput); // Calling the flow with a single object
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  input: {schema: PromptHandlebarsInputSchema},
  output: {schema: AIResponseSchema},
  prompt: `You are an AI assistant specialized in interpreting psychological questionnaire responses to provide a personalized profile.
The user has answered a series of items rated on a 1-5 Likert scale (1=Nada, 5=Mucho).

**SCORING RULES:**
1.  **Personality Dimensions (11 total):** For these, you will calculate a MEAN score. Before calculating, you must INVERT the scores for items marked as "(Inversa)". To invert a score, use this formula: Inverted Score = 6 - Original Score. (e.g., 1 becomes 5, 2 becomes 4, etc.). After inverting, calculate the average of all items in the dimension. The final score for each of these 11 dimensions must be a number between 1.0 and 5.0.
2.  **State Scales (Estado de Ánimo, Ansiedad Estado):** For these two specific scales, you will calculate a SUM of the raw scores (no inversion needed). Then, you will convert this sum to a 1-5 scale using the provided formulas, and finally, INVERT the result on the 1-5 scale.
    *   **Estado de Ánimo (12 items):** Range 12-60. Formula: \`((SUM - 12) / 48) * 4 + 1\`. Then, \`Final Score = 6 - Converted Score\`.
    *   **Ansiedad Estado (6 items):** Range 6-30. Formula: \`((SUM - 6) / 24) * 4 + 1\`. Then, \`Final Score = 6 - Converted Score\`.

**User's Answers (Dimension - Item Text (Inverse status if applicable): Score):**
{{#each itemsTextArray}}
  {{{this}}}
{{/each}}

Based on all these item responses, please perform the following tasks IN SPANISH. ALL fields in your response are MANDATORY and your entire output must be a single valid JSON object matching the AIResponseSchema:

1.  **Emotional Profile (emotionalProfileJSON)**: For each of the 13 psychological dimensions listed below, provide a NUMERIC score from 1.0 to 5.0 (you can use one decimal place, e.g., 3.5) calculated according to the SCORING RULES above.
    **Crucially, the value for 'emotionalProfileJSON' MUST BE A STRING containing a valid JSON object where keys are the dimension names (e.g., "Regulación Emocional y Estrés") and values are your NUMERIC scores (1.0-5.0) for each. Ensure all 13 dimensions are present as keys in this JSON string.**
    Dimension Names: {{#each dimensionNamesForPrompt}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}.

2.  **Priority Areas (priorityAreas)**: Identify EXACTLY 3 psychological dimensions (using their full names) that you consider priority areas for the user to focus on for their development or well-being. These should be areas where improvement would be most beneficial, based on their scores.

3.  **Feedback (feedback)**: Provide a concise (2-3 paragraphs), empathetic, and constructive overall summary of the assessment. This feedback must be encouraging, acknowledge potential strengths, and gently highlight areas for growth based on the profile. Avoid overly technical jargon. Frame it as a starting point for self-discovery.

Ensure your entire response is a single, valid JSON object. Do not include any text outside of this JSON structure.
The \`emotionalProfileJSON\` field MUST BE A JSON STRING.
`,
});

const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: FlowInternalInputSchema, // Flow expects this schema
    outputSchema: InitialAssessmentOutputSchema,
  },
  // Flow implementation takes a single argument matching FlowInternalInputSchema
  async (flowActualInput: FlowInternalInput): Promise<InitialAssessmentOutput> => {
    console.log('InitialAssessmentFlow START: Received flowActualInput (FlowInternalInput) (first 1000 chars):', JSON.stringify(flowActualInput, null, 2).substring(0, 1000) + '...');
    
    // Destructure the single input object
    const { promptData, allDimensionNames } = flowActualInput; 
    console.log('InitialAssessmentFlow: Extracted allDimensionNames from flowActualInput:', allDimensionNames); // Crucial log

    const itemsTextArray: string[] = [];
    const currentAnswers = promptData.answers;
    const currentItemDetails = promptData.itemDetails;

    for (const itemId in currentAnswers) {
      if (Object.prototype.hasOwnProperty.call(currentAnswers, itemId)) {
        const answer = currentAnswers[itemId];
        const detail = currentItemDetails[itemId];
        if (detail) {
          itemsTextArray.push(
            `${detail.dimensionName} - "${detail.text}" ${detail.isInverse ? '(Inversa)' : ''}: ${answer}`
          );
        } else {
           console.warn(`InitialAssessmentFlow: No details found for itemId: ${itemId}. Skipping this item for prompt.`);
        }
      }
    }
    
    // Prepare input for the prompt using the extracted dimension names
    const handlebarsInputForPrompt: PromptHandlebarsInput = { 
        itemsTextArray, 
        dimensionNamesForPrompt: allDimensionNames // Use extracted names
    };
    console.log('InitialAssessmentFlow: Prepared handlebarsInputForPrompt (PromptHandlebarsInput) (first 1000 chars):', JSON.stringify(handlebarsInputForPrompt, null, 2).substring(0,1000) + "...");

    const {output: aiResponse} = await prompt(handlebarsInputForPrompt); // Pass correct object to prompt
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

      const validationResult = z.record(z.string(), z.number().min(1).max(5)).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("InitialAssessmentFlow Error: Parsed emotionalProfileJSON does not match Record<string, number> with scores 1-5:", validationResult.error.flatten(), "Original JSON String:", aiResponse.emotionalProfileJSON, "Parsed Object for Zod:", parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA no tiene el formato de mapa de puntuaciones numéricas esperado (1-5) o los nombres de las dimensiones no son strings.');
      }
      parsedEmotionalProfile = validationResult.data; 
      if (Object.keys(parsedEmotionalProfile).length === 0) {
        console.error('InitialAssessmentFlow Error: Parsed emotionalProfile is an empty object.', parsedEmotionalProfile);
        throw new Error('El perfil emocional devuelto por la IA está vacío.');
      }
    } catch (e: any) {
      console.error("InitialAssessmentFlow Error: Failed to parse or validate emotionalProfileJSON. Raw JSON string was:", `"${aiResponse.emotionalProfileJSON}"`, "Error message:", e.message, "Stack:", e.stack);
      // El error e.message aquí SÍ será del JSON.parse o la validación Zod.
      throw new Error(`La IA devolvió un perfil emocional en formato JSON inválido o con estructura incorrecta. El JSON recibido fue: "${aiResponse.emotionalProfileJSON}". Error: ${e.message}`);
    }

    // Moved this check outside the try...catch for JSON parsing
    // Check if allDimensionNames is a valid array before using .some()
    console.log('InitialAssessmentFlow: Checking allDimensionNames before .some() call. Value:', allDimensionNames, 'Is Array:', Array.isArray(allDimensionNames));
    if (Array.isArray(allDimensionNames) && allDimensionNames.length > 0) {
        if (allDimensionNames.some(dn => !(dn in parsedEmotionalProfile))) {
            console.warn('InitialAssessmentFlow Warning: Not all expected dimensions were found in AI emotional profile. Missing ones will not have scores.', 
            'Expected (allDimensionNames):', allDimensionNames, 'Received keys (from parsedEmotionalProfile):', Object.keys(parsedEmotionalProfile));
            // Depending on requirements, you could throw an error here or fill missing ones with a default.
            // For now, we proceed with what was returned.
        }
    } else {
        console.warn('InitialAssessmentFlow Warning: allDimensionNames is not a valid array or is empty. Skipping check for all dimensions in profile. Value of allDimensionNames:', allDimensionNames);
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
