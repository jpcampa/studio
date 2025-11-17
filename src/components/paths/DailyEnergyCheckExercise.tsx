
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyEnergyCheckExerciseContent } from '@/data/paths/pathTypes';

interface DailyEnergyCheckExerciseProps {
  content: DailyEnergyCheckExerciseContent;
  pathId: string;
}

export function DailyEnergyCheckExercise({ content, pathId }: DailyEnergyCheckExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [energyLevel, setEnergyLevel] = useState<'alta' | 'media' | 'baja' | ''>('');
  const [rechargedBy, setRechargedBy] = useState('');
  const [drainedBy, setDrainedBy] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Nivel de energía de hoy:** ${energyLevel}
**Me recargó:** ${rechargedBy}
**Me drenó:** ${drainedBy}
    `;
    addNotebookEntry({ title: 'Mi Mini-Check de Energía Diaria', content: notebookContent, pathId: pathId });
    toast({ title: 'Registro Guardado', description: 'Tu registro de energía ha sido guardado.' });
    setIsSaved(true);
  };

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
            <div className="text-center p-4 space-y-4">
                 <p className="mb-4">Este ejercicio te ayudará a identificar qué actividades, personas y entornos recargan tu batería y cuáles la gastan más rápido.</p>
                <Button onClick={() => setStep(1)}>Empezar mi registro de energía</Button>
            </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <Label>Paso 1: Evalúa tu energía de hoy</Label>
            <RadioGroup value={energyLevel} onValueChange={(value) => setEnergyLevel(value as any)}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="alta" id="energy-high" /><Label htmlFor="energy-high">Alta</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="media" id="energy-medium" /><Label htmlFor="energy-medium">Media</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="baja" id="energy-low" /><Label htmlFor="energy-low">Baja</Label></div>
            </RadioGroup>
            <Button onClick={() => setStep(2)} className="w-full">Continuar</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="recharged">Paso 2: Lo que me recargó hoy</Label>
            <Textarea id="recharged" value={rechargedBy} onChange={e => setRechargedBy(e.target.value)} placeholder="Ej: Salir a caminar al sol, reír con un amigo..." />
            <Button onClick={() => setStep(3)} className="w-full">Continuar</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="drained">Paso 3: Lo que me drenó hoy</Label>
            <Textarea id="drained" value={drainedBy} onChange={e => setDrainedBy(e.target.value)} placeholder="Ej: Reunión tensa, dormir poco..." />
            <Button onClick={() => { handleSave(); setStep(4); }} className="w-full">Guardar Balance</Button>
          </div>
        );
        case 4:
            return (
               <div className="p-4 text-center space-y-4">
                   <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                   <h4 className="font-semibold text-lg">Balance Guardado</h4>
                   <p className="text-muted-foreground">Hoy has protegido tu energía. Mañana puedes probar a sumar más de lo que te recarga.</p>
                   <Button onClick={() => { setStep(0); setIsSaved(false); }} variant="outline" className="w-full">Hacer otro registro</Button>
               </div>
            );
      default:
        return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
