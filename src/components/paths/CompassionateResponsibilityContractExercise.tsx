
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CompassionateResponsibilityContractExerciseContent } from '@/data/paths/pathTypes';

interface CompassionateResponsibilityContractExerciseProps {
  content: CompassionateResponsibilityContractExerciseContent;
  pathId: string;
}

export function CompassionateResponsibilityContractExercise({ content, pathId }: CompassionateResponsibilityContractExerciseProps) {
  const { toast } = useToast();
  const [initialCommitment, setInitialCommitment] = useState('');
  const [howToTalk, setHowToTalk] = useState('');
  const [howToRespond, setHowToRespond] = useState('');
  const [signature, setSignature] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi compromiso inicial:*
${initialCommitment}

*Cómo quiero hablarme cuando me equivoque:*
${howToTalk}

*Cómo quiero responder ante mis decisiones:*
${howToRespond}

*Firma del contrato:*
${signature}
    `;
    addNotebookEntry({ title: 'Mi Contrato de Autorresponsabilidad Compasiva', content: notebookContent, pathId: pathId });
    toast({ title: 'Contrato Guardado', description: 'Tu contrato ha sido guardado.' });
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
            <Label htmlFor="initial-commitment">Escribe aquí tu frase de compromiso inicial</Label>
            <Textarea id="initial-commitment" value={initialCommitment} onChange={e => setInitialCommitment(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="how-to-talk">Describe aquí cómo quieres hablarte cuando cometas un error</Label>
            <Textarea id="how-to-talk" value={howToTalk} onChange={e => setHowToTalk(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="how-to-respond">Escribe aquí cómo quieres responder ante tus decisiones</Label>
            <Textarea id="how-to-respond" value={howToRespond} onChange={e => setHowToRespond(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature">Escribe tu firma o iniciales para sellar tu contrato</Label>
            <Textarea id="signature" value={signature} onChange={e => setSignature(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Contrato</Button>
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
