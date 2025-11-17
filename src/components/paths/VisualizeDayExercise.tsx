
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { VisualizeDayExerciseContent } from '@/data/paths/pathTypes';

interface VisualizeDayExerciseProps {
  content: VisualizeDayExerciseContent;
  pathId: string;
}

export function VisualizeDayExercise({ content, pathId }: VisualizeDayExerciseProps) {
  const { toast } = useToast();
  const [intention, setIntention] = useState('');
  const [idealDay, setIdealDay] = useState('');
  const [keyGesture, setKeyGesture] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Intención para hoy:** ${intention}
**Mi día ideal:** ${idealDay}
**Gesto clave:** ${keyGesture}
    `;
    addNotebookEntry({ title: 'Mi Visualización del Día', content: notebookContent, pathId: pathId });
    toast({ title: 'Visualización Guardada', description: 'Tu visualización del día ha sido guardada.' });
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
            <Label htmlFor="intention">Paso 1: Elige tu intención para hoy</Label>
            <Textarea id="intention" value={intention} onChange={e => setIntention(e.target.value)} placeholder="Ej: Hoy quiero vivir con calma y foco" disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ideal-day">Paso 2: Visualiza tu día ideal</Label>
            <Textarea id="ideal-day" value={idealDay} onChange={e => setIdealDay(e.target.value)} placeholder="Ej: Desayuno tranquilo, voy al trabajo caminando..." disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-gesture">Paso 3: Un gesto clave para mantener tu intención</Label>
            <Textarea id="key-gesture" value={keyGesture} onChange={e => setKeyGesture(e.target.value)} placeholder="Ej: Hacer 3 respiraciones profundas antes de una reunión" disabled={isSaved}/>
          </div>
          {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi visualización</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Visualización guardada.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
