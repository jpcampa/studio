
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NourishingConversationExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface NourishingConversationExerciseProps {
  content: NourishingConversationExerciseContent;
  pathId: string;
}

export function NourishingConversationExercise({ content, pathId }: NourishingConversationExerciseProps) {
  const { toast } = useToast();
  const [person, setPerson] = useState('');
  const [context, setContext] = useState('');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [reflection, setReflection] = useState({ after: '', discovered: '', strengthen: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Persona:* ${person}
*Contexto:* ${context}
*Tema compartido:* ${topic}
*Pregunta abierta:* ${question}
*Reflexión:*
- Después de hablar me sentí: ${reflection.after}
- Descubrí: ${reflection.discovered}
- Para fortalecer el vínculo: ${reflection.strengthen}
    `;
    addNotebookEntry({ title: 'Registro de Conversación Nutritiva', content: notebookContent, pathId });
    toast({ title: 'Registro Guardado' });
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
          <div className="space-y-2">
            <Label>Paso 1: Elige persona y contexto</Label>
            <Input value={person} onChange={e => setPerson(e.target.value)} placeholder="Persona..." disabled={isSaved} />
            <Select onValueChange={setContext} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Contexto..."/></SelectTrigger>
              <SelectContent>
                <SelectItem value="Paseo">Paseo</SelectItem>
                <SelectItem value="Café">Café</SelectItem>
                <SelectItem value="Llamada">Llamada</SelectItem>
                <SelectItem value="Comida">Comida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Paso 2: Prepara la conversación</Label>
            <Textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Tema que quiero compartir..." disabled={isSaved} />
            <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Pregunta abierta para el otro..." disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label>Paso 3: Reflexión post-conversación</Label>
            <Textarea value={reflection.after} onChange={e => setReflection(p => ({...p, after: e.target.value}))} placeholder="¿Cómo me sentí después?" disabled={isSaved} />
            <Textarea value={reflection.discovered} onChange={e => setReflection(p => ({...p, discovered: e.target.value}))} placeholder="¿Qué descubrí?" disabled={isSaved} />
            <Textarea value={reflection.strengthen} onChange={e => setReflection(p => ({...p, strengthen: e.target.value}))} placeholder="¿Cómo puedo seguir fortaleciendo el vínculo?" disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Registro</Button>
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
