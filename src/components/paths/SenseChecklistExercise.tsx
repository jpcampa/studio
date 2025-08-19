
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import type { SenseChecklistExerciseContent } from '@/data/paths/pathTypes';

interface SenseChecklistExerciseProps {
  content: SenseChecklistExerciseContent;
  pathId: string;
}

const checklistItems = [
    { id: 'check-importa', label: '¿Esto me acerca a lo que importa para mí?' },
    { id: 'check-miedo', label: '¿Estoy actuando por miedo, por presión o por valor?' },
    { id: 'check-emocion', label: '¿Qué emoción me mueve en esta decisión?' },
    { id: 'check-paz', label: '¿Me sentiré en paz conmigo después de esto?' },
    { id: 'check-valor', label: '¿Estoy honrando un valor o evitando un conflicto?' },
];

export function SenseChecklistExercise({ content, pathId }: SenseChecklistExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelections(prev => ({...prev, [id]: checked}));
  };
  
  const next = () => setStep(prev => prev + 1);

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="p-4 text-center space-y-4">
            <p>Antes de actuar o tomar una decisión, te invitamos a hacer una breve pausa y revisar algunas preguntas clave. Este pequeño gesto puede ayudarte a elegir con más claridad y en sintonía con lo que realmente te importa.</p>
            <Button onClick={next}>Comenzar Checklist <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}
        {step === 1 && (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Checklist del Sentido</h4>
                <p className="text-sm text-muted-foreground">Piensa en la decisión y marca si la pregunta tiene una respuesta clara y alineada para ti.</p>
                <div className="space-y-2">
                    {checklistItems.map(item => (
                        <div key={item.id} className="flex items-start space-x-2">
                            <Checkbox id={item.id} checked={!!selections[item.id]} onCheckedChange={c => handleSelectionChange(item.id, !!c)} className="mt-1"/>
                            <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                        </div>
                    ))}
                </div>
                <Button onClick={next} className="w-full">Revisar mis respuestas</Button>
            </div>
        )}
        {step === 2 && (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Revisa</h4>
                <p className="text-sm text-muted-foreground">Si hay más ✓ en la dirección de tus valores, adelante. Si hay dudas, quizá aún puedas elegir diferente.</p>
                <p className="italic">“Cada decisión es una oportunidad de acercarte a la vida que sí quieres habitar.”</p>
                <Button onClick={() => setStep(0)} variant="outline" className="w-full">Hacer otro checklist</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
