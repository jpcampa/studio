
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PresentVsEssentialSelfExerciseContent } from '@/data/paths/pathTypes';

interface PresentVsEssentialSelfExerciseProps {
  content: PresentVsEssentialSelfExerciseContent;
  pathId: string;
}

export function PresentVsEssentialSelfExercise({ content, pathId }: PresentVsEssentialSelfExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [presentSelfDesc, setPresentSelfDesc] = useState('');
  const [essentialSelfDesc, setEssentialSelfDesc] = useState('');
  const [smallAction, setSmallAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!smallAction.trim()) {
      toast({ title: "Acción no definida", description: "Por favor, escribe tu pequeña acción para guardar.", variant: "destructive" });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Mi yo actual:**
${presentSelfDesc || 'No descrito.'}

**Mi yo esencial:**
${essentialSelfDesc || 'No descrito.'}

**Mi pequeña acción para esta semana:**
${smallAction}
    `;
    addNotebookEntry({ title: `Visualización: Yo Presente vs. Yo Esencial`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu visualización ha sido guardada." });
    setIsSaved(true);
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
             <p className="text-sm text-muted-foreground">No se trata de juzgarte ni de exigirte cambios inmediatos. Se trata de mirarte con amabilidad, como quien observa una película, para redescubrir quién eres y hacia dónde quieres ir.</p>
            <Button onClick={next}>Empezar visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Present Self
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Tu yo actual</h4>
            <p className="text-sm text-muted-foreground">Pregúntate: ¿Cómo me hablo en mi día a día? ¿Cómo transcurren mis jornadas? ¿Qué emociones predominan? ¿Cómo me relaciono con los demás? ¿Qué hábitos mantengo, aunque no me hagan bien?</p>
            <Label htmlFor="present-self">Describe tu yo actual...</Label>
            <Textarea id="present-self" value={presentSelfDesc} onChange={e => setPresentSelfDesc(e.target.value)} placeholder="Ej: Mi yo actual corre a todos lados, revisa el móvil constantemente..." />
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2: // Essential Self
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Tu yo esencial</h4>
            <p className="text-sm text-muted-foreground">Pregúntate: ¿Cómo se mueve esta versión de mí? ¿Cómo cuida sus espacios y se habla? ¿Qué decisiones toma? ¿Qué límites pone? ¿Qué transmite a los demás?</p>
            <Label htmlFor="essential-self">Describe tu yo esencial...</Label>
            <Textarea id="essential-self" value={essentialSelfDesc} onChange={e => setEssentialSelfDesc(e.target.value)} placeholder="Ej: Mi yo esencial se mueve con calma, respira profundamente..." />
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 3: // Integration and choice
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Integración y elección</h4>
            <p className="text-sm text-muted-foreground">Ahora que tienes delante a tu yo actual y a tu yo esencial, observa la diferencia entre ambos. Esta comparación no es para sentir distancia, sino para elegir un puente que los conecte.</p>
            <div className="space-y-2">
                <Label htmlFor="small-action">¿Qué gesto pequeño de mi yo esencial puedo traer a mi vida esta semana?</Label>
                <Textarea id="small-action" value={smallAction} onChange={e => setSmallAction(e.target.value)} placeholder="Ej: Quiero probar a poner el móvil en silencio media hora cada noche..." />
            </div>
            {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mis pequeñas acciones</Button>
            ) : (
                <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Tu acción ha sido guardada.</p>
                </div>
            )}
          </form>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
