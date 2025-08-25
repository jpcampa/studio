
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import type { CoherenceCompassExerciseContent } from '@/data/paths/pathTypes';
import { ArrowRight, CheckCircle, Edit3 } from 'lucide-react';

interface CoherenceCompassExerciseProps {
  content: CoherenceCompassExerciseContent;
  pathId: string;
}

const areas = [
    { id: 'relaciones_personales', label: 'Relaciones personales (familia, pareja, amistades)' },
    { id: 'relaciones_laborales', label: 'Relaciones laborales o estudios' },
    { id: 'tiempo_libre', label: 'Tiempo libre y actividades que te nutren' },
    { id: 'salud', label: 'Salud física y mental (descanso, alimentación, emociones)' },
    { id: 'dinero', label: 'Manejo del dinero y decisiones económicas' },
    { id: 'entorno', label: 'Cuidado del entorno (hogar, espacio, medioambiente)' },
    { id: 'espiritualidad', label: 'Espiritualidad o vida interior (creencias, valores, conexión personal)' },
    { id: 'prioridades', label: 'Uso del tiempo y prioridades diarias' },
    { id: 'comunicacion', label: 'Comunicación con los demás' },
    { id: 'compromiso_social', label: 'Compromiso social o ético (si aplica)' },
];

export function CoherenceCompassExercise({ content, pathId }: CoherenceCompassExerciseProps) {
    const [step, setStep] = useState(0);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [aligned, setAligned] = useState({ area1: '', reason1: '', emotion1: '', area2: '', reason2: '', emotion2: '' });
    const [disconnected, setDisconnected] = useState({ area: '', reason: '', action: '' });

    const handleRatingChange = (id: string, value: number[]) => {
        setRatings(prev => ({...prev, [id]: value[0]}));
    };

    const next = () => setStep(p => p + 1);

    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <div className="p-4 text-center space-y-4">
                        <p>A veces sentimos que estamos viviendo según nuestros valores... y otras veces, como si lleváramos el piloto automático. Este ejercicio te ayudará a ver con más claridad dónde estás alineada/o contigo misma/o… y dónde quizás no tanto.</p>
                        <Button onClick={next}>Empezar mi brújula <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: Explora tus áreas clave</h4>
                        <p className="text-sm text-muted-foreground">En cada una, piensa si lo que piensas, sientes y haces está en sintonía. Marca del 1 (muy baja coherencia) al 5 (muy alta coherencia).</p>
                        {areas.map(area => (
                            <div key={area.id} className="space-y-2">
                                <Label htmlFor={area.id}>{area.label}: {ratings[area.id] || 'N/A'}</Label>
                                <Slider id={area.id} value={[ratings[area.id] || 3]} onValueChange={(v) => handleRatingChange(area.id, v)} min={1} max={5} step={1} />
                            </div>
                        ))}
                        <Button onClick={next} className="w-full">Siguiente</Button>
                    </div>
                );
            case 2:
                 return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: Selecciona tus dos zonas de mayor alineación</h4>
                        <p className="text-sm text-muted-foreground">Observa tus puntuaciones. ¿En qué dos áreas sientes más coherencia?</p>
                        <div className="space-y-2"><Label>¿Qué estás haciendo bien en ellas?</Label><Textarea value={aligned.reason1} onChange={e => setAligned(p => ({...p, reason1: e.target.value}))}/></div>
                        <div className="space-y-2"><Label>¿Qué emociones te despierta vivir en coherencia ahí?</Label><Textarea value={aligned.emotion1} onChange={e => setAligned(p => ({...p, emotion1: e.target.value}))}/></div>
                        <Button onClick={next} className="w-full">Siguiente</Button>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Detecta una zona de desconexión</h4>
                         <p className="text-sm text-muted-foreground">Ahora identifica una de las áreas donde sientes más contradicción o conflicto interno.</p>
                        <div className="space-y-2"><Label>¿Qué crees que te impide ser más coherente ahí?</Label><Textarea value={disconnected.reason} onChange={e => setDisconnected(p => ({...p, reason: e.target.value}))}/></div>
                        <div className="space-y-2"><Label>¿Qué pequeño gesto podrías dar para ser un poco más coherente?</Label><Textarea value={disconnected.action} onChange={e => setDisconnected(p => ({...p, action: e.target.value}))}/></div>
                        <Button onClick={next} className="w-full">Finalizar ejercicio</Button>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 text-center space-y-4">
                        <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                        <h4 className="font-semibold text-lg">Brújula Completada</h4>
                        <p className="text-sm text-muted-foreground">No necesitas respuestas perfectas ahora. Solo empezar a mirarte con más claridad y menos juicio. El primer paso hacia la coherencia es atreverte a ver.</p>
                        <Button onClick={() => setStep(0)} variant="outline">Empezar de nuevo</Button>
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
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
