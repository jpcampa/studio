
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, PlayCircle, BookOpen, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CalmVisualizationExerciseContent } from '@/data/paths/pathTypes';

interface CalmVisualizationExerciseProps {
  content: CalmVisualizationExerciseContent;
  pathId: string;
  audioUrl?: string; // Add audioUrl prop
}

export function CalmVisualizationExercise({ content, pathId, audioUrl }: CalmVisualizationExerciseProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'audio' | 'text'>(audioUrl ? 'audio' : 'text');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({ title: "Práctica Finalizada", description: "Has entrenado una nueva forma de responder con calma." });
  };
  
  const meditationText = "Cierra los ojos y visualiza la situación que te genera ansiedad. Ahora, imagina que una luz cálida te envuelve, creando una burbuja de calma. Dentro de esa burbuja, te sientes seguro/a. Observa la escena desde esa distancia, sabiendo que puedes manejarla. Respira hondo y siente cómo la calma se expande. Repite mentalmente: 'Puedo estar aquí, estoy a salvo'.";

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
            <>
                <div className="flex justify-center gap-2 mb-4">
                    <Button onClick={() => setViewMode('audio')} variant={viewMode === 'audio' ? 'default' : 'outline'}><PlayCircle className="mr-2 h-4 w-4" /> Audio</Button>
                    <Button onClick={() => setViewMode('text')} variant={viewMode === 'text' ? 'default' : 'outline'}><BookOpen className="mr-2 h-4 w-4" /> Texto</Button>
                </div>
                
                {viewMode === 'audio' && (
                    <div className="p-4 border rounded-lg bg-background text-center">
                        {audioUrl ? (
                            <audio controls controlsList="nodownload" className="w-full">
                                <source src={audioUrl} type="audio/mp3" />
                                Tu navegador no soporta el elemento de audio.
                            </audio>
                        ) : (
                            <>
                                <PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                                <p className="font-semibold">Visualización Guiada de Calma</p>
                                <p className="text-sm text-muted-foreground">Audio no disponible. Cambia a la versión de texto para leer la guía.</p>
                            </>
                        )}
                    </div>
                )}

                {viewMode === 'text' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-background animate-in fade-in-0 duration-500">
                      <p className="text-sm whitespace-pre-line">{meditationText}</p>
                    </div>
                )}
                
                <Button onClick={handleComplete} className="w-full mt-6">
                    <CheckCircle className="mr-2 h-4 w-4" /> Marcar como completado
                </Button>
            </>
        ) : (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
                <p className="text-muted-foreground">Has ensayado una respuesta más calmada. Tu cerebro está aprendiendo.</p>
                <Button onClick={() => setIsCompleted(false)} variant="outline" className="w-full">Repetir Visualización</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    

    