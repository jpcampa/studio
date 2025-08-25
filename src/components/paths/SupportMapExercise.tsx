
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SupportMapExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';

interface SupportMapExerciseProps {
  content: SupportMapExerciseContent;
  pathId: string;
}

interface Relation {
    name: string;
    supportType: string[];
    quality: number;
}

export function SupportMapExercise({ content, pathId }: SupportMapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState<Relation[]>(Array(5).fill({ name: '', supportType: [], quality: 3 }));
  const [reflection, setReflection] = useState('');

  const handleRelationChange = <K extends keyof Relation>(index: number, field: K, value: Relation[K]) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    relations.filter(r => r.name).forEach(r => {
        notebookContent += `**Persona:** ${r.name}\n`;
        notebookContent += `- Tipo de apoyo: ${r.supportType.join(', ')}\n`;
        notebookContent += `- Calidad: ${r.quality}/5\n\n`;
    });
    notebookContent += `**Reflexión:**\n${reflection || 'Sin reflexión.'}`;

    addNotebookEntry({ title: 'Mi Mapa de Relaciones y Apoyo', content: notebookContent, pathId });
    toast({ title: 'Mapa guardado', description: 'Tu mapa de relaciones se ha guardado en el cuaderno.' });
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p>Saber quién está ahí para ti es como tener un mapa en mitad de un viaje. Hoy vas a dibujar tu propio Mapa de Relaciones y Apoyo.</p>
            <Button onClick={() => setStep(1)}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Identifica a tus personas clave</h4>
            {relations.map((rel, index) => (
              <Input key={index} value={rel.name} onChange={e => handleRelationChange(index, 'name', e.target.value)} placeholder={`Persona ${index + 1}...`} />
            ))}
            <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Clasifica el tipo de apoyo</h4>
            {relations.filter(r => r.name).map((rel, index) => (
              <div key={index} className="space-y-2 border-t pt-2">
                <Label className="font-semibold">{rel.name}</Label>
                <Select onValueChange={v => handleRelationChange(index, 'supportType', [v])}>
                    <SelectTrigger><SelectValue placeholder="Elige un tipo de apoyo..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Emocional">Emocional</SelectItem>
                        <SelectItem value="Práctico">Práctico</SelectItem>
                        <SelectItem value="Validación/Consejo">Validación/Consejo</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            ))}
            <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Valora la calidad del apoyo</h4>
             {relations.filter(r => r.name).map((rel, index) => (
                 <div key={index} className="space-y-2 border-t pt-2">
                    <Label className="font-semibold">{rel.name}: {rel.quality}/5</Label>
                    <Slider value={[rel.quality]} onValueChange={v => handleRelationChange(index, 'quality', v[0])} min={1} max={5} step={1} />
                 </div>
             ))}
            <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
          </div>
        );
       case 4:
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold">Paso 4: Reflexión y síntesis</h4>
                <Label>¿Qué te dice este mapa? ¿Hay algo que te sorprenda?</Label>
                <Textarea value={reflection} onChange={e => setReflection(e.target.value)} />
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar Mapa y Reflexión</Button>
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
