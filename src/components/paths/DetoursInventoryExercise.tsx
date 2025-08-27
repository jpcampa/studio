
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetoursInventoryExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DetoursInventoryExerciseProps {
  content: DetoursInventoryExerciseContent;
  pathId: string;
}

const frequentDetours = [
  { id: 'detour-yes', label: 'Decir “sí” por compromiso, aunque quería decir “no”.' },
  { id: 'detour-social', label: 'Revisar redes sociales como escape.' },
  { id: 'detour-eating', label: 'Comer sin hambre por ansiedad o aburrimiento.' },
  { id: 'detour-postpone', label: 'Posponer decisiones importantes por miedo.' },
  { id: 'detour-thoughts', label: 'Pensamientos como: “No soy suficiente”, “Tengo que hacerlo perfecto”, “Si fallo, me rechazarán”.' },
  { id: 'detour-toxic-env', label: 'Rodearme de personas o ambientes que no me hacen bien.' },
];

const valueOptions = [
    { id: 'val-auth', label: 'Autenticidad (ser yo mismo/a)'},
    { id: 'val-care', label: 'Salud y autocuidado'},
    { id: 'val-connect', label: 'Conexión con los demás'},
    { id: 'val-calm', label: 'Calma y equilibrio'},
    { id: 'val-respect', label: 'Respeto hacia mí mismo/a'},
    { id: 'val-growth', label: 'Crecimiento personal'},
];

const emotionOptions = [
    { id: 'emo-guilt', label: 'Culpa'},
    { id: 'emo-frustration', label: 'Frustración'},
    { id: 'emo-sadness', label: 'Tristeza'},
    { id: 'emo-relief', label: 'Alivio momentáneo'},
    { id: 'emo-anxiety', label: 'Ansiedad'},
    { id: 'emo-shame', label: 'Vergüenza'},
];

const partOptions = [
    { id: 'part-insecure', label: 'Mi parte insegura'},
    { id: 'part-fearful', label: 'Mi parte que teme al rechazo'},
    { id: 'part-pleaser', label: 'Mi parte que busca aprobación'},
    { id: 'part-controlling', label: 'Mi parte que quiere sentirse en control'},
];


export function DetoursInventoryExercise({ content, pathId }: DetoursInventoryExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [detours, setDetours] = useState<Record<string, boolean>>({});
  const [otherDetour, setOtherDetour] = useState('');
  
  const [reflection, setReflection] = useState<{
    detour: string,
    values: Record<string, boolean>,
    emotions: Record<string, boolean>,
    parts: Record<string, boolean>,
    otherValue: string,
    otherEmotion: string,
    otherPart: string,
  }>({ detour: '', values: {}, emotions: {}, parts: {}, otherValue: '', otherEmotion: '', otherPart: ''});

  const [commitment, setCommitment] = useState('');
  const [reconnectionGestures, setReconnectionGestures] = useState('');
  
  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**${content.title}**\n\n`;
    notebookContent += `**Mi compromiso de cambio:**\nSi... entonces... ${commitment}\n\n`;
    notebookContent += `**Mis gestos de reconexión:**\n${reconnectionGestures || 'No especificados.'}`;

    addNotebookEntry({ title: `Inventario de Desvíos`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu inventario ha sido guardado." });
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 text-center space-y-4">
            <p>A veces no es que no sepas lo que quieres… sino que hay interferencias que te desvían del camino. Hoy vamos a ponerles nombre para empezar a recuperar dirección.</p>
            <Button onClick={next}>Empezar mi inventario <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Frequent detours
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Tus desvíos más frecuentes</h4>
            <p className="text-sm text-muted-foreground">Marca o escribe los desvíos que reconoces en tu vida actual. Elige máximo 3 para trabajar hoy.</p>
            <div className="space-y-2">
                {frequentDetours.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={!!detours[opt.id]} onCheckedChange={c => setDetours(p => ({...p, [opt.id]: !!c}))} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                 <div className="flex items-center space-x-2">
                    <Checkbox id="detour-other" checked={!!detours['detour-other']} onCheckedChange={c => setDetours(p => ({...p, 'detour-other': !!c}))} />
                    <Label htmlFor="detour-other" className="font-normal">Otro:</Label>
                </div>
                {detours['detour-other'] && <Textarea value={otherDetour} onChange={e => setOtherDetour(e.target.value)} />}
            </div>
            <Button onClick={next} className="w-full">Continuar</Button>
          </div>
        );
      case 2: // Reflection on one detour
        const selectedDetourLabel = Object.keys(detours).filter(k => detours[k]).map(k => {
            if (k === 'detour-other') return otherDetour;
            return frequentDetours.find(d => d.id === k)?.label || '';
        }).join(', ');
        return (
             <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 2: Profundiza en un desvío</h4>
                <p className="font-medium italic">Desvío seleccionado: {selectedDetourLabel || 'Ninguno'}</p>
                <div className="space-y-2">
                    <Label>¿Qué valor personal estás dejando de lado?</Label>
                    {valueOptions.map(v => <div key={v.id} className="flex items-center space-x-2"><Checkbox id={v.id} checked={!!reflection.values[v.id]} onCheckedChange={c => setReflection(p => ({...p, values: {...p.values, [v.id]:!!c}}))} /><Label htmlFor={v.id} className="font-normal">{v.label}</Label></div>)}
                </div>
                <div className="space-y-2">
                    <Label>¿Qué sientes después de actuar así?</Label>
                    {emotionOptions.map(e => <div key={e.id} className="flex items-center space-x-2"><Checkbox id={e.id} checked={!!reflection.emotions[e.id]} onCheckedChange={c => setReflection(p => ({...p, emotions: {...p.emotions, [e.id]:!!c}}))} /><Label htmlFor={e.id} className="font-normal">{e.label}</Label></div>)}
                </div>
                <div className="space-y-2">
                    <Label>¿Qué parte de ti busca protección o alivio?</Label>
                    {partOptions.map(p => <div key={p.id} className="flex items-center space-x-2"><Checkbox id={p.id} checked={!!reflection.parts[p.id]} onCheckedChange={c => setReflection(p_state => ({...p_state, parts: {...p_state.parts, [p.id]:!!c}}))} /><Label htmlFor={p.id} className="font-normal">{p.label}</Label></div>)}
                </div>
                <Button onClick={next} className="w-full">Ir al compromiso de cambio</Button>
             </div>
        );
    case 3: // Commitment and Reconnection
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 3 y 4: Compromiso y Gestos de Reconexión</h4>
                <div className="space-y-2">
                    <Label htmlFor="commitment-si">Tu gesto de cambio (Si... entonces...)</Label>
                    <Textarea id="commitment-si" value={commitment} onChange={e => setCommitment(e.target.value)} placeholder="Ej: Si me pongo a revisar redes por soledad, entonces enviaré un mensaje sincero a alguien cercano." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reconnection-gestures">Tu kit personal de reconexión</Label>
                    <Textarea id="reconnection-gestures" value={reconnectionGestures} onChange={e => setReconnectionGestures(e.target.value)} placeholder="Ej: Poner mi canción favorita y moverme un rato." />
                </div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar mi Inventario</Button>
            </div>
        );
      default: return null;
    }
  }

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
