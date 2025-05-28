
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
    console.log("SubmitAssessment Action: Received answers:", JSON.stringify(answers));
    const validatedAnswers = assessmentAnswersSchema.parse(answers);
    console.log("SubmitAssessment Action: Validated answers:", JSON.stringify(validatedAnswers));

    const input: InitialAssessmentInput = {
      answers: validatedAnswers,
    };

    console.log("SubmitAssessment Action: Calling initialAssessment flow with input:", JSON.stringify(input));
    const result = await initialAssessment(input);
    console.log("SubmitAssessment Action: Received result from initialAssessment flow:", JSON.stringify(result, null, 2));
    
    // Stricter check for truly complete and usable data
    if (!result || 
        !result.emotionalProfile || Object.keys(result.emotionalProfile).length === 0 ||
        !result.priorityAreas || result.priorityAreas.length === 0 ||
        !result.feedback || result.feedback.trim() === '') {
        console.error("SubmitAssessment Action: Result from AI flow considered incomplete.", result);
        // Prefer the error message from the flow if it exists and indicates a specific issue
        // Otherwise, use a generic message. This path might not be hit if the flow itself throws.
        throw new Error(result?.feedback === '' || result?.priorityAreas?.length === 0 ? "La IA no proporcionó todos los detalles necesarios (feedback o áreas prioritarias)." : "Respuesta incompleta de la IA.");
    }

    console.log("SubmitAssessment Action: Assessment successfully processed. Returning success.");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("SubmitAssessment Action: Error during assessment processing:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de evaluación inválidos: " + error.flatten().fieldErrors };
    }
    // Use the error message from the caught error if available
    const errorMessage = error.message || "Error al procesar la evaluación.";
    return { success: false, error: errorMessage };
  }
}
