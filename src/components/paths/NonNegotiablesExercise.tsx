"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { NonNegotiablesExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface NonNegotiablesExerciseProps {
  content: NonNegotiablesExerciseContent;
  pathId: string;
}

export function NonNegotiablesExercise({ content, pathId }: NonNegotiablesExerciseProps) {
    const [step, setStep] = useState(0);
    const [pastSituation, setPastSituation] = useState('');
    const [brokenValue, setBrokenValue] = useState<Record<string, boolean>>({});
    const [nonNegotiables, setNonNegotiables] = useState<string[]>([]);
    const [commitments, setCommitments] = useState<string[]>(['', '', '']);

    const handleNonNegotiableSelect = (value: string, checked: boolean) => {
        if (checked && nonNegotiables.length < 3) {
            setNonNegotiables(p => [...p, value]);
        } else if (!checked) {
            setNonNegotiables(p => p.filter(v => v !== value));
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 0: return <div className="p-4"><Label>Recuerda una situación en la que actuaste en contra de lo que sentías correcto.</Label><Textarea value={pastSituation} onChange={e => setPastSituation(e.target.value)} /><Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button></div>;
            case 1: return <div className="p-4"><Label>Elige los valores que, si los traicionas, sentirías que te pierdes.</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {valuesList.map(v => (
                        <div key={v} className="flex items-center space-x-2">
                            <Checkbox id={`nn-${v}`} checked={nonNegotiables.includes(v)} onCheckedChange={c => handleNonNegotiableSelect(v, !!c)} disabled={nonNegotiables.length >= 3 && !nonNegotiables.includes(v)} />
                            <Label htmlFor={`nn-${v}`} className="font-normal text-xs">{v}</Label>
                        </div>
                    ))}
                </div>
                <Button onClick={() => setStep(2)} className="w-full mt-2" disabled={nonNegotiables.length !== 3}>Siguiente</Button>
            </div>;
            case 2: return <div className="p-4">{nonNegotiables.map((v, i) => <div key={i} className="space-y-2 mb-2"><Label>{v}:</Label><Textarea value={commitments[i]} onChange={e => { const newC = [...commitments]; newC[i] = e.target.value; setCommitments(newC);}} /></div>)}<Button className="w-full mt-2"><Save className="mr-2 h-4 w-4" />Guardar</Button></div>;
            default: return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}

    