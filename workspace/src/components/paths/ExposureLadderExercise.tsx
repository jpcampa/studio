
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ExposureLadderExerciseContent } from '@/data/paths/pathTypes';

interface ExposureLadderExerciseProps {
  content: ExposureLadderExerciseContent;
  pathId: string;
}

export function ExposureLadderExercise({ content, pathId }: ExposureLadderExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState(Array(7).fill(''));
  const [firstStep, setFirstStep] = useState('');

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  const handleSave = () => {
    const filledSteps = steps.filter(s => s.trim() !== '');
    if (!goal.trim() || filledSteps.length === 0 || !firstStep.trim()) {
        toast({title: 'Datos incompletos', description: 'Por favor, define tu meta, al menos un escalón y elige tu primer paso.', variant: 'destructive'});
        return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Meta:** ${goal}
**Escalones:**
${filledSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Mi primer paso será:** ${firstStep}
    `;
    addNotebookEntry({ title: 'Mi Escalera de Exposición', content: notebookContent, pathId });
    toast({ title: 'Escalera Guardada' });
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 0: return (
        <div className="p-4 text-center">
            <p className="mb-4">Imagina que cada situación que temes es un escalón de una escalera. Hoy vamos a construir juntos tu escalera de exposición: desde lo más sencillo hasta lo más desafiante.</p>
            <Button onClick={() => setStep(1)}>Empezar a construir <ArrowRight className="ml-2 h-4 w-4"/></Button>
        </div>
      );
      case 1: return (
        <div className="p-4 space-y-4">
            <Label htmlFor="goal">¿Qué situación ansiosa quieres poder afrontar en el futuro?</Label>
            <Textarea id="goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ej: Hablar en público en una reunión de trabajo"/>
            <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
        </div>
      );
      case 2: return (
        <div className="p-4 space-y-4">
            <Label>Ahora divide esa situación en escalones más pequeños.</Label>
            {steps.map((s, i) => (
                <Textarea key={i} value={s} onChange={e => handleStepChange(i, e.target.value)} placeholder={`Escalón ${i+1}`}/>
            ))}
            <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
        </div>
      );
       case 3: return (
        <div className="p-4 space-y-4">
            <Label>Ordena tus escalones del más fácil al más difícil.</Label>
            <p className="text-sm text-muted-foreground">(Funcionalidad de arrastrar y ordenar no disponible, por favor ordénalos mentalmente por ahora)</p>
            <ul className="list-decimal list-inside p-2 border rounded-md">
                {steps.filter(s => s.trim()).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
        </div>
      );
      case 4: return (
        <div className="p-4 space-y-4">
            <Label>¿Cuál será el primer paso realista que puedes poner en práctica esta semana?</Label>
             <RadioGroup value={firstStep} onValueChange={setFirstStep}>
                {steps.filter(s => s.trim()).map((s, i) => (
                     <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={`step-radio-${i}`} />
                        <Label htmlFor={`step-radio-${i}`} className="font-normal">{s}</Label>
                     </div>
                ))}
             </RadioGroup>
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi escalera</Button>
        </div>
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
      <CardContent>{renderCurrentStep()}</CardContent>
    </Card>
  );
}
