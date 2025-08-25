
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NutritiveDrainingSupportMapExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface NutritiveDrainingSupportMapExerciseProps {
  content: NutritiveDrainingSupportMapExerciseContent;
  pathId: string;
}

interface Relation {
    name: string;
    sensation: 'calm' | 'same' | 'drained' | '';
}

export function NutritiveDrainingSupportMapExercise({ content, pathId }: NutritiveDrainingSupportMapExerciseProps) {
  const { toast } = useToast();
  const [relations, setRelations] = useState<Relation[]>(Array(5).fill({ name: '', sensation: '' }));
  const [reflection, setReflection] = useState({ approach: '', distance: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleRelationChange = <K extends keyof Relation>(index: number, field: K, value: Relation[K]) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    relations.filter(r => r.name).forEach(r => {
        notebookContent += `- ${r.name}: ${r.sensation}\n`;
    });
    notebookContent += `\n**Reflexión:**\n- Quiero acercarme a: ${reflection.approach}\n- Necesito tomar distancia de: ${reflection.distance}`;
    
    addNotebookEntry({ title: 'Mapa de Apoyos Nutritivos y Drenantes', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado' });
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
            <Label>Paso 1: Lista de personas con las que interactúas frecuentemente</Label>
            {relations.map((rel, index) => (
                <Input key={index} value={rel.name} onChange={e => handleRelationChange(index, 'name', e.target.value)} placeholder={`Persona ${index + 1}...`} disabled={isSaved} />
            ))}
          </div>
          <div className="space-y-2">
            <Label>Paso 2: ¿Cómo te sientes después de interactuar con cada una?</Label>
            {relations.filter(r => r.name).map((rel, index) => (
                <div key={index} className="p-2 border-t">
                    <p className="font-semibold">{rel.name}</p>
                    <RadioGroup value={rel.sensation} onValueChange={v => handleRelationChange(index, 'sensation', v as any)} disabled={isSaved}>
                        <div className="flex items-center gap-2"><RadioGroupItem value="calm" id={`s-${index}-c`}/><Label htmlFor={`s-${index}-c`} className="font-normal">Más tranquilo/a y animado/a</Label></div>
                        <div className="flex items-center gap-2"><RadioGroupItem value="same" id={`s-${index}-s`}/><Label htmlFor={`s-${index}-s`} className="font-normal">Igual que antes</Label></div>
                        <div className="flex items-center gap-2"><RadioGroupItem value="drained" id={`s-${index}-d`}/><Label htmlFor={`s-${index}-d`} className="font-normal">Agotado/a o tenso/a</Label></div>
                    </RadioGroup>
                </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Paso 3: Reflexión</Label>
            <Textarea value={reflection.approach} onChange={e => setReflection(p => ({...p, approach: e.target.value}))} placeholder="¿A quién quieres acercarte más?" disabled={isSaved}/>
            <Textarea value={reflection.distance} onChange={e => setReflection(p => ({...p, distance: e.target.value}))} placeholder="¿De quién necesitas tomar distancia?" disabled={isSaved}/>
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Mapa</Button>
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
