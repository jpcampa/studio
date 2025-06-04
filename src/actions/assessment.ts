
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
    // The initialAssessment function now correctly returns InitialAssessmentOutput
    // which expects emotionalProfile to be Record<string, number>
    const result = await initialAssessment(input);
    console.log("SubmitAssessment Action: Received result from initialAssessment flow:", JSON.stringify(result, null, 2));
    
    // Validate the structure of the result, especially emotionalProfile's values
    if (!result || 
        !result.emotionalProfile || Object.keys(result.emotionalProfile).length === 0 ||
        // Check if all values in emotionalProfile are numbers
        Object.values(result.emotionalProfile).some(score => typeof score !== 'number' || score < 1 || score > 5) ||
        !result.priorityAreas || result.priorityAreas.length === 0 ||
        !result.feedback || result.feedback.trim() === '') {
        console.error("SubmitAssessment Action: Result from AI flow considered incomplete or malformed.", result);
        throw new Error(result?.feedback === '' || result?.priorityAreas?.length === 0 || Object.values(result.emotionalProfile || {}).some(score => typeof score !== 'number')
            ? "La IA no proporcionó todos los detalles necesarios (feedback, áreas prioritarias o puntuaciones válidas)." 
            : "Respuesta incompleta o malformada de la IA.");
    }

    console.log("SubmitAssessment Action: Assessment successfully processed. Returning success.");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("SubmitAssessment Action: Error during assessment processing:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de evaluación inválidos: " + error.flatten().fieldErrors };
    }
    const errorMessage = error.message || "Error al procesar la evaluación.";
    return { success: false, error: errorMessage };
  }
}

    