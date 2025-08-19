
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BraveRoadmapExerciseContent } from '@/data/paths/pathTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BraveRoadmapExerciseProps {
  content: BraveRoadmapExerciseContent;
  pathId: string;
}

const valueOptions = [
    {id: 'care', label: 'Cuidado personal'}, {id: 'auth', label: 'Autenticidad'},
    {id: 'connect', label: 'Conexión'}, {id: 'calm', label: 'Calma'},
    {id: 'respect', label: 'Respeto'}, {id: 'coherence', label: 'Coherencia interna'},
    {id: 'bravery', label: 'Valentía'}, {id: 'compassion', label: 'Compasión'},
];

export function BraveRoadmapExercise({ content, pathId }: BraveRoadmapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [chosenValue, setChosenValue] = useState('');
  const [action1, setAction1] = useState('');
  const [courage1, setCourage1] = useState('');
  const [value1, setValue1] = useState('');
  
  const [action2, setAction2] = useState('');
  const [courage2, setCourage2] = useState('');
  const [value2, setValue2] = useState('');

  const [action3, setAction3] = useState('');
  const [courage3, setCourage3] = useState('');
  const [value3, setValue3] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

**Valor ancla de la semana:** ${chosenValue || 'No especificado'}

**Acción 1:** ${action1} (Coraje: ${courage1}/3, Valor: ${value1})
**Acción 2:** ${action2} (Coraje: ${courage2}/3, Valor: ${value2})
**Acción 3:** ${action3} (Coraje: ${courage3}/3, Valor: ${value3})
    `;
    addNotebookEntry({ title: `Mi Hoja de Ruta Valiente`, content: notebookContent, pathId });
    toast({ title: "Hoja de Ruta Guardada", description: "Tus acciones han sido guardadas." });
    setIsSaved(true);
    next();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>Una vida con sentido no se construye en grandes saltos, sino en pequeños actos valientes. Hoy vas a elegir tres acciones que reflejen quién eres y hacia dónde quieres ir.</p>
            <Button onClick={next}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu valor guía</h4>
            <RadioGroup value={chosenValue} onValueChange={setChosenValue}>
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
          <form onSubmit={handleSave} className="p-4 space-y-6">
            <h4 className="font-semibold text-lg">Paso 2: Define tus acciones</h4>
            <div className="space-y-2 p-2 border rounded-md">
                <Label htmlFor="action1">Acción concreta 1:</Label>
                <Textarea id="action1" value={action1} onChange={e => setAction1(e.target.value)}/>
                <Label>Coraje requerido (1-3):</Label>
                <RadioGroup value={courage1} onValueChange={setCourage1} className="flex gap-4"><RadioGroupItem value="1" id="c11"/><Label htmlFor="c11">1</Label><RadioGroupItem value="2" id="c12"/><Label htmlFor="c12">2</Label><RadioGroupItem value="3" id="c13"/><Label htmlFor="c13">3</Label></RadioGroup>
                <Label>Valor asociado:</Label>
                <Textarea value={value1} onChange={e => setValue1(e.target.value)}/>
            </div>
             <div className="space-y-2 p-2 border rounded-md">
                <Label htmlFor="action2">Acción concreta 2:</Label>
                <Textarea id="action2" value={action2} onChange={e => setAction2(e.target.value)}/>
                <Label>Coraje requerido (1-3):</Label>
                <RadioGroup value={courage2} onValueChange={setCourage2} className="flex gap-4"><RadioGroupItem value="1" id="c21"/><Label htmlFor="c21">1</Label><RadioGroupItem value="2" id="c22"/><Label htmlFor="c22">2</Label><RadioGroupItem value="3" id="c23"/><Label htmlFor="c23">3</Label></RadioGroup>
                <Label>Valor asociado:</Label>
                <Textarea value={value2} onChange={e => setValue2(e.target.value)}/>
            </div>
             <div className="space-y-2 p-2 border rounded-md">
                <Label htmlFor="action3">Acción concreta 3:</Label>
                <Textarea id="action3" value={action3} onChange={e => setAction3(e.target.value)}/>
                <Label>Coraje requerido (1-3):</Label>
                <RadioGroup value={courage3} onValueChange={setCourage3} className="flex gap-4"><RadioGroupItem value="1" id="c31"/><Label htmlFor="c31">1</Label><RadioGroupItem value="2" id="c32"/><Label htmlFor="c32">2</Label><RadioGroupItem value="3" id="c33"/><Label htmlFor="c33">3</Label></RadioGroup>
                <Label>Valor asociado:</Label>
                <Textarea value={value3} onChange={e => setValue3(e.target.value)}/>
            </div>
            <Button type="submit" className="w-full">Revisar mi hoja de ruta</Button>
          </form>
        );
      case 3:
        return (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Hoja de Ruta Guardada</h4>
                <p className="italic">"Tus decisiones crean tu camino. No importa si es grande o pequeño: cada paso desde el propósito cuenta."</p>
                <Button onClick={() => setStep(0)} variant="outline" className="w-full">Crear otra hoja de ruta</Button>
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
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
