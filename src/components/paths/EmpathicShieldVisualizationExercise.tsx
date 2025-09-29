
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, PlayCircle, BookOpen } from 'lucide-react';
import type { EmpathicShieldVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EmpathicShieldVisualizationExerciseProps {
  content: EmpathicShieldVisualizationExerciseContent;
  pathId: string;
}

export function EmpathicShieldVisualizationExercise({ content, pathId }: EmpathicShieldVisualizationExerciseProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'audio' | 'text'>('audio');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({ title: "Práctica Finalizada", description: "Has entrenado una nueva forma de cuidar: desde la empatía que también te cuida a ti." });
  };
  
  const writtenContent = [
    { title: "Bienvenida: cuida sin fundirte", text: "Vamos a realizar una visualización para ayudarte a sostener a los demás sin perderte tú. Imagina que construyes un espacio interno que te protege sin cerrarte. Ese espacio se llama escudo empático: un filtro emocional que cuida tu energía y mantiene tu presencia sin exigirte absorber lo que no te corresponde." },
    { title: "Respiración y conexión", text: "Busca una posición cómoda. Cierra los ojos si te ayuda a conectar. Lleva tu atención a la respiración. Inhala por la nariz… Retén… Exhala por la boca, vaciando completamente. Hazlo dos veces más… Y siente cómo tu cuerpo empieza a calmarse. Solo por hoy, no tienes que resolver nada. Solo estar." },
    { title: "Construye tu escudo emocional", text: "Imagina ahora que una luz suave y cálida te envuelve. Puede tener el color que tú necesites hoy. Esta luz forma un escudo flexible a tu alrededor: por delante, por detrás, a los lados, arriba, abajo. Este escudo no es una barrera. Es una membrana sabia: deja pasar lo que nutre, y suaviza lo que desborda. Dentro de él respiras mejor. Piensas con más claridad. Puedes cuidar sin romperte." },
    { title: "Escena emocional real", text: "Ahora, piensa en una persona o situación que suele exigirte emocionalmente. Imagina que estás ahí, pero con tu escudo activo. Ves al otro. Lo escuchas. Comprendes su emoción… Pero no te pierdes en ella. Tu centro sigue contigo. Estás presente. Estás entera/o. Acompañas… pero no absorbes." },
    { title: "Refuerza tu espacio interior", text: "Vuelve a ti. A tu cuerpo. A tu escudo. Siente su contorno. Respira dentro de él. Repite mentalmente: “Puedo cuidar sin desaparecer.”, “Mi presencia es suficiente.”, “También yo merezco protección emocional.”" },
    { title: "Cierre: tu escudo sigue contigo", text: "Imagina cómo ese escudo se integra en tu conciencia. No desaparece: ahora vive dentro de ti, como una herramienta que puedes activar siempre que lo necesites. Respira una última vez… Y cuando estés lista/o, vuelve suavemente al presente. Has entrenado una nueva forma de cuidar: desde la empatía que también te cuida a ti." },
  ];

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
        {!isCompleted ? (
            <>
                <div className="flex justify-center gap-2 mb-4">
                    <Button onClick={() => setViewMode('audio')} variant={viewMode === 'audio' ? 'default' : 'outline'}><PlayCircle className="mr-2 h-4 w-4" /> Audio</Button>
                    <Button onClick={() => setViewMode('text')} variant={viewMode === 'text' ? 'default' : 'outline'}><BookOpen className="mr-2 h-4 w-4" /> Texto</Button>
                </div>
                
                {viewMode === 'audio' && !content.audioUrl && (
                    <div className="p-4 border rounded-lg bg-background text-center">
                        <PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                        <p className="font-semibold">Visualización Guiada</p>
                        <p className="text-sm text-muted-foreground">Audio no disponible en la demo. Cambia a la versión de texto para leer la guía.</p>
                    </div>
                )}

                {viewMode === 'text' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-background animate-in fade-in-0 duration-500">
                        {writtenContent.map((section, index) => (
                            <div key={index}>
                                <h4 className="font-semibold text-primary">{section.title}</h4>
                                <p className="text-sm mt-1 whitespace-pre-line">{section.text}</p>
                            </div>
                        ))}
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
                <p className="text-muted-foreground">Has creado un recurso interno muy valioso. Recuerda tu escudo empático la próxima vez que necesites cuidar y cuidarte.</p>
                <Button onClick={() => setIsCompleted(false)} variant="outline" className="w-full">Repetir Visualización</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
