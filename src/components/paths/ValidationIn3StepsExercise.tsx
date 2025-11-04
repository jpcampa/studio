
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import type { ValidationIn3StepsExerciseContent } from '@/data/paths/pathTypes';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface ValidationIn3StepsExerciseProps {
  content: ValidationIn3StepsExerciseContent;
  pathId: string;
}

export function ValidationIn3StepsExercise({ content, pathId }: ValidationIn3StepsExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [step, setStep] = useState(0);
  const [perceivedEmotion, setPerceivedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [step1Phrase, setStep1Phrase] = useState('');
  const [step2Phrase, setStep2Phrase] = useState('');
  const [step3Phrase, setStep3Phrase] = useState('');
  const [blockageReflection, setBlockageReflection] = useState('');
  const [nextStepReflection, setNextStepReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleComplete = () => {
    if (step === 3 && (!blockageReflection.trim() || !nextStepReflection.trim())) {
      toast({ title: "Reflexión Incompleta", description: "Por favor, completa ambos campos de reflexión.", variant: "destructive" });
      return;
    }
    setIsCompleted(true);
    toast({ title: "Ejercicio Finalizado", description: "Has completado la práctica de Validación en 3 Pasos. ¡Buen trabajo!" });
  };
  
  const renderStep = () => {
    switch(step) {
        case 0:
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 1: Reconoce la emoción del otro</h4>
                    <p className="text-sm text-muted-foreground">Piensa en una situación reciente en la que alguien te compartió algo con carga emocional. Trata de identificar qué sentía esa persona.</p>
                     <div className="space-y-2">
                        <Label htmlFor="perceived-emotion">¿Qué emoción crees que sentía?</Label>
                        <Select value={perceivedEmotion} onValueChange={setPerceivedEmotion}>
                            <SelectTrigger id="perceived-emotion"><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                            <SelectContent>
                                {emotions.map(e => <SelectItem key={e.value} value={e.labelKey}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}
                                <SelectItem value="otra">Otra...</SelectItem>
                            </SelectContent>
                        </Select>
                        {perceivedEmotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2" />}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="step1-phrase">Tu frase para reconocer:</Label>
                        <Textarea id="step1-phrase" value={step1Phrase} onChange={e => setStep1Phrase(e.target.value)} placeholder="Ej: Entiendo que estés triste..." />
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 1:
            return (
                 <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 2: Nómbralo y dale sentido</h4>
                    <p className="text-sm text-muted-foreground">Conecta esa emoción con la situación que la generó. Usa esta fórmula como guía: “Entiendo que estés [emoción] porque [situación].”</p>
                    <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                        <p>Ejemplo: “Entiendo que estés frustrada porque sentías que habías dado mucho y nadie lo valoró.”</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="step2-phrase">Tu frase completa:</Label>
                        <Textarea id="step2-phrase" value={step2Phrase} onChange={e => setStep2Phrase(e.target.value)} />
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 2:
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 3: Normaliza sin justificar</h4>
                    <p className="text-sm text-muted-foreground">Elige una frase que le diga al otro: "Tu emoción tiene sentido en este contexto."</p>
                     <ul className="list-disc list-inside text-sm pl-4">
                        <li>“Cualquiera en tu lugar podría sentirse así.”</li>
                        <li>“Es natural que te sientas así después de lo que ha ocurrido.”</li>
                        <li>“No es raro sentirse así cuando uno se esfuerza tanto y no recibe respuesta.”</li>
                    </ul>
                    <div className="space-y-2">
                        <Label htmlFor="step3-phrase">Tu frase para normalizar:</Label>
                        <Textarea id="step3-phrase" value={step3Phrase} onChange={e => setStep3Phrase(e.target.value)} />
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 3:
            return (
                 <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 4: Toma conciencia de tus bloqueos</h4>
                     <p className="text-sm text-muted-foreground">Reflexiona con honestidad sobre tus propias barreras a la hora de escuchar.</p>
                     <div className="space-y-2">
                        <Label htmlFor="blockage-reflection">¿En qué situaciones te resulta más difícil validar emocionalmente a alguien?</Label>
                        <Textarea id="blockage-reflection" value={blockageReflection} onChange={e => setBlockageReflection(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="next-step-reflection">¿Qué podrías empezar a hacer diferente para estar más presente?</Label>
                        <Textarea id="next-step-reflection" value={nextStepReflection} onChange={e => setNextStepReflection(e.target.value)} />
                    </div>
                    <Button onClick={handleComplete} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" /> Marcar como completado
                    </Button>
                </div>
            );
        default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {!isCompleted ? renderStep() : (
            <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
                 <p className="text-muted-foreground">Cuando validas, no estás diciendo ‘tienes razón’, estás diciendo: ‘lo que sientes importa y estoy aquí contigo’.</p>
                 <Button onClick={() => { setStep(0); setIsCompleted(false); }} variant="outline" className="w-full">Practicar de nuevo</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
