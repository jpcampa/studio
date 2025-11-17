
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EssentialReminderExerciseContent } from '@/data/paths/pathTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EssentialReminderExerciseProps {
  content: EssentialReminderExerciseContent;
  pathId: string;
}

const valueOptions = [
    {id: 'care', label: 'Cuidado personal'}, {id: 'auth', label: 'Autenticidad'},
    {id: 'connect', label: 'Conexión'}, {id: 'calm', label: 'Calma'},
    {id: 'respect', label: 'Respeto'}, {id: 'coherence', label: 'Coherencia interna'},
];

const reminderTypes = ['Frase corta escrita', 'Imagen', 'Dibujo o símbolo', 'Objeto personal'];
const reminderPlacements = ['Espejo', 'Escritorio', 'Agenda', 'Fondo de pantalla'];

export function EssentialReminderExercise({ content, pathId }: EssentialReminderExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [value, setValue] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [reminderContent, setReminderContent] = useState('');
  const [placement, setPlacement] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

**Valor guía:** ${value || 'No especificado'}
**Tipo de recordatorio:** ${reminderType || 'No especificado'}
**Contenido:** ${reminderContent || 'No especificado'}
**Ubicación:** ${placement || 'No especificado'}
    `;
    addNotebookEntry({ title: `Mi Recordatorio Esencial`, content: notebookContent, pathId: pathId });
    toast({ title: "Recordatorio Guardado", description: "Tu recordatorio esencial ha sido guardado." });
    setIsSaved(true);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>A veces, una imagen o una frase puede sostenernos más que mil pensamientos. Hoy vas a crear tu recordatorio esencial.</p>
            <Button onClick={next}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Valor Guía</h4>
            <RadioGroup value={value} onValueChange={setValue}>
              {valueOptions.map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.label} id={opt.id} />
                  <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
         return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2 y 3: Diseña y Ubica</h4>
            <div className="space-y-2">
                <Label>¿Qué forma tendrá tu recordatorio?</Label>
                <RadioGroup value={reminderType} onValueChange={setReminderType}>
                    {reminderTypes.map(t => <div key={t} className="flex items-center space-x-2"><RadioGroupItem value={t} id={t}/><Label htmlFor={t} className="font-normal">{t}</Label></div>)}
                </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="reminder-content">Tu recordatorio (frase, descripción de imagen...)</Label>
                <Textarea id="reminder-content" value={reminderContent} onChange={e => setReminderContent(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <Label>¿Dónde vas a ponerlo?</Label>
                <RadioGroup value={placement} onValueChange={setPlacement}>
                    {reminderPlacements.map(p => <div key={p} className="flex items-center space-x-2"><RadioGroupItem value={p} id={p}/><Label htmlFor={p} className="font-normal">{p}</Label></div>)}
                </RadioGroup>
            </div>
            {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi Recordatorio</Button>
            ) : (
                 <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Recordatorio guardado.</p>
                </div>
            )}
          </form>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
