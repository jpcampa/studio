"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { EthicalMirrorExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';

interface EthicalMirrorExerciseProps {
  content: EthicalMirrorExerciseContent;
  pathId: string;
}

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

export function EthicalMirrorExercise({ content, pathId }: EthicalMirrorExerciseProps) {
    const [step, setStep] = useState(0);
    const [decision, setDecision] = useState('');
    const [person, setPerson] = useState('');
    const [otherPerson, setOtherPerson] = useState('');
    const [explanation, setExplanation] = useState('');
    const [values, setValues] = useState<Record<string, boolean>>({});
    const [isProud, setIsProud] = useState(false);
    const [reflectsWhoIAm, setReflectsWhoIAm] = useState(false);
    const [coherence, setCoherence] = useState(5);
    const [adjustment, setAdjustment] = useState('');
    const {toast} = useToast();

    const handleSave = () => {
        const selectedValues = Object.keys(values).filter(k => values[k]);
        const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a explorar:** ${decision}
**Persona espejo:** ${person === 'Otra' ? otherPerson : person}
**Explicación:** ${explanation}
**Valores en juego:** ${selectedValues.join(', ')}
**Nivel de coherencia:** ${coherence}/10
**Ajuste necesario:** ${adjustment || 'Ninguno.'}
        `;
        addNotebookEntry({ title: 'Reflexión: Espejo Ético', content: notebookContent, pathId });
        toast({title: "Reflexión Guardada"});
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="p-4 space-y-2">
                        <Label>¿Qué decisión estás valorando?</Label>
                        <Textarea value={decision} onChange={e => setDecision(e.target.value)} />
                        <Button onClick={() => setStep(1)} className="w-full">Siguiente</Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-2">
                        <Label>¿A quién se lo explicarías?</Label>
                        <Select value={person} onValueChange={setPerson}>
                            <SelectTrigger><SelectValue placeholder="Elige..."/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                                <SelectItem value="Familiar">Familiar</SelectItem>
                                <SelectItem value="Mentor/a">Mentor/a</SelectItem>
                                <SelectItem value="Mi yo futuro">“Mi yo futuro”</SelectItem>
                                <SelectItem value="Otra">Otra</SelectItem>
                            </SelectContent>
                        </Select>
                        {person === 'Otra' && <Textarea value={otherPerson} onChange={e => setOtherPerson(e.target.value)} />}
                        <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
                    </div>
                );
            case 2:
                return (
                     <div className="p-4 space-y-2">
                        <Label>Escribe tu explicación</Label>
                        <Textarea value={explanation} onChange={e => setExplanation(e.target.value)} />
                        <Label>Valores implicados</Label>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {valuesList.map(v => (
                                <div key={v} className="flex items-center space-x-2">
                                    <Checkbox id={v} checked={!!values[v]} onCheckedChange={c => setValues(p => ({...p, [v]: !!c}))} />
                                    <Label htmlFor={v} className="font-normal text-xs">{v}</Label>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
                     </div>
                );
            case 3:
                return(
                    <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isProud" checked={isProud} onCheckedChange={c => setIsProud(!!c)} />
                            <Label htmlFor="isProud">Me sentiría orgulloso/a de dar esta explicación.</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="reflects" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} />
                            <Label htmlFor="reflects">Refleja quién soy y lo que quiero ser.</Label>
                        </div>
                        <div>
                            <Label>Nivel de coherencia: {coherence}/10</Label>
                            <Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} />
                        </div>
                         <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 space-y-2">
                        <Label>Si algo no encaja, ¿qué cambiarías para sentirte en paz con la decisión?</Label>
                        <Textarea value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar</Button>
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

    