
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PersonalDefinitionExerciseContent } from '@/data/paths/pathTypes';

interface PersonalDefinitionExerciseProps {
  content: PersonalDefinitionExerciseContent;
  pathId: string;
}

export function PersonalDefinitionExercise({ content, pathId }: PersonalDefinitionExerciseProps) {
  const { toast } = useToast();
  const [definition, setDefinition] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!definition.trim()) {
      toast({ title: 'Definición vacía', description: 'Por favor, escribe tu definición personal.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi definición personal de resiliencia es:*
"${definition}"
    `;
    addNotebookEntry({ title: 'Mi Definición de Resiliencia', content: notebookContent, pathId });
    toast({ title: 'Definición Guardada', description: 'Tu definición de resiliencia se ha guardado en el cuaderno.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-sm text-muted-foreground">La resiliencia no es una fórmula universal. Tiene que ver con cómo tú vives el dolor, el cambio y la transformación. Te invito a escribir tu propia definición.</p>
          <div className="space-y-2">
            <Label htmlFor="resilience-def">Para mí, ser resiliente es...</Label>
            <Textarea id="resilience-def" value={definition} onChange={e => setDefinition(e.target.value)} rows={4} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar mi definición
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Definición guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
