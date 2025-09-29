
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, PlayCircle, BookOpen } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MeditacionGuiadaSinJuicioExerciseContent } from '@/data/paths/pathTypes';

interface MeditacionGuiadaSinJuicioExerciseProps {
  content: MeditacionGuiadaSinJuicioExerciseContent;
  pathId: string;
}

export function MeditacionGuiadaSinJuicioExercise({ content, pathId }: MeditacionGuiadaSinJuicioExerciseProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<'audio' | 'text'>('audio');
  const [reflection, setReflection] = useState('');

  const handleSave = () => {
    addNotebookEntry({ title: 'Reflexión: Meditación sin Juicio', content: reflection, pathId });
    toast({ title: 'Reflexión guardada' });
  };
  
  const meditationText = "Lleva tu atención a la respiración. Inhala… exhala lentamente. Siente el aire entrar y salir de tu cuerpo. Permite que cualquier sensación, pensamiento o emoción esté presente. No tienes que luchar. Solo observar. Di mentalmente: “Esto es lo que siento ahora… y está bien.” Si te distraes, vuelve suavemente a la frase y la respiración. Quédate ahí unos minutos. Simplemente presente contigo.";

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-2 mb-4">
            <Button onClick={() => setMode('audio')} variant={mode === 'audio' ? 'default' : 'outline'}><PlayCircle className="mr-2 h-4 w-4"/>Audio</Button>
            <Button onClick={() => setMode('text')} variant={mode === 'text' ? 'default' : 'outline'}><BookOpen className="mr-2 h-4 w-4"/>Texto</Button>
        </div>
        {mode === 'audio' && (
            content.audioUrl ? (
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            ) : (
                <div className="p-4 border rounded-lg bg-background text-center"><p>Audio no disponible en la demo. Cambia a la versión de texto.</p></div>
            )
        )}
        {mode === 'text' && <div className="p-4 border rounded-lg bg-background"><p className="whitespace-pre-line">{meditationText}</p></div>}
        <div className="mt-4 space-y-2">
            <Label>¿Cómo fue esta experiencia para ti?</Label>
            <Textarea value={reflection} onChange={e => setReflection(e.target.value)} />
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Reflexión</Button>
        </div>
      </CardContent>
    </Card>
  );
}
