
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import type { ChangeTimelineExerciseContent } from '@/data/paths/pathTypes';

interface ChangeTimelineExerciseProps {
  content: ChangeTimelineExerciseContent;
  pathId: string;
}

export function ChangeTimelineExercise({ content, pathId }: ChangeTimelineExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [startPoint, setStartPoint] = useState({ feelings: '', thoughts: '', beliefs: '', struggles: '' });
  const [inflectionPoints, setInflectionPoints] = useState('');
  const [presentMoment, setPresentMoment] = useState({ thoughts: '', talk: '', resources: '', values: '' });
  const [symbol, setSymbol] = useState({ image: '', why: '' });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStartPointChange = (field: keyof typeof startPoint, value: string) => {
    setStartPoint(prev => ({ ...prev, [field]: value }));
  };

  const handlePresentMomentChange = (field: keyof typeof presentMoment, value: string) => {
    setPresentMoment(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSymbolChange = (field: keyof typeof symbol, value: string) => {
    setSymbol(prev => ({ ...prev, [field]: value }));
  };

  const next = () => setStep(prev => prev + 1);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({ title: 'Línea de Cambio Finalizada', description: 'Has integrado tu camino de resiliencia.' });
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Nombra el punto de partida</h4>
            <div className="space-y-2">
              <Label>¿Qué sentías?</Label><Textarea value={startPoint.feelings} onChange={e => handleStartPointChange('feelings', e.target.value)} />
              <Label>¿Qué pensamientos dominaban tu mente?</Label><Textarea value={startPoint.thoughts} onChange={e => handleStartPointChange('thoughts', e.target.value)} />
              <Label>¿Qué creías sobre ti?</Label><Textarea value={startPoint.beliefs} onChange={e => handleStartPointChange('beliefs', e.target.value)} />
              <Label>¿Qué cosas te costaban?</Label><Textarea value={startPoint.struggles} onChange={e => handleStartPointChange('struggles', e.target.value)} />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Nombra tus momentos de inflexión</h4>
            <Label>Recuerda 2 o 3 momentos importantes del proceso.</Label>
            <Textarea value={inflectionPoints} onChange={e => setInflectionPoints(e.target.value)} placeholder="Momentos clave, logros, caídas, descubrimientos..." rows={5} />
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Nombra tu momento presente</h4>
            <div className="space-y-2">
              <Label>¿Qué ha cambiado en tu forma de pensar?</Label><Textarea value={presentMoment.thoughts} onChange={e => handlePresentMomentChange('thoughts', e.target.value)} />
              <Label>¿Cómo te hablas ahora?</Label><Textarea value={presentMoment.talk} onChange={e => handlePresentMomentChange('talk', e.target.value)} />
              <Label>¿Qué recursos has desarrollado?</Label><Textarea value={presentMoment.resources} onChange={e => handlePresentMomentChange('resources', e.target.value)} />
              <Label>¿Qué cosas valoras de ti?</Label><Textarea value={presentMoment.values} onChange={e => handlePresentMomentChange('values', e.target.value)} />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 4: Elige un símbolo o imagen de tu evolución</h4>
            <div className="space-y-2">
              <Label>¿Qué imagen se te viene a la mente?</Label><Textarea value={symbol.image} onChange={e => handleSymbolChange('image', e.target.value)} placeholder="Una montaña, un faro, una semilla..." />
              <Label>¿Por qué lo elegiste?</Label><Textarea value={symbol.why} onChange={e => handleSymbolChange('why', e.target.value)} />
            </div>
            <Button onClick={handleComplete} className="w-full"><CheckCircle className="mr-2 h-4 w-4"/> Finalizar Ejercicio</Button>
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
        {!isCompleted ? renderStep() : (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Completado!</h4>
            <p className="text-muted-foreground">Tu historia no es lineal ni perfecta. Pero cada paso ha sido una forma de reconstruirte. Eres resiliente no porque no caíste, sino porque te levantaste diferente.</p>
            <Button onClick={() => { setStep(0); setIsCompleted(false); }} variant="outline" className="w-full">Repetir Ejercicio</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
