
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { AnsiedadTieneSentidoExerciseContent } from '@/data/paths/pathTypes';
import { Edit3 } from 'lucide-react';

interface AnsiedadTieneSentidoExerciseProps {
  content: AnsiedadTieneSentidoExerciseContent;
  pathId: string;
}

export function AnsiedadTieneSentidoExercise({ content, pathId }: AnsiedadTieneSentidoExerciseProps) {
    const [step, setStep] = useState(0);
    const [situation, setSituation] = useState('');
    const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});
    const [otherSymptom, setOtherSymptom] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [initialThreat, setInitialThreat] = useState('');
    const [fearOfAnxiety, setFearOfAnxiety] = useState('');
    const [finalAction, setFinalAction] = useState('');

    const symptomOptions = [
        { id: 'symptom-palpitations', label: 'Palpitaciones o taquicardia' },
        { id: 'symptom-sweating', label: 'Sudoración excesiva' },
        { id: 'symptom-breathing', label: 'Respiración rápida o sensación de falta de aire' },
        { id: 'symptom-dizziness', label: 'Mareo, inestabilidad o sensación de desmayo' },
        { id: 'symptom-tension', label: 'Tensión muscular o rigidez' },
        { id: 'symptom-stomach', label: 'Nudo en el estómago o molestias digestivas' },
        { id: 'symptom-chills', label: 'Escalofríos o sensación de calor repentino' },
        { id: 'symptom-tingling', label: 'Hormigueos o entumecimiento en manos/pies' },
        { id: 'symptom-dry-mouth', label: 'Sequedad de boca' },
        { id: 'symptom-chest-pressure', label: 'Sensación de opresión en el pecho' },
        { id: 'symptom-trembling', label: 'Temblores o sacudidas visibles' },
        { id: 'symptom-urinate', label: 'Ganas frecuentes de orinar' },
        { id: 'symptom-headache', label: 'Dolor de cabeza o presión en la frente' },
        { id: 'symptom-concentration', label: 'Dificultad para concentrarte o “mente en blanco”' },
    ];
    
    const renderStep = () => {
        switch(step) {
            case 0: return <div className="p-4"><Label>Describe brevemente la situación (solo hechos, sin interpretaciones):</Label><Textarea value={situation} onChange={e => setSituation(e.target.value)} /><Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button></div>;
            case 1: return <div className="p-4 space-y-2"><Label>Señales del cuerpo y de la mente:</Label>{symptomOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><Checkbox id={opt.id} onCheckedChange={c => setSymptoms(p => ({...p, [opt.id]: !!c}))} /><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}<div className="flex items-center space-x-2"><Checkbox id="symptom-other" onCheckedChange={c => setSymptoms(p => ({...p, 'symptom-other': !!c}))} /><Label htmlFor="symptom-other" className="font-normal">Otro:</Label></div>{symptoms['symptom-other'] && <Textarea value={otherSymptom} onChange={e => setOtherSymptom(e.target.value)} />}<Label>Escribe los pensamientos que aparecieron:</Label><Textarea value={thoughts} onChange={e => setThoughts(e.target.value)} /><Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente</Button></div>;
            case 2: return <div className="p-4"><Label>Identifica el pensamiento inicial de amenaza:</Label><Textarea value={initialThreat} onChange={e => setInitialThreat(e.target.value)} /><Button onClick={() => setStep(3)} className="w-full mt-2">Siguiente</Button></div>;
            case 3: 
                const selectedSymptoms = symptomOptions.filter(s => symptoms[s.id]).map(s => s.label);
                if (symptoms['symptom-other'] && otherSymptom) selectedSymptoms.push(otherSymptom);
                return (
                    <div className="p-4 space-y-2">
                        <h4>Reconstruye el círculo de la ansiedad:</h4>
                        <p><strong>Situación:</strong> {situation}</p>
                        <p><strong>Pensamiento amenazante inicial:</strong> {initialThreat}</p>
                        <p><strong>Síntomas:</strong> {selectedSymptoms.join(', ')}</p>
                        <p><strong>Interpretación de los síntomas:</strong> {thoughts}</p>
                        <div><Label>Efecto final (qué hiciste/sentiste):</Label><Textarea value={finalAction} onChange={e => setFinalAction(e.target.value)} /></div>
                        <Button onClick={() => setStep(4)} className="w-full mt-2">Ver Cierre</Button>
                    </div>
                );
            case 4: return <div className="p-4 text-center"><p>Muy bien, acabas de trazar el mapa de tu ansiedad. Esto te ayuda a ver que no aparece “porque sí”: hay una secuencia clara. Cuanto más practiques este registro, más fácil será detectar el momento clave donde puedes intervenir para frenar el círculo.</p><p className="italic mt-2">“Tu ansiedad tiene un sentido. Al reconocer el círculo, recuperas poco a poco el control.”</p></div>;
            default: return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}</CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}

    