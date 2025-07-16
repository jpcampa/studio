
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

interface TriggerExerciseProps {
  content: TriggerExerciseContent;
}

export function TriggerExercise({ content }: TriggerExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();

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
    
    // Here you would typically save the full exercise data to a specific store
    // For now, we'll just show a confirmation.
    
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro de 'Identifica tu disparador' ha sido guardado exitosamente.",
    });
    
    setIsSaved(true);
  };

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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-foreground/80 italic">Recuerda un momento reciente de estrés. Responde al cuestionario guiado. Al finalizar, recibirás un resumen visual tipo "brújula del estrés", que te mostrará si tus estresores habituales son externos, internos o mixtos.</p>
          
          <div>
            <Label htmlFor="emotion" className="font-semibold">¿Cómo te sentiste en ese momento?</Label>
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
            <Label className="font-semibold">¿Qué situación estaba ocurriendo?</Label>
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
                {situation === 'otra' && (
                    <Textarea 
                        value={otherSituation}
                        onChange={(e) => setOtherSituation(e.target.value)}
                        placeholder="Describe la situación"
                        disabled={isSaved}
                        className="ml-6"
                    />
                )}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="thoughts" className="font-semibold">¿Qué pasó por tu cabeza justo antes de sentirte así?</Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Ej: 'No soy capaz', 'Esto va a salir mal'"
              disabled={isSaved}
            />
          </div>

          <div>
            <Label className="font-semibold">¿Te vino alguna imagen o recuerdo automático?</Label>
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
            <Label htmlFor="anticipation" className="font-semibold">¿Qué pensaste que podría pasar? (Anticipación de amenaza)</Label>
            <Textarea
              id="anticipation"
              value={anticipation}
              onChange={(e) => setAnticipation(e.target.value)}
              placeholder="Ej: 'Me van a despedir', 'Voy a hacer el ridículo'."
              disabled={isSaved}
            />
          </div>

           <div>
            <Label className="font-semibold">¿De dónde vino el disparador principal?</Label>
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
            <Label className="font-semibold">¿Qué hiciste para calmarte o evitarlo?</Label>
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
                {copingResponse === 'otra' && (
                    <Textarea 
                        value={otherCopingResponse}
                        onChange={(e) => setOtherCopingResponse(e.target.value)}
                        placeholder="Describe tu respuesta"
                        disabled={isSaved}
                        className="ml-6"
                    />
                )}
            </RadioGroup>
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
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-semibold text-md text-primary mb-4 flex items-center">
              <NotebookText className="mr-2 h-5 w-5" />
              Reflexión Final (Para el Cuaderno Terapéutico)
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                <li>¿Qué situaciones me han hecho sentir más sobrepasado/a últimamente?</li>
                <li>¿Qué hice en esos momentos?</li>
                <li>¿Qué podría probar diferente la próxima vez?</li>
            </ul>
          </div>
        )}

      </CardContent>
      {content.duration && <CardFooter className="text-xs text-muted-foreground">Duración sugerida: {content.duration}</CardFooter>}
    </Card>
  );
}
