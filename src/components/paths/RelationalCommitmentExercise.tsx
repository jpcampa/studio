
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { RelationalCommitmentExerciseContent } from '@/data/paths/pathTypes';

interface RelationalCommitmentExerciseProps {
  content: RelationalCommitmentExerciseContent;
  pathId: string;
}

export function RelationalCommitmentExercise({ content, pathId }: RelationalCommitmentExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [values, setValues] = useState('');
  const [misalignedRelation, setMisalignedRelation] = useState('');
  const [commitmentPerson, setCommitmentPerson] = useState('');
  const [vulnerableBehavior, setVulnerableBehavior] = useState('');
  const [partToStrengthen, setPartToStrengthen] = useState('');
  const [blockingThoughts, setBlockingThoughts] = useState('');
  const [commitmentStatement, setCommitmentStatement] = useState('');
  const [weeklyMicroAction, setWeeklyMicroAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const handleSave = () => {
    if (!commitmentStatement.trim()) {
      toast({ title: "Compromiso no definido", description: "Por favor, escribe tu declaración de compromiso para guardarla.", variant: "destructive" });
      return;
    }
    
    const notebookContent = `
**Ejercicio: ${content.title}**

**Valores importantes para mí en una relación:**
${values || 'No especificado.'}

**Relación que no se alinea y por qué:**
${misalignedRelation || 'No especificado.'}

**Me gustaría construir un vínculo más honesto con:**
${commitmentPerson || 'No especificado.'}

**Cuando me siento vulnerable, suelo:**
${vulnerableBehavior || 'No especificado.'}

**Parte de mí que quiero fortalecer:**
${partToStrengthen || 'No especificado.'}

**Pensamientos que me frenan:**
${blockingThoughts || 'No especificado.'}

---
**MI COMPROMISO RELACIONAL PERSONAL:**
*${commitmentStatement}*

**Mi microacción para esta semana:**
${weeklyMicroAction || 'No especificada.'}
`;
    addNotebookEntry({ title: `Mi Compromiso Relacional`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu compromiso relacional se ha guardado en el cuaderno." });
    setIsSaved(true);
    next();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">A veces nos enfocamos en protegernos… pero olvidamos definir cómo queremos estar presentes en nuestras relaciones. Este ejercicio es una brújula emocional para que elijas conscientemente con quién y desde qué valores quieres vincularte.</p>
            <Button onClick={next}>Crear mi compromiso <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elijo con quién construir</h4>
            <div className="space-y-2">
              <Label htmlFor="values">¿Qué valores son importantes para ti en una relación saludable?</Label>
              <Textarea id="values" value={values} onChange={e => setValues(e.target.value)} placeholder="Ej: respeto, apoyo, libertad, ternura..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="misaligned">¿Hay alguna relación actual que no esté alineada con estos valores? ¿Qué señales lo indican?</Label>
              <Textarea id="misaligned" value={misalignedRelation} onChange={e => setMisalignedRelation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commitment-person">¿Con quién te gustaría comprometerte a construir un vínculo más honesto y equilibrado?</Label>
              <Textarea id="commitment-person" value={commitmentPerson} onChange={e => setCommitmentPerson(e.target.value)} />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Cómo quiero estar presente</h4>
            <div className="space-y-2">
              <Label htmlFor="vulnerable-behavior">¿Cómo sueles actuar en relaciones cuando te sientes inseguro/a o vulnerable?</Label>
              <Textarea id="vulnerable-behavior" value={vulnerableBehavior} onChange={e => setVulnerableBehavior(e.target.value)} placeholder="Ej: Me cierro, actúo desde el miedo..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strengthen-part">¿Qué parte de ti te gustaría fortalecer para estar más presente emocionalmente?</Label>
              <Textarea id="strengthen-part" value={partToStrengthen} onChange={e => setPartToStrengthen(e.target.value)} placeholder="Ej: Confiar en que lo que siento importa..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blocking-thoughts">¿Qué pensamientos te frenan cuando quieres poner un límite o ser tú misma/o?</Label>
              <Textarea id="blocking-thoughts" value={blockingThoughts} onChange={e => setBlockingThoughts(e.target.value)} placeholder="Ej: 'Si soy honesta, se enfadará'..." />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Declaración de compromiso personal</h4>
             <p className="text-sm text-muted-foreground">Escribe una frase potente y verdadera que refleje cómo eliges vincularte contigo y con las personas que te rodean. Será tu ancla.</p>
            <div className="space-y-2">
              <Label htmlFor="commitment-statement">Mi compromiso relacional personal:</Label>
              <Textarea id="commitment-statement" value={commitmentStatement} onChange={e => setCommitmentStatement(e.target.value)} placeholder="Ej: 'Me comprometo a construir vínculos basados en el respeto y la honestidad...'" />
            </div>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Microacción semanal</h4>
            <p className="text-sm text-muted-foreground">Elige una acción pequeña y concreta que te acerque a tu compromiso.</p>
            <div className="space-y-2">
              <Label htmlFor="micro-action">¿Qué pequeño gesto vas a hacer esta semana para actuar en coherencia con tu compromiso?</Label>
              <Textarea id="micro-action" value={weeklyMicroAction} onChange={e => setWeeklyMicroAction(e.target.value)} placeholder="Ej: Poner un límite sin justificarme, agradecer su presencia..." />
            </div>
            <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar en mi cuaderno</Button>
          </div>
        );
       case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Has creado una brújula valiosa para tus relaciones. Vuelve a ella cuando necesites recordar tu dirección.</p>
            <Button onClick={() => { setStep(0); setIsSaved(false); }} variant="outline" className="w-full">Comenzar de nuevo</Button>
          </div>
        );
      default:
        return null;
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
