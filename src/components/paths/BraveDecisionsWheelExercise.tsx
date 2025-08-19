
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BraveDecisionsWheelExerciseContent } from '@/data/paths/pathTypes';

interface BraveDecisionsWheelExerciseProps {
  content: BraveDecisionsWheelExerciseContent;
  pathId: string;
}

export function BraveDecisionsWheelExercise({ content, pathId }: BraveDecisionsWheelExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [fearDecision, setFearDecision] = useState('');
  const [valueDecision, setValueDecision] = useState('');
  const [confidenceDecision, setConfidenceDecision] = useState('');
  const [despairDecision, setDespairDecision] = useState('');
  const [finalChoice, setFinalChoice] = useState('');

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación:* ${situation || 'No especificada.'}
*Decisión desde el miedo:* ${fearDecision || 'No especificado.'}
*Decisión desde el valor:* ${valueDecision || 'No especificado.'}
*Decisión desde la confianza:* ${confidenceDecision || 'No especificado.'}
*Decisión desde la desesperanza:* ${despairDecision || 'No especificado.'}
*Mi elección final:* ${finalChoice || 'No especificada.'}
`;
    addNotebookEntry({ title: 'Rueda de Decisiones Valientes', content: notebookContent, pathId });
    toast({ title: 'Decisión Guardada', description: 'Tu reflexión ha sido guardada.' });
    setStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Define tu situación actual</h4>
            <Label htmlFor="situation-brave">Describe brevemente la decisión que tienes que tomar.</Label>
            <Textarea id="situation-brave" value={situation} onChange={e => setSituation(e.target.value)} />
            <Button onClick={() => setStep(1)} className="w-full">Siguiente</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2"><Label htmlFor="fear-decision">¿Qué harías si decidieras desde el miedo?</Label><Textarea id="fear-decision" value={fearDecision} onChange={e => setFearDecision(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="value-decision">¿Qué harías si decidieras desde el valor?</Label><Textarea id="value-decision" value={valueDecision} onChange={e => setValueDecision(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="confidence-decision">¿Qué harías si decidieras desde la confianza?</Label><Textarea id="confidence-decision" value={confidenceDecision} onChange={e => setConfidenceDecision(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="despair-decision">¿Qué harías si decidieras desde la desesperanza?</Label><Textarea id="despair-decision" value={despairDecision} onChange={e => setDespairDecision(e.target.value)} /></div>
            <Button onClick={() => setStep(2)} className="w-full">Integrar y Elegir</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso final: Integra y elige tu camino</h4>
            <Label htmlFor="final-choice">Ahora que has visto la situación desde distintas lentes, ¿qué decisión quieres tomar hoy y por qué?</Label>
            <Textarea id="final-choice" value={finalChoice} onChange={e => setFinalChoice(e.target.value)} />
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mi elección</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
            <h4 className="font-semibold text-lg">Elección Guardada</h4>
            <p className="text-muted-foreground">“No necesitas eliminar el miedo. Solo necesitas escucharte por encima de él”.</p>
            <Button onClick={() => { setStep(0); setSituation(''); setFearDecision(''); setValueDecision(''); setConfidenceDecision(''); setDespairDecision(''); setFinalChoice(''); }} variant="outline">Empezar de nuevo</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
