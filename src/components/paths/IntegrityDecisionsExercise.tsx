
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { IntegrityDecisionsExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface IntegrityDecisionsExerciseProps {
  content: IntegrityDecisionsExerciseContent;
  pathId: string;
}

export function IntegrityDecisionsExercise({ content, pathId }: IntegrityDecisionsExerciseProps) {
    const t = useTranslations();
    const { toast } = useToast();
    const [decision, setDecision] = useState('');
    const [values, setValues] = useState<Record<string, boolean>>({});
    const [emotions, setEmotions] = useState<string[]>([]);
    const [impact, setImpact] = useState('');
    const [isProud, setIsProud] = useState(false);
    const [reflectsWhoIAm, setReflectsWhoIAm] = useState(false);
    const [coherence, setCoherence] = useState(5);
    const [adjustment, setAdjustment] = useState('');

    const handleSave = () => {
        const selectedValues = Object.keys(values).filter(k => values[k]);
        const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a tomar:** ${decision}
**Valores implicados:** ${selectedValues.join(', ')}
**Emociones predominantes:** ${emotions.join(', ')}
**Impacto a largo plazo:** ${impact}
**Orgullo:** ${isProud ? 'Sí' : 'No'}
**Refleja quién soy:** ${reflectsWhoIAm ? 'Sí' : 'No'}
**Nivel de coherencia:** ${coherence}/10
**Ajuste necesario:** ${adjustment || 'Ninguno.'}
        `;
        addNotebookEntry({ title: 'Decisión con Integridad', content: notebookContent, pathId: pathId });
        toast({ title: 'Reflexión Guardada' });
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>¿Qué decisión tienes que tomar?</Label><Textarea value={decision} onChange={e => setDecision(e.target.value)} /></div>
                <div className="space-y-2"><Label>¿Qué valores están implicados?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                        {valuesList.map(v => (
                            <div key={v} className="flex items-center space-x-2">
                                <Checkbox id={`val-${v}`} checked={!!values[v]} onCheckedChange={c => setValues(p => ({ ...p, [v]: !!c }))} />
                                <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2"><Label>¿Qué emociones predominan?</Label>
                    <Select onValueChange={val => setEmotions([val])}>
                        <SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                        <SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.labelKey}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2"><Label>Si tomo esta decisión, ¿cómo me afectará dentro de 1 año? ¿Y dentro de 5 años?</Label><Textarea value={impact} onChange={e => setImpact(e.target.value)} /></div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2"><Checkbox id="isProud-integrity" checked={isProud} onCheckedChange={c => setIsProud(!!c)} /><Label htmlFor="isProud-integrity">Me sentiría orgulloso/a de esta decisión.</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="reflects-integrity" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} /><Label htmlFor="reflects-integrity">Refleja quién soy y quiero ser.</Label></div>
                </div>
                <div><Label>Nivel de coherencia: {coherence}/10</Label><Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} /></div>
                <div className="space-y-2"><Label>Si algo no encaja, ¿qué cambiarías para sentirte en paz?</Label><Textarea value={adjustment} onChange={e => setAdjustment(e.target.value)} /></div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar en mi cuaderno</Button>
            </CardContent>
        </Card>
    );
}
