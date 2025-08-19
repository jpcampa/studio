
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DirectedDecisionsExerciseContent } from '@/data/paths/pathTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DirectedDecisionsExerciseProps {
  content: DirectedDecisionsExerciseContent;
  pathId: string;
}

const valueOptions = [
    {id: 'care', label: 'Cuidado personal'}, {id: 'auth', label: 'Autenticidad'},
    {id: 'calm', label: 'Calma'}, {id: 'connect', label: 'Conexión'},
    {id: 'respect', label: 'Respeto'}, {id: 'balance', label: 'Equilibrio'},
    {id: 'presence', label: 'Presencia'}, {id: 'coherence', label: 'Coherencia interna'},
];

export function DirectedDecisionsExercise({ content, pathId }: DirectedDecisionsExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [selectedValue, setSelectedValue] = useState('');
  const [decision1, setDecision1] = useState('');
  const [adjustment1, setAdjustment1] = useState('');
  const [tomorrowAction, setTomorrowAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!tomorrowAction.trim()) {
      toast({ title: "Acción no definida", description: "Define tu acción para mañana.", variant: 'destructive'});
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Valor elegido a fortalecer:** ${selectedValue || 'No especificado.'}
**Acción para mañana:** ${tomorrowAction}
    `;
    addNotebookEntry({ title: `Decisiones con Dirección`, content: notebookContent, pathId });
    toast({ title: "Decisión Guardada", description: "Tu acción de mañana se ha guardado." });
    setIsSaved(true);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>A veces vivimos decidiendo en automático. Pero hoy vas a practicar algo distinto: tomar decisiones pequeñas que te acerquen a lo que sí tiene sentido para ti.</p>
            <Button onClick={next}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Elige un valor central</h4>
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              {valueOptions.map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.label} id={opt.id} />
                  <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Microdecisiones cotidianas</h4>
            <p className="text-sm text-muted-foreground">Revisa tu día y anota 1-3 decisiones. ¿Están alineadas con tu valor elegido? ¿Cómo podrías reajustarlas?</p>
            <div className="space-y-2">
              <Label htmlFor="decision1">Decisión 1</Label>
              <Textarea id="decision1" value={decision1} onChange={e => setDecision1(e.target.value)} />
              <Label htmlFor="adjustment1">Ajuste posible</Label>
              <Textarea id="adjustment1" value={adjustment1} onChange={e => setAdjustment1(e.target.value)} />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Elige una acción para mañana</h4>
             <div className="space-y-2">
              <Label htmlFor="tomorrow-action">¿Qué pequeña acción puedes tomar mañana que honre ese valor?</Label>
              <Textarea id="tomorrow-action" value={tomorrowAction} onChange={e => setTomorrowAction(e.target.value)} />
            </div>
            {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" />Guardar mi acción</Button>
            ) : (
                <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Tu acción ha sido guardada.</p>
                </div>
            )}
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
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
