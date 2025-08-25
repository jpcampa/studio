
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { VisualizacionGuiadaCuerpoAnsiedadExerciseContent } from '@/data/paths/pathTypes';
import { Edit3 } from 'lucide-react';

interface VisualizacionGuiadaCuerpoAnsiedadExerciseProps {
  content: VisualizacionGuiadaCuerpoAnsiedadExerciseContent;
  pathId: string;
}

export function VisualizacionGuiadaCuerpoAnsiedadExercise({ content, pathId }: VisualizacionGuiadaCuerpoAnsiedadExerciseProps) {
    const [step, setStep] = useState(0);
    const [breathing, setBreathing] = useState('');
    const [heart, setHeart] = useState('');
    const [stomachHead, setStomachHead] = useState({ stomach: '', head: '' });
    const [acceptancePhrase, setAcceptancePhrase] = useState('');
    const [wavePhrase, setWavePhrase] = useState('');

    const renderStep = () => {
        switch (step) {
            case 0: return <div className="p-4 text-center"><p>En este ejercicio vas a explorar tu cuerpo para mirar tus sensaciones con calma, sin añadirles interpretaciones de peligro. Piensa en ti como un explorador curioso.</p><Button onClick={() => setStep(1)} className="w-full mt-2">Comenzar visualización</Button></div>;
            case 1: return <div className="p-4 space-y-2"><Label>Escanea tu respiración. ¿Cómo la sientes ahora mismo?</Label><RadioGroup value={breathing} onValueChange={setBreathing}><RadioGroupItem value="normal" id="b-normal" /><Label htmlFor="b-normal">Normal</Label><RadioGroupItem value="rapida" id="b-rapida" /><Label htmlFor="b-rapida">Rápida</Label><RadioGroupItem value="superficial" id="b-superficial" /><Label htmlFor="b-superficial">Superficial</Label><RadioGroupItem value="presion" id="b-presion" /><Label htmlFor="b-presion">Con presión en el pecho</Label></RadioGroup><Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente</Button></div>;
            case 2: return <div className="p-4 space-y-2"><Label>Escucha tu corazón. ¿Cómo lo percibes?</Label><RadioGroup value={heart} onValueChange={setHeart}><RadioGroupItem value="normal" id="h-normal" /><Label htmlFor="h-normal">Normal</Label><RadioGroupItem value="rapido" id="h-rapido" /><Label htmlFor="h-rapido">Muy rápido (taquicardia)</Label><RadioGroupItem value="fuerte" id="h-fuerte" /><Label htmlFor="h-fuerte">Fuerte, como si se notara en todo el cuerpo</Label><RadioGroupItem value="irregular" id="h-irregular" /><Label htmlFor="h-irregular">Irregular o con saltos</Label></RadioGroup><Button onClick={() => setStep(3)} className="w-full mt-2">Siguiente</Button></div>;
            case 3: return <div className="p-4 space-y-2"><Label>Explora el estómago y la cabeza.</Label><div><Label>En el estómago, noto principalmente:</Label><Textarea value={stomachHead.stomach} onChange={e => setStomachHead(p => ({...p, stomach: e.target.value}))} /></div><div><Label>En la cabeza, siento:</Label><Textarea value={stomachHead.head} onChange={e => setStomachHead(p => ({...p, head: e.target.value}))} /></div><Button onClick={() => setStep(4)} className="w-full mt-2">Siguiente</Button></div>;
            case 4: return <div className="p-4"><Label>Nómbralo sin luchar. Escribe una frase que lo resuma.</Label><Textarea value={acceptancePhrase} onChange={e => setAcceptancePhrase(e.target.value)} placeholder="Ej: Mi corazón late fuerte, tengo un nudo en el estómago..." /><Button onClick={() => setStep(5)} className="w-full mt-2">Siguiente</Button></div>;
            case 5: return <div className="p-4"><Label>Imagina la ola. Escribe una frase que te ayude a recordarlo en el futuro.</Label><Textarea value={wavePhrase} onChange={e => setWavePhrase(e.target.value)} placeholder="Ej: Mi ansiedad es una ola: viene y se va." /><Button onClick={() => setStep(6)} className="w-full mt-2">Ver Cierre</Button></div>;
            case 6: return <div className="p-4 text-center"><p>Muy bien. Hoy has practicado observar tu ansiedad en el cuerpo sin huir de ella. Cuanto más te entrenes, más descubrirás que las sensaciones, aunque molestas, no te dañan.</p><p className="italic mt-2">“Tu cuerpo grita con la ansiedad, pero tú puedes aprender a escucharlo sin miedo. Cada vez que lo haces, la ola pierde fuerza.”</p></div>;
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

    