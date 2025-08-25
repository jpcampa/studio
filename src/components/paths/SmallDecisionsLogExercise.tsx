"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SmallDecisionsLogExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';

interface SmallDecisionsLogExerciseProps {
  content: SmallDecisionsLogExerciseContent;
  pathId: string;
}

interface DecisionLog {
    decision: string;
    choiceType: 'querer' | 'deber' | 'mixto' | '';
    reason: string;
    aftermath: string;
    nextTime: string;
}

export function SmallDecisionsLogExercise({ content, pathId }: SmallDecisionsLogExerciseProps) {
    const { toast } = useToast();
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState<DecisionLog[]>(Array(2).fill({ decision: '', choiceType: '', reason: '', aftermath: '', nextTime: ''}));

    const handleLogChange = (index: number, field: keyof DecisionLog, value: string) => {
        const newLogs = [...logs];
        (newLogs[index] as any)[field] = value;
        setLogs(newLogs);
    };

    const handleSave = () => {
        const filledLogs = logs.filter(log => log.decision.trim() !== '');
        if (filledLogs.length === 0) {
            toast({ title: "Sin decisiones", description: "Anota al menos una decisión para guardar el registro.", variant: 'destructive'});
            return;
        }

        let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
        filledLogs.forEach((log, index) => {
            notebookContent += `**Decisión ${index + 1}:** ${log.decision}\n`;
            notebookContent += `- Elegí desde: ${log.choiceType}\n`;
            notebookContent += `- Razón: ${log.reason}\n`;
            notebookContent += `- Cómo me sentí: ${log.aftermath}\n`;
            notebookContent += `- Próxima vez: ${log.nextTime}\n\n`;
        });
        addNotebookEntry({ title: 'Registro de Decisiones Pequeñas', content: notebookContent, pathId });
        toast({ title: 'Registro Guardado' });
        setStep(2);
    };

    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <div className="p-4 text-center space-y-4">
                        <p>Cada día tomas cientos de decisiones. Algunas pequeñas, otras grandes… pero muchas de ellas definen si estás siendo fiel a ti o no. En este ejercicio vas a entrenar tu mirada interna. No para juzgarte, sino para entender desde dónde eliges.</p>
                        <Button onClick={() => setStep(1)}>Comenzar mi registro <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Registra 2 decisiones de hoy</h4>
                        {logs.map((log, index) => (
                             <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                                <Label htmlFor={`decision-${index}`}>Decisión {index + 1}:</Label>
                                <Textarea id={`decision-${index}`} value={log.decision} onChange={e => handleLogChange(index, 'decision', e.target.value)} />
                                <Label>¿Actuaste desde el “querer” o el “deber”?</Label>
                                <RadioGroup value={log.choiceType} onValueChange={v => handleLogChange(index, 'choiceType', v)} className="flex gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="querer" id={`choice-${index}-q`}/><Label htmlFor={`choice-${index}-q`}>Querer</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="deber" id={`choice-${index}-d`}/><Label htmlFor={`choice-${index}-d`}>Deber</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="mixto" id={`choice-${index}-m`}/><Label htmlFor={`choice-${index}-m`}>Mixto</Label></div>
                                </RadioGroup>
                                <Label htmlFor={`reason-${index}`}>¿Qué te llevó a elegir así?</Label>
                                <Textarea id={`reason-${index}`} value={log.reason} onChange={e => handleLogChange(index, 'reason', e.target.value)} />
                                <Label htmlFor={`aftermath-${index}`}>¿Cómo te sentiste después?</Label>
                                <Textarea id={`aftermath-${index}`} value={log.aftermath} onChange={e => handleLogChange(index, 'aftermath', e.target.value)} />
                                <Label htmlFor={`nextTime-${index}`}>¿Qué harías distinto la próxima vez?</Label>
                                <Textarea id={`nextTime-${index}`} value={log.nextTime} onChange={e => handleLogChange(index, 'nextTime', e.target.value)} />
                            </div>
                        ))}
                        <Button onClick={handleSave} className="w-full">
                            <Save className="mr-2 h-4 w-4"/> Guardar Registro
                        </Button>
                    </div>
                );
            case 2:
                 return (
                    <div className="p-4 text-center space-y-4">
                        <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                        <h4 className="font-semibold text-lg">Registro Guardado</h4>
                        <p className="text-sm text-muted-foreground">Este registro no es para ser perfecto. Es para ser más consciente. A veces elegimos desde el deber. Otras, desde el querer. Lo importante es que tú puedas distinguirlo… y poco a poco recuperar la brújula.</p>
                        <Button onClick={() => { setStep(0); setLogs(Array(2).fill({ decision: '', choiceType: '', reason: '', aftermath: '', nextTime: ''})) }} variant="outline">Hacer otro registro</Button>
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
    