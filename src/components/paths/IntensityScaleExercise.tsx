
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IntensityScaleExerciseContent } from '@/data/paths/pathTypes';

interface IntensityScaleExerciseProps {
  content: IntensityScaleExerciseContent;
  pathId: string;
}

export function IntensityScaleExercise({ content, pathId }: IntensityScaleExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [scale, setScale] = useState({
    '0-2': { signals: '', needs: '', strategy: '' },
    '3-4': { signals: '', needs: '', strategy: '' },
    '5-6': { signals: '', needs: '', strategy: '' },
    '7-8': { signals: '', needs: '', strategy: '' },
    '9-10': { signals: '', needs: '', strategy: '' },
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleScaleChange = (level: keyof typeof scale, field: string, value: string) => {
    setScale(prev => ({ ...prev, [level]: { ...prev[level], [field]: value } }));
  };

  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    Object.entries(scale).forEach(([level, data]) => {
      notebookContent += `**Nivel ${level}:**\n`;
      notebookContent += `- Señales: ${data.signals || 'No descrito'}\n`;
      notebookContent += `- Necesidades: ${data.needs || 'No descrito'}\n`;
      notebookContent += `- Estrategias: ${data.strategy || 'No descrito'}\n\n`;
    });
    addNotebookEntry({ title: 'Mi Escala de Intensidad Emocional', content: notebookContent, pathId });
    toast({ title: 'Escala Guardada', description: 'Tu escala de intensidad emocional se ha guardado.' });
    setIsSaved(true);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Este ejercicio te ayudará a crear una brújula emocional para saber qué hacer según cómo te sientes. No tienes que improvisar cuando estés en plena tormenta.</p>
            <Button onClick={() => setStep(1)}>Crear mi plan <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Crea tu plan por niveles</h4>
            {Object.keys(scale).map(level => (
              <div key={level} className="p-3 border rounded-md">
                <h5 className="font-medium">Nivel {level}</h5>
                <div className="space-y-2 mt-2">
                  <Label>¿Qué siento en el cuerpo y en la mente?</Label>
                  <Textarea value={scale[level as keyof typeof scale].signals} onChange={e => handleScaleChange(level as keyof typeof scale, 'signals', e.target.value)} />
                  <Label>¿Qué necesito realmente en este nivel?</Label>
                  <Textarea value={scale[level as keyof typeof scale].needs} onChange={e => handleScaleChange(level as keyof typeof scale, 'needs', e.target.value)} />
                  <Label>¿Qué estrategias puedo usar para regularme?</Label>
                  <Textarea value={scale[level as keyof typeof scale].strategy} onChange={e => handleScaleChange(level as keyof typeof scale, 'strategy', e.target.value)} />
                </div>
              </div>
            ))}
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mi escala</Button>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
            <h4 className="font-semibold text-lg">Escala Guardada</h4>
            <p className="text-muted-foreground">Ya tienes tu propia escala emocional con recursos asociados. Esta será tu hoja de ruta cuando todo parezca desbordarte.</p>
            <Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button>
          </div>
        );
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
