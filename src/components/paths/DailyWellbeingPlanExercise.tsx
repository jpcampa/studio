
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyWellbeingPlanExerciseContent } from '@/data/paths/pathTypes';

interface DailyWellbeingPlanExerciseProps {
  content: DailyWellbeingPlanExerciseContent;
  pathId: string;
}

export function DailyWellbeingPlanExercise({ content, pathId }: DailyWellbeingPlanExerciseProps) {
  const { toast } = useToast();
  const [physicalHabit, setPhysicalHabit] = useState('');
  const [emotionalHabit, setEmotionalHabit] = useState('');
  const [mentalHabit, setMentalHabit] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Microhábito Físico:** ${physicalHabit}
**Microhábito Emocional:** ${emotionalHabit}
**Microhábito Mental:** ${mentalHabit}
    `;
    addNotebookEntry({ title: 'Mi Plan Diario de Bienestar', content: notebookContent, pathId: pathId });
    toast({ title: 'Plan Guardado', description: 'Tu plan de microhábitos ha sido guardado.' });
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
            <Label>Paso 1: Microhábito físico</Label>
            <Select onValueChange={setPhysicalHabit} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un hábito físico..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Caminar 15 minutos al día">Caminar 15 minutos al día</SelectItem>
                <SelectItem value="Beber un vaso grande de agua al despertar">Beber un vaso grande de agua al despertar</SelectItem>
                <SelectItem value="Estirarte 2 minutos al levantarte">Estirarte 2 minutos al levantarte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Paso 2: Microhábito emocional</Label>
            <Select onValueChange={setEmotionalHabit} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un hábito emocional..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Escribir una frase de gratitud">Escribir una frase de gratitud</SelectItem>
                <SelectItem value="Decir algo amable a alguien">Decir algo amable a alguien</SelectItem>
                <SelectItem value="Escuchar una canción que me inspire">Escuchar una canción que me inspire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Paso 3: Microhábito mental</Label>
             <Select onValueChange={setMentalHabit} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige una preparación..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Respiración consciente 5 minutos">Respiración consciente 5 minutos</SelectItem>
                <SelectItem value="Leer una página de un libro">Leer una página de un libro</SelectItem>
                <SelectItem value="Anotar una idea o aprendizaje del día">Anotar una idea o aprendizaje del día</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi plan diario</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Plan guardado.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
