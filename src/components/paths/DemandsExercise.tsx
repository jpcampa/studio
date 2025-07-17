
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DemandsExerciseContent } from '@/data/paths/pathTypes';

interface DemandsExerciseProps {
  content: DemandsExerciseContent;
}

const originOptions = [
    { id: 'origin-family', label: 'Familia o educación' },
    { id: 'origin-culture', label: 'Cultura o sociedad' },
    { id: 'origin-rejection-fear', label: 'Miedo al rechazo' },
    { id: 'origin-approval-desire', label: 'Deseo de aprobación' },
    { id: 'origin-insecurity', label: 'Inseguridad personal' },
];

export function DemandsExercise({ content }: DemandsExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();

  const [demand, setDemand] = useState('');
  const [origins, setOrigins] = useState<Record<string, boolean>>({});
  const [otherOrigin, setOtherOrigin] = useState('');
  const [consequences, setConsequences] = useState('');
  const [realNeed, setRealNeed] = useState('');
  const [compassionateReformulation, setCompassionateReformulation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [reflection, setReflection] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  const handleOriginChange = (optionId: string, checked: boolean) => {
    setOrigins(prev => ({ ...prev, [optionId]: checked }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!demand.trim() || !consequences.trim() || !realNeed.trim() || !compassionateReformulation.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos del ejercicio.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro de 'Exigencias vs. Deseos' ha sido guardado.",
    });
    setIsSaved(true);
  };

  const handleSaveReflection = (e: FormEvent) => {
    e.preventDefault();
     if (!reflection.trim()) {
      toast({ title: "Reflexión vacía", description: "Escribe tu reflexión para guardarla.", variant: "destructive" });
      return;
    }
    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: `**¿Qué exigencias me están pesando más? ¿Cómo puedo transformarlas en necesidades reales que sí quiero cuidar?**\n\n${reflection}`,
      pathId: 'gestion-estres',
    });
    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico.",
    });
    setIsReflectionSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="demand" className="font-semibold">1. Exigencia detectada: ¿Qué te estás diciendo?</Label>
            <Textarea id="demand" value={demand} onChange={e => setDemand(e.target.value)} placeholder="Ej: Tengo que estar siempre disponible para todos, aunque no pueda más." disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">2. Origen probable: ¿De dónde crees que viene esta exigencia?</Label>
            <div className="space-y-2">
                {originOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={origins[opt.id] || false} onCheckedChange={(checked) => handleOriginChange(opt.id, checked as boolean)} disabled={isSaved} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="origin-other-check" checked={origins['origin-other-check'] || false} onCheckedChange={(checked) => handleOriginChange('origin-other-check', checked as boolean)} disabled={isSaved} />
                    <Label htmlFor="origin-other-check" className="font-normal">Otra:</Label>
                </div>
                {origins['origin-other-check'] && (
                    <Textarea value={otherOrigin} onChange={e => setOtherOrigin(e.target.value)} placeholder="Describe el otro origen" disabled={isSaved} className="ml-6" />
                )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consequences" className="font-semibold">3. Consecuencias: ¿Qué te está costando esta exigencia?</Label>
            <Textarea id="consequences" value={consequences} onChange={e => setConsequences(e.target.value)} placeholder="Impacto emocional, físico, en relaciones... Ej: Me siento agotada, irritable..." disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="realNeed" className="font-semibold">4. Deseo o necesidad real: ¿Qué necesitas o quieres de verdad?</Label>
            <Textarea id="realNeed" value={realNeed} onChange={e => setRealNeed(e.target.value)} placeholder="Conecta con tu parte honesta. Ej: Necesito descansar y darme permiso." disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reformulation" className="font-semibold">5. Reformulación compasiva: ¿Qué podrías decirte con más amabilidad?</Label>
            <Textarea id="reformulation" value={compassionateReformulation} onChange={e => setCompassionateReformulation(e.target.value)} placeholder="Ej: Estoy haciendo lo mejor que puedo. También merezco cuidarme." disabled={isSaved} />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Ejercicio
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>

         {isSaved && (
          <form onSubmit={handleSaveReflection} className="mt-8 pt-6 border-t">
            <h4 className="font-semibold text-md text-primary mb-4 flex items-center">
              <NotebookText className="mr-2 h-5 w-5" />
              Reflexión Final (Para el Cuaderno Terapéutico)
            </h4>
            <div className="space-y-2">
               <Label htmlFor="reflection-notebook-demands" className="font-normal text-sm">¿Qué exigencias me están pesando más? ¿Cómo puedo transformarlas en necesidades reales que sí quiero cuidar?</Label>
               <Textarea
                id="reflection-notebook-demands"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Escribe tu reflexión aquí..."
                rows={4}
                disabled={isReflectionSaved}
               />
            </div>
             {!isReflectionSaved ? (
              <Button type="submit" className="w-full mt-4">
                  <Save className="mr-2 h-4 w-4" /> Guardar Reflexión en mi Cuaderno
              </Button>
            ) : (
              <div className="mt-4 flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
            )}
          </form>
        )}

      </CardContent>
    </Card>
  );
}
