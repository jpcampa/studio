
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, TrafficCone } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { StopExerciseContent } from '@/data/paths/pathTypes';

interface StopExerciseProps {
  content: StopExerciseContent;
  pathId: string;
}

export function StopExercise({ content, pathId }: StopExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  
  const [observedState, setObservedState] = useState('');
  const [nextAction, setNextAction] = useState('');
  
  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!observedState.trim() || !nextAction.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa tu observación y tu siguiente paso.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi observación (pensamiento y sensación):*
${observedState}

*Mi siguiente paso elegido:*
${nextAction}
    `;
    addNotebookEntry({ title: `Práctica STOP`, content: notebookContent, pathId });
    toast({ title: 'Práctica Guardada' });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p>La técnica STOP es como tener un semáforo interno. Cuando la ansiedad acelera tus pensamientos, este semáforo te recuerda que puedes parar y elegir cómo seguir.</p>
            <Button onClick={next}>Empezar práctica <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2"><TrafficCone className="text-red-500"/>S: STOP / Para</h4>
            <p className="text-sm text-muted-foreground">Interrumpe el piloto automático. Detente físicamente. Suelta los hombros, planta los pies en el suelo.</p>
            <Button onClick={next} className="w-full">Hecho, siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2"><TrafficCone className="text-yellow-500"/>T: Toma una respiración</h4>
            <p className="text-sm text-muted-foreground">Activa tu freno natural. Inhala por la nariz... y exhala lento por la boca. Repite 3-5 veces.</p>
            <Button onClick={next} className="w-full">Hecho, siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2"><TrafficCone className="text-yellow-500"/>O: Observa</h4>
            <p className="text-sm text-muted-foreground">Mira tus pensamientos y sensaciones desde fuera. ¿Qué estás pensando? ¿Qué sientes en el cuerpo?</p>
            <Textarea value={observedState} onChange={e => setObservedState(e.target.value)} placeholder="Ej: 'Pienso que no podré y siento un nudo en el estómago'"/>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2"><TrafficCone className="text-green-500"/>P: Permite / Prosigue</h4>
            <p className="text-sm text-muted-foreground">Acepta lo que sientes sin luchar. Ahora, elige el siguiente paso, por pequeño que sea.</p>
            <Textarea value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="Ej: 'Doy tres pasos y entro a la sala'"/>
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi frase permisiva</Button>
          </form>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
