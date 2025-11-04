
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ImaginedCrisisRehearsalExerciseContent } from '@/data/paths/pathTypes';

interface ImaginedCrisisRehearsalExerciseProps {
  content: ImaginedCrisisRehearsalExerciseContent;
  pathId: string;
}

export function ImaginedCrisisRehearsalExercise({ content, pathId }: ImaginedCrisisRehearsalExerciseProps) {
  const { toast } = useToast();
  const [reflection, setReflection] = useState({
    differentAction: '',
    selfTalk: '',
    toolUsed: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof typeof reflection, value: string) => {
    setReflection(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.differentAction.trim() && !reflection.selfTalk.trim() && !reflection.toolUsed.trim()) {
      toast({ title: 'Reflexión vacía', description: 'Por favor, escribe algo en al menos uno de los campos.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*¿Qué harías diferente?*
${reflection.differentAction || 'No especificado.'}

*¿Qué te dirías?*
${reflection.selfTalk || 'No especificado.'}

*¿Qué herramienta usarías primero?*
${reflection.toolUsed || 'No especificado.'}
    `;

    addNotebookEntry({
      title: 'Ensayo de Crisis Imaginaria',
      content: notebookContent,
      pathId: pathId,
    });

    toast({ title: 'Ensayo Guardado', description: 'Tu reflexión ha sido guardada en el cuaderno.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <p className="text-sm text-foreground/80 italic">
            Instrucciones: Primero, escucha el audio para realizar la visualización. Luego, con esa experiencia fresca en tu mente, responde a las siguientes preguntas para anclar tu aprendizaje.
          </p>
          <div className="space-y-2">
            <Label htmlFor="differentAction">¿Qué harías diferente?</Label>
            <Textarea
              id="differentAction"
              value={reflection.differentAction}
              onChange={(e) => handleInputChange('differentAction', e.target.value)}
              placeholder="Describe la nueva acción o respuesta..."
              disabled={isSaved}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selfTalk">¿Qué te dirías?</Label>
            <Textarea
              id="selfTalk"
              value={reflection.selfTalk}
              onChange={(e) => handleInputChange('selfTalk', e.target.value)}
              placeholder="Escribe la frase o el diálogo interno que usarías..."
              disabled={isSaved}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolUsed">¿Qué herramienta usarías primero?</Label>
            <Textarea
              id="toolUsed"
              value={reflection.toolUsed}
              onChange={(e) => handleInputChange('toolUsed', e.target.value)}
              placeholder="Piensa en una técnica de respiración, un ancla, etc."
              disabled={isSaved}
            />
          </div>

          {!isSaved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar Reflexión
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu reflexión ha sido guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

    