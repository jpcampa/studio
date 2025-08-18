
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, TrafficLight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SemaforoEmocionalExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';

interface SemaforoEmocionalExerciseProps {
  content: SemaforoEmocionalExerciseContent;
  pathId: string;
}

export function SemaforoEmocionalExercise({ content, pathId }: SemaforoEmocionalExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [light, setLight] = useState<'verde' | 'ambar' | 'rojo' | ''>('');
  const [action, setAction] = useState('');

  const handleSave = () => {
    addNotebookEntry({ title: 'Registro de Semáforo Emocional', content: `Estado: ${light}. Acción de cuidado: ${action}`, pathId });
    toast({ title: 'Registro Guardado' });
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: return <div className="p-4 space-y-4 text-center"><p>Escanea tu cuerpo, tu mente y tus emociones y selecciona en qué "luz" estás ahora.</p><RadioGroup value={light} onValueChange={(v) => setLight(v as any)} className="flex justify-around py-4">{['verde', 'ambar', 'rojo'].map(color => <Label key={color} htmlFor={`light-${color}`} className={cn("flex items-center justify-center h-20 w-20 rounded-full border-4 cursor-pointer", light === color ? `border-${color}-500 bg-${color}-100` : 'border-gray-300 bg-gray-50', color === 'verde' ? 'border-green-500 bg-green-100' : '', color === 'ambar' ? 'border-yellow-500 bg-yellow-100' : '', color === 'rojo' ? 'border-red-500 bg-red-100' : '')}><RadioGroupItem value={color} id={`light-${color}`} className="sr-only" /><TrafficLight className={cn("h-10 w-10", color === 'verde' ? 'text-green-600' : '', color === 'ambar' ? 'text-yellow-600' : '', color === 'rojo' ? 'text-red-600' : '')} /></Label>)}</RadioGroup><Button onClick={() => setStep(1)} className="w-full" disabled={!light}>Siguiente</Button></div>;
      case 1:
        let suggestions, title;
        if(light === 'verde') { title='Bienestar emocional presente'; suggestions = 'Agradece algo, regálate un momento consciente.'; }
        else if(light === 'ambar') { title='Activación emocional leve'; suggestions = 'Haz una respiración profunda, conecta con tus sentidos.'; }
        else { title='Desborde o activación intensa'; suggestions = 'Aléjate del estímulo, usa una técnica de grounding.'; }
        return <div className="p-4 space-y-4"><h4 className="font-semibold text-center">{title}</h4><p className="text-sm text-center">{suggestions}</p><Label>¿Qué harás ahora para ayudarte?</Label><Textarea value={action} onChange={e => setAction(e.target.value)} /><Button onClick={handleSave} className="w-full mt-2"><Save className="mr-2 h-4 w-4"/>Guardar</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
