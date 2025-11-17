
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SelfCareContractExerciseContent } from '@/data/paths/pathTypes';

interface SelfCareContractExerciseProps {
  content: SelfCareContractExerciseContent;
  pathId: string;
}

export function SelfCareContractExercise({ content, pathId }: SelfCareContractExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [notWilling, setNotWilling] = useState('');
  const [commitment, setCommitment] = useState('');
  const [how, setHow] = useState('');

  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    if (!notWilling.trim() || !commitment.trim() || !how.trim()) {
        toast({ title: "Contrato Incompleto", description: "Por favor, completa todas las secciones del contrato.", variant: "destructive" });
        return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**No estoy dispuesta/o a:**
${notWilling}

**Me comprometo a:**
${commitment}

**Lo haré de forma:**
${how}
`;
    addNotebookEntry({ title: "Mi Contrato Interno de Autocuidado", content: notebookContent, pathId: pathId });
    toast({ title: "Contrato Guardado", description: "Tu contrato interno se ha guardado en el cuaderno." });
    next();
  };

  const renderStep = () => {
    switch(step) {
        case 0:
            return (
                <div className="p-4 space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">A menudo hablamos de poner límites hacia fuera, pero ¿qué pasa con los límites internos? Este ejercicio te ayuda a identificar con claridad aquello que ya no estás dispuesto o dispuesta a seguir permitiéndote, desde un lugar de cuidado, no de juicio.</p>
                    <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Crear mi contrato</Button>
                </div>
            );
        case 1:
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <div className="space-y-2">
                        <Label htmlFor="not-willing" className="font-semibold text-lg">No estoy dispuesta/o a…</Label>
                        <p className="text-xs text-muted-foreground">Ejemplos: Seguir callando lo que me duele; Ceder siempre para evitar conflictos; Negar mis necesidades para complacer.</p>
                        <Textarea id="not-willing" value={notWilling} onChange={e => setNotWilling(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="commitment" className="font-semibold text-lg">Me comprometo a…</Label>
                         <p className="text-xs text-muted-foreground">Ejemplos: Cuidar mi energía como prioridad; Escuchar mis emociones sin juzgarlas; Recordarme que tengo derecho a poner límites.</p>
                        <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="how" className="font-semibold text-lg">Lo haré de forma…</Label>
                         <p className="text-xs text-muted-foreground">Ejemplos: Clara, sin herir; Suave, pero firme; Honesta, aunque me cueste.</p>
                        <Textarea id="how" value={how} onChange={e => setHow(e.target.value)} />
                    </div>
                    <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi Contrato</Button>
                </div>
            );
        case 2:
            return (
                <div className="p-6 text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">¡Contrato Guardado!</h4>
                    <p className="text-muted-foreground">Has creado un compromiso valioso contigo. Vuelve a él cuando necesites recordar lo que es importante para ti.</p>
                    <Button onClick={() => setStep(0)} variant="outline" className="w-full">Crear otro</Button>
                </div>
            );
        default: return null;
    }
  }

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
