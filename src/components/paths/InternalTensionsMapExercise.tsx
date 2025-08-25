"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import type { InternalTensionsMapExerciseContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';

interface InternalTensionsMapExerciseProps {
  content: InternalTensionsMapExerciseContent;
  pathId: string;
}

export function InternalTensionsMapExercise({ content, pathId }: InternalTensionsMapExerciseProps) {
    const { toast } = useToast();
    const t = useTranslations();
    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState('');
    const [emotion, setEmotion] = useState('');
    const [action, setAction] = useState('');
    const [alignment, setAlignment] = useState<'alineado/a' | 'parcialmente' | 'desalineado/a' | ''>('');
    const [needed, setNeeded] = useState('');

    const handleSave = () => {
        const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation}
**Pensamiento:** ${thought}
**Emoción:** ${emotion}
**Acción:** ${action}
**Alineación:** ${alignment}
**¿Qué habría necesitado?:** ${needed}
        `;
        addNotebookEntry({ title: 'Mapa de Tensiones Internas', content: notebookContent, pathId });
        toast({ title: 'Mapa Guardado' });
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>¿Qué ocurrió?</Label><Textarea value={situation} onChange={e => setSituation(e.target.value)} /></div>
                <div className="space-y-2"><Label>¿Qué te dijiste?</Label><Textarea value={thought} onChange={e => setThought(e.target.value)} /></div>
                <div className="space-y-2"><Label>Identifica la emoción dominante</Label>
                    <Select value={emotion} onValueChange={setEmotion}>
                        <SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                        <SelectContent>{emotions.map(e => <SelectItem key={e.value} value={e.labelKey}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2"><Label>¿Qué hiciste finalmente?</Label><Textarea value={action} onChange={e => setAction(e.target.value)} /></div>
                <div className="space-y-2"><Label>Evalúa la alineación</Label>
                    <RadioGroup value={alignment} onValueChange={v => setAlignment(v as any)}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="alineado/a" id="align-1" /><Label htmlFor="align-1">100% alineado/a</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="parcialmente" id="align-2" /><Label htmlFor="align-2">Parcialmente alineado/a</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="desalineado/a" id="align-3" /><Label htmlFor="align-3">Desalineado/a</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2"><Label>¿Qué hubiera necesitado para actuar de forma más coherente?</Label><Textarea value={needed} onChange={e => setNeeded(e.target.value)} /></div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar en mi cuaderno</Button>
            </CardContent>
        </Card>
    );
}

    