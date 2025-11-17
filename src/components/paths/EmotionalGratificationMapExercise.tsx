
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmotionalGratificationMapExerciseContent } from '@/data/paths/pathTypes';

interface EmotionalGratificationMapExerciseProps {
  content: EmotionalGratificationMapExerciseContent;
  pathId: string;
}

export function EmotionalGratificationMapExercise({ content, pathId }: EmotionalGratificationMapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState('');
  const [people, setPeople] = useState('');
  const [places, setPlaces] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Actividades que me recargan:**
${activities || 'No especificado.'}

**Personas que me inspiran o dan calma:**
${people || 'No especificado.'}

**Lugares que me llenan de energía:**
${places || 'No especificado.'}
    `;
    addNotebookEntry({ title: 'Mi Mapa de Gratificación Emocional', content: notebookContent, pathId: pathId });
    toast({ title: 'Mapa Guardado', description: 'Tu mapa ha sido guardado en el cuaderno.' });
    setIsSaved(true);
  };

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <div className="text-center p-4">
            <p className="mb-4">Este ejercicio te ayudará a reconectar con esas fuentes de bienestar que a veces olvidas. Al final, tendrás un mapa personal al que acudir cuando necesites recargar energía emocional.</p>
            <Button onClick={() => setStep(1)}>Empezar</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="activities">Paso 1: Recuerda actividades que te hacían sentir bien</Label>
            <Textarea id="activities" value={activities} onChange={e => setActivities(e.target.value)} placeholder="Ej: Caminar por la playa, cocinar mi receta favorita..." />
            <Button onClick={() => setStep(2)} className="w-full">Continuar</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="people">Paso 2: Recuerda personas con las que te sentías bien</Label>
            <Textarea id="people" value={people} onChange={e => setPeople(e.target.value)} placeholder="Ej: Mi mejor amigo de la universidad, mi abuela..." />
            <Button onClick={() => setStep(3)} className="w-full">Continuar</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="places">Paso 3: Lugares que te recargaban</Label>
            <Textarea id="places" value={places} onChange={e => setPlaces(e.target.value)} placeholder="Ej: Una cafetería acogedora, un sendero en la montaña..." />
            <Button onClick={() => { handleSave(); setStep(4); }} className="w-full">Guardar mi mapa</Button>
          </div>
        );
      case 4:
         return (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Mapa Guardado</h4>
                <p className="text-muted-foreground">Aquí tienes tu mapa de gratificación, para revisarlo cuando quieras:</p>
                <div className="text-left p-2 border rounded-md bg-background/50">
                    <p><strong>Actividades:</strong> {activities}</p>
                    <p><strong>Personas:</strong> {people}</p>
                    <p><strong>Lugares:</strong> {places}</p>
                </div>
                 <Button onClick={() => { setStep(0); setIsSaved(false); }} variant="outline" className="w-full">Empezar de nuevo</Button>
            </div>
         );
      default:
        return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
