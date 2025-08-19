
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ResilienceTimelineExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ResilienceTimelineExerciseProps {
  content: ResilienceTimelineExerciseContent;
  pathId: string;
}

export function ResilienceTimelineExercise({ content, pathId }: ResilienceTimelineExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [situations, setSituations] = useState(['', '', '']);
  const [reflections, setReflections] = useState(Array(3).fill({ difficult: '', resources: '', learned: '', surprised: '' }));

  const handleSituationChange = (index: number, value: string) => {
    const newSituations = [...situations];
    newSituations[index] = value;
    setSituations(newSituations);
  };

  const handleReflectionChange = (index: number, field: string, value: string) => {
    const newReflections = [...reflections];
    newReflections[index] = { ...newReflections[index], [field]: value };
    setReflections(newReflections);
  };

  const next = () => setStep(prev => prev + 1);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Todos hemos atravesado dificultades. Hoy te propongo mirar atrás no para quedarte ahí, sino para descubrir qué te ayudó a salir adelante.</p>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplos</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    <div>
                      <h4 className="font-semibold">Cambio de ciudad sin red de apoyo</h4>
                      <p className="text-sm text-muted-foreground">Lo más difícil fue sentirme sola. Usé rutinas como salir a caminar para darme estabilidad. Aprendí que puedo adaptarme y que el coraje silencioso sostiene desde dentro.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Ruptura amorosa inesperada</h4>
                      <p className="text-sm text-muted-foreground">Lo más difícil fue la pérdida de un futuro imaginado. Pedí ayuda a una terapeuta, escribí en un diario y me permití llorar. Aprendí que puedo sostenerme incluso cuando lo que soñaba se desvanece.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}>Empezar mi línea del tiempo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Selecciona tres momentos difíciles</h4>
            <p className="text-sm text-muted-foreground">Elige 3 situaciones importantes en tu vida en las que sentiste que estabas en crisis o pasándolo mal.</p>
            {situations.map((sit, index) => (
              <Textarea key={index} value={sit} onChange={e => handleSituationChange(index, e.target.value)} placeholder={`Situación ${index + 1}`} />
            ))}
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Reflexiona sobre cada una</h4>
            {situations.map((sit, index) => sit.trim() && (
              <div key={index} className="p-3 border rounded-md">
                <h5 className="font-medium">{sit}</h5>
                <div className="space-y-2 mt-2">
                  <Label>¿Qué fue lo más difícil?</Label>
                  <Textarea value={reflections[index].difficult} onChange={e => handleReflectionChange(index, 'difficult', e.target.value)} />
                  <Label>¿Qué recursos usé?</Label>
                  <Textarea value={reflections[index].resources} onChange={e => handleReflectionChange(index, 'resources', e.target.value)} />
                  <Label>¿Qué aprendí?</Label>
                  <Textarea value={reflections[index].learned} onChange={e => handleReflectionChange(index, 'learned', e.target.value)} />
                  <Label>¿Qué me sorprendió de mí?</Label>
                  <Textarea value={reflections[index].surprised} onChange={e => handleReflectionChange(index, 'surprised', e.target.value)} />
                </div>
              </div>
            ))}
            <Button onClick={next} className="w-full">Ver mi línea de resiliencia</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
            <h4 className="font-semibold text-lg">Tu Línea de Resiliencia</h4>
            <p className="text-muted-foreground">Observa lo que has escrito. Esta es tu línea de resiliencia: no solo viviste momentos difíciles… también te transformaste a través de ellos.</p>
            <Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button>
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
