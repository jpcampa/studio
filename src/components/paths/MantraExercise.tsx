
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MantraExerciseContent } from '@/data/paths/pathTypes';

interface MantraExerciseProps {
  content: MantraExerciseContent;
}

const steps = ['intro', 'step1', 'step2', 'step3', 'summary'];

const baseOptions = [
    { id: 'base-advance', label: 'Puedo avanzar, aunque no lo tenga todo claro' },
    { id: 'base-trust', label: 'Estoy eligiendo confiar en mi capacidad de adaptarme' },
    { id: 'base-sustain', label: 'Puedo sostenerme incluso si tengo miedo' },
    { id: 'base-learn', label: 'Aprenderé pase lo que pase' },
    { id: 'base-control', label: 'No necesito controlar todo para estar bien' },
];

export function MantraExercise({ content }: MantraExerciseProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [blockingThought, setBlockingThought] = useState('');
  const [baseIdea, setBaseIdea] = useState('');
  const [customBaseIdea, setCustomBaseIdea] = useState('');
  const [finalMantra, setFinalMantra] = useState('');
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!finalMantra.trim()) {
      toast({
        title: "Mantra no definido",
        description: "Por favor, crea tu mantra personal para guardarlo.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi pensamiento de bloqueo habitual:*
${blockingThought || 'No especificado.'}

*Mi mantra de confianza personal:*
**${finalMantra}**
    `;

    addNotebookEntry({
      title: "Mi Mantra de Confianza",
      content: notebookContent,
      pathId: 'tolerar-incertidumbre',
    });

    toast({
      title: "Mantra Guardado",
      description: "Tu mantra de confianza se ha guardado en el Cuaderno Terapéutico.",
    });
    
    // No cerramos, el usuario puede ver su mantra
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {steps[currentStep] === 'intro' && (
          <div className="text-center p-4">
            <p className="mb-6">Cuando no tienes certezas, tu mente busca control. Esta técnica te ayuda a entrenar lo contrario: una confianza activa. Vas a crear una frase breve y significativa que te recuerde que puedes sostenerte aunque no tengas todo resuelto.</p>
            <Button onClick={nextStep}>Comenzar Ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'step1' && (
          <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
            <Label htmlFor="blocking-thought" className="font-semibold text-lg">Paso 1: Identifica tu pensamiento de bloqueo</Label>
            <p className="text-sm text-muted-foreground">¿Qué te sueles decir cuando aparecen el miedo o la inseguridad?</p>
            <Textarea id="blocking-thought" value={blockingThought} onChange={e => setBlockingThought(e.target.value)} placeholder="Ej: No voy a poder, Todo tiene que salir perfecto, Si me equivoco será un desastre..." />
            <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'step2' && (
          <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">Paso 2: Elige una idea base para reformular</Label>
            <p className="text-sm text-muted-foreground">¿Qué te gustaría recordarte cuando el miedo apriete?</p>
            <RadioGroup onValueChange={setBaseIdea} value={baseIdea} className="space-y-2">
                {baseOptions.map(opt => (
                     <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.label} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                     </div>
                ))}
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="otra" id="base-other" />
                    <Label htmlFor="base-other" className="font-normal">Otra:</Label>
                </div>
            </RadioGroup>
            {baseIdea === 'otra' && (
                <Textarea value={customBaseIdea} onChange={e => setCustomBaseIdea(e.target.value)} placeholder="Escribe tu propia idea base" className="ml-6 mt-2" />
            )}
             <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'step3' && (
             <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                <Label htmlFor="final-mantra" className="font-semibold text-lg">Paso 3: Crea tu frase personal</Label>
                <p className="text-sm text-muted-foreground">Usa tus propias palabras o inspírate en las fórmulas para crear tu mantra. Ejemplos: "Aunque me dé miedo, puedo afrontarlo paso a paso.", "Estoy eligiendo confiar en mi capacidad de adaptarme."</p>
                <Textarea id="final-mantra" value={finalMantra} onChange={e => setFinalMantra(e.target.value)} placeholder="Escribe aquí tu frase final" rows={3} />
                <Button onClick={nextStep} className="w-full">Ver mi Mantra <CheckCircle className="ml-2 h-4 w-4" /></Button>
            </div>
        )}

        {steps[currentStep] === 'summary' && (
             <div className="space-y-6 p-4 text-center animate-in fade-in-0 duration-500">
                <h3 className="text-xl font-bold text-primary">Tu Mantra de Confianza</h3>
                <blockquote className="text-2xl italic font-serif p-4 border-l-4 border-accent bg-accent/10">
                    "{finalMantra || 'Define tu mantra en el paso anterior.'}"
                </blockquote>
                <div className="text-sm text-muted-foreground">
                    <p className="font-semibold">Úsalo en acción:</p>
                    <p>Repítelo antes de una situación que te active inseguridad, cuando notes que estás anticipando demasiado, o como ritual diario para conectar con tu centro. Cuanto más lo digas, más fácil será que tu cuerpo lo reconozca como una señal de seguridad.</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Guardar mi mantra en el Cuaderno
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
