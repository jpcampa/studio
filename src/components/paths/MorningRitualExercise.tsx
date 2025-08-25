
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MorningRitualExerciseContent } from '@/data/paths/pathTypes';

interface MorningRitualExerciseProps {
  content: MorningRitualExerciseContent;
  pathId: string;
}

export function MorningRitualExercise({ content, pathId }: MorningRitualExerciseProps) {
  const { toast } = useToast();
  const [firstGesture, setFirstGesture] = useState('');
  const [bodyCare, setBodyCare] = useState('');
  const [mentalPrep, setMentalPrep] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Mi primer gesto al despertar:** ${firstGesture}
**Mi cuidado para el cuerpo:** ${bodyCare}
**Mi preparación mental:** ${mentalPrep}
    `;
    addNotebookEntry({ title: 'Mi Ritual de Mañana Amable', content: notebookContent, pathId });
    toast({ title: 'Ritual Guardado', description: 'Tu ritual de mañana ha sido guardado.' });
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
            <Label>Paso 1: Elige tu primer gesto al despertar</Label>
            <Select onValueChange={setFirstGesture} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un gesto..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Respirar profundamente 1 minuto">Respirar profundamente 1 minuto</SelectItem>
                <SelectItem value="Beber un vaso grande de agua">Beber un vaso grande de agua</SelectItem>
                <SelectItem value="Abrir la ventana y dejar entrar luz">Abrir la ventana y dejar entrar luz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Paso 2: Añade un cuidado para tu cuerpo</Label>
            <Select onValueChange={setBodyCare} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un cuidado..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Estiramientos suaves 2-3 minutos">Estiramientos suaves 2-3 minutos</SelectItem>
                <SelectItem value="Preparar un desayuno nutritivo">Preparar un desayuno nutritivo</SelectItem>
                <SelectItem value="Higiene consciente">Higiene consciente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Paso 3: Prepara tu mente</Label>
             <Select onValueChange={setMentalPrep} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige una preparación..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Anotar una intención del día">Anotar una intención del día</SelectItem>
                <SelectItem value="Escribir 3 cosas por las que estás agradecido/a">Escribir 3 cosas por las que estás agradecido/a</SelectItem>
                <SelectItem value="Escuchar una canción inspiradora">Escuchar una canción inspiradora</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi mañana amable</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Ritual guardado.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
