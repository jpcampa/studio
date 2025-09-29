
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';

interface FutureSelfVisualizationExerciseProps {
  content: ModuleContent;
  pathId: string;
  audioUrl?: string;
}

export function FutureSelfVisualizationExercise({ content, pathId, audioUrl }: FutureSelfVisualizationExerciseProps) {
    const { toast } = useToast();
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
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
                {audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src={audioUrl} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
            </CardHeader>
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
