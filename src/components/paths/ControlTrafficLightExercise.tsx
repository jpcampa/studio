
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, TrafficCone, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ControlTrafficLightExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '../ui/alert';

interface ControlTrafficLightExerciseProps {
  content: ControlTrafficLightExerciseContent;
}

const steps = ['intro', 'green', 'amber', 'red', 'summary'];

export function ControlTrafficLightExercise({ content }: ControlTrafficLightExerciseProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [greenZone, setGreenZone] = useState('');
  const [amberZone, setAmberZone] = useState('');
  const [redZone, setRedZone] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!greenZone.trim() && !amberZone.trim() && !redZone.trim()) {
        toast({
            title: "Ejercicio vacío",
            description: "Por favor, añade al menos una idea en alguna de las zonas para guardar.",
            variant: "destructive"
        });
        return;
    }

    let notebookContent = `
**Ejercicio: ${content.title}**

${situation ? `*Situación analizada:* ${situation}\n\n` : ''}
**🟢 Depende de mí:**
${greenZone || 'Sin entradas.'}

**🟠 Puedo influir:**
${amberZone || 'Sin entradas.'}

**🔴 No depende de mí:**
${redZone || 'Sin entradas.'}
    `;

    addNotebookEntry({
      title: `Semáforo del Control: ${situation.substring(0, 30) || 'Reflexión'}`,
      content: notebookContent,
      pathId: 'tolerar-incertidumbre',
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Semáforo del Control' se ha guardado en el Cuaderno Terapéutico.",
    });
    // No cerramos el ejercicio, el usuario puede seguir viéndolo o ir a la reflexión final
  };
  
  const redZoneItemsCount = redZone.split('\n').filter(line => line.trim() !== '').length;

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {steps[currentStep] === 'intro' && (
          <div className="text-center p-4">
             <p className="mb-6">A veces sentimos que todo depende de nosotros… y eso genera tensión. Este ejercicio te ayudará a distinguir con claridad qué puedes controlar y qué necesitas soltar.</p>
             <Label htmlFor="situation-main">Piensa en una situación reciente que te esté generando estrés, preocupación o malestar.</Label>
             <Textarea id="situation-main" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe la situación aquí..." className="mt-2 mb-4" />
             <Button onClick={nextStep}>Empezar Ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'green' && (
          <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
            <Label htmlFor="green-zone" className="font-semibold text-lg flex items-center gap-2 text-green-600">
                <span className="w-5 h-5 rounded-full bg-green-500 inline-block border-2 border-white shadow"></span>
                Zona Verde: Lo que SÍ depende de mí
            </Label>
            <p className="text-sm text-muted-foreground">¿Qué sí depende 100% de ti en esa situación? Escribe cada idea en una línea nueva.</p>
            <Textarea id="green-zone" value={greenZone} onChange={e => setGreenZone(e.target.value)} rows={5} />
            <div className="text-xs text-muted-foreground bg-background p-2 rounded-md border">
                <strong>Pistas:</strong> Tus decisiones, tu actitud, cómo organizas tu tiempo, cómo te hablas, cómo gestionas tus emociones, tu manera de cuidarte.
            </div>
            <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'amber' && (
           <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
             <Label htmlFor="amber-zone" className="font-semibold text-lg flex items-center gap-2 text-amber-600">
                <span className="w-5 h-5 rounded-full bg-amber-500 inline-block border-2 border-white shadow"></span>
                Zona Ámbar: Lo que puedo influir
            </Label>
            <p className="text-sm text-muted-foreground">¿Qué no depende completamente de ti, pero puedes influir de alguna forma?</p>
            <Textarea id="amber-zone" value={amberZone} onChange={e => setAmberZone(e.target.value)} rows={5} />
            <div className="text-xs text-muted-foreground bg-background p-2 rounded-md border">
                <strong>Pistas:</strong> Puedes proponer o negociar, expresar lo que sientes, pedir ayuda, planificar con más margen, ofrecer tu punto de vista con respeto.
            </div>
            <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'red' && (
            <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
             <Label htmlFor="red-zone" className="font-semibold text-lg flex items-center gap-2 text-red-600">
                <span className="w-5 h-5 rounded-full bg-red-500 inline-block border-2 border-white shadow"></span>
                Zona Roja: Lo que NO depende de mí
            </Label>
            <p className="text-sm text-muted-foreground">¿Qué aspectos te generan ansiedad pero realmente no están en tus manos?</p>
            <Textarea id="red-zone" value={redZone} onChange={e => setRedZone(e.target.value)} rows={5} />
            <div className="text-xs text-muted-foreground bg-background p-2 rounded-md border">
                <strong>Pistas:</strong> Reacciones de los demás, decisiones ajenas, el pasado, resultados futuros, lo que otros piensan, la incertidumbre en sí misma.
            </div>
            {redZoneItemsCount >= 4 && (
                <Alert variant="default" className="border-blue-500 text-blue-800 bg-blue-50 dark:border-blue-700 dark:text-blue-200 dark:bg-blue-900/30">
                    <AlertDescription>Has colocado muchas cosas en la Zona Roja. Es natural sentir que hay mucho fuera de tu control. Reconocerlo es el primer paso para soltar. Y soltar no es rendirse: es confiar más en ti.</AlertDescription>
                </Alert>
            )}
            <Button onClick={nextStep} className="w-full">Ver mi semáforo <TrafficCone className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'summary' && (
             <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                <h3 className="text-center font-bold text-lg text-primary">Tu Semáforo del Control</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50/50 dark:bg-green-900/20">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2 mb-2">🟢 Depende de mí</h4>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{greenZone || '...'}</pre>
                    </div>
                    <div className="border-2 border-amber-500 rounded-lg p-3 bg-amber-50/50 dark:bg-amber-900/20">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2 mb-2">🟠 Puedo influir</h4>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{amberZone || '...'}</pre>
                    </div>
                     <div className="border-2 border-red-500 rounded-lg p-3 bg-red-50/50 dark:bg-red-900/20">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-2 mb-2">🔴 No depende de mí</h4>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{redZone || '...'}</pre>
                    </div>
                </div>
                 <p className="text-center text-muted-foreground italic text-sm pt-4">
                    Soltar no es rendirse. Es redirigir tu energía hacia lo que sí puedes transformar. No todo depende de ti, pero sí puedes elegir cómo responder.
                </p>
                <div className="flex justify-center">
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Guardar en mi Cuaderno
                    </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
