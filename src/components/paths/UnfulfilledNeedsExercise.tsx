
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UnfulfilledNeedsExerciseContent } from '@/data/paths/pathTypes';

interface UnfulfilledNeedsExerciseProps {
  content: UnfulfilledNeedsExerciseContent;
  pathId: string;
}

export function UnfulfilledNeedsExercise({ content, pathId }: UnfulfilledNeedsExerciseProps) {
  const { toast } = useToast();
  const [unfulfilledAction, setUnfulfilledAction] = useState('');
  const [associatedValue, setAssociatedValue] = useState('');
  const [reason, setReason] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!unfulfilledAction || !associatedValue || !reason || !tomorrowPlan) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los campos.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Acción que me habría hecho bien hoy:*
${unfulfilledAction}

*Valor asociado:*
${associatedValue}

*¿Qué me impidió hacerlo?:*
${reason}

*Plan para mañana:*
${tomorrowPlan}
    `;
    addNotebookEntry({ title: `Micropráctica: Necesidades No Atendidas`, content: notebookContent, pathId });
    toast({ title: "Reflexión Guardada", description: "Tu reflexión ha sido guardada en el cuaderno." });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-sm text-muted-foreground">Identifica una pequeña acción que hoy no hiciste y que sabes que te habría hecho bien.</p>
          <div className="space-y-2">
            <Label htmlFor="unfulfilled-action">Acción que me habría hecho bien:</Label>
            <Textarea id="unfulfilled-action" value={unfulfilledAction} onChange={e => setUnfulfilledAction(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assoc-value">¿Qué valor estaba asociado a eso que postergaste?</Label>
            <Textarea id="assoc-value" value={associatedValue} onChange={e => setAssociatedValue(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">¿Qué te impidió hacerlo? (miedo, prisa, presión, distracción)</Label>
            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tomorrow-plan">¿Qué puedes hacer mañana para protegerlo mejor?</Label>
            <Textarea id="tomorrow-plan" value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} disabled={isSaved} />
          </div>
           {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Reflexión</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu reflexión ha sido guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
