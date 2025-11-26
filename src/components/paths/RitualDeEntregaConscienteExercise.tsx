"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, Book, Feather, Wind } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';

interface RitualDeEntregaConscienteExerciseProps {
  content: ModuleContent;
  pathId: string;
}

export function RitualDeEntregaConscienteExercise({ content, pathId }: RitualDeEntregaConscienteExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0: initial choice, 1: write, 2: breathe, 3: gratitude

  // State for "Escribir y soltar"
  const [writtenInquietud, setWrittenInquietud] = useState('');
  const [writtenReflection, setWrittenReflection] = useState('');
  const [writtenReformulation, setWrittenReformulation] = useState('');

  // State for "Cerrar con gratitud"
  const [gratitude, setGratitude] = useState('');
  const [advancement, setAdvancement] = useState('');
  const [calmMoment, setCalmMoment] = useState('');

  const handleSave = (option: string, entryContent: string) => {
    addNotebookEntry({
      title: `Ritual de Entrega Consciente: ${option}`,
      content: entryContent,
      pathId: pathId,
    });
    toast({
      title: "Ritual Guardado",
      description: `Tu ritual de '${option}' ha sido guardado en el cuaderno.`,
    });
  };

  const renderInitialChoice = () => (
    <div className="text-center p-4 space-y-4">
        <p className="text-sm text-muted-foreground">Cuando intentas controlarlo todo, tu mente se agota. Este ejercicio te propone soltar por un momento. Elige la forma que hoy más te ayude:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(1)}><Book className="mb-2"/>Escribir y soltar</Button>
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(2)}><Wind className="mb-2"/>Respirar con intención</Button>
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(3)}><Feather className="mb-2"/>Cerrar con gratitud</Button>
        </div>
    </div>
  );

  const renderWriteAndRelease = () => (
    <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
        <h4 className="font-semibold text-lg">Opción 1: Escribir y Soltar</h4>
        <div className="space-y-2">
            <Label htmlFor="inquietud">Paso 1: Escribe todo lo que te inquieta</Label>
            <Textarea id="inquietud" value={writtenInquietud} onChange={e => setWrittenInquietud(e.target.value)} placeholder="Frases cortas, sin filtro..."/>
        </div>
        <div className="space-y-2">
            <Label>Paso 2: Reflexiona</Label>
            <p className="text-xs text-muted-foreground">• ¿Es esto cierto? • ¿Me ayuda pensar así? • ¿Podría verlo de forma más realista?</p>
            <Textarea value={writtenReflection} onChange={e => setWrittenReflection(e.target.value)} placeholder="Tu reflexión..."/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="reformulation">Paso 3: Reformula una frase más útil</Label>
            <Textarea id="reformulation" value={writtenReformulation} onChange={e => setWrittenReformulation(e.target.value)} placeholder="Ej: No tengo que saberlo todo para empezar."/>
        </div>
        <div className="text-center space-y-2">
            <p className="font-semibold">Paso 4: Suelta</p>
            <p className="text-sm text-muted-foreground">"Hoy elijo confiar en mi capacidad de avanzar paso a paso."</p>
            <Button onClick={() => {
                const content = `**Inquietud:**\n${writtenInquietud}\n\n**Reflexión:**\n${writtenReflection}\n\n**Reformulación:**\n${writtenReformulation}`;
                handleSave("Escribir y Soltar", content);
            }}><Save className="mr-2 h-4 w-4"/> Guardar como "Entrega consciente"</Button>
        </div>
        <Button variant="link" onClick={() => setStep(0)}>Volver a opciones</Button>
    </div>
  );

  const renderBreatheWithIntention = () => (
     <div className="space-y-4 p-2 text-center animate-in fade-in-0 duration-500">
        <h4 className="font-semibold text-lg">Opción 2: Respirar con Intención</h4>
        <p className="text-sm text-muted-foreground">Respirar no es un descanso menor. Es una señal clara a tu cuerpo de que puede soltar el control.</p>
        <div className="space-y-2">
            <p className="font-medium">Respiración 4-2-6</p>
            <audio controls controlsList="nodownload" className="w-full h-10"><source src="https://workwellfut.com/audios/rm/R1_respiracion_4-2-6.mp3" type="audio/mp3"/></audio>
        </div>
         <div className="space-y-2">
            <p className="font-medium">Respiración diafragmática</p>
             <audio controls controlsList="nodownload" className="w-full h-10"><source src="https://workwellfut.com/audios/rm/R1-parte-1-respiracion-muscular-progresiva.mp3" type="audio/mp3"/></audio>
        </div>
        <Button variant="link" onClick={() => setStep(0)}>Volver a opciones</Button>
    </div>
  );

  const renderGratitudeClosing = () => (
    <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
        <h4 className="font-semibold text-lg">Opción 3: Cerrar el Día con Gratitud</h4>
        <div className="space-y-2">
            <Label htmlFor="gratitude">¿Qué agradezco hoy?</Label>
            <Textarea id="gratitude" value={gratitude} onChange={e => setGratitude(e.target.value)}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="advancement">¿Qué pequeño avance hice?</Label>
            <Textarea id="advancement" value={advancement} onChange={e => setAdvancement(e.target.value)}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="calm-moment">¿Qué momento me conectó con la calma?</Label>
            <Textarea id="calm-moment" value={calmMoment} onChange={e => setCalmMoment(e.target.value)}/>
        </div>
        <p className="text-xs italic text-muted-foreground">Hacer esto cada noche entrena a tu mente a cerrar el día con amabilidad, no con autoexigencia.</p>
        <Button onClick={() => {
            const content = `**Agradezco:**\n${gratitude}\n\n**Avance:**\n${advancement}\n\n**Momento de calma:**\n${calmMoment}`;
            handleSave("Cierre con Gratitud", content);
        }}><Save className="mr-2 h-4 w-4"/> Guardar en mi cuaderno</Button>
        <Button variant="link" onClick={() => setStep(0)}>Volver a opciones</Button>
    </div>
  );
  
  const renderContent = () => {
      switch(step) {
          case 0: return renderInitialChoice();
          case 1: return renderWriteAndRelease();
          case 2: return renderBreatheWithIntention();
          case 3: return renderGratitudeClosing();
          default: return renderInitialChoice();
      }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
