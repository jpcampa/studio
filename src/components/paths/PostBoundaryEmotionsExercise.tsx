"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PostBoundaryEmotionsExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface PostBoundaryEmotionsExerciseProps {
  content: PostBoundaryEmotionsExerciseContent;
  pathId: string;
}

const emotionOptions = [
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-insecurity', label: 'Inseguridad' },
    { id: 'emo-fear', label: 'Miedo al rechazo' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-anger', label: 'Enfado o irritación' },
];

export function PostBoundaryEmotionsExercise({ content, pathId }: PostBoundaryEmotionsExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [thoughts, setThoughts] = useState<Record<string, {text: string, belief: number}>>({});
  const [emotions, setEmotions] = useState<Record<string, {selected: boolean, intensity: number}>>({});
  const [bodySensations, setBodySensations] = useState('');
  const [behavior, setBehavior] = useState('');
  const [emotionFunction, setEmotionFunction] = useState('');
  const [compassionateResponse, setCompassionateResponse] = useState('');
  const [reassessment, setReassessment] = useState('');
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  
  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    let notebookContent = `
**Ejercicio: ${content.title}**

**Situación en la que puse un límite:**
${situation || 'No especificada.'}

**Pensamientos que aparecieron (y cuánto los creí):**
${Object.values(thoughts).map(t => `- "${t.text}" (Creído al ${t.belief}%)`).join('\n') || 'No especificados.'}

**Emociones que sentí (y su intensidad):**
${Object.entries(emotions).filter(([key, val]) => val.selected).map(([key, val]) => `- ${emotionOptions.find(o=>o.id === key)?.label || key}: ${val.intensity}%`).join('\n') || 'No especificadas.'}

**Sensaciones corporales:**
${bodySensations || 'No especificadas.'}

**Comportamiento posterior:**
${behavior || 'No especificado.'}

**Función de la emoción:**
${emotionFunction || 'No especificado.'}

**Respuesta compasiva que me di:**
"${compassionateResponse || 'No especificada.'}"

**Reevaluación de la situación:**
${reassessment || 'No especificada.'}
    `;
    addNotebookEntry({ title: `Registro Post-Límite: ${situation.substring(0, 25)}`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu registro se ha guardado en el cuaderno." });
    next();
  };

  const handleSavePhrase = (phrase: string) => {
    addNotebookEntry({ title: "Frase de Autocompasión", content: `"${phrase}"`, pathId });
    setSavedPhrases(prev => [...prev, phrase]);
    toast({ title: "Frase Guardada", description: "Tu frase de autocuidado se ha guardado." });
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // Example
        return (
          <div className="text-center p-4 space-y-4">
             <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                    <p><strong>Situación:</strong> “Mi amiga me pidió que le ayudara a organizar su mudanza este fin de semana, pero yo ya tenía planes de descanso. Le dije que no.”</p>
                    <p><strong>Pensamientos:</strong> “Seguro que piensa que soy egoísta” (80%), “Nunca estoy cuando se me necesita” (65%).</p>
                    <p><strong>Emociones:</strong> Culpa (70%), inseguridad (40%).</p>
                    <p><strong>Cuerpo:</strong> Tensión en el pecho, respiración superficial.</p>
                    <p><strong>Conducta:</strong> Me sentí incómoda durante un rato. Luego le escribí un mensaje para suavizar.</p>
                    <p><strong>Función de la emoción:</strong> La culpa me muestra que me importa mi amiga y quiero cuidar el vínculo.</p>
                    <p><strong>Respuesta compasiva:</strong> “Puedo querer a alguien y decir que no. Estoy aprendiendo a respetar mis propios límites sin dejar de cuidar la relación.”</p>
                    <p><strong>Resultado:</strong> Me sentí más tranquila. Pude dejar de rumiar.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
          </div>
        );
      case 1: // Form steps
        return (
            <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
                <div className="space-y-2"><Label htmlFor="sit-desc">¿Qué ocurrió exactamente? ¿Qué dijiste o hiciste que supusiera un límite?</Label><Textarea id="sit-desc" value={situation} onChange={e => setSituation(e.target.value)} /></div>
                <div className="space-y-2"><Label>¿Qué frases surgieron en tu mente? ¿Cuánto las creíste (0–100%)?</Label><Input value={thoughts['thought1']?.text || ''} onChange={e => setThoughts(p => ({...p, thought1: {...p.thought1, text: e.target.value}}))} /><Slider value={[thoughts['thought1']?.belief || 50]} onValueChange={v => setThoughts(p => ({...p, thought1: {...p.thought1, belief:v[0]}}))} /></div>
                <div className="space-y-2"><Label>¿Qué emociones aparecieron y con qué intensidad (0–100%)?</Label>
                    {emotionOptions.map(opt => (
                        <div key={opt.id} className="space-y-2"><div className="flex items-center gap-2"><Checkbox id={opt.id} checked={emotions[opt.id]?.selected || false} onCheckedChange={c => setEmotions(p => ({...p, [opt.id]: {...p[opt.id], selected: !!c}}))} /><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>
                        {emotions[opt.id]?.selected && <Slider value={[emotions[opt.id]?.intensity || 50]} onValueChange={v => setEmotions(p => ({...p, [opt.id]: {...p[opt.id], intensity: v[0]}}))} />}</div>
                    ))}
                </div>
                <div className="space-y-2"><Label htmlFor="body-sens">¿Qué notaste en tu cuerpo?</Label><Textarea id="body-sens" value={bodySensations} onChange={e => setBodySensations(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="behavior">¿Qué hiciste o evitaste hacer tras el límite?</Label><Textarea id="behavior" value={behavior} onChange={e => setBehavior(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="emo-func">¿Qué estaba protegiendo esta emoción? ¿Qué valor estaba detrás?</Label><Textarea id="emo-func" value={emotionFunction} onChange={e => setEmotionFunction(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="comp-resp">¿Qué podrías decirte para validar lo que sientes sin dejarte arrastrar?</Label><Textarea id="comp-resp" value={compassionateResponse} onChange={e => setCompassionateResponse(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reassess">¿Cómo ves ahora esa situación? ¿Cambió algo en tu percepción?</Label><Textarea id="reassess" value={reassessment} onChange={e => setReassessment(e.target.value)} /></div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar Registro</Button>
            </div>
        );
      case 2: // Suggested phrases
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500 text-center">
                <h4 className="font-semibold text-lg text-primary">Frases de Autocompasión Sugeridas</h4>
                <ul className="space-y-2 text-left">
                    {["Es incómodo poner límites, pero no es peligroso.", "Puedo sentir culpa y seguir cuidándome.", "Estoy aprendiendo. No necesito hacerlo perfecto.", "Esta emoción me habla, no me define.", "La incomodidad es pasajera. Mi bienestar es más importante que el juicio externo."].map(phrase => (
                        <li key={phrase} className="flex items-center justify-between p-2 border rounded-md bg-background">
                            <span className="text-sm italic">"{phrase}"</span>
                            <Button size="sm" variant="ghost" onClick={() => handleSavePhrase(phrase)} disabled={savedPhrases.includes(phrase)}>{savedPhrases.includes(phrase) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4"/>}</Button>
                        </li>
                    ))}
                </ul>
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
