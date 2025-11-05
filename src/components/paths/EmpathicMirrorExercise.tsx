
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight } from 'lucide-react';
import type { EmpathicMirrorExerciseContent } from '@/data/paths/pathTypes';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface EmpathicMirrorExerciseProps {
  content: EmpathicMirrorExerciseContent;
  pathId: string;
}

const invalidatingPhrasesOptions = [
    { id: 'inv-not-big-deal', label: 'No es para tanto.' },
    { id: 'inv-positive-side', label: 'Tienes que ver el lado positivo.' },
    { id: 'inv-i-would', label: 'Yo en tu lugar haría…' },
    { id: 'inv-i-went-through', label: 'Yo también pasé por eso y no me afectó tanto.' },
    { id: 'inv-at-least', label: 'Bueno, al menos no fue peor.' },
];


export function EmpathicMirrorExercise({ content, pathId }: EmpathicMirrorExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();

  const [step, setStep] = useState(0);
  const [conversationPartner, setConversationPartner] = useState('');
  const [topic, setTopic] = useState('');
  const [perceivedEmotion, setPerceivedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [mirrorPhrase, setMirrorPhrase] = useState('');
  const [selectedInvalidating, setSelectedInvalidating] = useState<Record<string, boolean>>({});
  const [otherInvalidating, setOtherInvalidating] = useState('');
  const [commitment, setCommitment] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleComplete = () => {
    if (step === 4 && !commitment.trim()) {
        toast({ title: "Acción requerida", description: "Por favor, define tu microacción empática.", variant: "destructive" });
        return;
    }
    setIsCompleted(true);
    toast({ title: "Ejercicio Finalizado", description: "Has completado la práctica del Espejo Empático. ¡Buen trabajo!" });
  };
  
  const renderStep = () => {
    switch(step) {
        case 0:
            return (
                <div className="p-4 space-y-4 text-center">
                    <p className="italic text-muted-foreground">Te mostramos un ejemplo para guiarte. Lo importante es que uses tus propias palabras y seas honesto/a contigo.</p>
                    <Accordion type="single" collapsible className="w-full text-left">
                    <AccordionItem value="example">
                        <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                        <AccordionContent>
                        <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                            <p><strong>Situación:</strong> “Mi jefe me pidió quedarme para una tarea urgente cuando ya salía.”</p>
                            <p><strong>Cuerpo:</strong> Tensión en la mandíbula, presión en el pecho.</p>
                            <p><strong>Emoción:</strong> Frustración (80%).</p>
                            <p><strong>Pensamiento:</strong> "Si digo que no, pensará que no soy profesional". (Creído al 85%).</p>
                            <p><strong>Impulso:</strong> Aceptar sin discutir.</p>
                            <p><strong>Límite necesario:</strong> Sí, estaba sobrepasado/a.</p>
                            <p><strong>Respuesta alternativa:</strong> "Me encantaría, pero hoy no puedo. Mañana lo vemos." (Confianza: 65%).</p>
                        </div>
                        </AccordionContent>
                    </AccordionItem>
                    </Accordion>
                    <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
                </div>
            );
        case 1:
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 1: Recuerda una conversación reciente</h4>
                    <p className="text-sm text-muted-foreground">Piensa en una conversación reciente o habitual en la que alguien te compartió algo con carga emocional.</p>
                    <div className="space-y-2">
                        <Label htmlFor="partner-name">¿Con quién fue esa conversación?</Label>
                        <Input id="partner-name" value={conversationPartner} onChange={e => setConversationPartner(e.target.value)} placeholder="Nombre o inicial..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="topic">¿Qué te compartió o qué tema estaba en juego?</Label>
                        <Textarea id="topic" value={topic} onChange={e => setTopic(e.target.value)} />
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 2:
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 2: ¿Qué emoción estaba detrás?</h4>
                     <p className="text-sm text-muted-foreground">Conecta con lo que percibiste en esa persona. No hace falta que sea exacto: simplemente sintoniza con su tono, su expresión, su energía.</p>
                     <div className="space-y-2">
                        <Label htmlFor="perceived-emotion">¿Qué emoción crees que predominaba en su mensaje?</Label>
                        <Select value={perceivedEmotion} onValueChange={setPerceivedEmotion}>
                            <SelectTrigger id="perceived-emotion"><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                            <SelectContent>
                                {emotions.map(e => <SelectItem key={e.value} value={e.labelKey}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}
                                <SelectItem value="otra">Otra...</SelectItem>
                            </SelectContent>
                        </Select>
                        {perceivedEmotion === 'otra' && (
                             <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2" />
                        )}
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 3:
            return (
                 <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 3: Practica tu frase-espejo</h4>
                    <p className="text-sm text-muted-foreground">Ahora vas a reflejar esa emoción, sin interpretar ni corregir. Usa esta fórmula como guía: “Entiendo que estés [emoción] porque [situación].”</p>
                    <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                        <p>Ejemplo: “Entiendo que estés agotada porque llevas muchos días tirando sola de todo esto.”</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mirror-phrase">Tu frase-espejo:</Label>
                        <Textarea id="mirror-phrase" value={mirrorPhrase} onChange={e => setMirrorPhrase(e.target.value)} />
                    </div>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 4:
            return (
                 <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 4: Detecta frases que invalidan (para evitarlas)</h4>
                    <p className="text-sm text-muted-foreground">Reflexiona con honestidad: ¿Qué tipo de frases dices a veces, sin querer, que podrían invalidar emocionalmente al otro?</p>
                     <div className="space-y-2">
                        {invalidatingPhrasesOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={opt.id} checked={selectedInvalidating[opt.id] || false} onCheckedChange={c => setSelectedInvalidating(p => ({ ...p, [opt.id]: !!c }))} />
                                <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                            </div>
                        ))}
                        <div className="flex items-center space-x-2">
                            <Checkbox id="inv-other" checked={selectedInvalidating['inv-other'] || false} onCheckedChange={c => setSelectedInvalidating(p => ({ ...p, 'inv-other': !!c }))} />
                            <Label htmlFor="inv-other" className="font-normal">Otra:</Label>
                        </div>
                        {selectedInvalidating['inv-other'] && <Textarea value={otherInvalidating} onChange={e => setOtherInvalidating(e.target.value)} placeholder="Escribe otra frase que suelas usar..." className="ml-6"/>}
                    </div>
                    <p className="text-xs text-muted-foreground italic">Tu intención: Quiero intentar evitar estas respuestas automáticas y practicar el silencio como espacio seguro para el otro.</p>
                    <Button onClick={next} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 5:
            return (
                 <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg text-primary">Paso 5: Define tu próxima microacción empática</h4>
                    <p className="text-sm text-muted-foreground">Para integrar este aprendizaje, elige una acción pequeña y concreta que pondrás en práctica en tu próxima conversación.</p>
                    <div className="space-y-2">
                        <Label htmlFor="commitment">Mi compromiso (Ej: “Voy a dejar más silencios, sin interrumpir.”):</Label>
                        <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} />
                    </div>
                    <Button onClick={handleComplete} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" /> Marcar como completado
                    </Button>
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
        {!isCompleted ? renderStep() : (
            <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
                 <p className="text-muted-foreground">Cuando escuchas sin corregir ni compararte, regalas al otro algo muy poderoso: el permiso de ser quien es.</p>
                 <Button onClick={() => { setStep(0); setIsCompleted(false); }} variant="outline" className="w-full">Practicar de nuevo</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    