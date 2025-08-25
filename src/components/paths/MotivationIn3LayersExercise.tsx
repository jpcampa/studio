
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MotivationIn3LayersExerciseContent } from '@/data/paths/pathTypes';

interface MotivationIn3LayersExerciseProps {
  content: MotivationIn3LayersExerciseContent;
  pathId: string;
}

export function MotivationIn3LayersExercise({ content, pathId }: MotivationIn3LayersExerciseProps) {
  const { toast } = useToast();
  const [action, setAction] = useState('');
  const [value, setValue] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Acción concreta:** ${action}
**Valor personal:** ${value}
**Sentido mayor:** ${purpose}
    `;
    addNotebookEntry({ title: 'Mi Motivación en 3 Capas', content: notebookContent, pathId });
    toast({ title: 'Motivación Guardada', description: 'Tu motivación en 3 capas ha sido guardada.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Paso 1: Acción concreta</Label>
            <Textarea id="action" value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: Llamar a mi amiga Marta" disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Paso 2: Valor personal</Label>
            <Textarea id="value" value={value} onChange={e => setValue(e.target.value)} placeholder="Ej: Porque valoro cuidar mis relaciones" disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Paso 3: Sentido mayor</Label>
            <Textarea id="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Ej: Quiero tener una red de apoyo sólida" disabled={isSaved}/>
          </div>
           {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi motivación</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Motivación guardada.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
