
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapaEmocionNecesidadCuidadoExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface MapaEmocionNecesidadCuidadoExerciseProps {
  content: MapaEmocionNecesidadCuidadoExerciseContent;
  pathId: string;
}

const needOptions = [
    { id: 'respeto', label: 'Respeto' }, { id: 'seguridad', label: 'Seguridad' }, { id: 'claridad', label: 'Claridad' }, { id: 'descanso', label: 'Descanso' },
    { id: 'apoyo', label: 'Apoyo' }, { id: 'tiempo', label: 'Tiempo' }, { id: 'conexion', label: 'Conexión' }, { id: 'autonomia', label: 'Autonomía' },
    { id: 'validacion', label: 'Validación' }, { id: 'aceptacion', label: 'Aceptación' }, { id: 'acompañamiento', label: 'Acompañamiento' }, { id: 'sentido', label: 'Sentido' },
    { id: 'comprension', label: 'Comprensión' }, { id: 'libertad', label: 'Libertad' }, { id: 'tranquilidad', label: 'Tranquilidad' }, { id: 'confianza', label: 'Confianza' },
    { id: 'expresion', label: 'Expresión' }, { id: 'amor', label: 'Amor' }, { id: 'espacio', label: 'Espacio' }, { id: 'reconocimiento', label: 'Reconocimiento' }
];

const careActions = {
    laboral: [
        { id: 'pausa', label: 'Pedir una pausa o descanso breve' }, { id: 'limite', label: 'Poner un límite con respeto' }, { id: 'delegar', label: 'Delegar una tarea concreta' }, { id: 'agradecer', label: 'Agradecerte lo que ya hiciste hoy' }
    ],
    familiar: [
        { id: 'compartir', label: 'Compartir cómo te sientes con alguien cercano' }, { id: 'hablar', label: 'Hablar con alguien de confianza' }, { id: 'pedir_ayuda', label: 'Pedir ayuda en una tarea doméstica' }, { id: 'limite_cariño', label: 'Poner un límite con respeto y cariño' }
    ],
    personal: [
        { id: 'escribir', label: 'Escribir tus emociones en tu cuaderno' }, { id: 'pausa_real', label: 'Darte 15 minutos de pausa real' }, { id: 'nutrir', label: 'Hacer algo que te nutra (música, paseo, respiración)' }, { id: 'no_exigir', label: 'No exigirte tanto hoy' }, { id: 'llorar_respirar', label: 'Llorar, respirar, validar' }
    ]
};

export function MapaEmocionNecesidadCuidadoExercise({ content, pathId }: MapaEmocionNecesidadCuidadoExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [needs, setNeeds] = useState<Record<string, boolean>>({});
  const [otherNeed, setOtherNeed] = useState('');
  const [careAction, setCareAction] = useState('');
  const [otherCareAction, setOtherCareAction] = useState('');

  const handleSave = () => {
    const selectedNeeds = needOptions.filter(n => needs[n.id]).map(n => n.label);
    if(needs['otra'] && otherNeed) selectedNeeds.push(otherNeed);

    let finalCareAction = otherCareAction || careAction;

    const notebookContent = `
**Ejercicio: ${content.title}**

*Emoción sentida:* ${emotion === 'otra' ? otherEmotion : (emotionOptions.find(e => e.value === emotion)?.labelKey ? t[emotionOptions.find(e => e.value === emotion)!.labelKey as keyof typeof t] : emotion)}
*Necesidades detectadas:* ${selectedNeeds.join(', ')}
*Acción de cuidado elegida:* ${finalCareAction}
    `;

    addNotebookEntry({ title: 'Mi Mapa Emoción-Necesidad-Cuidado', content: notebookContent, pathId: pathId });
    toast({ title: 'Registro Guardado' });
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: return <div className="p-4 space-y-4"><Label>Elige la emoción que sientes con más intensidad:</Label><Select value={emotion} onValueChange={setEmotion}><SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger><SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>{emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} /> }<Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>¿Qué podrías estar necesitando?</Label>{needOptions.map(n => <div key={n.id} className="flex items-center gap-2"><Checkbox id={n.id} onCheckedChange={c => setNeeds(p => ({...p, [n.id]: !!c}))} /><Label htmlFor={n.id} className="font-normal">{n.label}</Label></div>)}<div className="flex items-center gap-2"><Checkbox id="otra" onCheckedChange={c => setNeeds(p => ({...p, otra: !!c}))} /><Label htmlFor="otra" className="font-normal">Otra:</Label></div>{needs.otra && <Textarea value={otherNeed} onChange={e => setOtherNeed(e.target.value)} />}<Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>¿Qué acción pequeña y amable podrías hacer hoy?</Label><RadioGroup value={careAction} onValueChange={setCareAction}>{Object.values(careActions).flat().map(a => <div key={a.id} className="flex items-center gap-2"><RadioGroupItem value={a.label} id={a.id}/><Label htmlFor={a.id} className="font-normal">{a.label}</Label></div>)}</RadioGroup><Textarea value={otherCareAction} onChange={e => setOtherCareAction(e.target.value)} placeholder="Otra acción específica..." /><Button onClick={() => setStep(3)} className="w-full mt-2">Ver Síntesis</Button></div>;
      case 3: return <div className="p-4 space-y-4 text-center"><p>Hoy sentí: {emotion==='otra' ? otherEmotion : emotion}. Porque estoy necesitando: {needOptions.filter(n=>needs[n.id]).map(n=>n.label).join(', ')}. Me propongo cuidarme así: {otherCareAction || careAction}.</p><Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar</Button></div>
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
