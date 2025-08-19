
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EnergySenseMapExerciseContent } from '@/data/paths/pathTypes';

interface Activity {
  name: string;
  energy: 'low' | 'medium' | 'high' | '';
  value: 'low' | 'medium' | 'high' | '';
}

export function EnergySenseMapExercise({ content, pathId }: { content: EnergySenseMapExerciseContent; pathId: string }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(Array(6).fill({ name: '', energy: '', value: '' }));
  const [reflection, setReflection] = useState({ moreOf: '', lessOf: '' });
  const [commitment, setCommitment] = useState('');

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    const newActivities = [...activities];
    (newActivities[index] as any)[field] = value;
    setActivities(newActivities);
  };
  
  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    activities.filter(a => a.name.trim()).forEach(a => {
      notebookContent += `**Actividad:** ${a.name} (Energía: ${a.energy}, Valor: ${a.value})\n`;
    });
    notebookContent += `\n**Reflexión:**\n- Hacer más: ${reflection.moreOf}\n- Hacer menos/diferente: ${reflection.lessOf}\n\n**Compromiso:** ${commitment}\n`;

    addNotebookEntry({ title: 'Mi Mapa de Energía y Sentido', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado', description: 'Tu mapa de energía ha sido guardado.' });
    setStep(prev => prev + 1);
  };

  const categorizedActivities = useMemo(() => {
    const pot = activities.filter(a => a.name && a.value === 'high' && a.energy === 'low');
    const drain = activities.filter(a => a.name && a.value === 'low' && a.energy === 'high');
    const neutral = activities.filter(a => a.name && !pot.includes(a) && !drain.includes(a));
    return { pot, drain, neutral };
  }, [activities]);

  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4 text-center"><p>Cada día invertimos nuestra energía en múltiples cosas. Algunas nos conectan, otras solo nos drenan. Este ejercicio te ayuda a distinguir entre lo que te ocupa y lo que te nutre.</p><Button onClick={() => setStep(1)}>Empezar mi mapa</Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>Haz una lista de 6-8 actividades de tu última semana.</Label>{activities.map((act, i) => <Textarea key={i} value={act.name} onChange={e => handleActivityChange(i, 'name', e.target.value)} placeholder={`Actividad ${i + 1}`} />)}<Button onClick={() => setStep(2)} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4">{activities.filter(a => a.name).map((act, i) => <div key={i} className="p-2 border rounded"><p className="font-semibold">{act.name}</p><Label>¿Cuánta energía te consume?</Label><RadioGroup value={act.energy} onValueChange={v => handleActivityChange(i, 'energy', v)} className="flex gap-4"><div className="flex items-center gap-1"><RadioGroupItem value="low" id={`e-${i}-l`}/><Label htmlFor={`e-${i}-l`}>Poco</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="medium" id={`e-${i}-m`}/><Label htmlFor={`e-${i}-m`}>Moderado</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="high" id={`e-${i}-h`}/><Label htmlFor={`e-${i}-h`}>Mucho</Label></div></RadioGroup><Label>¿Se alinea con tus valores?</Label><RadioGroup value={act.value} onValueChange={v => handleActivityChange(i, 'value', v)} className="flex gap-4"><div className="flex items-center gap-1"><RadioGroupItem value="low" id={`v-${i}-l`}/><Label htmlFor={`v-${i}-l`}>Nada</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="medium" id={`v-${i}-m`}/><Label htmlFor={`v-${i}-m`}>Algo</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="high" id={`v-${i}-h`}/><Label htmlFor={`v-${i}-h`}>Mucho</Label></div></RadioGroup></div>)}<Button onClick={() => setStep(3)} className="w-full">Ver cuadrante</Button></div>;
      case 3: return <div className="p-4 space-y-4"><h3 className="font-bold text-center">Tu Cuadrante de Energía y Sentido</h3><div><h4>Potenciadoras</h4><ul className="list-disc pl-5">{categorizedActivities.pot.map(a => <li key={a.name}>{a.name}</li>)}</ul></div><div><h4>Drenantes</h4><ul className="list-disc pl-5">{categorizedActivities.drain.map(a => <li key={a.name}>{a.name}</li>)}</ul></div><div><h4>Neutras/Reajustables</h4><ul className="list-disc pl-5">{categorizedActivities.neutral.map(a => <li key={a.name}>{a.name}</li>)}</ul></div><Button onClick={() => setStep(4)} className="w-full">Reflexionar</Button></div>;
      case 4: return <div className="p-4 space-y-4"><Label>¿Qué actividad te gustaría hacer más?</Label><Textarea value={reflection.moreOf} onChange={e => setReflection(p => ({...p, moreOf: e.target.value}))}/><Label>¿Qué actividad podrías reducir o reajustar?</Label><Textarea value={reflection.lessOf} onChange={e => setReflection(p => ({...p, lessOf: e.target.value}))}/><Label>Hoy me comprometo a...</Label><Textarea value={commitment} onChange={e => setCommitment(e.target.value)} /><Button onClick={handleSave} className="w-full">Guardar</Button></div>;
      case 5: return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><p>Mapa guardado. Vuelve a él para recordar dónde enfocar tu energía.</p></div>
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
