
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, Wind, MessageSquareHeart, HandHeart } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';

interface RitualDeEntregaConscienteExerciseProps {
  content: ModuleContent;
  pathId: string;
}

type RitualOption = 'escribir' | 'respirar' | 'gratitud' | null;

export function RitualDeEntregaConscienteExercise({ content, pathId }: RitualDeEntregaConscienteExerciseProps) {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<RitualOption>(null);

  // States for "Escribir y soltar"
  const [worries, setWorries] = useState('');
  const [reflection, setReflection] = useState('');
  const [reformulation, setReformulation] = useState('');

  // State for "Cerrar con gratitud"
  const [gratitude, setGratitude] = useState('');
  const [progress, setProgress] = useState('');
  const [connection, setConnection] = useState('');

  const handleSave = (title: string, notebookContent: string) => {
    addNotebookEntry({ title, content: notebookContent, pathId });
    toast({ title: 'Guardado', description: 'Tu ritual ha sido guardado en el cuaderno.' });
  };
  
  const EscribirYsoltar = () => (
    <div className="space-y-4">
        <Label>Paso 1: Escribe todo lo que te inquieta</Label>
        <Textarea value={worries} onChange={e => setWorries(e.target.value)} placeholder="Frases cortas, sin filtro..."/>
        <Label>Paso 2: ¿Es esto 100% cierto? ¿Me ayuda pensar así?</Label>
        <Textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Reflexiona aquí..."/>
        <Label>Paso 3: Reformula una frase más útil</Label>
        <Textarea value={reformulation} onChange={e => setReformulation(e.target.value)} placeholder="Ej: No tengo que saberlo todo para empezar."/>
        <Button onClick={() => handleSave("Entrega Consciente: Escribir y Soltar", `Inquietudes: ${worries}\nReflexión: ${reflection}\nReformulación: ${reformulation}`)} className="w-full">
            <Save className="mr-2 h-4 w-4"/> Guardar
        </Button>
    </div>
  );
  
  const RespirarConIntencion = () => (
    <div className="space-y-4 text-center">
        <p>Selecciona una respiración guiada que te ayude a soltar el control.</p>
        {/* Placeholder for audio players */}
        <Button variant="outline" className="w-full">Respiración 4-2-6 (Audio)</Button>
        <Button variant="outline" className="w-full">Respiración diafragmática (Audio)</Button>
        <p className="text-sm italic text-muted-foreground">Respirar no es un descanso menor. Es una señal clara a tu cuerpo de que puede soltar el control.</p>
    </div>
  );

  const CerrarConGratitud = () => (
    <div className="space-y-4">
        <Label>¿Qué agradezco hoy?</Label>
        <Textarea value={gratitude} onChange={e => setGratitude(e.target.value)} placeholder="Ej: La llamada de un amigo..."/>
        <Label>¿Qué pequeño avance hice?</Label>
        <Textarea value={progress} onChange={e => setProgress(e.target.value)} placeholder="Ej: Envié ese email que posponía..."/>
        <Label>¿Qué momento me conectó con la calma o alguien importante?</Label>
        <Textarea value={connection} onChange={e => setConnection(e.target.value)} placeholder="Ej: El paseo al atardecer..."/>
        <Button onClick={() => handleSave("Entrega Consciente: Cierre con Gratitud", `Agradezco: ${gratitude}\nAvance: ${progress}\nMomento de conexión: ${connection}`)} className="w-full">
            <Save className="mr-2 h-4 w-4"/> Guardar
        </Button>
    </div>
  );
  
  const renderContent = () => {
    if (selectedOption === 'escribir') return <EscribirYsoltar />;
    if (selectedOption === 'respirar') return <RespirarConIntencion />;
    if (selectedOption === 'gratitud') return <CerrarConGratitud />;
    
    return (
        <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Cuando intentas controlarlo todo, tu mente se agota. Este ejercicio te propone soltar por un momento. Elige la forma que hoy más te ayude.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setSelectedOption('escribir')}><MessageSquareHeart/>Escribir y soltar</Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setSelectedOption('respirar')}><Wind/>Respirar con intención</Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setSelectedOption('gratitud')}><HandHeart/>Cerrar con gratitud</Button>
            </div>
        </div>
    );
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.type === 'exercise' && content.title}</CardTitle>
        {content.type === 'exercise' && content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {selectedOption && <Button variant="ghost" size="sm" onClick={() => setSelectedOption(null)} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4"/>Volver a las opciones</Button>}
        {renderContent()}
      </CardContent>
    </Card>
  );
}
