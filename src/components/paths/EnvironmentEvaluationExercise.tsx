"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { EnvironmentEvaluationExerciseContent } from '@/data/paths/pathTypes';
import { Edit3 } from 'lucide-react';

const environments = [
    { id: 'salud_fisica', label: 'Salud física' },
    { id: 'salud_mental', label: 'Salud mental y emocional' },
    { id: 'familia', label: 'Relaciones familiares' },
    { id: 'pareja', label: 'Pareja / vida afectiva' },
    { id: 'amistades', label: 'Amistades y red social' },
    { id: 'desarrollo_personal', label: 'Desarrollo personal' },
    { id: 'trabajo', label: 'Vida laboral/profesional' },
    { id: 'finanzas', label: 'Finanzas y seguridad' },
    { id: 'ocio', label: 'Ocio y tiempo libre' },
];

interface EnvironmentEvaluationExerciseProps {
  content: EnvironmentEvaluationExerciseContent;
  pathId: string;
}

export function EnvironmentEvaluationExercise({ content, pathId }: EnvironmentEvaluationExerciseProps) {
    const [step, setStep] = useState(0);
    const [selectedEnvs, setSelectedEnvs] = useState<Record<string, boolean>>({});
    const [ratings, setRatings] = useState<Record<string, { support: number, drain: number }>>({});

    const handleRatingChange = (id: string, type: 'support' | 'drain', value: number[]) => {
        setRatings(prev => ({...prev, [id]: {...(prev[id] || {support:5, drain:5}), [type]: value[0]}}));
    }

    const renderStep = () => {
        switch(step) {
            case 0: return (
                <div className="p-4 space-y-2">
                    <Label>Identifica tus entornos clave:</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {environments.map(e => (
                            <div key={e.id} className="flex items-center space-x-2">
                                <Checkbox id={e.id} checked={!!selectedEnvs[e.id]} onCheckedChange={c => setSelectedEnvs(p => ({...p, [e.id]: !!c}))} />
                                <Label htmlFor={e.id} className="font-normal">{e.label}</Label>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button>
                </div>
            );
            case 1: return (
                <div className="p-4 space-y-4">
                    {environments.filter(e => selectedEnvs[e.id]).map(e => (
                        <div key={e.id} className="p-3 border rounded-md">
                            <h4 className="font-semibold">{e.label}</h4>
                            <Label>¿Cuánto apoya tus valores? {ratings[e.id]?.support || 'N/A'}/10</Label>
                            <Slider value={[ratings[e.id]?.support || 5]} onValueChange={v => handleRatingChange(e.id, 'support', v)} min={0} max={10} step={1} />
                            <Label>¿Cuánto te aleja de ellos? {ratings[e.id]?.drain || 'N/A'}/10</Label>
                            <Slider value={[ratings[e.id]?.drain || 5]} onValueChange={v => handleRatingChange(e.id, 'drain', v)} min={0} max={10} step={1} />
                        </div>
                    ))}
                    <Button onClick={() => setStep(2)} className="w-full">Ver Síntesis Visual</Button>
                </div>
            );
            case 2:
                // Placeholder for visual synthesis
                return <div className="p-4 text-center"><p>Aquí se mostraría un gráfico con tus puntuaciones.</p><Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button></div>
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

    