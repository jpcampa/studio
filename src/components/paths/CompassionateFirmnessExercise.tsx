"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CompassionateFirmnessExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CompassionateFirmnessExerciseProps {
  content: CompassionateFirmnessExerciseContent;
  pathId: string;
}

export function CompassionateFirmnessExercise({ content, pathId }: CompassionateFirmnessExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [otherEmotion, setOtherEmotion] = useState('');
  const [myNeed, setMyNeed] = useState('');
  const [finalPhrase, setFinalPhrase] = useState('');

  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    if (!finalPhrase.trim()) {
        setFinalPhrase(`Veo que te sientes ${otherEmotion}, y al mismo tiempo, yo necesito ${myNeed}.`);
    }
    const phraseToSave = finalPhrase || `Veo que te sientes ${otherEmotion}, y al mismo tiempo, yo necesito ${myNeed}.`;

    addNotebookEntry({ title: "Mi Frase de Firmeza Compasiva", content: `"${phraseToSave}"`, pathId });
    toast({ title: "Frase Guardada", description: "Tu frase se ha guardado en el cuaderno." });
    next();
  };
  
  const renderStep = () => {
    switch(step) {
        case 0: // Examples
            return (
                <div className="p-4 space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">A veces, encontrar las palabras justas no es fácil. Por eso, te dejamos aquí algunas frases que pueden inspirarte. No se trata de copiarlas tal cual, sino de usarlas como punto de partida para expresar tu verdad con firmeza y cuidado.</p>
                     <Accordion type="single" collapsible className="w-full text-left">
                        <AccordionItem value="example">
                            <AccordionTrigger>Ver ejemplos</AccordionTrigger>
                            <AccordionContent>
                            <ul className="list-disc list-inside space-y-2 p-2">
                                <li className="italic">“Sé que esto te está afectando… y aun así, necesito mantener mi decisión.”</li>
                                <li className="italic">“Entiendo que esperabas otra cosa, pero esta vez necesito respetar mis tiempos.”</li>
                                <li className="italic">“Me doy cuenta de que esto te duele, y al mismo tiempo no puedo encargarme de eso ahora.”</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Crear mi frase</Button>
                </div>
            );
        case 1: // Form
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                     <p className="text-sm text-muted-foreground">Piensa en una situación concreta en la que te haya costado mantener tu decisión ante la incomodidad del otro o la otra. A partir de esa situación, completa el modelo.</p>
                     <div className="space-y-2">
                        <Label htmlFor="other-emotion">Veo que te sientes...</Label>
                        <Textarea id="other-emotion" value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Ej: frustrado/a, decepcionado/a..."/>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="my-need">...y al mismo tiempo, yo necesito...</Label>
                        <Textarea id="my-need" value={myNeed} onChange={e => setMyNeed(e.target.value)} placeholder="Ej: mantener mi decisión, cuidar mi tiempo..."/>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="final-phrase" className="font-semibold">Tu frase final (puedes ajustarla):</Label>
                        <Textarea id="final-phrase" value={finalPhrase || `Veo que te sientes ${otherEmotion}, y al mismo tiempo, yo necesito ${myNeed}.`} onChange={e => setFinalPhrase(e.target.value)} />
                     </div>
                     <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar mi Frase</Button>
                </div>
            );
        case 2: // Confirmation
            return (
                 <div className="p-6 text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">¡Frase Guardada!</h4>
                    <p className="text-muted-foreground">Recuerda: validar al otro no significa invalidarte a ti. Puedes practicar esta frase para que te salga con más naturalidad.</p>
                    <Button onClick={() => setStep(0)} variant="outline" className="w-full">Crear otra frase</Button>
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
