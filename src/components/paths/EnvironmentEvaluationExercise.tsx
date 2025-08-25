"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { EnvironmentEvaluationExerciseContent } from '@/data/paths/pathTypes';
import { Edit3 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis
} from "recharts";

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

    const selectedEnvironments = useMemo(() => {
        return environments.filter(e => selectedEnvs[e.id]);
    }, [selectedEnvs]);

    const chartData = useMemo(() => {
        return selectedEnvironments.map(env => {
            const rating = ratings[env.id] || { support: 5, drain: 5 };
            // Puntuación área=(Apoyo) + (10 - Drenaje) / 2
            const score = (rating.support + (10 - rating.drain)) / 2;
            return {
                area: env.label,
                score: parseFloat(score.toFixed(1)),
                fullMark: 10,
            };
        });
    }, [selectedEnvironments, ratings]);

    const chartConfig = {
        score: {
            label: 'Coherencia del Entorno',
            color: "hsl(var(--primary))",
        },
    };

    const renderStep = () => {
        switch(step) {
            case 0: return (
                <div className="p-4 space-y-2">
                    <Label className="font-semibold">Identifica tus entornos clave:</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {environments.map(e => (
                            <div key={e.id} className="flex items-center space-x-2">
                                <Checkbox id={e.id} checked={!!selectedEnvs[e.id]} onCheckedChange={c => setSelectedEnvs(p => ({...p, [e.id]: !!c}))} />
                                <Label htmlFor={e.id} className="font-normal">{e.label}</Label>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setStep(1)} className="w-full mt-4">Siguiente</Button>
                </div>
            );
            case 1: return (
                <div className="p-4 space-y-4">
                    {selectedEnvironments.length > 0 ? selectedEnvironments.map(e => (
                        <div key={e.id} className="p-3 border rounded-md">
                            <h4 className="font-semibold">{e.label}</h4>
                            <Label htmlFor={`support-${e.id}`}>¿Cuánto apoya tus valores? {ratings[e.id]?.support ?? 5}/10</Label>
                            <Slider id={`support-${e.id}`} value={[ratings[e.id]?.support || 5]} onValueChange={v => handleRatingChange(e.id, 'support', v)} min={0} max={10} step={1} />
                            <Label htmlFor={`drain-${e.id}`}>¿Cuánto te aleja de ellos? {ratings[e.id]?.drain ?? 5}/10</Label>
                            <Slider id={`drain-${e.id}`} value={[ratings[e.id]?.drain || 5]} onValueChange={v => handleRatingChange(e.id, 'drain', v)} min={0} max={10} step={1} />
                        </div>
                    )) : <p className="text-muted-foreground text-center">No has seleccionado ningún entorno. Vuelve al paso anterior para elegirlos.</p>}
                     <div className="flex justify-between w-full">
                        <Button onClick={() => setStep(0)} variant="outline">Atrás</Button>
                        <Button onClick={() => setStep(2)} disabled={selectedEnvironments.length === 0}>Ver Síntesis Visual</Button>
                    </div>
                </div>
            );
            case 2:
                return (
                    <div className="p-4 text-center space-y-4">
                        <h4 className="font-semibold text-lg">Tu Mapa de Coherencia</h4>
                        <p className="text-sm text-muted-foreground">Este gráfico muestra la "coherencia" de cada entorno. Una puntuación alta indica que te apoya y no te drena. Una baja, lo contrario.</p>
                         <ChartContainer config={chartConfig} className="w-full aspect-square h-[350px]">
                            <RadarChart data={chartData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
                                <PolarGrid />
                                <Radar
                                    dataKey="score"
                                    fill="var(--color-score)"
                                    fillOpacity={0.6}
                                    dot={{
                                        r: 4,
                                        fillOpacity: 1,
                                    }}
                                />
                            </RadarChart>
                        </ChartContainer>
                        <Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button>
                    </div>
                );
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