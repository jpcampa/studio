
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
import type { InfluenceWheelExerciseContent } from '@/data/paths/pathTypes';

interface InfluenceWheelExerciseProps {
  content: InfluenceWheelExerciseContent;
  pathId: string;
}

interface Situation {
  text: string;
  control: 'mine' | 'not_mine' | 'partial' | '';
}

export function InfluenceWheelExercise({ content, pathId }: InfluenceWheelExerciseProps) {
  const { toast } = useToast();
  const [situations, setSituations] = useState<Situation[]>(Array(5).fill({ text: '', control: '' }));
  const [actions, setActions] = useState<Record<number, string>>({});
  const [release, setRelease] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleSituationTextChange = (index: number, text: string) => {
    const newSituations = [...situations];
    newSituations[index].text = text;
    setSituations(newSituations);
  };
  
  const handleControlChange = (index: number, value: 'mine' | 'not_mine' | 'partial') => {
    const newSituations = [...situations];
    newSituations[index].control = value;
    setSituations(newSituations);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    situations.forEach((sit, index) => {
      if (sit.text.trim()) {
        notebookContent += `**Situación ${index + 1}:** ${sit.text} (Control: ${sit.control})\n`;
        if (sit.control === 'mine' || sit.control === 'partial') {
          notebookContent += `- Acción concreta: ${actions[index] || 'No especificada.'}\n`;
        }
        if (sit.control === 'not_mine' || sit.control === 'partial') {
          notebookContent += `- Forma de soltar: ${release[index] || 'No especificada.'}\n`;
        }
        notebookContent += '\n';
      }
    });
    addNotebookEntry({ title: 'Mi Rueda de Influencia', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu rueda de influencia ha sido guardada.' });
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
          <p className="text-sm">Piensa en los últimos 7 días y anota situaciones que te han preocupado, estresado o hecho sentir responsable.</p>
          {situations.map((sit, index) => (
            <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
              <Label htmlFor={`sit-${index}`}>Situación {index + 1}</Label>
              <Textarea id={`sit-${index}`} value={sit.text} onChange={e => handleSituationTextChange(index, e.target.value)} disabled={isSaved} />
              <RadioGroup value={sit.control} onValueChange={v => handleControlChange(index, v as any)} disabled={isSaved}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="mine" id={`c-${index}-m`} /><Label htmlFor={`c-${index}-m`} className="font-normal">Depende de mí</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="not_mine" id={`c-${index}-n`} /><Label htmlFor={`c-${index}-n`} className="font-normal">No depende de mí</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="partial" id={`c-${index}-p`} /><Label htmlFor={`c-${index}-p`} className="font-normal">Depende parcialmente</Label></div>
              </RadioGroup>
              {(sit.control === 'mine' || sit.control === 'partial') && (
                <div><Label>Acción concreta:</Label><Textarea value={actions[index] || ''} onChange={e => setActions(p => ({...p, [index]: e.target.value}))} /></div>
              )}
              {(sit.control === 'not_mine' || sit.control === 'partial') && (
                <div><Label>Forma de soltar:</Label><Textarea value={release[index] || ''} onChange={e => setRelease(p => ({...p, [index]: e.target.value}))} /></div>
              )}
            </div>
          ))}
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Rueda</Button>
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
