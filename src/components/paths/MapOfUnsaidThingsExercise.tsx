
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapOfUnsaidThingsExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface MapOfUnsaidThingsExerciseProps {
  content: MapOfUnsaidThingsExerciseContent;
  pathId: string;
}

const emotionOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad' },
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-shame', label: 'Vergüenza' },
    { id: 'emo-frustration', label: 'Frustración' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-apathy', label: 'Apatía / desconexión' },
    { id: 'emo-insecurity', label: 'Inseguridad' },
    { id: 'emo-overwhelm', label: 'Agobio' },
    { id: 'emo-fear-judgment', label: 'Miedo al juicio' },
    { id: 'emo-passive-resistance', label: 'Resistencia pasiva' },
];

const blockageOptions = [
    { id: 'block-conflict-fear', label: 'Miedo al conflicto' },
    { id: 'block-desire-to-please', label: 'Deseo de agradar o no decepcionar' },
    { id: 'block-guilt', label: 'Culpa por priorizarme' },
    { id: 'block-low-self-esteem', label: 'Baja autoestima o inseguridad' },
    { id: 'block-negative-anticipation', label: 'Anticipación negativa de consecuencias' },
    { id: 'block-belief-better-silent', label: 'Creencia de que “mejor callar que incomodar”' },
];


export function MapOfUnsaidThingsExercise({ content, pathId }: MapOfUnsaidThingsExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);

  // State for the user's reflection
  const [situation, setSituation] = useState('');
  const [whatIWanted, setWhatIWanted] = useState('');
  const [whatIDid, setWhatIDid] = useState('');
  const [emotions, setEmotions] = useState<Record<string, boolean>>({});
  const [otherEmotion, setOtherEmotion] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [aftermath, setAftermath] = useState('');

  // State for pattern detection
  const [repeatedEmotions, setRepeatedEmotions] = useState('');
  const [difficultContexts, setDifficultContexts] = useState('');
  const [fears, setFears] = useState('');
  const [blockages, setBlockages] = useState<Record<string, boolean>>({});

  // State for reframing
  const [friendAdvice, setFriendAdvice] = useState('');
  const [fearOrChoice, setFearOrChoice] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [howToSayIt, setHowToSayIt] = useState('');
  
  // State for next step
  const [nextStepPhrase, setNextStepPhrase] = useState('');
  const [nextStepContext, setNextStepContext] = useState('');
  const [nextStepOpener, setNextStepOpener] = useState('');
  
  const [patternName, setPatternName] = useState('');


  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);
  const reset = () => {
    // Reset all state fields if user wants to start over
    setStep(0);
    setSituation('');
    // ... reset all other state variables
  };

  const handleSave = () => {
     const getSelectedLabels = (options: {id: string, label: string}[], selections: Record<string, boolean>) => {
        return options.filter(opt => selections[opt.id]).map(opt => opt.label);
    };

    const selectedEmotions = getSelectedLabels(emotionOptions, emotions);
    if (emotions['emo-other'] && otherEmotion) selectedEmotions.push(otherEmotion);
    
    const selectedBlockages = getSelectedLabels(blockageOptions, blockages);

    const notebookContent = `
**Ejercicio: ${content.title}**
${patternName ? `\n**Nombre del Patrón:** ${patternName}\n` : ''}
---
**MI PATRÓN PERSONAL**

**Emociones que se repiten cuando callo:**
${repeatedEmotions || 'No especificado.'}

**Contextos difíciles:**
${difficultContexts || 'No especificado.'}

**Temores si hablo:**
${fears || 'No especificado.'}

**Bloqueos identificados:**
${selectedBlockages.length > 0 ? selectedBlockages.map(b => `- ${b}`).join('\n') : 'Ninguno seleccionado.'}

---
**MI NUEVA FORMA DE VERLO**

**Consejo de un buen amigo:**
${friendAdvice || 'No especificado.'}

**¿Actúo por miedo o elección?:**
${fearOrChoice || 'No especificado.'}

**Peor escenario y cómo lo afrontaría:**
${worstCase || 'No especificado.'}

---
**MI PLAN DE ACCIÓN**

**Frase límite que podría decir:**
${nextStepPhrase || 'No especificado.'}

**Contexto para practicar:**
${nextStepContext || 'No especificado.'}

**Frase para iniciar la conversación:**
${nextStepOpener || 'No especificado.'}
`;

    addNotebookEntry({
      title: `Mapa de mis no dichos: ${patternName || 'Reflexión'}`,
      content: notebookContent,
      pathId: pathId,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Mapa de mis no dichos' se ha guardado en el Cuaderno Terapéutico.",
    });
    setStep(prev => prev + 1); // Go to final confirmation screen
  };


  const renderStep = () => {
    switch(step) {
      case 0: // Intro with example
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="italic text-muted-foreground">Antes de empezar, te mostramos un ejemplo para guiarte. Lo importante es que uses tus propias palabras y seas honesto/a contigo.</p>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                    <p><strong>¿Qué ocurrió?</strong> Estaba en una reunión y mi jefa pidió voluntarios para un proyecto urgente.</p>
                    <p><strong>¿Qué querías decir/hacer?</strong> Quería decir que no podía asumirlo por sobrecarga.</p>
                    <p><strong>¿Qué hiciste?</strong> Me quedé en silencio.</p>
                    <p><strong>¿Emoción?</strong> Ansiedad, frustración.</p>
                    <p><strong>¿Pensamientos?</strong> "Si digo que no, pensarán que no soy profesional".</p>
                    <p><strong>¿Consecuencia?</strong> Me sentí invisible y frustrado conmigo mismo.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
          </div>
        );
      case 1: // REGISTRA UNA SITUACIÓN
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
             <h4 className="font-semibold text-lg text-primary">Registra una Situación Concreta</h4>
             <p className="text-sm text-muted-foreground">Recuerda una situación reciente en la que no dijiste algo importante para ti.</p>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-happened">¿Qué ocurrió?</Label>
                 <Textarea id="sit-what-happened" value={situation} onChange={e => setSituation(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-i-wanted">¿Qué querías decir o hacer, pero no lo hiciste?</Label>
                 <Textarea id="sit-what-i-wanted" value={whatIWanted} onChange={e => setWhatIWanted(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-i-did">¿Qué hiciste en su lugar?</Label>
                 <Textarea id="sit-what-i-did" value={whatIDid} onChange={e => setWhatIDid(e.target.value)} />
             </div>
              <div className="space-y-2">
                 <Label>¿Qué emoción sentiste?</Label>
                 <div className="grid grid-cols-2 gap-2">
                     {emotionOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={emotions[opt.id] || false} onCheckedChange={c => setEmotions(p => ({...p, [opt.id]:!!c}))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                     ))}
                 </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="emo-other" checked={emotions['emo-other'] || false} onCheckedChange={c => setEmotions(p => ({...p, 'emo-other':!!c}))} />
                    <Label htmlFor="emo-other" className="font-normal">Otra:</Label>
                 </div>
                 {emotions['emo-other'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción" className="ml-6"/>}
              </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-thoughts">¿Qué pensamientos pasaron por tu mente?</Label>
                 <Textarea id="sit-thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-aftermath">¿Qué pasó después?</Label>
                 <Textarea id="sit-aftermath" value={aftermath} onChange={e => setAftermath(e.target.value)} />
             </div>
             <Button onClick={next} className="w-full">Siguiente: Detectar Patrón <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 2: // DETECTA TU PATRÓN
         return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Detecta tu Patrón</h4>
                <p className="text-sm text-muted-foreground">Después de registrar varias situaciones, puedes empezar a ver patrones. No es para etiquetarte, sino para entenderte.</p>
                <div className="space-y-2"><Label htmlFor="pat-emotions">¿Qué emociones se repiten cuando callas?</Label><Textarea id="pat-emotions" value={repeatedEmotions} onChange={e => setRepeatedEmotions(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="pat-contexts">¿Con qué personas o contextos te cuesta más expresarte?</Label><Textarea id="pat-contexts" value={difficultContexts} onChange={e => setDifficultContexts(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="pat-fears">¿Qué temes que ocurra si hablas?</Label><Textarea id="pat-fears" value={fears} onChange={e => setFears(e.target.value)} /></div>
                <div>
                    <Label>Checklist de bloqueos (elige los que se parezcan a ti):</Label>
                    <div className="space-y-1 mt-1">
                        {blockageOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={opt.id} checked={blockages[opt.id] || false} onCheckedChange={c => setBlockages(p => ({...p, [opt.id]:!!c}))} />
                                <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Replantear <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
             </div>
         );
       case 3: // REPLANTEA
         return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Replantea la Situación</h4>
                <p className="text-sm text-muted-foreground">Mira la situación desde otro ángulo para abrir nuevas formas de actuar.</p>
                <div className="space-y-2"><Label htmlFor="reframe-friend">¿Qué me diría un buen amigo si supiera esto?</Label><Textarea id="reframe-friend" value={friendAdvice} onChange={e => setFriendAdvice(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-choice">¿Estoy actuando por miedo o por elección?</Label><Textarea id="reframe-choice" value={fearOrChoice} onChange={e => setFearOrChoice(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-worstcase">¿Qué es lo peor que podría pasar si hablo? ¿Y qué haría si eso ocurre?</Label><Textarea id="reframe-worstcase" value={worstCase} onChange={e => setWorstCase(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-how">¿Cómo podría decirlo con respeto y firmeza?</Label><Textarea id="reframe-how" value={howToSayIt} onChange={e => setHowToSayIt(e.target.value)} /></div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Dar el Primer Paso <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            </div>
         );
       case 4: // DA TU PRIMER PASO
         return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Da tu Primer Paso</h4>
                <p className="text-sm text-muted-foreground">Prepárate para actuar diferente la próxima vez. No tiene que ser perfecto, solo un paso adelante.</p>
                <div className="space-y-2"><Label htmlFor="step-phrase">¿Qué podrías intentar decir la próxima vez que ocurra algo parecido?</Label><Textarea id="step-phrase" value={nextStepPhrase} onChange={e => setNextStepPhrase(e.target.value)} placeholder="Ej: Gracias por contar conmigo, pero no puedo..." /></div>
                <div className="space-y-2"><Label htmlFor="step-context">¿En qué contexto podrías practicarlo con más confianza?</Label><Textarea id="step-context" value={nextStepContext} onChange={e => setNextStepContext(e.target.value)} placeholder="Ej: En una conversación individual..." /></div>
                <div className="space-y-2"><Label htmlFor="step-opener">¿Qué frase podrías tener preparada para empezar?</Label><Textarea id="step-opener" value={nextStepOpener} onChange={e => setNextStepOpener(e.target.value)} placeholder="Ej: Hay algo que quiero comentarte..." /></div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Guardar <Save className="ml-2 h-4 w-4" /></Button></div>
            </div>
         );
       case 5: // Guardar
        return (
             <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">¿Quieres guardar lo que has descubierto hoy?</h4>
                <p className="text-sm">Has recorrido un camino importante. Puedes guardar todo esto en tu Cuaderno Terapéutico para volver a él cuando lo necesites.</p>
                <div className="space-y-2 text-left">
                    <Label htmlFor="pattern-name">Ponle un nombre a este patrón (opcional)</Label>
                    <Textarea id="pattern-name" value={patternName} onChange={e => setPatternName(e.target.value)} placeholder="Ej: Cuando me callo en el trabajo" />
                </div>
                 <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar patrón y alternativa en mi cuaderno</Button>
                 <Button onClick={back} variant="outline" className="w-full">Atrás</Button>
             </div>
        );
       case 6: // Final confirmation
        return (
             <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Guardado con éxito!</h4>
                 <p className="text-muted-foreground">Podrás volver a consultarlo siempre que lo necesites en tu Cuaderno Terapéutico.</p>
                 <Button onClick={reset} variant="outline" className="w-full">Registrar otra situación</Button>
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
