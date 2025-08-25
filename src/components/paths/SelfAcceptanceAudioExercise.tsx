
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, PlayCircle, BookOpen } from 'lucide-react';
import type { SelfAcceptanceAudioExerciseContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';

interface SelfAcceptanceAudioExerciseProps {
  content: SelfAcceptanceAudioExerciseContent;
  pathId: string;
}

export function SelfAcceptanceAudioExercise({ content, pathId }: SelfAcceptanceAudioExerciseProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'audio' | 'text'>('audio');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({ title: "Práctica Finalizada", description: "Has entrenado una nueva forma de hablarte con amabilidad." });
  };
  
  const meditationText = `Busca un lugar tranquilo, donde puedas estar sin interrupciones durante unos minutos. Siéntate o recuéstate de forma cómoda… y permite que tu cuerpo empiece a soltar cualquier tensión acumulada. Puedes cerrar los ojos… o dejarlos entreabiertos, como prefieras. Vamos a comenzar llevando la atención a tu respiración. No necesitas cambiarla, solo observar cómo el aire entra… y sale… de tu cuerpo. Siente cómo, con cada inhalación, recibes oxígeno y energía… y con cada exhalación, sueltas lo que ya no necesitas. Ahora, mientras respiras, deja que tu mente traiga suavemente un momento reciente en el que te hayas juzgado con dureza. Un instante en el que te hayas hablado con palabras exigentes o críticas. No vamos a recrearnos en el dolor, solo a observar… como si vieras una escena a lo lejos, con una mirada amable y sin juicio. Imagina ahora que esa misma situación le ocurrió a alguien a quien quieres profundamente. Puede ser una amistad cercana, un hermano o hermana, un hijo, incluso una mascota querida. Nota cómo cambia tu corazón cuando piensas en esa persona… y siente el impulso natural de cuidarle, de reconfortarle. ¿Qué le dirías para que se sintiera comprendido y acompañado? Permite que esas palabras aparezcan con suavidad en tu mente. Escucha tu propio tono de voz interno… cálido, paciente, sin prisas. Tal vez le dirías: “Es normal equivocarse… lo importante es que sigues aprendiendo y creciendo”. O quizás: “Estoy contigo… esto no define quién eres”. Deja que las palabras se formen y se queden un momento en tu pecho. Ahora, vamos a hacer algo importante: dirige esas mismas palabras hacia ti. Puedes usar tu nombre, como si te hablaras desde un lugar de respeto y cariño. Repite mentalmente o en voz baja: [Tu nombre], es normal equivocarte… lo importante es que sigues aprendiendo y creciendo. O la frase que tú hayas elegido. Siente cómo es para ti recibir estas palabras… como si te arroparas con una manta suave… como si por dentro se encendiera una luz cálida que te recuerda que mereces comprensión, incluso en los momentos difíciles. Permanece aquí unos instantes… respirando con calma… dejando que esta sensación de amabilidad se expanda por todo tu cuerpo. Antes de terminar, piensa en un pequeño gesto que puedas hacer hoy para cuidarte. Algo sencillo, como darte unos minutos para descansar, salir a caminar, o disfrutar de algo que te guste. Elige ese gesto y repítelo mentalmente: “Hoy me cuidaré haciendo…”. Poco a poco, vuelve tu atención al lugar en el que estás. Siente tus pies, tus manos… y cuando estés lista o listo, abre los ojos… llevando contigo la certeza de que eres digno o digna de respeto y amabilidad… siempre.`;

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
                        <PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                        <p className="font-semibold">Práctica de Autoaceptación Guiada</p>
                        <p className="text-sm text-muted-foreground">Audio no disponible en la demo. Cambia a la versión de texto para leer la guía.</p>
                    </div>
                )}

                {viewMode === 'text' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-background animate-in fade-in-0 duration-500 max-h-60 overflow-y-auto">
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
                <p className="text-muted-foreground">Has practicado una forma poderosa de hablarte. Recuerda que puedes volver a este ejercicio siempre que lo necesites.</p>
                <Button onClick={() => setIsCompleted(false)} variant="outline" className="w-full">Repetir Práctica</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
