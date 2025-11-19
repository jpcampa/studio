
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import type { TriggerExerciseContent } from '@/data/paths/pathTypes';
import { Separator } from '../ui/separator';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore'; // Importar la función para guardar

interface TriggerExerciseProps {
  content: TriggerExerciseContent;
}

export function TriggerExercise({ content }: TriggerExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();

  // State for the main exercise
  const [emotion, setEmotion] = useState('');
  const [situation, setSituation] = useState('');
  const [otherSituation, setOtherSituation] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [hadAutomaticImage, setHadAutomaticImage] = useState<boolean | 'indeterminate'>('indeterminate');
  const [automaticImageDesc, setAutomaticImageDesc] = useState('');
  const [anticipation, setAnticipation] = useState('');
  const [triggerSource, setTriggerSource] = useState('');
  const [copingResponse, setCopingResponse] = useState('');
  const [otherCopingResponse, setOtherCopingResponse] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // State for the reflection
  const [reflectionSituations, setReflectionSituations] = useState('');
  const [reflectionActions, setReflectionActions] = useState('');
  const [reflectionNextTime, setReflectionNextTime] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  const audioUrl = "https://workwellfut.com/audios/r1_desc/Tecnica-2-identifica-tu-disparador.mp3";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!emotion || !situation || !thoughts || hadAutomaticImage === 'indeterminate' || !triggerSource || !copingResponse) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los campos del ejercicio para guardar tu registro.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro de 'Identifica tu disparador' ha sido guardado exitosamente.",
    });
    
    setIsSaved(true);
  };
  
  const handleSaveReflection = (e: FormEvent) => {
    e.preventDefault();
     if (!reflectionSituations.trim() || !reflectionActions.trim() || !reflectionNextTime.trim()) {
      toast({
        title: "Reflexión Incompleta",
        description: "Por favor, responde a todas las preguntas de reflexión para guardarla.",
        variant: "destructive",
      });
      return;
    }
    
    const reflectionEntry = `
      **Ejercicio:** ${content.title}

      **¿Qué situaciones me han hecho sentir más sobrepasado/a últimamente?**
      ${reflectionSituations}

      **¿Qué hice en esos momentos?**
      ${reflectionActions}

      **¿Qué podría probar diferente la próxima vez?**
      ${reflectionNextTime}
    `;

    addNotebookEntry({
        title: `Reflexión: ${content.title}`,
        content: reflectionEntry,
        pathId: 'gestion-estres', // Hardcoded for now, could be dynamic
    });

    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión ha sido guardada en tu Cuaderno Terapéutico.",
    });
    
    setIsReflectionSaved(true);
  }

  const situationOptions = [
      { id: 'situation-hurtful-comment', label: 'Alguien me dijo algo que me dolió' },
      { id: 'situation-overwhelmed', label: 'Me exigieron demasiado en poco tiempo' },
      { id: 'situation-memory', label: 'Recordé algo que me afectó' },
      { id: 'situation-physical', label: 'Me sentía mal físicamente' },
  ];

  const copingOptions = [
      { id: 'coping-distraction', label: 'Me distraje con redes' },
      { id: 'coping-overload', label: 'Me sobreexigí para hacerlo perfecto' },
      { id: 'coping-blocked', label: 'Me bloqueé' },
      { id: 'coping-vented', label: 'Lloré o exploté' },
  ];


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
          <p className="text-sm text-foreground/80 italic">Recuerda un momento reciente de estrés. Responde al cuestionario guiado. Al finalizar, recibirás un resumen visual tipo "brújula del estrés", que te mostrará si tus estresores habituales son externos, internos o mixtos.</p>
          
          <div>
            <Label htmlFor="emotion" className="font-semibold">1. ¿Cómo te sentiste en ese momento?</Label>
            <Select value={emotion} onValueChange={setEmotion} disabled={isSaved}>
              <SelectTrigger id="emotion">
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
          </div>
          
          <div>
            <Label className="font-semibold">2. ¿Qué situación estaba ocurriendo?</Label>
            <RadioGroup onValueChange={setSituation} value={situation} className="space-y-2 mt-2" disabled={isSaved}>
                {situationOptions.map(opt => (
                     <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.label} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                     </div>
                ))}
                <div className="flex items-center space-x-2">
                     <RadioGroupItem value="otra" id="situation-other" />
                    <Label htmlFor="situation-other" className="font-normal">Otra:</Label>
                </div>
            </RadioGroup>
            {situation === 'otra' && (
                <Textarea 
                    value={otherSituation}
                    onChange={(e) => setOtherSituation(e.target.value)}
                    placeholder="Describe la situación"
                    disabled={isSaved}
                    className="ml-6 mt-2"
                />
            )}
          </div>

          <div>
            <Label htmlFor="thoughts" className="font-semibold">3. ¿Qué pasó por tu cabeza justo antes de sentirte así?</Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Ej: 'No soy capaz', 'Todo va a salir mal'"
              disabled={isSaved}
            />
          </div>

          <div>
            <Label className="font-semibold">4. ¿Te vino alguna imagen o recuerdo automático?</Label>
             <RadioGroup onValueChange={(val) => setHadAutomaticImage(val === 'yes')} value={hadAutomaticImage === 'indeterminate' ? '' : (hadAutomaticImage ? 'yes' : 'no')} className="flex space-x-4 mt-2" disabled={isSaved}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hadImage-yes" />
                    <Label htmlFor="hadImage-yes" className="font-normal">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hadImage-no" />
                    <Label htmlFor="hadImage-no" className="font-normal">No</Label>
                </div>
            </RadioGroup>
            {hadAutomaticImage === true && (
                <Textarea
                    value={automaticImageDesc}
                    onChange={(e) => setAutomaticImageDesc(e.target.value)}
                    placeholder="Describe brevemente la imagen o recuerdo"
                    className="mt-2"
                    disabled={isSaved}
                />
            )}
          </div>
          
          <div>
            <Label htmlFor="anticipation" className="font-semibold">5. ¿Qué pensaste que podría pasar? (Anticipación de amenaza)</Label>
            <Textarea
              id="anticipation"
              value={anticipation}
              onChange={(e) => setAnticipation(e.target.value)}
              placeholder="Ej: 'Me van a despedir', 'Voy a hacer el ridículo'."
              disabled={isSaved}
            />
          </div>

           <div>
            <Label className="font-semibold">6. ¿De dónde vino el disparador principal?</Label>
            <RadioGroup onValueChange={setTriggerSource} value={triggerSource} className="space-y-1 mt-2" disabled={isSaved}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="externo" id="source-external" />
                    <Label htmlFor="source-external" className="font-normal">Externo (personas, tareas, entorno)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interno" id="source-internal" />
                    <Label htmlFor="source-internal" className="font-normal">Interno (pensamientos, recuerdos, sensaciones)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ambos" id="source-both" />
                    <Label htmlFor="source-both" className="font-normal">Ambos</Label>
                </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold">7. ¿Qué hiciste para calmarte o evitarlo?</Label>
             <RadioGroup onValueChange={setCopingResponse} value={copingResponse} className="space-y-2 mt-2" disabled={isSaved}>
                {copingOptions.map(opt => (
                     <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.label} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                     </div>
                ))}
                 <div className="flex items-center space-x-2">
                     <RadioGroupItem value="otra" id="coping-other" />
                    <Label htmlFor="coping-other" className="font-normal">Otra:</Label>
                </div>
             </RadioGroup>
             {copingResponse === 'otra' && (
                <Textarea 
                    value={otherCopingResponse}
                    onChange={(e) => setOtherCopingResponse(e.target.value)}
                    placeholder="Describe tu respuesta"
                    disabled={isSaved}
                    className="ml-6 mt-2"
                />
            )}
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
            <div className="space-y-4">
               <div>
                  <Label htmlFor="reflection-situations" className="font-semibold text-sm">¿Qué situaciones me han hecho sentir más sobrepasado/a últimamente?</Label>
                  <Textarea 
                    id="reflection-situations"
                    value={reflectionSituations}
                    onChange={e => setReflectionSituations(e.target.value)}
                    placeholder="Escribe aquí tu reflexión..."
                    rows={3}
                    disabled={isReflectionSaved}
                  />
               </div>
               <div>
                  <Label htmlFor="reflection-actions" className="font-semibold text-sm">¿Qué hice en esos momentos?</Label>
                   <Textarea 
                    id="reflection-actions"
                    value={reflectionActions}
                    onChange={e => setReflectionActions(e.target.value)}
                    placeholder="Escribe aquí tu reflexión..."
                    rows={3}
                    disabled={isReflectionSaved}
                  />
               </div>
                <div>
                  <Label htmlFor="reflection-next-time" className="font-semibold text-sm">¿Qué podría probar diferente la próxima vez?</Label>
                   <Textarea 
                    id="reflection-next-time"
                    value={reflectionNextTime}
                    onChange={e => setReflectionNextTime(e.target.value)}
                    placeholder="Escribe aquí tu reflexión..."
                    rows={3}
                    disabled={isReflectionSaved}
                  />
               </div>
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
      {content.duration && <CardFooter className="text-xs text-muted-foreground">Duración sugerida: {content.duration}</CardFooter>}
    </Card>
  );
}
