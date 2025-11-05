"use server";

import { knowledgeAssistant, type KnowledgeAssistantInput, type KnowledgeAssistantOutput } from '@/ai/flows/knowledge-assistant';
import { z } from 'zod';

const knowledgeAssistantMessageSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía."),
  context: z.string().optional(),
});

export type ServerKnowledgeAssistantResult =
  | { success: true; data: KnowledgeAssistantOutput }
  | { success: false; error: string };

export async function sendMessageToKnowledgeAssistant(
  userInput: { question: string; context?: string }
): Promise<ServerKnowledgeAssistantResult> {
  try {
    const validatedInput = knowledgeAssistantMessageSchema.parse(userInput);

    const input: KnowledgeAssistantInput = {
      question: validatedInput.question,
      context: validatedInput.context,
    };

    const result = await knowledgeAssistant(input);

    if (!result || !result.response) {
      throw new Error("Respuesta incompleta del asistente de conocimiento.");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending message to knowledge assistant:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de mensaje inválidos: " + error.message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al comunicarse con el asistente." };
  }
}
