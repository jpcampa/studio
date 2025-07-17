
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetectiveExerciseContent } from '@/data/paths/pathTypes';

interface DetectiveExerciseProps {
  content: DetectiveExerciseContent;
}

const cognitiveDistortions = [
    { value: 'catastrophism', label: 'Catastrofismo' },
    { value: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)' },
    { value: 'overgeneralization', label: 'Sobregeneralización' },
    { value: 'personalization', label: 'Personalización' },
    { value: 'mind_reading', label: 'Adivinación del pensamiento o futuro' },
    { value: 'selective_abstraction', label: 'Abstracción selectiva' },
    { value: 'emotional_reasoning', label: 'Razonamiento emocional' },
    { value: 'should_statements', label: '“Deberías” rígidos' },
    { value: 'magnification_minimization', label: 'Maximizar lo negativo / Minimizar lo positivo' },
];

export function DetectiveExercise({ content }: DetectiveExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [emotion, setEmotion] = useState('');
  const [is100PercentTrue, setIs100PercentTrue] = useState('');
  const [isAnticipating, setIsAnticipating] = useState('');
  const [adviceToFriend, setAdviceToFriend] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [reflection, setReflection] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!situation || !automaticThought || !distortion || !emotion || !is100PercentTrue || !isAnticipating || !adviceToFriend || !alternativeThought) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos del ejercicio.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro del 'Detective de Pensamientos' ha sido guardado.",
    });
    setIsSaved(true);
  };

  const handleSaveReflection = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({ title: "Reflexión vacía", description: "Escribe tu reflexión para guardarla.", variant: "destructive" });
      return;
    }
    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: `**¿Qué aprendí al observar mis pensamientos desde fuera? ¿Qué distorsiones repito más? ¿Qué noto cuando me hablo con más comprensión?**\n\n${reflection}`,
      pathId: 'gestion-estres',
    });
    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico.",
    });
    setIsReflectionSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="situation" className="font-semibold">1. Situación: ¿Qué ocurrió?</Label>
            <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ej: Tenía que presentar un informe y mi hijo se puso enfermo." disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="automaticThought" className="font-semibold">2. Pensamiento automático: ¿Qué pasó por tu mente?</Label>
            <Textarea id="automaticThought" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} placeholder="Ej: No voy a poder con todo." disabled={isSaved} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distortion" className="font-semibold">3. Distorsión cognitiva: ¿Reconoces algún filtro mental?</Label>
            <Select value={distortion} onValueChange={setDistortion} disabled={isSaved}>
              <SelectTrigger id="distortion"><SelectValue placeholder="Elige la distorsión principal" /></SelectTrigger>
              <SelectContent>
                {cognitiveDistortions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotion" className="font-semibold">4. Emoción asociada: ¿Qué emoción principal sentiste?</Label>
             <Select value={emotion} onValueChange={setEmotion} disabled={isSaved}>
                <SelectTrigger id="emotion"><SelectValue placeholder="Selecciona la emoción principal" /></SelectTrigger>
                <SelectContent>
                    {emotions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-md border p-4 bg-background">
            <h4 className="font-semibold text-center">5. Preguntas de verificación</h4>
            <div className="space-y-2">
                <Label htmlFor="is100PercentTrue">¿Es 100% cierto este pensamiento?</Label>
                <Textarea id="is100PercentTrue" value={is100PercentTrue} onChange={e => setIs100PercentTrue(e.target.value)} disabled={isSaved} rows={2} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="isAnticipating">¿Estoy exagerando o anticipando el peor escenario?</Label>
                <Textarea id="isAnticipating" value={isAnticipating} onChange={e => setIsAnticipating(e.target.value)} disabled={isSaved} rows={2} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="adviceToFriend">¿Qué le diría a alguien que quiero si pensara esto?</Label>
                <Textarea id="adviceToFriend" value={adviceToFriend} onChange={e => setAdviceToFriend(e.target.value)} disabled={isSaved} rows={2} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alternativeThought" className="font-semibold">6. Pensamiento alternativo: ¿Cómo puedes reformularlo?</Label>
            <Textarea id="alternativeThought" value={alternativeThought} onChange={e => setAlternativeThought(e.target.value)} placeholder="Escribe una versión más realista, flexible y amable." disabled={isSaved} />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Ejercicio
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>

        {isSaved && (
          <form onSubmit={handleSaveReflection} className="mt-8 pt-6 border-t">
            <h4 className="font-semibold text-md text-primary mb-4 flex items-center">
              <NotebookText className="mr-2 h-5 w-5" />
              Reflexión Final (Para el Cuaderno Terapéutico)
            </h4>
            <div className="space-y-2">
               <Label htmlFor="reflection-notebook" className="font-normal text-sm">¿Qué aprendí al observar mis pensamientos desde fuera? ¿Qué distorsiones repito más? ¿Qué noto cuando me hablo con más comprensión?</Label>
               <Textarea
                id="reflection-notebook"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Escribe tu reflexión aquí..."
                rows={4}
                disabled={isReflectionSaved}
               />
            </div>
             {!isReflectionSaved ? (
              <Button type="submit" className="w-full mt-4">
                  <Save className="mr-2 h-4 w-4" /> Guardar Reflexión en mi Cuaderno
              </Button>
            ) : (
              <div className="mt-4 flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
