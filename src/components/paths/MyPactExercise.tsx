
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
import type { MyPactExerciseContent } from '@/data/paths/pathTypes';

interface MyPactExerciseProps {
  content: MyPactExerciseContent;
  pathId: string;
}

export function MyPactExercise({ content, pathId }: MyPactExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [commitment, setCommitment] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [reminder, setReminder] = useState('');
  const [anchorPhrase, setAnchorPhrase] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!commitment.trim() || !reminder.trim() || !anchorPhrase.trim()) {
      toast({ title: 'Pacto incompleto', description: 'Por favor, completa todas las secciones del pacto.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Me comprometo a cuidar:*
${commitment}

*Mi recordatorio tangible será:*
${reminder}

*Mi frase de acompañamiento emocional es:*
"${anchorPhrase}"
    `;
    addNotebookEntry({ title: 'Mi Pacto Conmigo', content: notebookContent, pathId });
    toast({ title: 'Pacto Guardado', description: 'Tu pacto contigo se ha guardado en el cuaderno.' });
    setIsSaved(true);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: ¿Qué me comprometo a cuidar?</h4>
            <Label htmlFor="commitment-pact">Piensa en una o dos prácticas o actitudes que quieras mantener vivas.</Label>
            <Textarea id="commitment-pact" value={commitment} onChange={e => setCommitment(e.target.value)} />
            <Button onClick={() => setStep(1)} className="w-full">Siguiente</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: ¿Cómo me lo recordaré?</h4>
            <Label>Elige un recordatorio concreto, algo visible, físico o cotidiano.</Label>
            <RadioGroup value={reminderType} onValueChange={setReminderType}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rutina" id="rem-routine" /><Label className="font-normal" htmlFor="rem-routine">Una rutina diaria</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="objeto" id="rem-object" /><Label className="font-normal" htmlFor="rem-object">Un objeto con significado</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nota" id="rem-note" /><Label className="font-normal" htmlFor="rem-note">Una nota o imagen visible</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="gesto" id="rem-gesture" /><Label className="font-normal" htmlFor="rem-gesture">Un gesto físico</Label></div>
            </RadioGroup>
            <Textarea value={reminder} onChange={e => setReminder(e.target.value)} placeholder={`Describe tu recordatorio de tipo "${reminderType}"`} />
            <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Una frase que me acompañe</h4>
            <Label htmlFor="anchor-phrase">¿Qué quieres decirte a ti mismo/a cuando te sientas perdido/a, agotado/a o en lucha?</Label>
            <Textarea id="anchor-phrase" value={anchorPhrase} onChange={e => setAnchorPhrase(e.target.value)} />
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mi pacto</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {!isSaved ? renderStep() : (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Pacto Guardado!</h4>
            <p className="text-muted-foreground">Este pacto no es una obligación. Es una forma de cuidarte con conciencia. Llévalo contigo.</p>
            <Button onClick={() => { setStep(0); setIsSaved(false); }} variant="outline" className="w-full">Crear otro pacto</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
