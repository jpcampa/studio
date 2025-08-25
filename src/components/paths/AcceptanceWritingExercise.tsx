
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AcceptanceWritingExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface AcceptanceWritingExerciseProps {
  content: AcceptanceWritingExerciseContent;
  pathId: string;
}

export function AcceptanceWritingExercise({ content, pathId }: AcceptanceWritingExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [fact, setFact] = useState('');
  const [emotion, setEmotion] = useState('');
  const [dialogue, setDialogue] = useState('');
  const [judgment, setJudgment] = useState('');
  const [response, setResponse] = useState('');
  const [compassionPhrase, setCompassionPhrase] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Hecho objetivo:*
${fact}

*Emoción(es) sentida(s):*
${emotion}

*Diálogo interno:*
"${dialogue}"

*Hecho vs. Juicio:*
${judgment}

*Respuesta actual:*
${response}

*Frase de cierre compasivo:*
"${compassionPhrase}"
    `;
    addNotebookEntry({ title: 'Ejercicio de Aceptación Escrita', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu reflexión ha sido guardada en el cuaderno.' });
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
            <Label htmlFor="fact">Describe objetivamente lo que pasó</Label>
            <Textarea id="fact" value={fact} onChange={e => setFact(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emotion-acceptance">Selecciona la emoción que sentiste</Label>
            <Select onValueChange={setEmotion} value={emotion} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
              <SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialogue">Escribe tu diálogo interno</Label>
            <Textarea id="dialogue" value={dialogue} onChange={e => setDialogue(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="judgment">Anota qué partes son hechos y cuáles son juicios</Label>
            <Textarea id="judgment" value={judgment} onChange={e => setJudgment(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Escribe tu respuesta o acción actual</Label>
            <Textarea id="response" value={response} onChange={e => setResponse(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compassion-phrase">Escribe tu frase de cierre compasivo</Label>
            <Textarea id="compassion-phrase" value={compassionPhrase} onChange={e => setCompassionPhrase(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Autorregistro</Button>
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
