
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SymbolicSupportCircleExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';

interface SymbolicSupportCircleExerciseProps {
  content: SymbolicSupportCircleExerciseContent;
  pathId: string;
}

interface Pillar {
    name: string;
    contribution: string;
    careAction: string;
}

export function SymbolicSupportCircleExercise({ content, pathId }: SymbolicSupportCircleExerciseProps) {
  const { toast } = useToast();
  const [pillars, setPillars] = useState<Pillar[]>(Array(4).fill({ name: '', contribution: '', careAction: ''}));
  const [isSaved, setIsSaved] = useState(false);

  const handlePillarChange = <K extends keyof Pillar>(index: number, field: K, value: Pillar[K]) => {
      const newPillars = [...pillars];
      newPillars[index] = { ...newPillars[index], [field]: value };
      setPillars(newPillars);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    pillars.filter(p => p.name).forEach(p => {
        notebookContent += `**Pilar:** ${p.name}\n- Aporta: ${p.contribution}\n- Gesto de cuidado: ${p.careAction}\n\n`;
    });
    addNotebookEntry({ title: 'Mi Círculo de Sostén Simbólico', content: notebookContent, pathId });
    toast({ title: 'Círculo Guardado' });
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
            <Label>Paso 1: Elige a tus pilares</Label>
            {pillars.map((p, i) => (
              <Input key={i} value={p.name} onChange={e => handlePillarChange(i, 'name', e.target.value)} placeholder={`Pilar ${i+1}...`} disabled={isSaved}/>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Paso 2 y 3: Representa y cuida tu red</Label>
            {pillars.filter(p => p.name).map((p, i) => (
              <div key={i} className="p-2 border-t">
                <p className="font-semibold">{p.name}</p>
                <Textarea value={p.contribution} onChange={e => handlePillarChange(i, 'contribution', e.target.value)} placeholder="¿Qué te aporta esta persona?" disabled={isSaved} />
                <Textarea value={p.careAction} onChange={e => handlePillarChange(i, 'careAction', e.target.value)} placeholder="Gesto para cuidar el vínculo..." disabled={isSaved} />
              </div>
            ))}
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Círculo</Button>
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
