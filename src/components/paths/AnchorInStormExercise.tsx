
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
import type { AnchorInStormExerciseContent } from '@/data/paths/pathTypes';

interface AnchorInStormExerciseProps {
  content: AnchorInStormExerciseContent;
  pathId: string;
}

export function AnchorInStormExercise({ content, pathId }: AnchorInStormExerciseProps) {
  const { toast } = useToast();
  const [emotionalState, setEmotionalState] = useState('');
  const [anchorType, setAnchorType] = useState('');
  const [anchorDesc, setAnchorDesc] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!emotionalState.trim() || !anchorType || !anchorDesc.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los campos del ancla.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Estado emocional frecuente:*
${emotionalState}

*Tipo de ancla:*
${anchorType}

*Descripción de mi ancla:*
${anchorDesc}
    `;
    addNotebookEntry({ title: 'Mi Ancla en la Tormenta', content: notebookContent, pathId });
    toast({ title: 'Ancla Guardada', description: 'Tu ancla emocional ha sido guardada.' });
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
          <p className="text-sm text-muted-foreground">En este ejercicio vas a crear tu propia ancla emocional: un recurso personal, íntimo y portátil que puedas usar cuando te sientas desbordado o desbordada.</p>
          <div className="space-y-2">
            <Label htmlFor="emotionalState">¿En qué momentos sientes que necesitas un ancla?</Label>
            <Textarea id="emotionalState" value={emotionalState} onChange={e => setEmotionalState(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label>Elige tu tipo de ancla</Label>
            <RadioGroup value={anchorType} onValueChange={setAnchorType} disabled={isSaved}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Respiración calmante" id="anchor-breath" /><Label htmlFor="anchor-breath" className="font-normal">Respiración calmante</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Imagen segura" id="anchor-image" /><Label htmlFor="anchor-image" className="font-normal">Imagen segura o reconfortante</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Frase de autorregulación" id="anchor-phrase" /><Label htmlFor="anchor-phrase" className="font-normal">Frase de autorregulación</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Gesto físico" id="anchor-gesture" /><Label htmlFor="anchor-gesture" className="font-normal">Gesto físico de autocuidado</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Otra" id="anchor-other" /><Label htmlFor="anchor-other" className="font-normal">Otra</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="anchor-desc">Describe tu ancla emocional</Label>
            <Textarea id="anchor-desc" value={anchorDesc} onChange={e => setAnchorDesc(e.target.value)} disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Ancla</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu ancla ha sido guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
