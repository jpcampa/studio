
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UnaPalabraCadaDiaExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface UnaPalabraCadaDiaExerciseProps {
  content: UnaPalabraCadaDiaExerciseContent;
  pathId: string;
}

export function UnaPalabraCadaDiaExercise({ content, pathId }: UnaPalabraCadaDiaExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();

  const [step, setStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [anchorAction, setAnchorAction] = useState('');
  const [reflection, setReflection] = useState('');

  const handleSaveReflection = () => {
    if (reflection.trim()) {
        addNotebookEntry({ title: 'Reflexión semanal: Mis emociones', content: reflection, pathId });
        toast({ title: 'Reflexión Guardada' });
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0: return <div className="p-4 space-y-4"><Label>¿Qué emoción resume mejor tu día hasta ahora?</Label><Select value={selectedEmotion} onValueChange={v => {setSelectedEmotion(v); if(v !== 'otra') setOtherEmotion('')}}><SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger><SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>{selectedEmotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Escribe tu emoción..." className="mt-2" />}<Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button></div>;
      case 1: return <div className="p-4 space-y-4"><p>Has sentido: <strong>{selectedEmotion === 'otra' ? otherEmotion : (emotionOptions.find(e => e.value === selectedEmotion)?.labelKey ? t[emotionOptions.find(e => e.value === selectedEmotion)!.labelKey as keyof typeof t] : selectedEmotion)}</strong>.</p><p>Reconócelo con respeto: "Me permito reconocerlo, sin juzgarlo y con aceptación"</p><Button onClick={() => setStep(2)} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>Elige una microacción para anclar el ejercicio:</Label><div className="space-y-1"><div className="flex items-center gap-2"><Checkbox id="a1" onCheckedChange={c => c && setAnchorAction('Respirar')} /><Label htmlFor="a1" className="font-normal">Respirar con esta emoción durante 3 ciclos</Label></div><div className="flex items-center gap-2"><Checkbox id="a2" onCheckedChange={c => c && setAnchorAction('Llevar')} /><Label htmlFor="a2" className="font-normal">Llevar esta frase conmigo como una compañera</Label></div></div><Button onClick={() => setStep(3)} className="w-full mt-2">Finalizar</Button></div>;
      case 3: return <div className="p-4 space-y-4"><h4 className="font-semibold">Práctica reflexiva opcional (Días 5-7)</h4><Label>Mis tres emociones más repetidas o significativas de la semana y qué necesitaba al sentirlas:</Label><Textarea value={reflection} onChange={e => setReflection(e.target.value)} /><Button onClick={handleSaveReflection} className="w-full mt-2"><Save className="mr-2 h-4 w-4" />Guardar en mi cuaderno</Button></div>
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
