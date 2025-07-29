
'use server';

/**
 * @fileOverview An AI-powered assistant that answers questions based on a provided knowledge base.
 *
 * - knowledgeAssistant - A function that handles the RAG interaction.
 * - KnowledgeAssistantInput - The input type for the knowledgeAssistant function.
 * - KnowledgeAssistantOutput - The return type for the knowledgeAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { documents } from '@/data/knowledgeBase'; // Import the documents

const KnowledgeAssistantInputSchema = z.object({
  question: z.string().describe('The user question about the provided documents.'),
  context: z
    .string()
    .optional()
    .describe('Previous messages in the conversation to maintain context.'),
});
export type KnowledgeAssistantInput = z.infer<typeof KnowledgeAssistantInputSchema>;

const KnowledgeAssistantOutputSchema = z.object({
  response: z.string().describe('The assistant\'s answer, based *only* on the provided documents.'),
});
export type KnowledgeAssistantOutput = z.infer<typeof KnowledgeAssistantOutputSchema>;

// Combine all documents into a single string for the prompt context
const knowledgeBaseContent = documents.join('\n\n---\n\n');

export async function knowledgeAssistant(input: KnowledgeAssistantInput): Promise<KnowledgeAssistantOutput> {
  return knowledgeAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeAssistantPrompt',
  input: {schema: KnowledgeAssistantInputSchema},
  output: {schema: KnowledgeAssistantOutputSchema},
  prompt: `Eres un asistente experto que responde preguntas basándose EXCLUSIVAMENTE en la información contenida en los siguientes documentos.

**Reglas Importantes:**
1.  **No uses conocimiento externo.** Tu única fuente de verdad son los documentos que se te proporcionan a continuación.
2.  **Si la respuesta no se encuentra en los documentos, debes decirlo claramente.** Responde con una frase como "Lo siento, pero no he encontrado información sobre eso en los documentos proporcionados" o "Esa información no está disponible en la base de conocimiento". NO intentes adivinar ni inferir.
3.  **Cita la fuente si es posible.** Si un documento tiene un título, menciónalo.
4.  **Sé directo y preciso.** Responde a la pregunta del usuario de la forma más clara posible usando la información de los documentos.

**Documentos de la Base de Conocimiento:**
---
{{{knowledgeBaseContent}}}
---

**Historial de la Conversación (para contexto):**
{{context}}

**Pregunta del Usuario:**
{{{question}}}

**Respuesta (basada únicamente en los documentos):**
`,
  // We are injecting the knowledge base content directly into the prompt template.
  // Note: This is a simple approach. For larger document sets, a vector database
  // and retrieval system (like Genkit's indexing feature) would be more efficient.
  custom: {
    knowledgeBaseContent: knowledgeBaseContent,
  }
});

const knowledgeAssistantFlow = ai.defineFlow(
  {
    name: 'knowledgeAssistantFlow',
    inputSchema: KnowledgeAssistantInputSchema,
    outputSchema: KnowledgeAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

