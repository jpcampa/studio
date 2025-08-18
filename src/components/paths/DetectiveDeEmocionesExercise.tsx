
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetectiveDeEmocionesExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface DetectiveDeEmocionesExerciseProps {
  content: DetectiveDeEmocionesExerciseContent;
  pathId: string;
}

export function DetectiveDeEmocionesExercise({ content, pathId }: DetectiveDeEmocionesExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [impulse, setImpulse] = useState('');
  const [reflection, setReflection] = useState('');

  const nextStep = () => setStep(prev => prev + 1);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación vivida:*
${situation || 'No especificada.'}

*Pensamiento automático:*
"${automaticThought || 'No especificado.'}"

*Emoción sentida:*
${selectedEmotion ? (emotionOptions.find(e => e.value === selectedEmotion)?.labelKey ? t[emotionOptions.find(e => e.value === selectedEmotion)!.labelKey as keyof typeof t] : selectedEmotion) : 'No especificada'} (Intensidad: ${emotionIntensity}%)

*Impulso o conducta:*
${impulse || 'No especificado.'}

*Reflexión:*
${reflection || 'Sin reflexión.'}
`;
    addNotebookEntry({ title: 'Mi Registro de Detective de Emociones', content: notebookContent, pathId });
    toast({ title: 'Registro Guardado', description: 'Tu registro se ha guardado en el cuaderno.' });
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4"><p className="text-center mb-4">Piensa en una situación reciente que te haya movido emocionalmente.</p><Button onClick={nextStep} className="w-full">Comenzar</Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>¿Qué ocurrió? (Describe los hechos)</Label><Textarea value={situation} onChange={e => setSituation(e.target.value)} /><Button onClick={nextStep} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>¿Qué pensaste en ese momento?</Label><Textarea value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} /><Button onClick={nextStep} className="w-full">Siguiente</Button></div>;
      case 3: return <div className="p-4 space-y-4"><Label>¿Qué emoción sentiste con más fuerza?</Label><Select value={selectedEmotion} onValueChange={setSelectedEmotion}><SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger><SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent></Select><Button onClick={nextStep} className="w-full mt-2">Siguiente</Button></div>;
      case 4: return <div className="p-4 space-y-4"><Label>¿Qué tan fuerte fue esa emoción? ({emotionIntensity}%)</Label><Slider value={[emotionIntensity]} onValueChange={v => setEmotionIntensity(v[0])} max={100} step={5} /><Button onClick={nextStep} className="w-full">Siguiente</Button></div>;
      case 5: return <div className="p-4 space-y-4"><Label>¿Qué hiciste o te dieron ganas de hacer?</Label><Textarea value={impulse} onChange={e => setImpulse(e.target.value)} /><Button onClick={nextStep} className="w-full">Siguiente</Button></div>;
      case 6: return <div className="p-4 space-y-4"><Label>¿Qué aprendiste al observar esta cadena?</Label><Textarea value={reflection} onChange={e => setReflection(e.target.value)} /><Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar</Button></div>;
      case 7: return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><p>Hoy diste un paso más hacia tu autoconocimiento. Nombrar lo que sientes te permite cuidarte mejor.</p><Button onClick={() => setStep(0)} variant="outline">Hacer otro registro</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
