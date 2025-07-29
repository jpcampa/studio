
"use client";

import { KnowledgeAssistantInterface } from '@/components/knowledge-assistant/KnowledgeAssistantInterface';
import { useTranslations } from '@/lib/translations';
import { Lightbulb } from 'lucide-react';

export default function KnowledgeAssistantPage() {
  const t = useTranslations();
  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Asistente de Conocimiento</h1>
        <p className="text-muted-foreground">
          Haz preguntas sobre los documentos de tu base de conocimiento. La IA responderá basándose únicamente en esa información.
        </p>
        <div className="mt-4 text-sm bg-accent/20 border border-accent/50 text-accent-foreground p-3 rounded-lg flex items-start gap-2">
           <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent" />
           <span className="text-left">
            Puedes editar el contenido de los documentos en el archivo <strong>src/data/knowledgeBase.ts</strong>.
           </span>
        </div>
      </div>
      <KnowledgeAssistantInterface />
    </div>
  );
}
