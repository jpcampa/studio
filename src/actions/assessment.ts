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
    const validatedAnswers = assessmentAnswersSchema.parse(answers);

    const input: InitialAssessmentInput = {
      answers: validatedAnswers,
    };

    const result = await initialAssessment(input);
    
    if (!result || !result.emotionalProfile || !result.priorityAreas || !result.feedback) {
        throw new Error("Respuesta incompleta de la IA.");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error submitting assessment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de evaluación inválidos: " + error.message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al procesar la evaluación." };
  }
}
