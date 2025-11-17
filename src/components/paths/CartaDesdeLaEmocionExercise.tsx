
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CartaDesdeLaEmocionExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface CartaDesdeLaEmocionExerciseProps {
  content: CartaDesdeLaEmocionExerciseContent;
  pathId: string;
}

export function CartaDesdeLaEmocionExercise({ content, pathId }: CartaDesdeLaEmocionExerciseProps) {
    const { toast } = useToast();
    const t = useTranslations();
    const [step, setStep] = useState(0);
    const [emotion, setEmotion] = useState('');
    const [otherEmotion, setOtherEmotion] = useState('');
    const [tone, setTone] = useState('');
    const [need, setNeed] = useState('');
    const [letterBody, setLetterBody] = useState('');
    
    const finalEmotion = emotion === 'otra' ? otherEmotion : (emotionOptions.find(e => e.value === emotion)?.labelKey ? t[emotionOptions.find(e => e.value === emotion)!.labelKey as keyof typeof t] : emotion);

    const handleSave = () => {
        const fullLetter = `
Hola, soy tu emoción: ${finalEmotion}
Aparezco porque hay algo en ti que te importa mucho… y no está siendo cuidado como necesita.
Lo que realmente estás necesitando ahora es: ${need}
No vengo a hacerte daño. Estoy aquí para ayudarte a mirar hacia dentro. Quiero que sepas que te estoy protegiendo, aunque a veces no sepa cómo expresarme.
Me gustaría que me escucharas sin miedo. Solo necesito un espacio para ser vista, sentida y comprendida.
${letterBody}
Con cariño,
Tu emoción: ${finalEmotion}
        `;
        addNotebookEntry({ title: `Carta desde mi ${finalEmotion}`, content: fullLetter, pathId: pathId });
        toast({ title: 'Carta Guardada' });
    };
    
    const renderStep = () => {
        switch(step) {
            case 0: return <div className="p-4 space-y-4"><Label>¿Qué emoción te está pidiendo ser escuchada hoy?</Label><Select value={emotion} onValueChange={setEmotion}><SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger><SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>{emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} /> }<Button onClick={() => setStep(1)} className="w-full mt-2">Siguiente</Button></div>;
            case 1: return <div className="p-4 space-y-4"><Label>¿En qué tono quieres escribir esta carta?</Label><Select value={tone} onValueChange={setTone}><SelectTrigger><SelectValue placeholder="Elige un tono..." /></SelectTrigger><SelectContent><SelectItem value="compasivo">Compasivo y suave</SelectItem><SelectItem value="firme">Claro, firme y directo</SelectItem><SelectItem value="sereno">Sereno y tranquilizador</SelectItem></SelectContent></Select><Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente</Button></div>;
            case 2: return <div className="p-4 space-y-4"><Label>Lo que realmente estás necesitando ahora es...</Label><Textarea value={need} onChange={e => setNeed(e.target.value)} /><Label>Cuerpo de la carta (opcional):</Label><Textarea value={letterBody} onChange={e => setLetterBody(e.target.value)} /><Button onClick={handleSave} className="w-full mt-2"><Save className="mr-2 h-4 w-4"/>Guardar Carta</Button></div>;
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
