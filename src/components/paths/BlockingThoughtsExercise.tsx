
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BlockingThoughtsExerciseContent } from '@/data/paths/pathTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BlockingThoughtsExerciseProps {
  content: BlockingThoughtsExerciseContent;
  pathId: string;
}

const distortionOptions = [
    { value: 'catastrophism', label: 'Catastrofismo' },
    { value: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)' },
    { value: 'mind_reading', label: 'Adivinación del pensamiento o futuro' },
    { value: 'personalization', label: 'Personalización' },
];

export function BlockingThoughtsExercise({ content, pathId }: BlockingThoughtsExerciseProps) {
  const { toast } = useToast();
  const [situation, setSituation] = useState('');
  const [blockingThought, setBlockingThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [reformulation, setReformulation] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!situation || !blockingThought || !reformulation) {
        toast({ title: 'Campos incompletos', variant: 'destructive' });
        return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación:* ${situation}
*Pensamiento bloqueante:* ${blockingThought}
*Distorsión identificada:* ${distortion}
*Reformulación:* ${reformulation}
*Próximo paso:* ${nextStep}
    `;
    addNotebookEntry({ title: 'Registro de Pensamientos Bloqueantes', content: notebookContent, pathId });
    toast({ title: 'Registro Guardado' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sit-blocking">Describe una situación reciente en la que no pediste ayuda</Label>
            <Textarea id="sit-blocking" value={situation} onChange={e => setSituation(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thought-blocking">¿Qué pensamiento te frenó?</Label>
            <Textarea id="thought-blocking" value={blockingThought} onChange={e => setBlockingThought(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distortion-select">Identifica la distorsión</Label>
            <Select onValueChange={setDistortion} value={distortion} disabled={isSaved}>
                <SelectTrigger><SelectValue placeholder="Elige una distorsión..."/></SelectTrigger>
                <SelectContent>
                    {distortionOptions.map(opt => <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformulation-blocking">Escribe una reformulación más útil</Label>
            <Textarea id="reformulation-blocking" value={reformulation} onChange={e => setReformulation(e.target.value)} disabled={isSaved} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="next-step-blocking">¿Cómo podrías aplicarlo la próxima vez?</Label>
            <Textarea id="next-step-blocking" value={nextStep} onChange={e => setNextStep(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Registro</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
