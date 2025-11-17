
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PlanABExerciseContent } from '@/data/paths/pathTypes';

interface PlanABExerciseProps {
  content: PlanABExerciseContent;
  pathId: string;
}

export function PlanABExercise({ content, pathId }: PlanABExerciseProps) {
  const { toast } = useToast();
  const [decision, setDecision] = useState('');
  const [planA, setPlanA] = useState({ action: '', value: '', outcome: '' });
  const [planB, setPlanB] = useState({ fear: '', strategy: '', support: '', phrase: '' });
  const [commitment, setCommitment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || !planA.action.trim() || !planB.fear.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa al menos la decisión y los planes A y B.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a tomar:**
${decision}

---
**Plan A (Paso con intención):**
* Acción: ${planA.action}
* Valor: ${planA.value}
* Resultado esperado: ${planA.outcome}

---
**Plan B (Red de cuidado emocional):**
* Miedo principal: ${planB.fear}
* Estrategia de cuidado: ${planB.strategy}
* Apoyo disponible: ${planB.support}
* Frase de contención: "${planB.phrase}"

---
**Mi compromiso realista:**
${commitment}
    `;

    addNotebookEntry({ title: 'Mi Plan A/B Emocional', content: notebookContent, pathId: pathId });
    toast({ title: 'Plan Guardado', description: 'Tu plan A/B se ha guardado en el cuaderno.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="decision">Describe en una frase clara la decisión que estás enfrentando.</Label>
            <Textarea id="decision" value={decision} onChange={e => setDecision(e.target.value)} disabled={isSaved} />
          </div>
          <div className="p-4 border rounded-md bg-background">
            <h4 className="font-semibold text-primary">Plan A – ¿Qué harás?</h4>
            <div className="space-y-2 mt-2">
              <Label htmlFor="planA-action">Acción concreta</Label>
              <Textarea id="planA-action" value={planA.action} onChange={e => setPlanA(p => ({ ...p, action: e.target.value }))} disabled={isSaved} />
              <Label htmlFor="planA-value">Valor asociado</Label>
              <Textarea id="planA-value" value={planA.value} onChange={e => setPlanA(p => ({ ...p, value: e.target.value }))} disabled={isSaved} />
              <Label htmlFor="planA-outcome">Resultado deseado</Label>
              <Textarea id="planA-outcome" value={planA.outcome} onChange={e => setPlanA(p => ({ ...p, outcome: e.target.value }))} disabled={isSaved} />
            </div>
          </div>
          <div className="p-4 border rounded-md bg-background">
            <h4 className="font-semibold text-primary">Plan B – ¿Cómo te cuidarás si no sale como esperas?</h4>
            <div className="space-y-2 mt-2">
              <Label htmlFor="planB-fear">¿Qué es lo que más temes que ocurra?</Label>
              <Textarea id="planB-fear" value={planB.fear} onChange={e => setPlanB(p => ({ ...p, fear: e.target.value }))} disabled={isSaved} />
              <Label htmlFor="planB-strategy">¿Qué harías si eso sucede?</Label>
              <Textarea id="planB-strategy" value={planB.strategy} onChange={e => setPlanB(p => ({ ...p, strategy: e.target.value }))} disabled={isSaved} />
              <Label htmlFor="planB-support">¿A quién podrías acudir?</Label>
              <Textarea id="planB-support" value={planB.support} onChange={e => setPlanB(p => ({ ...p, support: e.target.value }))} disabled={isSaved} />
              <Label htmlFor="planB-phrase">¿Qué frase o imagen podrías recordarte para sostenerte?</Label>
              <Textarea id="planB-phrase" value={planB.phrase} onChange={e => setPlanB(p => ({ ...p, phrase: e.target.value }))} disabled={isSaved} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="commitment">¿Qué paso pequeño y concreto vas a dar en los próximos días para poner en marcha este plan?</Label>
            <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Plan</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu plan ha sido guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
