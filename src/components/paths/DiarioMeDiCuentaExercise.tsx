
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DiarioMeDiCuentaExerciseContent } from '@/data/paths/pathTypes';

interface DiarioMeDiCuentaExerciseProps {
  content: DiarioMeDiCuentaExerciseContent;
  pathId: string;
}

const messages = [
    "Cada vez que te observas con cariño, sanas un poco más.",
    "Lo que te das cuenta hoy, puede cambiar tu mañana.",
    "No necesitas cambiar lo que sientes. Solo comprenderlo.",
    "El simple hecho de mirarte con respeto… ya es transformación."
];

export function DiarioMeDiCuentaExercise({ content, pathId }: DiarioMeDiCuentaExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [noticed, setNoticed] = useState('');
  const [howNoticed, setHowNoticed] = useState('');
  const [whatINeed, setWhatINeed] = useState('');
  
  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

*¿Qué noté en mí hoy?:*
${noticed}

*¿Qué me ayudó a notarlo?:*
${howNoticed}

*¿Qué necesito ahora que me he dado cuenta de esto?:*
${whatINeed}
`;
    addNotebookEntry({ title: 'Mi "Me di cuenta" del día', content: notebookContent, pathId: pathId });
    toast({ title: 'Entrada Guardada' });
    setStep(prev => prev + 1);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4 space-y-4"><p className="text-center">Registra uno o dos momentos de autoconciencia del día.</p><Button onClick={() => setStep(1)} className="w-full">Comenzar</Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>¿Qué noté en mí hoy?</Label><Textarea value={noticed} onChange={e => setNoticed(e.target.value)} /><Button onClick={() => setStep(2)} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>¿Qué me ayudó a notarlo?</Label><Textarea value={howNoticed} onChange={e => setHowNoticed(e.target.value)} /><Button onClick={() => setStep(3)} className="w-full">Siguiente</Button></div>;
      case 3: return <div className="p-4 space-y-4"><Label>¿Qué necesito ahora que me he dado cuenta de esto?</Label><Textarea value={whatINeed} onChange={e => setWhatINeed(e.target.value)} /><Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar</Button></div>;
      case 4: return <div className="p-4 text-center space-y-4"><p className="italic">"{messages[Math.floor(Math.random() * messages.length)]}"</p><Button onClick={() => setStep(0)} variant="outline">Registrar otro "Me di cuenta"</Button></div>;
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
