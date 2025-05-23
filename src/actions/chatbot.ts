"use server";

import { emotionalChatbot, type EmotionalChatbotInput, type EmotionalChatbotOutput } from '@/ai/flows/emotional-chatbot';
import { z } from 'zod';

const chatbotMessageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío."),
  context: z.string().optional(),
});

export type ServerChatbotResult =
  | { success: true; data: EmotionalChatbotOutput }
  | { success: false; error: string };

export async function sendMessageToChatbot(
  userInput: { message: string; context?: string }
): Promise<ServerChatbotResult> {
  try {
    const validatedInput = chatbotMessageSchema.parse(userInput);

    const input: EmotionalChatbotInput = {
      message: validatedInput.message,
      context: validatedInput.context,
    };

    const result = await emotionalChatbot(input);

    if (!result || !result.response) {
      throw new Error("Respuesta incompleta del chatbot IA.");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos de mensaje inválidos: " + error.message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al comunicarse con el chatbot." };
  }
}
