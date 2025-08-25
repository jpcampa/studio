
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MutualCareCommitmentExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MutualCareCommitmentExerciseProps {
  content: MutualCareCommitmentExerciseContent;
  pathId: string;
}

export function MutualCareCommitmentExercise({ content, pathId }: MutualCareCommitmentExerciseProps) {
  const { toast } = useToast();
  const [people, setPeople] = useState(['', '', '']);
  const [actions, setActions] = useState(['', '', '']);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    people.forEach((p, i) => {
        if(p.trim() && actions[i].trim()) {
            notebookContent += `- Para cuidar a ${p}: ${actions[i]}\n`;
        }
    });
    addNotebookEntry({ title: 'Mi Compromiso de Cuidado Mutuo', content: notebookContent, pathId });
    toast({ title: 'Compromiso Guardado' });
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
                <Label>Paso 1: Identifica a quién quieres cuidar</Label>
                {people.map((p, i) => (
                    <Input key={i} value={p} onChange={e => { const newP = [...people]; newP[i] = e.target.value; setPeople(newP);}} placeholder={`Persona ${i+1}...`} disabled={isSaved} />
                ))}
            </div>
             <div className="space-y-2">
                <Label>Paso 2: Elige tus gestos de cuidado</Label>
                {actions.map((a, i) => (
                    <Textarea key={i} value={a} onChange={e => { const newA = [...actions]; newA[i] = e.target.value; setActions(newA);}} placeholder={`Acción para la persona ${i+1}...`} disabled={isSaved} />
                ))}
             </div>
            {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Compromisos</Button>
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
