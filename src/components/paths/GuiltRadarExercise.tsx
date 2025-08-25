
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { GuiltRadarExerciseContent } from '@/data/paths/pathTypes';

interface GuiltRadarExerciseProps {
  content: GuiltRadarExerciseContent;
  pathId: string;
}

export function GuiltRadarExercise({ content, pathId }: GuiltRadarExerciseProps) {
  const { toast } = useToast();
  const [situation, setSituation] = useState('');
  const [internalPhrase, setInternalPhrase] = useState('');
  const [controlLevel, setControlLevel] = useState<'total' | 'partial' | 'none' | ''>('');
  const [responseAction, setResponseAction] = useState('');
  const [learning, setLearning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación que me generó culpa:*
${situation}

*Mi frase interna fue:*
"${internalPhrase}"

*Nivel de control real:*
${controlLevel}

*Mi respuesta/acción elegida:*
${responseAction}

*Aprendizaje y cuidado para la próxima vez:*
${learning}
    `;
    addNotebookEntry({ title: 'Mi Radar de Culpa', content: notebookContent, pathId });
    toast({ title: 'Radar Guardado', description: 'Tu radar de culpa ha sido guardado.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="situation-guilt">Describe brevemente la situación</Label>
            <Textarea id="situation-guilt" value={situation} onChange={e => setSituation(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internal-phrase">Escribe tu frase interna</Label>
            <Textarea id="internal-phrase" value={internalPhrase} onChange={e => setInternalPhrase(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label>Evalúa el control real</Label>
            <RadioGroup value={controlLevel} onValueChange={v => setControlLevel(v as any)} disabled={isSaved}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="total" id="ctrl-total" /><Label htmlFor="ctrl-total" className="font-normal">Estaba totalmente bajo mi control</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="partial" id="ctrl-partial" /><Label htmlFor="ctrl-partial" className="font-normal">Parcialmente: una parte sí y otra no</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="ctrl-none" /><Label htmlFor="ctrl-none" className="font-normal">No estaba bajo mi control</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="response-action">Decide tu respuesta y/o acción</Label>
            <Textarea id="response-action" value={responseAction} onChange={e => setResponseAction(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="learning-guilt">Escribe tu aprendizaje y plan para la próxima vez</Label>
            <Textarea id="learning-guilt" value={learning} onChange={e => setLearning(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Radar</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
