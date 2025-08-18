
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, NotebookText } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AuthenticityThermometerExerciseContent } from '@/data/paths/pathTypes';

interface AuthenticityThermometerExerciseProps {
  content: AuthenticityThermometerExerciseContent;
  pathId: string;
}

export function AuthenticityThermometerExercise({ content, pathId }: AuthenticityThermometerExerciseProps) {
  const { toast } = useToast();
  
  const [relations, setRelations] = useState(Array(4).fill({ name: '', howIShow: '', whatIHide: '', whyIHide: '', authenticity: 5 }));
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [step, setStep] = useState(0);

  const handleRelationChange = (index: number, field: string, value: any) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleReflectionChange = (field: string, value: string) => {
    setReflection(prev => ({...prev, [field]: value}));
  };

  const handleSave = () => {
    const filledRelations = relations.filter(r => r.name.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: 'Ejercicio Incompleto', description: 'Por favor, completa al menos una relación.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**${content.title}**\n\n`;

    filledRelations.forEach(r => {
      notebookContent += `**Relación con: ${r.name}**\n`;
      notebookContent += `- Cómo me muestro: ${r.howIShow}\n`;
      notebookContent += `- Qué me callo: ${r.whatIHide}\n`;
      notebookContent += `- Por qué lo hago: ${r.whyIHide}\n`;
      notebookContent += `- Nivel de autenticidad: ${r.authenticity}/10\n\n`;
    });

    notebookContent += `**Reflexión Integradora:**\n`;
    notebookContent += `- Vínculos más libres: ${reflection.q1}\n`;
    notebookContent += `- ¿Qué lo permite?: ${reflection.q2}\n`;
    notebookContent += `- Patrón en relaciones difíciles: ${reflection.q3}\n`;
    notebookContent += `- Próximo pequeño paso: ${reflection.q4}\n`;

    addNotebookEntry({ title: 'Mi Termómetro de Autenticidad', content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión ha sido guardada en el Cuaderno Terapéutico." });
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Piensa en 4 a 6 personas con las que te relaciones de forma habitual. Para cada una, responde con sinceridad a las siguientes preguntas.</p>
            {relations.map((relation, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md bg-background">
                <Label htmlFor={`name-${index}`}>Nombre o inicial de la persona {index + 1}</Label>
                <Input id={`name-${index}`} value={relation.name} onChange={(e) => handleRelationChange(index, 'name', e.target.value)} />
                <Label htmlFor={`how-${index}`}>¿Cómo me suelo mostrar con esta persona?</Label>
                <Textarea id={`how-${index}`} value={relation.howIShow} onChange={(e) => handleRelationChange(index, 'howIShow', e.target.value)} placeholder="Ej: complaciente, distante..."/>
                <Label htmlFor={`hide-${index}`}>¿Qué emociones suelo callarme o modificar?</Label>
                <Textarea id={`hide-${index}`} value={relation.whatIHide} onChange={(e) => handleRelationChange(index, 'whatIHide', e.target.value)} placeholder="Ej: tristeza, enfado..."/>
                <Label htmlFor={`why-${index}`}>¿Qué me lo impide?</Label>
                <Textarea id={`why-${index}`} value={relation.whyIHide} onChange={(e) => handleRelationChange(index, 'whyIHide', e.target.value)} placeholder="Ej: miedo a decepcionar..."/>
                <Label htmlFor={`auth-${index}`}>¿Qué tan auténtico/a me siento? {relation.authenticity}/10</Label>
                <Slider id={`auth-${index}`} value={[relation.authenticity]} onValueChange={(v) => handleRelationChange(index, 'authenticity', v[0])} max={10} step={1} />
              </div>
            ))}
            <Button onClick={() => setStep(1)} className="w-full">Ir a la reflexión</Button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
             <h4 className="font-semibold">Reflexión Integradora</h4>
             <p className="text-sm text-muted-foreground">Después de completar al menos 3 relaciones, responde a estas preguntas en tu cuaderno emocional:</p>
             <div className="space-y-2">
                <Label>¿En qué tipo de vínculos me siento más libre para ser yo?</Label>
                <Textarea value={reflection.q1} onChange={(e) => handleReflectionChange('q1', e.target.value)} />
             </div>
              <div className="space-y-2">
                <Label>¿Qué me lo permite? (¿Hay confianza, escucha real, poco juicio?)</Label>
                <Textarea value={reflection.q2} onChange={(e) => handleReflectionChange('q2', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>¿Qué patrón detecto en las relaciones donde me cuesta más mostrarme auténtico/a?</Label>
                <Textarea value={reflection.q3} onChange={(e) => handleReflectionChange('q3', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>¿Qué pequeña acción podría probar para empezar a mostrarme un poco más como soy?</Label>
                <Textarea value={reflection.q4} onChange={(e) => handleReflectionChange('q4', e.target.value)} />
             </div>
             <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Ejercicio y Reflexión</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
