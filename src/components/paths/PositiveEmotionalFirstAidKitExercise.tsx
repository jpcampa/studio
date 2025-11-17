
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PositiveEmotionalFirstAidKitExerciseContent } from '@/data/paths/pathTypes';

interface PositiveEmotionalFirstAidKitExerciseProps {
  content: PositiveEmotionalFirstAidKitExerciseContent;
  pathId: string;
}

export function PositiveEmotionalFirstAidKitExercise({ content, pathId }: PositiveEmotionalFirstAidKitExerciseProps) {
  const { toast } = useToast();
  const [person, setPerson] = useState('');
  const [activity, setActivity] = useState('');
  const [music, setMusic] = useState('');
  const [gesture, setGesture] = useState('');
  const [phrase, setPhrase] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Persona (Red de apoyo):** ${person}
**Actividad (Placer o logro):** ${activity}
**Música:** ${music}
**Gesto (Sonrisa o risa):** ${gesture}
**Frase (Autoinstrucción):** ${phrase}
    `;
    addNotebookEntry({ title: 'Mi Botiquín Emocional Positivo', content: notebookContent, pathId: pathId });
    toast({ title: 'Botiquín Guardado', description: 'Tu botiquín emocional ha sido guardado.' });
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
            <Label>1. Persona (Red de apoyo)</Label>
            <Select onValueChange={setPerson} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige a quién acudir..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Llamar a un amigo/a">Llamar a un amigo/a</SelectItem>
                <SelectItem value="Escribir a un familiar">Escribir a un familiar</SelectItem>
                <SelectItem value="Quedar para un café">Quedar para un café</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>2. Actividad (Placer o logro)</Label>
            <Select onValueChange={setActivity} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige una actividad..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Caminar">Caminar</SelectItem>
                <SelectItem value="Cocinar tu plato favorito">Cocinar tu plato favorito</SelectItem>
                <SelectItem value="Practicar un hobby">Practicar un hobby</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>3. Música</Label>
            <Select onValueChange={setMusic} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige tu música..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lista favorita">Lista favorita</SelectItem>
                <SelectItem value="Canción que me da energía">Canción que me da energía</SelectItem>
                <SelectItem value="Música relajante">Música relajante</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>4. Gesto (Sonrisa o risa)</Label>
            <Select onValueChange={setGesture} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un gesto..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Ver un vídeo divertido">Ver un vídeo divertido</SelectItem>
                <SelectItem value="Recordar una anécdota graciosa">Recordar una anécdota graciosa</SelectItem>
                <SelectItem value="Sonreír conscientemente">Sonreír conscientemente</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>5. Frase (Autoinstrucción)</Label>
            <Select onValueChange={setPhrase} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige una frase..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Soy capaz de superar esto.">Soy capaz de superar esto.</SelectItem>
                <SelectItem value="Esto también pasará.">Esto también pasará.</SelectItem>
                <SelectItem value="Puedo con lo que venga, paso a paso.">Puedo con lo que venga, paso a paso.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi botiquín</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Botiquín guardado.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
