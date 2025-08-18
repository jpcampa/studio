
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Path, PathModule, ModuleContent } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Edit3, Clock, PlayCircle, ExternalLink, AlertTriangle, ChevronRight, Check, Save, NotebookText, Map, TrafficCone, GitBranchPlus, Orbit, ArrowRight, Calendar as CalendarIcon, X as XIcon, Minus as MinusIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCompletedModules, saveCompletedModules } from '@/lib/progressStore';
import { useActivePath } from '@/contexts/ActivePathContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { StressMapExercise } from '@/components/paths/StressMapExercise';
import { TriggerExercise } from '@/components/paths/TriggerExercise';
import { DetectiveExercise } from '@/components/paths/DetectiveExercise';
import { DemandsExercise } from '@/components/paths/DemandsExercise';
import { WellbeingPlanExercise } from '@/components/paths/WellbeingPlanExercise';
import { UncertaintyMapExercise } from '@/components/paths/UncertaintyMapExercise';
import { ControlTrafficLightExercise } from '@/components/paths/ControlTrafficLightExercise';
import { AlternativeStoriesExercise } from '@/components/paths/AlternativeStoriesExercise';
import { MantraExercise } from '@/components/paths/MantraExercise';
import { DelSabotajeALaAccionExercise } from '@/components/paths/DelSabotajeALaAccionExercise';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapOfUnsaidThingsExercise } from '@/components/paths/MapOfUnsaidThingsExercise';
import { DiscomfortCompassExercise } from '@/components/paths/DiscomfortCompassExercise';
import { AssertivePhraseExercise } from '@/components/paths/AssertivePhraseExercise';
import { NoGuiltTechniquesExercise } from '@/components/paths/NoGuiltTechniquesExercise';
import { PostBoundaryEmotionsExercise } from '@/components/paths/PostBoundaryEmotionsExercise';
import { CompassionateFirmnessExercise } from '@/components/paths/CompassionateFirmnessExercise';
import { SelfCareContractExercise } from '@/components/paths/SelfCareContractExercise';
import type { AuthenticityThermometerExerciseContent, ExerciseContent, RelationalCommitmentExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';


// Componente para manejar las reflexiones del cuaderno terapéutico
function TherapeuticNotebookReflectionExercise({ content, pathId }: { content: ModuleContent, pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [reflection, setReflection] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    if (content.type !== 'therapeuticNotebookReflection') return null;

    const handleSaveReflection = (e: FormEvent) => {
        e.preventDefault();
        if (!reflection.trim()) {
            toast({ title: "Reflexión Incompleta", description: "Por favor, escribe tu reflexión antes de guardar.", variant: "destructive" });
            return;
        }

        const fullContent = `
**${content.title}**

${content.prompts.join('\n')}

**Mi reflexión:**
${reflection}
        `;

        addNotebookEntry({
            title: `Reflexión: ${content.title}`,
            content: fullContent,
            pathId: pathId,
        });

        toast({ title: "Reflexión Guardada", description: "Tu reflexión ha sido guardada en el Cuaderno Terapéutico." });
        setIsSaved(true);
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center"><NotebookText className="mr-2"/>{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveReflection} className="space-y-4">
                    <div className="space-y-2">
                        {content.prompts.map((prompt, index) => (
                            <p key={index} className="text-sm text-foreground/80 italic"> • {prompt}</p>
                        ))}
                         <Label htmlFor={`reflection-${pathId}`} className="sr-only">Tu reflexión</Label>
                        <Textarea
                            id={`reflection-${pathId}`}
                            value={reflection}
                            onChange={e => setReflection(e.target.value)}
                            placeholder="Escribe aquí tu reflexión personal..."
                            rows={5}
                            disabled={isSaved}
                        />
                    </div>
                    {!isSaved ? (
                        <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" /> Guardar Reflexión en mi Cuaderno
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <p className="font-medium">Tu reflexión ha sido guardada.</p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

// ====================================================================
// START OF RUTA 3 DYNAMIC COMPONENTS
// ====================================================================

function BlockageMapExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [avoidedTask, setAvoidedTask] = useState('');
    const [blockingThoughts, setBlockingThoughts] = useState('');
    const [avoidedEmotions, setAvoidedEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [escapeBehaviors, setEscapeBehaviors] = useState('');
    const [consequences, setConsequences] = useState('');

    if (content.type !== 'exercise') return null;

    const emotionsOptions = [
        { id: 'emo-anxiety', label: 'Ansiedad' },
        { id: 'emo-insecurity', label: 'Inseguridad' },
        { id: 'emo-judgment-fear', label: 'Miedo al juicio' },
        { id: 'emo-shame', label: 'Vergüenza' },
        { id: 'emo-guilt', label: 'Culpa' },
        { id: 'emo-frustration', label: 'Frustración' },
        { id: 'emo-apathy', label: 'Apatía o vacío emocional' },
        { id: 'emo-sadness', label: 'Tristeza o desánimo' },
        { id: 'emo-overwhelm', label: 'Agobio mental' },
        { id: 'emo-resistance', label: 'Resistencia (“No quiero que me obliguen”)' },
    ];

    const handleSave = () => {
        const selectedEmotions = emotionsOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
        if (avoidedEmotions['emo-other'] && otherEmotion) {
            selectedEmotions.push(otherEmotion);
        }

        const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea evitada:*
${avoidedTask || 'No especificada.'}

*Pensamientos bloqueadores:*
${blockingThoughts || 'No especificados.'}

*Emociones evitadas:*
${selectedEmotions.length > 0 ? selectedEmotions.map(e => `- ${e}`).join('\n') : 'No especificadas.'}

*Conductas de escape:*
${escapeBehaviors || 'No especificadas.'}

*Consecuencias:*
${consequences || 'No especificadas.'}
        `;

        addNotebookEntry({ title: 'Mi Mapa del Bloqueo Personal', content: notebookContent, pathId });
        toast({ title: 'Mapa guardado', description: 'Tu Mapa del Bloqueo Personal se ha guardado en el cuaderno.' });
        setStep(prev => prev + 1); // Move to final summary screen
    };

    const renderStep = () => {
        switch (step) {
            case 0: return (
                <div className="text-center p-4">
                    <p className="mb-4">¿Tienes una tarea pendiente que sigues posponiendo? Este ejercicio te ayudará a identificar qué está pasando dentro de ti. No hay respuestas correctas, solo pistas para entenderte mejor.</p>
                    <Button onClick={() => setStep(1)}>Comenzar mi mapa <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
            case 1: return (
                <div className="p-4 space-y-4">
                    <Label htmlFor="avoided-task">Piensa en una tarea concreta que llevas tiempo evitando.</Label>
                    <Textarea id="avoided-task" value={avoidedTask} onChange={e => setAvoidedTask(e.target.value)} placeholder="Ej: Escribir un email importante" />
                    <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
                </div>
            );
            case 2: return (
                <div className="p-4 space-y-4">
                    <Label htmlFor="blocking-thoughts">¿Qué pensamientos aparecen cuando piensas en esa tarea?</Label>
                    <Textarea id="blocking-thoughts" value={blockingThoughts} onChange={e => setBlockingThoughts(e.target.value)} placeholder="Ej: Lo haré mal y me juzgarán" />
                    <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
                </div>
            );
            case 3: return (
                <div className="p-4 space-y-4">
                    <Label>¿Qué emociones o sensaciones físicas intentas evitar?</Label>
                    {emotionsOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={avoidedEmotions[opt.id] || false} onCheckedChange={checked => setAvoidedEmotions(p => ({ ...p, [opt.id]: !!checked }))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="emo-other" checked={avoidedEmotions['emo-other'] || false} onCheckedChange={checked => setAvoidedEmotions(p => ({ ...p, 'emo-other': !!checked }))} />
                        <Label htmlFor="emo-other" className="font-normal">Otra:</Label>
                    </div>
                    {avoidedEmotions['emo-other'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción" className="ml-6" />}
                    <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
                </div>
            );
            case 4: return (
                <div className="p-4 space-y-4">
                    <Label htmlFor="escape-behaviors">¿Qué haces para evitarla?</Label>
                    <Textarea id="escape-behaviors" value={escapeBehaviors} onChange={e => setEscapeBehaviors(e.target.value)} placeholder="Ej: Miro redes sociales, limpio compulsivamente..." />
                    <Button onClick={() => setStep(5)} className="w-full">Siguiente</Button>
                </div>
            );
            case 5: return (
                <div className="p-4 space-y-4">
                    <Label htmlFor="consequences">¿Qué consecuencias tiene para ti seguir evitándolo?</Label>
                    <Textarea id="consequences" value={consequences} onChange={e => setConsequences(e.target.value)} placeholder="Ej: Me siento culpable, pierdo oportunidades..." />
                    <Button onClick={handleSave} className="w-full">Ver mi mapa del bloqueo</Button>
                </div>
            );
            case 6: // Summary screen
                const selectedEmotions = emotionsOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
                if (avoidedEmotions['emo-other'] && otherEmotion) selectedEmotions.push(otherEmotion);
                return (
                    <div className="p-4 space-y-2">
                        <h4 className="font-bold text-center text-lg">Tu Mapa del Bloqueo</h4>
                        <p><strong>Tarea evitada:</strong> {avoidedTask || 'N/A'}</p>
                        <p><strong>Pensamientos bloqueadores:</strong> {blockingThoughts || 'N/A'}</p>
                        <p><strong>Emociones evitadas:</strong> {selectedEmotions.join(', ') || 'N/A'}</p>
                        <p><strong>Conductas de escape:</strong> {escapeBehaviors || 'N/A'}</p>
                        <p><strong>Consecuencias:</strong> {consequences || 'N/A'}</p>
                        <p className="text-sm italic text-center pt-4">Este mapa no es para juzgarte. Es para ayudarte a ver el ciclo completo con más claridad. Entenderlo es el primer paso para liberarte.</p>
                        <Button onClick={() => setStep(0)} variant="outline" className="w-full">Comenzar de nuevo</Button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent>
                {renderStep()}
            </CardContent>
        </Card>
    );
}

function CompassionateReflectionExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
     const { toast } = useToast();
     const { user } = useUser();
    const [step, setStep] = useState(0);
    const [adviceToFriend, setAdviceToFriend] = useState('');
    const [selfJudgment, setSelfJudgment] = useState('');
    const [avoidedEmotions, setAvoidedEmotions] = useState<Record<string, boolean>>({});
    const [aftermathEmotion, setAftermathEmotion] = useState('');
    const [perfectionism, setPerfectionism] = useState<Record<string, boolean>>({});
    const [flexibleThought, setFlexibleThought] = useState('');

    if (content.type !== 'exercise') return null;

    const handleSave = () => {
         const notebookContent = `
**Ejercicio: ${content.title}**

*A alguien que quiero le diría:*
${adviceToFriend || 'No especificado.'}

*En ese momento pensé que:*
${selfJudgment || 'No especificado.'}

*Emociones que intenté evitar:*
${Object.keys(avoidedEmotions).filter(k => avoidedEmotions[k]).join(', ') || 'No especificadas.'}

*¿Qué sentí después de evitarlo?:*
${aftermathEmotion || 'No especificado.'}

*Exigencias detectadas:*
${Object.keys(perfectionism).filter(k => perfectionism[k]).join(', ') || 'Ninguna.'}

*Nueva forma de pensarlo:*
${flexibleThought || 'No especificada.'}
        `;
        addNotebookEntry({ title: 'Mi Reflexión Compasiva', content: notebookContent, pathId });
        toast({ title: 'Reflexión guardada', description: 'Tu reflexión se ha guardado en el cuaderno.' });
        setStep(prev => prev + 1);
    };

     const renderStep = () => {
        switch (step) {
            case 0: return <div className="p-4 text-center"><p>Ahora, vamos a mirar dentro de ti, con respeto y sin crítica. No buscamos explicaciones perfectas, solo entender qué te estaba pasando.</p><Button onClick={() => setStep(1)}>Empezar la reflexión</Button></div>;
            case 1: return <div className="p-4 space-y-2"><Label>Imagina que una persona a la que quieres mucho está en tu situación. ¿Qué le dirías?</Label><Textarea value={adviceToFriend} onChange={e => setAdviceToFriend(e.target.value)} placeholder="Le diría que..." /><Button onClick={() => setStep(2)} className="w-full mt-2">Continuar</Button></div>;
            case 2: return <div className="p-4 space-y-2"><Label>Cuando te bloqueaste, ¿qué pensaste sobre ti?</Label><Textarea value={selfJudgment} onChange={e => setSelfJudgment(e.target.value)} placeholder="Pensé que no valía para esto..." /><p className="text-sm text-center text-primary">Es solo un pensamiento. No eres ese pensamiento.</p><Button onClick={() => setStep(3)} className="w-full mt-2">Siguiente</Button></div>;
            case 3: return <div className="p-4 space-y-2"><Label>¿Qué emoción crees que intentabas evitar cuando procrastinaste?</Label>
                <div className="space-y-1">
                    <div className="flex items-center gap-2"><Checkbox id="fear" onCheckedChange={c => setAvoidedEmotions(p => ({...p, fear:!!c}))} /><Label htmlFor="fear" className="font-normal">Miedo al fallo</Label></div>
                    <div className="flex items-center gap-2"><Checkbox id="shame" onCheckedChange={c => setAvoidedEmotions(p => ({...p, shame:!!c}))} /><Label htmlFor="shame" className="font-normal">Vergüenza</Label></div>
                    <div className="flex items-center gap-2"><Checkbox id="guilt" onCheckedChange={c => setAvoidedEmotions(p => ({...p, guilt:!!c}))} /><Label htmlFor="guilt" className="font-normal">Culpa</Label></div>
                </div>
                <Label htmlFor="aftermath">¿Y qué sentí después de evitarlo?</Label>
                <Textarea id="aftermath" value={aftermathEmotion} onChange={e => setAftermathEmotion(e.target.value)} placeholder="Alivio momentáneo... y luego frustración." />
                <Button onClick={() => setStep(4)} className="w-full mt-2">Siguiente</Button></div>;
            case 4: return <div className="p-4 space-y-2"><Label>¿Te exigiste demasiado en ese momento?</Label>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2"><Checkbox id="perfect" onCheckedChange={c => setPerfectionism(p => ({...p, perfect:!!c}))} /><Label htmlFor="perfect" className="font-normal">Pensé que, si no lo hacía perfecto, mejor no hacerlo.</Label></div>
                    <div className="flex items-center gap-2"><Checkbox id="energy" onCheckedChange={c => setPerfectionism(p => ({...p, energy:!!c}))} /><Label htmlFor="energy" className="font-normal">Sentí que tenía que estar con energía total.</Label></div>
                    <div className="flex items-center gap-2"><Checkbox id="no-error" onCheckedChange={c => setPerfectionism(p => ({...p, error:!!c}))} /><Label htmlFor="no-error" className="font-normal">Cualquier error me parecía inaceptable.</Label></div>
                </div>
                <Label htmlFor="flexible-thought">¿Cómo podrías pensarlo hoy con más flexibilidad?</Label>
                <Textarea id="flexible-thought" value={flexibleThought} onChange={e => setFlexibleThought(e.target.value)} placeholder="Aunque no salga perfecto, un pequeño paso ya es avanzar." />
                <Button onClick={handleSave} className="w-full mt-2">Ver mi reflexión completa</Button></div>;
            case 5: return <div className="p-4 space-y-2"><h4 className="font-bold text-center text-lg">Tu Mapa de Comprensión Emocional</h4><p className="text-sm italic text-center">Has dado un paso valiente. Hablarte con amabilidad te ayuda a avanzar.</p><Button onClick={() => setStep(0)} variant="outline" className="w-full">Empezar de nuevo</Button></div>;
            default: return null;
        }
    };
    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}

function TwoMinuteRuleExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [task, setTask] = useState('');
    const [twoMinVersion, setTwoMinVersion] = useState('');
    const [when, setWhen] = useState('');
    const [saved, setSaved] = useState(false);

    if (content.type !== 'exercise') return null;
    
    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        if (!task || !twoMinVersion || !when) {
            toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
            return;
        }
        const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea que pospongo:*
${task}

*Mi versión de 2 minutos es:*
${twoMinVersion}

*Me comprometo a hacerlo:*
${when}
        `;
        addNotebookEntry({ title: 'Mi Compromiso de 2 Minutos', content: notebookContent, pathId });
        toast({ title: 'Compromiso Guardado', description: 'Tu plan de 2 minutos ha sido guardado.' });
        setSaved(true);
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task">¿Qué tarea estás posponiendo?</Label>
                        <Textarea id="task" value={task} onChange={e => setTask(e.target.value)} disabled={saved} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twoMin">¿Cuál sería su versión de 2 minutos?</Label>
                        <Textarea id="twoMin" value={twoMinVersion} onChange={e => setTwoMinVersion(e.target.value)} disabled={saved} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="when">¿Cuándo lo harás?</Label>
                        <RadioGroup value={when} onValueChange={setWhen} disabled={saved}>
                            <div className="flex items-center gap-2"><RadioGroupItem value="Ahora" id="now" /><Label htmlFor="now" className="font-normal">Ahora</Label></div>
                            <div className="flex items-center gap-2"><RadioGroupItem value="En los próximos 10 minutos" id="in10" /><Label htmlFor="in10" className="font-normal">En los próximos 10 minutos</Label></div>
                        </RadioGroup>
                    </div>
                    {!saved ? <Button type="submit" className="w-full">Guardar mi compromiso</Button> : <p className="text-center text-green-600">¡Compromiso guardado!</p>}
                </form>
            </CardContent>
        </Card>
    );
}

function MicroPlanExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [moment, setMoment] = useState('');
    const [action, setAction] = useState('');
    const [step, setStep] = useState(0);

    if (content.type !== 'exercise') return null;

    const handleSave = () => {
        if (!moment || !action) {
            toast({title: 'Faltan datos', description: 'Por favor, completa ambos campos.', variant: 'destructive'});
            return;
        }
        const notebookContent = `
**Ejercicio: ${content.title}**

*Mi microplan de acción es:*
Cuando ${moment}, voy a ${action}.
        `;
        addNotebookEntry({ title: 'Mi Microplan de Acción', content: notebookContent, pathId });
        toast({title: 'Microplan Guardado', description: 'Tu frase de acción ha sido guardada.'});
        setStep(3); // Go to final confirmation
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>
                {step === 0 && <div className="text-center p-4"><p className="mb-4">Planear con realismo es lo que necesitamos para avanzar. Crea tu microplan: una frase corta que una lo cotidiano con lo que quieres empezar.</p><Button onClick={() => setStep(1)}>Crear mi frase de acción</Button></div>}
                {step === 1 && <div className="p-4 space-y-4"><Label>¿En qué momento cotidiano podrías activar tu gesto?</Label><Textarea value={moment} onChange={e => setMoment(e.target.value)} placeholder="Ej: Llegue a casa..." /><Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente paso</Button></div>}
                {step === 2 && <div className="p-4 space-y-4"><Label>¿Qué pequeña acción puedes vincular a ese momento?</Label><Textarea value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: Salir a caminar 10 minutos..." /><Button onClick={handleSave} className="w-full mt-2">Ver mi frase</Button></div>}
                {step === 3 && <div className="p-4 text-center space-y-4"><p className="font-bold">Tu frase final:</p><p className="italic">"Cuando {moment}, voy a {action}."</p><p className="text-sm text-muted-foreground">Esta frase no es una obligación: es una señal de autocuidado.</p><Button onClick={() => setStep(0)} variant="outline">Crear otro plan</Button></div>}
            </CardContent>
        </Card>
    );
}

function FutureSelfVisualizationExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [habit, setHabit] = useState('');
    const [futureSelf, setFutureSelf] = useState('');
    const [emotions, setEmotions] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [benefits, setBenefits] = useState('');
    const [steps, setSteps] = useState('');
    const [saved, setSaved] = useState(false);

    if (content.type !== 'exercise') return null;

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const notebookContent = `
**Ejercicio: ${content.title}**

*Hábito visualizado:* ${habit}
*Cómo era mi yo futuro:* ${futureSelf}
*Emociones que sentí:* ${emotions}
*Pensamientos que aparecieron:* ${thoughts}
*Beneficios en mi vida:* ${benefits}
*Pasos que me ayudaron:* ${steps}
        `;
        addNotebookEntry({ title: 'Mi Visualización del Yo Futuro', content: notebookContent, pathId });
        toast({ title: 'Visualización Guardada', description: 'Tu ejercicio se ha guardado en el cuaderno.' });
        setSaved(true);
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <p className="text-sm">Después de realizar la visualización (ya sea leyéndola o escuchando el audio), responde a las siguientes preguntas para anclar la experiencia.</p>
                    <div className="space-y-2"><Label htmlFor="habit">¿Qué hábito visualizaste?</Label><Textarea id="habit" value={habit} onChange={e => setHabit(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="future-self">¿Cómo era tu yo futuro?</Label><Textarea id="future-self" value={futureSelf} onChange={e => setFutureSelf(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="emotions">¿Qué emociones sentiste?</Label><Textarea id="emotions" value={emotions} onChange={e => setEmotions(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="thoughts">¿Qué pensamientos nuevos aparecieron?</Label><Textarea id="thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="benefits">¿Qué beneficios viste en tu vida?</Label><Textarea id="benefits" value={benefits} onChange={e => setBenefits(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="steps">¿Qué pasos te ayudaron a llegar hasta ahí?</Label><Textarea id="steps" value={steps} onChange={e => setSteps(e.target.value)} disabled={saved} /></div>
                    {!saved ? <Button type="submit" className="w-full">Guardar mi visualización</Button> : <p className="text-center text-green-600">¡Visualización guardada!</p>}
                </form>
            </CardContent>
        </Card>
    );
}

function RealisticRitualExercise({ content, pathId }: { content: ModuleContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [habit, setHabit] = useState('');
    const [minVersion, setMinVersion] = useState('');
    const [link, setLink] = useState('');
    const [reminder, setReminder] = useState('');
    const [saved, setSaved] = useState(false);

    if (content.type !== 'exercise') return null;
    
    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        if (!habit || !minVersion || !link || !reminder) {
            toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
            return;
        }
        const notebookContent = `
**Ejercicio: ${content.title}**

*Hábito que quiero mantener:*
${habit}

*Mi versión mínima viable:*
${minVersion}

*Lo vincularé a:*
${link}

*Para recordarlo o facilitarlo, voy a:*
${reminder}
        `;
        addNotebookEntry({ title: 'Mi Ritual Realista', content: notebookContent, pathId });
        toast({ title: 'Ritual Guardado', description: 'Tu ritual ha sido guardado.' });
        setSaved(true);
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="habit-ritual">¿Qué hábito quiero mantener?</Label><Textarea id="habit-ritual" value={habit} onChange={e => setHabit(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="min-version">¿Cuál es su versión mínima viable?</Label><Textarea id="min-version" value={minVersion} onChange={e => setMinVersion(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="link">¿Cuándo o con qué lo vincularás?</Label><Textarea id="link" value={link} onChange={e => setLink(e.target.value)} disabled={saved} /></div>
                    <div className="space-y-2"><Label htmlFor="reminder">¿Qué puedo hacer para recordarlo o facilitarlo?</Label><Textarea id="reminder" value={reminder} onChange={e => setReminder(e.target.value)} disabled={saved} /></div>
                    {!saved ? <Button type="submit" className="w-full">Guardar mi ritual</Button> : <p className="text-center text-green-600">¡Ritual guardado!</p>}
                </form>
            </CardContent>
        </Card>
    );
}

function GentleTrackingExercise({ content, pathId }: { content: ExerciseContent; pathId: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [weekWord, setWeekWord] = useState('');
    const [saved, setSaved] = useState(false);
    
    type TrackingStatus = 'done' | 'partial' | 'skipped';
    type DailyProgress = {
        status?: TrackingStatus;
        comment?: string;
    };
    const [progress, setProgress] = useState<Record<string, DailyProgress>>({});
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    
    const storageKey = `gentle-tracking-${pathId}`;
    
    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(storageKey);
            if (storedProgress) {
                setProgress(JSON.parse(storedProgress));
            }
        } catch (error) {
            console.error("Error loading tracking progress from localStorage", error);
        }
    }, [storageKey]);

    const saveProgress = (newProgress: Record<string, DailyProgress>) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newProgress));
        } catch (error) {
            console.error("Error saving tracking progress to localStorage", error);
        }
    };

    const handleDayStatusChange = (status: TrackingStatus) => {
        if (!selectedDate) return;
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const newProgress = { ...progress, [dateKey]: { ...progress[dateKey], status } };
        setProgress(newProgress);
        saveProgress(newProgress);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const progressText = Object.entries(progress)
            .map(([date, data]) => {
                const statusSymbol = data.status === 'done' ? '✔' : data.status === 'partial' ? '~' : 'X';
                return `${format(new Date(date), 'dd/MM/yyyy')}: ${statusSymbol}`;
            })
            .join('\n');

        const notebookContent = `
**Ejercicio: ${content.title}**

*Seguimiento del Hábito:*
${progressText || 'No se registraron días.'}

*Mi palabra de la semana para este hábito ha sido:*
**${weekWord || 'No especificada.'}**
        `;
        addNotebookEntry({ title: 'Mi Seguimiento Amable', content: notebookContent, pathId });
        toast({ title: 'Seguimiento Guardado', description: 'Tu progreso y palabra de la semana se han guardado.' });
        setSaved(true);
    };
    
    const renderDayContent = (day: Date) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayProgress = progress[dateKey];
        let icon = null;
        if (dayProgress?.status === 'done') icon = <CheckIcon className="h-4 w-4 text-green-500" />;
        if (dayProgress?.status === 'partial') icon = <MinusIcon className="h-4 w-4 text-yellow-500" />;
        if (dayProgress?.status === 'skipped') icon = <XIcon className="h-4 w-4 text-red-500" />;

        return (
            <div className="relative flex items-center justify-center h-full w-full">
                {day.getDate()}
                {icon && <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">{icon}</div>}
            </div>
        );
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                     <p className="text-sm">Usa el calendario para marcar tu progreso diario (✔, ~, X) y añade comentarios si lo necesitas.</p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={es}
                            className="rounded-md border p-3"
                            components={{
                                DayContent: ({ date, displayMonth }) => renderDayContent(date),
                            }}
                        />
                         {selectedDate && (
                            <div className="w-full sm:w-auto flex-grow space-y-3">
                                <p className="font-semibold text-center">Progreso para {format(selectedDate, "PPP", { locale: es })}</p>
                                <div className="flex justify-around gap-2">
                                     <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('done')} title="Lo hice"><CheckIcon className="h-5 w-5 text-green-500" /></Button>
                                     <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('partial')} title="Lo hice parcialmente"><MinusIcon className="h-5 w-5 text-yellow-500" /></Button>
                                     <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('skipped')} title="No lo hice"><XIcon className="h-5 w-5 text-red-500" /></Button>
                                </div>
                            </div>
                        )}
                     </div>

                    <div className="space-y-2">
                        <Label htmlFor="week-word">Tu palabra de la semana</Label>
                        <Textarea id="week-word" value={weekWord} onChange={e => setWeekWord(e.target.value)} placeholder="Ej: Constancia, Presencia, Avance..." disabled={saved} />
                    </div>
                    {!saved ? <Button type="submit" className="w-full">Guardar Palabra de la Semana</Button> : <p className="text-center text-green-600">¡Guardado!</p>}
                </form>
            </CardContent>
        </Card>
    );
}

// ====================================================================
// END OF RUTA 3 DYNAMIC COMPONENTS
// ====================================================================
import { AuthenticityThermometerExercise } from './AuthenticityThermometerExercise';
import { EmpatheticDialogueExercise } from './EmpatheticDialogueExercise';
import { EmpathicMirrorExercise } from './EmpathicMirrorExercise';
import { ValidationIn3StepsExercise } from './ValidationIn3StepsExercise';
import { EmpathicShieldVisualizationExercise } from './EmpathicShieldVisualizationExercise';
import { EmotionalInvolvementTrafficLightExercise } from './EmotionalInvolvementTrafficLightExercise';
import { SignificantRelationshipsInventoryExercise } from './SignificantRelationshipsInventoryExercise';
import { RelationalCommitmentExercise } from './RelationalCommitmentExercise';
// RUTA 6 imports
import { DetectiveDeEmocionesExercise } from './DetectiveDeEmocionesExercise';
import { UnaPalabraCadaDiaExercise } from './UnaPalabraCadaDiaExercise';
import { MapaEmocionNecesidadCuidadoExercise } from './MapaEmocionNecesidadCuidadoExercise';
import { CartaDesdeLaEmocionExercise } from './CartaDesdeLaEmocionExercise';
import { MapaEmocionalRepetidoExercise } from './MapaEmocionalRepetidoExercise';
import { SemaforoEmocionalExercise } from './SemaforoEmocionalExercise';
import { MeditacionGuiadaSinJuicioExercise } from './MeditacionGuiadaSinJuicioExercise';
import { DiarioMeDiCuentaExercise } from './DiarioMeDiCuentaExercise';

const renderContent = (contentItem: ModuleContent, index: number, pathId: string) => {
  switch (contentItem.type) {
    case 'title':
      return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3">{contentItem.text}</h3>;
    case 'paragraph':
      return <p key={index} className="text-base leading-relaxed whitespace-pre-line mb-4" dangerouslySetInnerHTML={{ __html: contentItem.text.replace(/\n/g, '<br />') }} />;
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4">
          {contentItem.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/☐/g, '<span class="inline-block w-4 h-4 border border-foreground/50 rounded-sm mr-2"></span>') }} />)}
        </ul>
      );
    case 'collapsible':
      return (
        <Accordion key={index} type="single" collapsible className="w-full mb-4">
          <AccordionItem value={`item-${index}`} className="border rounded-lg shadow-sm">
            <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline text-left">
              {contentItem.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4">
                {contentItem.content.map((item, i) => renderContent(item, i, pathId))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'exercise':
        // RUTA 3 Ejercicios
        if (contentItem.title === 'Ejercicio 1: Mi Mapa del Bloqueo Personal') {
            return <BlockageMapExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 2: Reflexiona sin Culparte') {
            return <CompassionateReflectionExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 1: La Regla de los 2 Minutos') {
            return <TwoMinuteRuleExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 2: Tu Primer Microplan de Acción') {
            return <MicroPlanExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 2: Visualización del Yo Futuro') {
            return <FutureSelfVisualizationExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 1: Diseña tu Ritual Realista') {
            return <RealisticRitualExercise key={index} content={contentItem} pathId={pathId} />;
        }
        if (contentItem.title === 'Ejercicio 2: Seguimiento Amable + Refuerzo Visual') {
            return <GentleTrackingExercise key={index} content={contentItem as ExerciseContent} pathId={pathId} />;
        }
        // Fallback for other exercises
        return (
            <Card key={index} className="bg-muted/30 my-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{contentItem.title}</CardTitle>
                    {contentItem.objective && <CardDescription className="pt-2">{contentItem.objective}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {contentItem.content.map((item, i) => renderContent(item, i, pathId))}
                </CardContent>
                {contentItem.duration && <CardFooter className="text-xs text-muted-foreground"><Clock className="mr-2 h-3 w-3" />Duración sugerida: {contentItem.duration}</CardFooter>}
            </Card>
        );
    case 'quote':
        return <blockquote key={index} className="mt-6 border-l-2 pl-6 italic text-accent-foreground/80">"{contentItem.text}"</blockquote>;
    case 'stressMapExercise':
        return <StressMapExercise key={index} content={contentItem} />;
    case 'triggerExercise':
        return <TriggerExercise key={index} content={contentItem} />;
    case 'detectiveExercise':
        return <DetectiveExercise key={index} content={contentItem} />;
    case 'demandsExercise':
        return <DemandsExercise key={index} content={contentItem} />;
    case 'wellbeingPlanExercise':
        return <WellbeingPlanExercise key={index} content={contentItem} />;
    case 'uncertaintyMapExercise':
        return <UncertaintyMapExercise key={index} content={contentItem} />;
    case 'controlTrafficLightExercise':
        return <ControlTrafficLightExercise key={index} content={contentItem} />;
    case 'alternativeStoriesExercise':
        return <AlternativeStoriesExercise key={index} content={contentItem} />;
    case 'mantraExercise':
        return <MantraExercise key={index} content={contentItem} />;
    case 'delSabotajeALaAccionExercise':
        return <DelSabotajeALaAccionExercise key={index} content={contentItem} />;
    case 'therapeuticNotebookReflection':
        return <TherapeuticNotebookReflectionExercise key={index} content={contentItem} pathId={pathId} />;
    case 'mapOfUnsaidThingsExercise':
        return <MapOfUnsaidThingsExercise key={index} content={contentItem} pathId={pathId} />;
    case 'discomfortCompassExercise':
        return <DiscomfortCompassExercise key={index} content={contentItem} pathId={pathId} />;
    case 'assertivePhraseExercise':
        return <AssertivePhraseExercise key={index} content={contentItem} pathId={pathId} />;
    case 'noGuiltTechniquesExercise':
        return <NoGuiltTechniquesExercise key={index} content={contentItem} pathId={pathId} />;
    case 'postBoundaryEmotionsExercise':
        return <PostBoundaryEmotionsExercise key={index} content={contentItem} pathId={pathId} />;
    case 'compassionateFirmnessExercise':
        return <CompassionateFirmnessExercise key={index} content={contentItem} pathId={pathId} />;
    case 'selfCareContractExercise':
        return <SelfCareContractExercise key={index} content={contentItem} pathId={pathId} />;
    // RUTA 5
    case 'authenticityThermometerExercise':
      return <AuthenticityThermometerExercise key={index} content={contentItem as AuthenticityThermometerExerciseContent} pathId={pathId} />;
    case 'empatheticDialogueExercise':
      return <EmpatheticDialogueExercise key={index} content={contentItem} pathId={pathId} />;
    case 'empathicMirrorExercise':
      return <EmpathicMirrorExercise key={index} content={contentItem} pathId={pathId} />;
    case 'validationIn3StepsExercise':
      return <ValidationIn3StepsExercise key={index} content={contentItem} pathId={pathId} />;
    case 'empathicShieldVisualizationExercise':
      return <EmpathicShieldVisualizationExercise key={index} content={contentItem} pathId={pathId} />;
    case 'emotionalInvolvementTrafficLightExercise':
      return <EmotionalInvolvementTrafficLightExercise key={index} content={contentItem} pathId={pathId} />;
    case 'significantRelationshipsInventoryExercise':
      return <SignificantRelationshipsInventoryExercise key={index} content={contentItem} pathId={pathId} />;
    case 'relationalCommitmentExercise':
      return <RelationalCommitmentExercise key={index} content={contentItem as RelationalCommitmentExerciseContent} pathId={pathId} />;
    // RUTA 6
    case 'detectiveDeEmocionesExercise':
        return <DetectiveDeEmocionesExercise key={index} content={contentItem} pathId={pathId} />;
    case 'unaPalabraCadaDiaExercise':
        return <UnaPalabraCadaDiaExercise key={index} content={contentItem} pathId={pathId} />;
    case 'mapaEmocionNecesidadCuidadoExercise':
        return <MapaEmocionNecesidadCuidadoExercise key={index} content={contentItem} pathId={pathId} />;
    case 'cartaDesdeLaEmocionExercise':
        return <CartaDesdeLaEmocionExercise key={index} content={contentItem} pathId={pathId} />;
    case 'mapaEmocionalRepetidoExercise':
        return <MapaEmocionalRepetidoExercise key={index} content={contentItem} pathId={pathId} />;
    case 'semaforoEmocionalExercise':
        return <SemaforoEmocionalExercise key={index} content={contentItem} pathId={pathId} />;
    case 'meditacionGuiadaSinJuicioExercise':
        return <MeditacionGuiadaSinJuicioExercise key={index} content={contentItem} pathId={pathId} />;
    case 'diarioMeDiCuentaExercise':
        return <DiarioMeDiCuentaExercise key={index} content={contentItem} pathId={pathId} />;
    default:
      return null;
  }
};


export function PathDetailClient({ path }: { path: Path }) {
  const t = useTranslations();
  const { toast } = useToast();
  const { loadPath, updateModuleCompletion: contextUpdateModuleCompletion } = useActivePath();
  
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [showPathCongratsDialog, setShowPathCongratsDialog] = useState(false);

  useEffect(() => {
    if (path) {
      const initialCompleted = getCompletedModules(path.id);
      setCompletedModules(initialCompleted);
      loadPath(path.id, path.title, path.modules.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, loadPath]);


  if (!path) {
    // This case should ideally be handled by the server component with notFound()
    return (
      <div className="container mx-auto py-8 text-center text-xl flex flex-col items-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        {t.errorOccurred} Ruta no encontrada.
        <Button asChild variant="outline">
          <Link href="/paths">{t.allPaths}</Link>
        </Button>
      </div>
    );
  }

  const toggleComplete = (moduleId: string, moduleTitle: string) => {
    const newCompletedModules = new Set(completedModules);
    let justCompletedModule = false;

    if (newCompletedModules.has(moduleId)) {
      newCompletedModules.delete(moduleId);
    } else {
      newCompletedModules.add(moduleId);
      justCompletedModule = true;
    }

    setCompletedModules(newCompletedModules);
    saveCompletedModules(path.id, newCompletedModules);
    contextUpdateModuleCompletion(path.id, moduleId, justCompletedModule);


    if (justCompletedModule) {
      toast({
        title: t.moduleCompletedTitle,
        description: t.moduleCompletedMessage.replace("{moduleTitle}", moduleTitle),
        duration: 3000,
      });

      const allModulesCompleted = path.modules.every(m => newCompletedModules.has(m.id));
      if (allModulesCompleted) {
        setShowPathCongratsDialog(true);
      }
    }
  };
  
  const getModuleIcon = (type: PathModule['type']) => {
    switch (type) {
      case 'introduction': return <BookOpen className="h-6 w-6 text-primary" />;
      case 'skill_practice': return <Edit3 className="h-6 w-6 text-primary" />;
      case 'summary': return <CheckCircle className="h-6 w-6 text-primary" />;
      default: return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-12 shadow-xl overflow-hidden">
        {path.dataAiHint && (
          <div className="relative h-64 w-full">
            <Image 
              src={`https://placehold.co/800x300.png`} 
              alt={path.title} 
              fill 
              className="object-cover"
              data-ai-hint={path.dataAiHint} 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg">{path.title}</h1>
            </div>
          </div>
        )}
        {!path.dataAiHint && (
             <CardHeader className="bg-muted/30 p-8 text-center">
                <h1 className="text-4xl font-bold text-primary">{path.title}</h1>
             </CardHeader>
        )}
        <CardContent className="p-8">
          <p className="text-lg text-muted-foreground mt-2 text-center">{path.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {path.modules.map((module: PathModule, index: number) => (
          <Card key={module.id} className={`shadow-lg transition-all duration-300 hover:shadow-xl ${completedModules.has(module.id) ? 'border-green-500/50 bg-green-50/30 dark:bg-green-900/10' : 'border-transparent'}`}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  {getModuleIcon(module.type)}
                  <div>
                    <CardTitle className="text-xl text-accent">{module.title}</CardTitle>
                    {module.estimatedTime && (
                      <CardDescription className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" /> {module.estimatedTime}
                      </CardDescription>
                    )}
                  </div>
                </div>
                 {completedModules.has(module.id) && (
                  <Badge variant="secondary" className="border-green-600 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                    Completado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
                {module.content.map((contentItem, i) => renderContent(contentItem, i, path.id))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleComplete(module.id, module.title)} variant={completedModules.has(module.id) ? "secondary" : "default"}>
                <Check className="mr-2 h-4 w-4" />
                {completedModules.has(module.id) ? t.markAsNotCompleted : t.markAsCompleted}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
            <Link href="/paths">{t.allPaths}</Link>
        </Button>
      </div>

      <AlertDialog open={showPathCongratsDialog} onOpenChange={setShowPathCongratsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary">{t.pathCompletedTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t.pathCompletedMessage.replace("{pathTitle}", path.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPathCongratsDialog(false)}>{t.continueLearning}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
