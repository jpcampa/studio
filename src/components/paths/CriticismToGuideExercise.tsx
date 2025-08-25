
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CriticismToGuideExerciseContent } from '@/data/paths/pathTypes';

interface CriticismToGuideExerciseProps {
  content: CriticismToGuideExerciseContent;
  pathId: string;
}

export function CriticismToGuideExercise({ content, pathId }: CriticismToGuideExerciseProps) {
  const { toast } = useToast();
  const [criticalPhrase, setCriticalPhrase] = useState('');
  const [hiddenObjective, setHiddenObjective] = useState('');
  const [reformulatedPhrase, setReformulatedPhrase] = useState('');
  const [checklist, setChecklist] = useState({ helps: false, respects: false, energizes: false });
  const [isSaved, setIsSaved] = useState(false);

  const objectiveOptions = [
    'Mejorar un resultado.', 'Evitar un error.', 'Ganar aprobación o reconocimiento.', 'Cumplir con mis valores o principios.',
    'Evitar que me rechacen o critiquen.', 'Protegerme de una decepción.', 'Sentirme seguro/a antes de actuar.', 'Demostrar que soy capaz.',
    'Mantener el control de la situación.', 'Prevenir que vuelva a ocurrir algo desagradable.', 'Evitar perder una oportunidad.',
    'Mantener una buena imagen de mí ante los demás.', 'Evitar hacer daño a alguien.', 'Cumplir con lo que creo que “debería” hacer.'
  ];

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi frase crítica:*
"${criticalPhrase}"

*El objetivo oculto era:*
${hiddenObjective}

*Mi frase reformulada como guía:*
"${reformulatedPhrase}"
    `;
    addNotebookEntry({ title: 'Transformación de Crítica a Guía', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación ha sido guardada.' });
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
            <Label htmlFor="critical-phrase">Escribe aquí tu frase crítica</Label>
            <Textarea id="critical-phrase" value={criticalPhrase} onChange={e => setCriticalPhrase(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hidden-objective">Selecciona cuál crees que es el objetivo oculto</Label>
            <Select onValueChange={setHiddenObjective} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un objetivo..." /></SelectTrigger>
              <SelectContent>
                {objectiveOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                <SelectItem value="otro">Otro...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformulated-phrase">Escribe aquí tu frase reformulada</Label>
            <Textarea id="reformulated-phrase" value={reformulatedPhrase} onChange={e => setReformulatedPhrase(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label>Revisión y anclaje</Label>
            <div className="flex items-center space-x-2"><Checkbox id="c1" onCheckedChange={c => setChecklist(p => ({...p, helps: !!c}))} disabled={isSaved} /><Label htmlFor="c1" className="font-normal">Me ayuda a mejorar</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="c2" onCheckedChange={c => setChecklist(p => ({...p, respects: !!c}))} disabled={isSaved} /><Label htmlFor="c2" className="font-normal">Me habla con respeto</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="c3" onCheckedChange={c => setChecklist(p => ({...p, energizes: !!c}))} disabled={isSaved} /><Label htmlFor="c3" className="font-normal">Me deja con energía para actuar</Label></div>
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Frase Guía</Button>
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
