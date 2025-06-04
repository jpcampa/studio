
"use server";

import { initialAssessment, type InitialAssessmentInput, type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { z } from 'zod';

const assessmentAnswersSchema = z.record(z.string(), z.coerce.number().min(1).max(5));

export type ServerAssessmentResult = 
  | { success: true; data: InitialAssessmentOutput }
  | { success: false; error: string };

export async function submitAssessment(
  answers: Record<string, number>
): Promise<ServerAssessmentResult> {
  try {
    console.log("SubmitAssessment Action START: Received raw answers:", JSON.stringify(answers));
    const validatedAnswers = assessmentAnswersSchema.safeParse(answers);

    if (!validatedAnswers.success) {
        console.error("SubmitAssessment Action: Validation of input answers failed:", validatedAnswers.error.flatten());
        return { success: false, error: "Datos de evaluación de entrada inválidos: " + JSON.stringify(validatedAnswers.error.flatten().fieldErrors) };
    }
    console.log("SubmitAssessment Action: Validated answers:", JSON.stringify(validatedAnswers.data));

    const input: InitialAssessmentInput = {
      answers: validatedAnswers.data,
    };

    console.log("SubmitAssessment Action: Calling initialAssessment flow with input:", JSON.stringify(input));
    const result = await initialAssessment(input);
    console.log("SubmitAssessment Action: Received result object from initialAssessment flow:", JSON.stringify(result, null, 2));
    
    // Validate the structure of the result, especially emotionalProfile's values
    // and ensure priorityAreas and feedback are present and correctly typed.
    // The InitialAssessmentOutputSchema from the flow already does a good job,
    // but an extra check here can catch issues if the flow's schema validation was bypassed or incomplete.
    if (!result || 
        !result.emotionalProfile || 
        Object.keys(result.emotionalProfile).length === 0 ||
        Object.values(result.emotionalProfile).some(score => typeof score !== 'number' || score < 1 || score > 5) ||
        !result.priorityAreas || result.priorityAreas.length !== 3 || result.priorityAreas.some(area => typeof area !== 'string' || area.trim() === '') ||
        !result.feedback || typeof result.feedback !== 'string' || result.feedback.trim() === '') {
        
        let specificError = "Respuesta incompleta o malformada de la IA.";
        if (!result) specificError = "La IA no devolvió ningún resultado.";
        else if (!result.emotionalProfile || Object.keys(result.emotionalProfile).length === 0) specificError = "La IA no devolvió un perfil emocional.";
        else if (Object.values(result.emotionalProfile).some(score => typeof score !== 'number' || score < 1 || score > 5)) specificError = "El perfil emocional de la IA contiene puntuaciones inválidas (no numéricas o fuera del rango 1-5).";
        else if (!result.priorityAreas || result.priorityAreas.length !== 3 || result.priorityAreas.some(area => typeof area !== 'string' || area.trim() === '')) specificError = "La IA no devolvió exactamente 3 áreas prioritarias válidas.";
        else if (!result.feedback || typeof result.feedback !== 'string' || result.feedback.trim() === '') specificError = "La IA no devolvió un feedback válido.";

        console.error("SubmitAssessment Action: Result from AI flow considered incomplete or malformed. Specific error:", specificError, "Full AI result:", result);
        throw new Error(specificError);
    }

    console.log("SubmitAssessment Action END: Assessment successfully processed. Returning success.");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("SubmitAssessment Action: Error during assessment processing:", error.message, error.stack);
    if (error instanceof z.ZodError) { // This would be for the input `assessmentAnswersSchema`
      return { success: false, error: "Datos de evaluación de entrada inválidos: " + JSON.stringify(error.flatten().fieldErrors) };
    }
    // For errors thrown from the flow or the explicit checks above
    const errorMessage = error.message || "Error desconocido al procesar la evaluación.";
    return { success: false, error: errorMessage };
  }
}
