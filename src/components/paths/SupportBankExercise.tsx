
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SupportBankExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';

interface SupportBankExerciseProps {
  content: SupportBankExerciseContent;
  pathId: string;
}

interface Person {
    name: string;
    supportType: string;
    confidence: number;
}

export function SupportBankExercise({ content, pathId }: SupportBankExerciseProps) {
  const { toast } = useToast();
  const [people, setPeople] = useState<Person[]>(Array(5).fill({ name: '', supportType: '', confidence: 3 }));
  const [isSaved, setIsSaved] = useState(false);

  const handlePersonChange = <K extends keyof Person>(index: number, field: K, value: Person[K]) => {
    const newPeople = [...people];
    newPeople[index] = { ...newPeople[index], [field]: value };
    setPeople(newPeople);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    people.filter(p => p.name).forEach(p => {
        notebookContent += `**Persona:** ${p.name}\n- Tipo de apoyo: ${p.supportType}\n- Confianza: ${p.confidence}/5\n\n`;
    });
    addNotebookEntry({ title: 'Mi Banco de Apoyos', content: notebookContent, pathId: pathId });
    toast({ title: 'Banco de Apoyos Guardado' });
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
                <Label>Paso 1: Lista de personas conocidas</Label>
                {people.map((p, i) => <Input key={i} value={p.name} onChange={e => handlePersonChange(i, 'name', e.target.value)} placeholder={`Persona ${i+1}...`} disabled={isSaved} />)}
            </div>
             <div className="space-y-2">
                <Label>Paso 2: Clasifica y valora</Label>
                {people.filter(p => p.name).map((p, i) => (
                    <div key={i} className="p-2 border-t">
                        <p className="font-semibold">{p.name}</p>
                        <Select onValueChange={v => handlePersonChange(i, 'supportType', v)} disabled={isSaved}>
                            <SelectTrigger><SelectValue placeholder="Tipo de apoyo..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Escuchar y aconsejar">Escuchar y aconsejar</SelectItem>
                                <SelectItem value="Acompañar físicamente">Acompañar físicamente</SelectItem>
                                <SelectItem value="Ayudar con tareas">Ayudar con tareas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Label>Confianza: {p.confidence}/5</Label>
                        <Slider value={[p.confidence]} onValueChange={v => handlePersonChange(i, 'confidence', v[0])} min={1} max={5} step={1} disabled={isSaved} />
                    </div>
                ))}
             </div>
             {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Banco</Button>
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
