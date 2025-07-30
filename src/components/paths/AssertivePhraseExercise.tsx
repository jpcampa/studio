"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AssertivePhraseExerciseContent } from '@/data/paths/pathTypes';

interface AssertivePhraseExerciseProps {
  content: AssertivePhraseExerciseContent;
  pathId: string;
}

const steps = ['intro', 'step1', 'step2', 'step3', 'step4', 'summary'];

export function AssertivePhraseExercise({ content, pathId }: AssertivePhraseExerciseProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [fact, setFact] = useState('');
  const [feeling, setFeeling] = useState('');
  const [need, setNeed] = useState('');
  const [request, setRequest] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!fact.trim() || !feeling.trim() || !need.trim() || !request.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos para construir y guardar tu frase.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi Frase Asertiva Construida:*
"Cuando ${fact}, me siento ${feeling}. Necesito ${need}. Por eso te pido ${request}."
    `;

    addNotebookEntry({
      title: "Mi Frase Asertiva en 4 Pasos",
      content: notebookContent,
      pathId: pathId,
    });

    toast({
      title: "Frase Guardada",
      description: "Tu frase asertiva se ha guardado en el Cuaderno Terapéutico.",
    });
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'intro':
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">Esta técnica se basa en una estructura simple que puedes usar cuando algo te molesta o necesitas expresar un límite. Te ayudará a hablar desde ti, sin atacar ni culparte.</p>
            <div className="p-3 border rounded-md bg-background text-left">
              <h4 className="font-semibold text-sm">Ejemplo de frase completa:</h4>
              <p className="text-sm italic">“Cuando haces bromas sobre mí delante de otros, me siento incómoda. Necesito sentirme respetada. Por eso, si hay algo que no te gusta, te pido que me lo digas en privado.”</p>
            </div>
            <Button onClick={nextStep}>Empezar a construir mi frase <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      
      case 'step1':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="fact" className="font-semibold text-lg">Paso 1: Describe el hecho objetivo</Label>
            <p className="text-sm text-muted-foreground">¿Qué ocurrió? Sé concreto/a y evita juicios.</p>
            <Textarea id="fact" value={fact} onChange={e => setFact(e.target.value)} placeholder="Ej: Llegaste tarde a la reunión sin avisar." />
            <Button onClick={nextStep} className="w-full">Siguiente</Button>
          </div>
        );

      case 'step2':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="feeling" className="font-semibold text-lg">Paso 2: Expresa tu emoción</Label>
            <p className="text-sm text-muted-foreground">Ponle nombre a lo que sentiste. Habla desde ti.</p>
            <Textarea id="feeling" value={feeling} onChange={e => setFeeling(e.target.value)} placeholder="Ej: frustración, tristeza, inseguridad..." />
            <Button onClick={nextStep} className="w-full">Siguiente</Button>
          </div>
        );

      case 'step3':
         return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="need" className="font-semibold text-lg">Paso 3: Identifica tu necesidad</Label>
            <p className="text-sm text-muted-foreground">Conecta con lo que estaba en juego para ti.</p>
            <Textarea id="need" value={need} onChange={e => setNeed(e.target.value)} placeholder="Ej: respeto, apoyo, claridad..." />
            <Button onClick={nextStep} className="w-full">Siguiente</Button>
          </div>
        );
      
      case 'step4':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="request" className="font-semibold text-lg">Paso 4: Formula una petición</Label>
            <p className="text-sm text-muted-foreground">Pide algo concreto, breve y posible.</p>
            <Textarea id="request" value={request} onChange={e => setRequest(e.target.value)} placeholder="Ej: Te pido que me avises si vas a llegar más tarde." />
            <Button onClick={nextStep} className="w-full">Ver mi frase completa</Button>
          </div>
        );

      case 'summary':
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-bold text-primary">Tu Frase Asertiva Completa</h3>
            <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic text-left">
              “Cuando {fact || '...' }, me siento {feeling || '...'}. Necesito {need || '...'}. Por eso te pido {request || '...' }.”
            </blockquote>
            <p className="text-sm text-muted-foreground">Puedes guardarla en tu cuaderno, practicarla en voz alta o escribirla varias veces. Cuanto más la repitas, más natural te saldrá.</p>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Guardar en mi Cuaderno</Button>
          </div>
        );

      default:
        return null;
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
