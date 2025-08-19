
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ThoughtsThatBlockPurposeExerciseContent } from '@/data/paths/pathTypes';
import { Checkbox } from '@/components/ui/checkbox';

interface ThoughtsThatBlockPurposeExerciseProps {
  content: ThoughtsThatBlockPurposeExerciseContent;
  pathId: string;
}

const distortionOptions = [
    {id: 'catastrophism', label: 'Catastrofismo'}, {id: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)'},
    {id: 'overgeneralization', label: 'Sobregeneralización'}, {id: 'personalization', label: 'Personalización'},
    {id: 'mind_reading', label: 'Adivinación del pensamiento o futuro'}, {id: 'selective_abstraction', label: 'Abstracción selectiva'},
];

export function ThoughtsThatBlockPurposeExercise({ content, pathId }: ThoughtsThatBlockPurposeExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortions, setDistortions] = useState<Record<string, boolean>>({});
  const [reformulation, setReformulation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reformulation.trim()) {
        toast({ title: 'Reformulación vacía', description: 'Por favor, completa la reformulación.', variant: 'destructive'});
        return;
    }
    const selectedDistortions = distortionOptions.filter(d => distortions[d.id]).map(d => d.label);

    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation || 'No especificada.'}
**Pensamiento automático:** "${automaticThought || 'No especificado.'}"
**Distorsiones detectadas:** ${selectedDistortions.join(', ') || 'Ninguna.'}
**Reformulación consciente:** "${reformulation}"
    `;
    addNotebookEntry({ title: `Micropráctica: Pensamientos que Bloquean`, content: notebookContent, pathId });
    toast({ title: "Práctica Guardada", description: "Tu ejercicio ha sido guardado." });
    setIsSaved(true);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Activa el recuerdo</h4>
            <Label htmlFor="sit-block">¿Qué situación reciente te bloqueó para actuar desde tu propósito?</Label>
            <Textarea id="sit-block" value={situation} onChange={e => setSituation(e.target.value)} />
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Pensamiento automático</h4>
            <div className="space-y-2">
                <Label htmlFor="thought-block">¿Qué frase pasó por tu mente en ese momento?</Label>
                <Textarea id="thought-block" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>¿Qué distorsiones cognitivas detectas?</Label>
                {distortionOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={!!distortions[opt.id]} onCheckedChange={c => setDistortions(p => ({...p, [opt.id]: !!c}))} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Reformulación consciente</h4>
            <Label htmlFor="reformulation-block">Reformula esa frase desde un lugar más realista, valiente o compasivo.</Label>
            <Textarea id="reformulation-block" value={reformulation} onChange={e => setReformulation(e.target.value)} />
             {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar en mi caja de herramientas</Button>
            ) : (
                 <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Guardado con éxito.</p>
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
