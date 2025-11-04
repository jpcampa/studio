
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { addEmotionalEntry } from '@/data/emotionalEntriesStore';
import type { StressMapExerciseContent } from '@/data/paths/pathTypes';

interface StressMapExerciseProps {
  content: StressMapExerciseContent;
}

export function StressMapExercise({ content }: StressMapExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();

  const [situation, setSituation] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [physicalReactions, setPhysicalReactions] = useState('');
  const [responseAction, setResponseAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const audioUrl = "https://workwellfut.com/audios/r1_desc/Tecnica-1-mapa-del-estres-personal.mp3";


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!situation.trim() || !thoughts.trim() || !selectedEmotion || !physicalReactions.trim() || !responseAction.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los campos del ejercicio para guardar tu registro.",
        variant: "destructive",
      });
      return;
    }
    
    // For simplicity, we can save the main emotion and situation to the existing emotional log.
    // The full context can be saved to a different store or extended in the future.
    addEmotionalEntry({
      situation: situation,
      emotion: selectedEmotion,
      // You could extend the store to save intensity, thoughts, etc.
    });

    toast({
      title: "Registro Guardado",
      description: "Tu 'Mapa del Estrés' ha sido guardado exitosamente.",
    });
    
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="situation" className="font-semibold">1. Situación (Qué ocurrió)</Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe brevemente el momento que te generó estrés. Ej: Mi jefa me pidió un informe urgente..."
              disabled={isSaved}
            />
          </div>

          <div>
            <Label htmlFor="thoughts" className="font-semibold">2. Pensamientos (Qué pensaste)</Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="¿Qué pasó por tu mente? Ej: 'No voy a poder con todo', 'Seguro piensa que soy incapaz'."
              disabled={isSaved}
            />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold">3. Emociones (Cómo te sentiste)</Label>
            <Select value={selectedEmotion} onValueChange={setSelectedEmotion} disabled={isSaved}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la emoción principal" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emo) => (
                  <SelectItem key={emo.value} value={emo.value}>
                    {t[emo.labelKey as keyof typeof t] || emo.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmotion && (
              <div className="space-y-2">
                <Label htmlFor="intensity">Intensidad: {emotionIntensity}%</Label>
                <Slider
                  id="intensity"
                  min={0}
                  max={100}
                  step={10}
                  defaultValue={[emotionIntensity]}
                  onValueChange={(value) => setEmotionIntensity(value[0])}
                  disabled={isSaved}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="physicalReactions" className="font-semibold">4. Reacciones físicas (Qué sintió tu cuerpo)</Label>
            <Textarea
              id="physicalReactions"
              value={physicalReactions}
              onChange={(e) => setPhysicalReactions(e.target.value)}
              placeholder="¿Notaste tensión, molestias o cambios? Ej: Dolor de estómago, respiración acelerada..."
              disabled={isSaved}
            />
          </div>

          <div>
            <Label htmlFor="responseAction" className="font-semibold">5. Respuesta/acción (Qué hiciste)</Label>
            <Textarea
              id="responseAction"
              value={responseAction}
              onChange={(e) => setResponseAction(e.target.value)}
              placeholder="¿Cómo reaccionaste? Ej: 'Me quedé paralizada y luego trabajé sin parar hasta muy tarde'."
              disabled={isSaved}
            />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Registro
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu registro ha sido guardado.</p>
            </div>
          )}

        </form>
      </CardContent>
      {content.duration && <CardFooter className="text-xs text-muted-foreground">Duración sugerida: {content.duration}</CardFooter>}
    </Card>
  );
}
