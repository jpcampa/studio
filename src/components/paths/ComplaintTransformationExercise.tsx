
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';

interface ComplaintTransformationExerciseProps {
  content: ComplaintTransformationExerciseContent;
  pathId: string;
}

export function ComplaintTransformationExercise({ content, pathId }: ComplaintTransformationExerciseProps) {
  const { toast } = useToast();
  const [complaint, setComplaint] = useState('');
  const [controllable, setControllable] = useState('');
  const [action, setAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!complaint.trim() || !action.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa tu queja y la acción a tomar.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Me quejo de:*
${complaint}

*Lo que sí depende de mí es:*
${controllable}

*Lo que sí puedo hacer es:*
${action}
    `;
    addNotebookEntry({ title: 'Transformación de Queja a Acción', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación de queja a acción ha sido guardada.' });
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
          <div className="space-y-2">
            <Label htmlFor="complaint">Escribe aquí tu queja</Label>
            <Textarea id="complaint" value={complaint} onChange={e => setComplaint(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="controllable">Describe la parte que sí depende de ti</Label>
            <Textarea id="controllable" value={controllable} onChange={e => setControllable(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action">Escribe tu acción concreta</Label>
            <Textarea id="action" value={action} onChange={e => setAction(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Transformación</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
