"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmpatheticDialogueExerciseContent } from '@/data/paths/pathTypes';

interface EmpatheticDialogueExerciseProps {
  content: EmpatheticDialogueExerciseContent;
  pathId: string;
}

export function EmpatheticDialogueExercise({ content, pathId }: EmpatheticDialogueExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [feeling, setFeeling] = useState('');
  const [activePart, setActivePart] = useState('');
  const [empatheticPhrase, setEmpatheticPhrase] = useState('');
  const [myNeed, setMyNeed] = useState('');
  const [intention, setIntention] = useState('');

  const handleSave = () => {
    const notebookContent = `
**${content.title}**

- **Sentimiento:** ${feeling}
- **Parte activa:** ${activePart}
- **Frase empática hacia mí:** ${empatheticPhrase}
- **Lo que necesito darme:** ${myNeed}
- **Mi intención:** ${intention}
    `;
    addNotebookEntry({ title: 'Mi Diálogo Interno Empático', content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu diálogo interno ha sido guardado en el cuaderno." });
    setStep(prev => prev + 1);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">Este ejercicio es una pausa consciente para escucharte desde la empatía y conectar contigo antes de responder a los demás. Te ayudará a darte lo que necesitas internamente, en lugar de actuar por impulso o por miedo.</p>
            <Button onClick={() => setStep(1)}>Empezar mi diálogo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1 & 2
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Detente y obsérvate</h4>
            <p>Piensa en una situación reciente o próxima en la que tengas que interactuar con alguien que te genera presión, inseguridad o emociones intensas.</p>
            <div className="space-y-2">
              <Label htmlFor="feeling">¿Qué siento ahora que pienso en esta situación o persona?</Label>
              <Textarea id="feeling" value={feeling} onChange={e => setFeeling(e.target.value)} placeholder="Me siento..."/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="active-part">¿Qué parte de mí está más activa en este momento?</Label>
              <Textarea id="active-part" value={activePart} onChange={e => setActivePart(e.target.value)} placeholder="Ej: mi parte complaciente, insegura, defensiva…"/>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
          </div>
        );
      case 2: // Step 3
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Escúchate con empatía</h4>
            <p>Imagina que eres tu mejor amiga/o. Escribe una frase de validación compasiva hacia ti. Ejemplos: “Entiendo que te sientas así, tiene sentido por lo que viviste.”, “No necesitas ser perfecta/o para estar presente.”</p>
            <div className="space-y-2">
              <Label htmlFor="empathetic-phrase">Tu frase empática hacia ti:</Label>
              <Textarea id="empathetic-phrase" value={empatheticPhrase} onChange={e => setEmpatheticPhrase(e.target.value)} />
            </div>
            <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
          </div>
        );
      case 3: // Step 4
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">¿Qué necesito ahora?</h4>
            <p>Pregúntate: ¿Qué necesito darme a mí en esta situación, antes de responder al otro?</p>
            <div className="space-y-2">
              <Label htmlFor="my-need">Lo que necesito darme ahora es...</Label>
              <Textarea id="my-need" value={myNeed} onChange={e => setMyNeed(e.target.value)} placeholder="Ej: más claridad, más calma, permiso para poner un límite..."/>
            </div>
            <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
          </div>
        );
      case 4: // Step 5
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Una intención para actuar desde tu centro</h4>
            <p>Cierra el ejercicio con una intención clara y realista para tu próxima interacción. Ejemplos: “Voy a intentar estar presente sin perderme a mí.”, “Voy a priorizarme sin dejar de cuidar el vínculo.”</p>
            <div className="space-y-2">
              <Label htmlFor="intention">Mi intención es...</Label>
              <Textarea id="intention" value={intention} onChange={e => setIntention(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mi Diálogo Interno</Button>
          </div>
        );
       case 5: // Confirmation
        return (
          <div className="text-center p-6 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto"/>
            <h4 className="font-bold text-lg">Diálogo Guardado</h4>
            <p>Has practicado una forma poderosa de escucharte. Recuerda que puedes volver a este ejercicio siempre que lo necesites.</p>
            <Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button>
          </div>
        );
      default: return null;
    }
  };

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
