"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmotionalInvolvementTrafficLightExerciseContent } from '@/data/paths/pathTypes';

interface EmotionalInvolvementTrafficLightExerciseProps {
  content: EmotionalInvolvementTrafficLightExerciseContent;
  pathId: string;
}

export function EmotionalInvolvementTrafficLightExercise({ content, pathId }: EmotionalInvolvementTrafficLightExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState(Array(5).fill({ name: '', color: '' }));
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleRelationChange = (index: number, field: string, value: string) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleReflectionChange = (field: string, value: string) => {
    setReflection(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const filledRelations = relations.filter(r => r.name.trim() !== '' && r.color.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: "Ejercicio Incompleto", description: "Completa al menos una relación con su color.", variant: 'destructive' });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;

    notebookContent += "**Mapa de relaciones y su color:**\n";
    filledRelations.forEach(r => {
      notebookContent += `- ${r.name}: ${r.color}\n`;
    });
    notebookContent += `\n**Reflexión guiada:**\n`;
    notebookContent += `- ¿Te ha sorprendido el color?: ${reflection.q1 || 'No respondido.'}\n`;
    notebookContent += `- ¿Notas patrones?: ${reflection.q2 || 'No respondido.'}\n`;
    notebookContent += `- ¿Qué relación necesitas revisar?: ${reflection.q3 || 'No respondido.'}\n`;
    notebookContent += `- ¿Qué vínculo te gustaría cuidar más?: ${reflection.q4 || 'No respondido.'}\n`;

    addNotebookEntry({ title: `Semáforo de Implicación Emocional`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico." });
    setIsSaved(true);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">A veces damos lo mismo a todas las personas sin notar cómo nos afecta. Este ejercicio te invita a observar cómo te sientes en tus relaciones cotidianas para que puedas decidir cómo implicarte.</p>
            <Button onClick={() => setStep(1)}>Empezar mi semáforo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Mapa de relaciones</h4>
            <p className="text-sm text-muted-foreground">Haz una lista de 5 personas con las que tengas contacto frecuente (personal o laboral).</p>
            {relations.map((rel, index) => (
              <Input
                key={index}
                value={rel.name}
                onChange={e => handleRelationChange(index, 'name', e.target.value)}
                placeholder={`Persona ${index + 1}...`}
              />
            ))}
            <Button onClick={() => setStep(2)} className="w-full">Siguiente</Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Elige un color para cada relación</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, elige un color según lo que su relación genera en ti:</p>
            <ul className="list-disc list-inside text-sm pl-4">
                <li><strong className="text-green-600">Verde:</strong> Me siento libre, escuchado/a, tranquilo/a. Esta relación me nutre.</li>
                <li><strong className="text-amber-600">Ámbar:</strong> Me cuesta poner límites. Me agoto un poco, pero me cuesta expresarlo.</li>
                <li><strong className="text-red-600">Rojo:</strong> Me siento drenado/a, desestabilizado/a o ansioso/a con frecuencia.</li>
            </ul>
            {relations.filter(r => r.name).map((rel, index) => (
              <div key={index} className="space-y-2 border-t pt-2">
                <Label className="font-semibold">{rel.name}</Label>
                <RadioGroup value={rel.color} onValueChange={v => handleRelationChange(index, 'color', v)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Verde" id={`c-${index}-g`} /><Label htmlFor={`c-${index}-g`} className="font-normal">Verde</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Ámbar" id={`c-${index}-a`} /><Label htmlFor={`c-${index}-a`} className="font-normal">Ámbar</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Rojo" id={`c-${index}-r`} /><Label htmlFor={`c-${index}-r`} className="font-normal">Rojo</Label></div>
                </RadioGroup>
              </div>
            ))}
            <Button onClick={() => setStep(3)} className="w-full">Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Reflexión guiada</h4>
            <div className="space-y-2"><Label>¿Te ha sorprendido el color que le diste a alguna relación?</Label><Textarea value={reflection.q1} onChange={e => handleReflectionChange('q1', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Notas patrones? ¿Relaciones que antes eran verdes y ahora son ámbar?</Label><Textarea value={reflection.q2} onChange={e => handleReflectionChange('q2', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Qué relación sientes que necesitas revisar, proteger o alejarte un poco?</Label><Textarea value={reflection.q3} onChange={e => handleReflectionChange('q3', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Qué vínculo te gustaría cuidar más conscientemente?</Label><Textarea value={reflection.q4} onChange={e => handleReflectionChange('q4', e.target.value)} /></div>
            <Button onClick={() => setStep(4)} className="w-full">Siguiente</Button>
          </div>
        );
       case 4:
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Acciones por color</h4>
             <p className="text-sm">Observar sin juzgar ya es una forma de cuidarte. Ahora puedes elegir qué hacer con esta información.</p>
             <div className="text-left space-y-2">
                 <p><strong className="text-green-600">Para relaciones verdes:</strong> Haz algo para fortalecerla (agradece, comparte, pasa tiempo de calidad).</p>
                 <p><strong className="text-amber-600">Para relaciones ámbar:</strong> Practica un pequeño límite o exprésate con más claridad.</p>
                 <p><strong className="text-red-600">Para relaciones rojas:</strong> Marca distancia emocional o elige el silencio protector.</p>
             </div>
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4"/> Guardar en mi cuaderno</Button>
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
        {isSaved && (
             <div className="mt-4 flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
