
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { QuestionYourIfsExerciseContent } from '@/data/paths/pathTypes';

interface QuestionYourIfsExerciseProps {
  content: QuestionYourIfsExerciseContent;
  pathId: string;
}

export function QuestionYourIfsExercise({ content, pathId }: QuestionYourIfsExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState({ pro: '', con: '' });
  const [alternatives, setAlternatives] = useState(['', '']);
  const [severity, setSeverity] = useState(5);
  const [reformulation, setReformulation] = useState('');

  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    if (!thought || !reformulation) {
      toast({ title: "Datos incompletos", description: "Completa el pensamiento y la reformulación para guardar.", variant: "destructive" });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Pensamiento ansioso:* "${thought}"
*Evidencia a favor:* ${evidence.pro}
*Evidencia en contra:* ${evidence.con}
*Alternativas:*
- ${alternatives[0]}
- ${alternatives[1]}
*Gravedad real (0-10):* ${severity}
*Reformulación final:* "${reformulation}"
    `;
    addNotebookEntry({ title: 'Cuestionando mis "¿Y si...?"', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado' });
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 0: return <div className="p-4 text-center"><p className="mb-4">Tu mente es una máquina de crear historias. Este ejercicio te enseña a no creértelas todas, especialmente las de miedo.</p><Button onClick={next}>Empezar práctica <ArrowRight className="ml-2 h-4 w-4"/></Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label htmlFor="thought">¿Cuál es tu “¿Y si…?” más frecuente?</Label><Textarea id="thought" value={thought} onChange={e => setThought(e.target.value)} /><Button onClick={next} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>Examina la evidencia</Label><Textarea value={evidence.pro} onChange={e => setEvidence(p => ({...p, pro: e.target.value}))} placeholder="Pruebas a favor..."/><Textarea value={evidence.con} onChange={e => setEvidence(p => ({...p, con: e.target.value}))} placeholder="Pruebas en contra..."/><Button onClick={next} className="w-full">Siguiente</Button></div>;
      case 3: return <div className="p-4 space-y-4"><Label>Explora alternativas</Label><Textarea value={alternatives[0]} onChange={e => setAlternatives(p => [e.target.value, p[1]])} placeholder="Alternativa 1..."/><Textarea value={alternatives[1]} onChange={e => setAlternatives(p => [p[0], e.target.value])} placeholder="Alternativa 2..."/><Button onClick={next} className="w-full">Siguiente</Button></div>;
      case 4: return <div className="p-4 space-y-4"><Label>Evalúa el impacto real (0-10): {severity}</Label><Slider value={[severity]} onValueChange={v => setSeverity(v[0])} max={10} step={1} /><Button onClick={next} className="w-full">Siguiente</Button></div>;
      case 5: return <div className="p-4 space-y-4"><Label htmlFor="reformulation">Reformula tu pensamiento</Label><Textarea id="reformulation" value={reformulation} onChange={e => setReformulation(e.target.value)} /><Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>{renderCurrentStep()}</CardContent>
    </Card>
  );
}
