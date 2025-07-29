
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UncertaintyMapExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';

interface UncertaintyMapExerciseProps {
  content: UncertaintyMapExerciseContent;
}

const areaOptions = [
    { id: 'area-work', label: 'Trabajo / estudios' },
    { id: 'area-economy', label: 'Economía / dinero' },
    { id: 'area-health', label: 'Salud' },
    { id: 'area-relationships', label: 'Relaciones afectivas' },
    { id: 'area-family', label: 'Familia / hijos' },
    { id: 'area-future', label: 'Futuro personal' },
    { id: 'area-purpose', label: 'Propósito / decisiones importantes' },
];

const responseOptions = [
    { id: 'resp-worry', label: 'Me preocupo mucho' },
    { id: 'resp-control', label: 'Intento controlar todo' },
    { id: 'resp-avoid', label: 'Evito pensar en ello' },
    { id: 'resp-paralyze', label: 'Me paralizo' },
    { id: 'resp-info', label: 'Busco mucha información' },
    { id: 'resp-distract', label: 'Me distraigo con otras cosas' },
    { id: 'resp-irritate', label: 'Me irrito o me pongo de mal humor' },
];

const steps = ['intro', 'areas', 'responses', 'summary'];

export function UncertaintyMapExercise({ content }: UncertaintyMapExerciseProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
  const [otherArea, setOtherArea] = useState('');
  const [selectedResponses, setSelectedResponses] = useState<Record<string, boolean>>({});
  const [otherResponse, setOtherResponse] = useState('');

  const nextStep = () => {
    if (currentStep === 1 && Object.values(selectedAreas).every(v => !v)) {
        toast({ title: "Selección requerida", description: "Por favor, marca al menos un área.", variant: "destructive" });
        return;
    }
    if (currentStep === 2 && Object.values(selectedResponses).every(v => !v)) {
        toast({ title: "Selección requerida", description: "Por favor, marca al menos una respuesta habitual.", variant: "destructive" });
        return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const handleAreaChange = (id: string, checked: boolean) => {
    setSelectedAreas(prev => ({ ...prev, [id]: checked }));
  };

  const handleResponseChange = (id: string, checked: boolean) => {
    setSelectedResponses(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const getSelectedLabels = (options: {id: string, label: string}[], selections: Record<string, boolean>) => {
        return options.filter(opt => selections[opt.id]).map(opt => opt.label);
    };

    const finalAreas = getSelectedLabels(areaOptions, selectedAreas);
    if (selectedAreas['area-other'] && otherArea.trim()) {
        finalAreas.push(`Otra: ${otherArea.trim()}`);
    }

    const finalResponses = getSelectedLabels(responseOptions, selectedResponses);
    if (selectedResponses['resp-other'] && otherResponse.trim()) {
        finalResponses.push(`Otra: ${otherResponse.trim()}`);
    }

    let notebookContent = `
**Ejercicio: ${content.title}**

*Áreas donde siento más incertidumbre:*
${finalAreas.length > 0 ? finalAreas.map(item => `- ${item}`).join('\n') : 'Ninguna especificada.'}

*Mis reacciones habituales ante la incertidumbre:*
${finalResponses.length > 0 ? finalResponses.map(item => `- ${item}`).join('\n') : 'Ninguna especificada.'}
    `;

    addNotebookEntry({
      title: "Mi Mapa de la Incertidumbre",
      content: notebookContent,
      pathId: 'tolerar-incertidumbre', // Hardcoded for now
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Mapa de la Incertidumbre' se ha guardado en el Cuaderno Terapéutico.",
    });
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {steps[currentStep] === 'intro' && (
          <div className="text-center p-4">
            <p className="mb-6">A veces nos sentimos inquietos sin saber muy bien por qué. Este ejercicio te ayudará a observar con claridad dónde sientes más incertidumbre y cómo sueles reaccionar ante ella. No hay respuestas buenas o malas, solo pistas valiosas para entenderte mejor.</p>
            <Button onClick={nextStep}>Comenzar mi mapa <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'areas' && (
          <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">¿En qué áreas sientes más incertidumbre?</Label>
            <p className="text-sm text-muted-foreground">Marca las áreas donde últimamente has sentido más incertidumbre.</p>
            <div className="space-y-2">
                {areaOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={selectedAreas[opt.id] || false} onCheckedChange={(checked) => handleAreaChange(opt.id, checked as boolean)} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="area-other" checked={selectedAreas['area-other'] || false} onCheckedChange={(checked) => handleAreaChange('area-other', checked as boolean)} />
                    <Label htmlFor="area-other" className="font-normal">Otra:</Label>
                </div>
                {selectedAreas['area-other'] && (
                    <Textarea value={otherArea} onChange={e => setOtherArea(e.target.value)} placeholder="Describe el otra área" className="ml-6" />
                )}
            </div>
            <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'responses' && (
          <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">¿Cómo sueles responder?</Label>
            <p className="text-sm text-muted-foreground">¿Qué sueles hacer cuando estás en una situación incierta?</p>
            <div className="space-y-2">
                {responseOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={selectedResponses[opt.id] || false} onCheckedChange={(checked) => handleResponseChange(opt.id, checked as boolean)} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="resp-other" checked={selectedResponses['resp-other'] || false} onCheckedChange={(checked) => handleResponseChange('resp-other', checked as boolean)} />
                    <Label htmlFor="resp-other" className="font-normal">Otra:</Label>
                </div>
                {selectedResponses['resp-other'] && (
                    <Textarea value={otherResponse} onChange={e => setOtherResponse(e.target.value)} placeholder="Describe la otra respuesta" className="ml-6" />
                )}
            </div>
            <Button onClick={nextStep} className="w-full">Ver mi mapa</Button>
          </div>
        )}
        
        {steps[currentStep] === 'summary' && (
          <div className="space-y-6 p-4 animate-in fade-in-0 duration-500">
             <Card className="p-4">
                <CardHeader className="p-2">
                    <CardTitle>Áreas donde sientes más incertidumbre:</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <ul className="list-disc list-inside">
                        {areaOptions.filter(o => selectedAreas[o.id]).map(o => <li key={o.id}>{o.label}</li>)}
                        {selectedAreas['area-other'] && otherArea.trim() && <li>{otherArea.trim()}</li>}
                    </ul>
                </CardContent>
             </Card>
              <Card className="p-4">
                <CardHeader className="p-2">
                    <CardTitle>Tus reacciones habituales:</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <ul className="list-disc list-inside">
                        {responseOptions.filter(o => selectedResponses[o.id]).map(o => <li key={o.id}>{o.label}</li>)}
                        {selectedResponses['resp-other'] && otherResponse.trim() && <li>{otherResponse.trim()}</li>}
                    </ul>
                </CardContent>
             </Card>
             <p className="text-sm italic text-center text-muted-foreground pt-4">
                Este mapa no es un diagnóstico, es una brújula. Reconocer dónde te cuesta soltar el control te da la oportunidad de responder con conciencia, en lugar de reaccionar en automático.
             </p>
             <div className="flex justify-center">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Guardar en mi diario
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
