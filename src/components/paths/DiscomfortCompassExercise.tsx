
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DiscomfortCompassExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DiscomfortCompassExerciseProps {
  content: DiscomfortCompassExerciseContent;
  pathId: string;
}

const bodySensationOptions = [
    { id: 'body-neck-tension', label: 'Tensión en cuello o mandíbula' },
    { id: 'body-stomach-knot', label: 'Nudo en el estómago' },
    { id: 'body-fast-breathing', label: 'Respiración acelerada' },
    { id: 'body-sweating', label: 'Sudoración o calor' },
    { id: 'body-palpitations', label: 'Palpitaciones' },
    { id: 'body-desire-to-flee', label: 'Ganas de huir o congelación' },
];

const emotionOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad' },
    { id: 'emo-anger', label: 'Enfado' },
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-shame', label: 'Vergüenza' },
    { id: 'emo-frustration', label: 'Frustración' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-overwhelm', label: 'Agobio' },
];

const impulseOptions = [
    { id: 'impulse-say-yes', label: 'Decir que sí, aunque no quería' },
    { id: 'impulse-avoid-convo', label: 'Evitar la conversación' },
    { id: 'impulse-change-topic', label: 'Cambiar de tema o callarme' },
];

export function DiscomfortCompassExercise({ content, pathId }: DiscomfortCompassExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  // State for user inputs
  const [situation, setSituation] = useState('');
  const [bodySensations, setBodySensations] = useState<Record<string, boolean>>({});
  const [otherBodySensation, setOtherBodySensation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [thoughts, setThoughts] = useState('');
  const [thoughtBelief, setThoughtBelief] = useState(50);
  const [impulse, setImpulse] = useState('');
  const [otherImpulse, setOtherImpulse] = useState('');
  const [neededLimit, setNeededLimit] = useState('');
  const [bodyToldMe, setBodyToldMe] = useState('');
  const [alternativeResponse, setAlternativeResponse] = useState('');
  const [responseConfidence, setResponseConfidence] = useState(50);

  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    const getSelectedLabels = (options: {id: string, label: string}[], selections: Record<string, boolean>) => {
        return options.filter(opt => selections[opt.id]).map(opt => opt.label);
    };

    const selectedBodySensations = getSelectedLabels(bodySensationOptions, bodySensations);
    if(bodySensations['body-other']) selectedBodySensations.push(otherBodySensation);
    
    let finalEmotion = emotion === 'otra' ? otherEmotion : emotion;
    let finalImpulse = impulse === 'otra' ? otherImpulse : impulse;
    
    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación que me activó:**
${situation || 'No especificada.'}

**Señales de mi cuerpo:**
${selectedBodySensations.length > 0 ? selectedBodySensations.map(s => `- ${s}`).join('\n') : 'Ninguna especificada.'}

**Emoción y pensamientos:**
- Emoción: ${finalEmotion || 'No especificada'} (Intensidad: ${emotionIntensity}%)
- Pensamiento: "${thoughts || 'No especificado'}" (Creído al ${thoughtBelief}%)

**Impulso y necesidad:**
- Ganas de hacer: ${finalImpulse || 'No especificado.'}
- ¿Necesitaba poner un límite?: ${neededLimit || 'No especificado.'}
- ¿Mi cuerpo me decía algo?: ${bodyToldMe || 'No especificado.'}

**Respuesta alternativa:**
- Podría decir: "${alternativeResponse || 'No especificada'}" (Confianza en esta respuesta: ${responseConfidence}%)
`;

    addNotebookEntry({
      title: `Brújula del Malestar: ${situation.substring(0,25) || 'Reflexión'}`,
      content: notebookContent,
      pathId: pathId,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Brújula del Malestar' ha sido guardada en el cuaderno.",
    });
    setStep(prev => prev + 1); // Go to final confirmation
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // Intro & Example
        return (
            <div className="p-4 space-y-4 text-center">
                <p className="italic text-muted-foreground">Te mostramos un ejemplo para guiarte. Lo importante es que uses tus propias palabras y seas honesto/a contigo.</p>
                <Accordion type="single" collapsible className="w-full text-left">
                <AccordionItem value="example">
                    <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                    <AccordionContent>
                    <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                        <p><strong>Situación:</strong> Mi jefe me pidió quedarme para una tarea urgente cuando ya salía.</p>
                        <p><strong>Cuerpo:</strong> Tensión en la mandíbula, presión en el pecho.</p>
                        <p><strong>Emoción:</strong> Frustración (80%).</p>
                        <p><strong>Pensamiento:</strong> "Si digo que no, pensará que no me implico." (Creído al 85%).</p>
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
      case 1: // Detecta la señal
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 1: Detecta la Señal</h4>
                <div className="space-y-2">
                    <Label htmlFor="discomfort-situation">¿Qué situación te activó emocionalmente?</Label>
                    <Textarea id="discomfort-situation" value={situation} onChange={e => setSituation(e.target.value)} />
                </div>
                <Button onClick={next} className="w-full">Siguiente</Button>
            </div>
        );
      case 2: // Escucha tu cuerpo
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 2: Escucha tu Cuerpo</h4>
                 <div className="space-y-2">
                    <Label>¿Qué notaste en tu cuerpo?</Label>
                    {bodySensationOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={bodySensations[opt.id] || false} onCheckedChange={c => setBodySensations(p => ({...p, [opt.id]:!!c}))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2 pt-1"><Checkbox id="body-other" checked={bodySensations['body-other'] || false} onCheckedChange={c => setBodySensations(p => ({...p, 'body-other':!!c}))} /><Label htmlFor="body-other" className="font-normal">Otra:</Label></div>
                    {bodySensations['body-other'] && <Textarea value={otherBodySensation} onChange={e => setOtherBodySensation(e.target.value)} placeholder="Describe la otra sensación" className="ml-6"/>}
                </div>
                <Button onClick={next} className="w-full">Siguiente</Button>
            </div>
        );
      case 3: // Emociones y pensamientos
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 3: Emociones y Pensamientos</h4>
                <div className="space-y-2">
                    <Label>¿Qué emoción sentiste?</Label>
                    <RadioGroup value={emotion} onValueChange={setEmotion} className="space-y-1">
                        {emotionOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.label} id={opt.id}/><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}
                        <div className="flex items-center space-x-2"><RadioGroupItem value="otra" id="emo-other-radio"/><Label htmlFor="emo-other-radio" className="font-normal">Otra:</Label></div>
                    </RadioGroup>
                    {emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la emoción" className="ml-6"/>}
                    <Label htmlFor="emo-intensity">Intensidad: {emotionIntensity}%</Label>
                    <Slider id="emo-intensity" value={[emotionIntensity]} onValueChange={v => setEmotionIntensity(v[0])} max={100} step={5} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="discomfort-thoughts">¿Qué pensaste en ese momento?</Label>
                    <Textarea id="discomfort-thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} />
                    <Label htmlFor="thought-belief">¿Cuánto te creíste ese pensamiento? {thoughtBelief}%</Label>
                    <Slider id="thought-belief" value={[thoughtBelief]} onValueChange={v => setThoughtBelief(v[0])} max={100} step={5} />
                </div>
                 <Button onClick={next} className="w-full">Siguiente</Button>
            </div>
        );
       case 4: // Impulso e intuición
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Impulso e Intuición</h4>
                <div className="space-y-2">
                    <Label>¿Qué te dieron ganas de hacer?</Label>
                    <RadioGroup value={impulse} onValueChange={setImpulse} className="space-y-1">
                        {impulseOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.label} id={opt.id}/><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}
                        <div className="flex items-center space-x-2"><RadioGroupItem value="otra" id="impulse-other-radio"/><Label htmlFor="impulse-other-radio" className="font-normal">Otra:</Label></div>
                    </RadioGroup>
                     {impulse === 'otra' && <Textarea value={otherImpulse} onChange={e => setOtherImpulse(e.target.value)} placeholder="Describe tu impulso" className="ml-6"/>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="needed-limit">¿Crees que necesitabas poner un límite?</Label>
                    <Textarea id="needed-limit" value={neededLimit} onChange={e => setNeededLimit(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="body-told-me">¿Tu cuerpo y tus emociones estaban intentando decirte algo?</Label>
                    <Textarea id="body-told-me" value={bodyToldMe} onChange={e => setBodyToldMe(e.target.value)} />
                </div>
                <Button onClick={next} className="w-full">Siguiente</Button>
            </div>
        );
      case 5: // Respuesta alternativa
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Respuesta Alternativa</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a entrenar una posible forma de expresarte la próxima vez. No tiene que ser perfecta. Solo honesta.</p>
                <div className="space-y-2">
                    <Label htmlFor="alt-response">¿Qué podrías decir la próxima vez en una situación parecida?</Label>
                    <Textarea id="alt-response" value={alternativeResponse} onChange={e => setAlternativeResponse(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="response-confidence">¿Qué grado de seguridad te genera esta nueva respuesta? {responseConfidence}%</Label>
                    <Slider id="response-confidence" value={[responseConfidence]} onValueChange={v => setResponseConfidence(v[0])} max={100} step={5} />
                </div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar mi Brújula</Button>
            </div>
        );
      case 6: // Final confirmation
        return (
             <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Registro Guardado!</h4>
                 <p className="text-muted-foreground">Has dado un paso importante al escuchar a tu cuerpo. Cada vez que lo haces, entrenas tu capacidad de cuidarte.</p>
                 <Button onClick={() => setStep(0)} variant="outline" className="w-full">Registrar otra situación</Button>
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
