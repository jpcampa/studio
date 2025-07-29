
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DelSabotajeALaAccionExerciseContent } from '@/data/paths/pathTypes';

interface DelSabotajeALaAccionExerciseProps {
  content: DelSabotajeALaAccionExerciseContent;
}

const sabotageOptions = [
    { id: 'sabotage-no-moment', label: '“No es el momento. Necesito estar inspirado o inspirada.”' },
    { id: 'sabotage-tired', label: '“Estoy demasiado cansado o cansada. Mejor luego.”' },
    { id: 'sabotage-perfect', label: '“Si no va a salir perfecto, no tiene sentido hacerlo.”' },
    { id: 'sabotage-fail', label: '“¿Y si me equivoco y piensan que no soy capaz?”' },
    { id: 'sabotage-no-interest', label: '“No tengo interés. No puedo con nada.”' },
    { id: 'sabotage-too-late', label: '“Debería haberlo hecho antes. Ya es tarde.”' },
];

const functionalResponses: Record<string, string> = {
    'sabotage-no-moment': '“La inspiración ayuda, pero el progreso viene al actuar.”',
    'sabotage-tired': '“Solo 15 minutos ya es un avance. A veces, empezar da energía.”',
    'sabotage-perfect': '“Avanzar, aunque sea imperfecto, es mejor que quedarme bloqueado/a.”',
    'sabotage-fail': '“No controlo lo que piensen. Pero puedo aprender y seguir.”',
    'sabotage-no-interest': '“Es solo un pensamiento del bloqueo. Haré algo pequeño y veré.”',
    'sabotage-too-late': '“No puedo cambiar el pasado, pero sí puedo actuar ahora.”',
};

const steps = ['intro', 'selection', 'responses', 'custom', 'summary'];

export function DelSabotajeALaAccionExercise({ content }: DelSabotajeALaAccionExerciseProps) {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [customSabotage, setCustomSabotage] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelections(prev => ({ ...prev, [id]: checked }));
  };

  const selectedOptions = useMemo(() => sabotageOptions.filter(opt => selections[opt.id]), [selections]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedOptions.length === 0 && !customSabotage.trim()) {
        toast({ title: "Ejercicio Incompleto", description: "Por favor, selecciona al menos una frase o añade una propia.", variant: "destructive"});
        return;
    }

    let notebookContent = `**${content.title}**\n\n**Mis frases de sabotaje y mis nuevas respuestas:**\n\n`;
    
    selectedOptions.forEach(opt => {
        notebookContent += `*Frase que me repito:*\n> ${opt.label}\n`;
        notebookContent += `*Respuesta realista y amable:*\n> ${functionalResponses[opt.id]}\n\n`;
    });

    if (customSabotage.trim() && customResponse.trim()) {
        notebookContent += `*Mi frase personal:*\n> ${customSabotage}\n`;
        notebookContent += `*Mi respuesta personal:*\n> ${customResponse}\n\n`;
    }

    addNotebookEntry({
      title: "Mi Tabla de Diálogo Interno",
      content: notebookContent,
      pathId: 'superar-procrastinacion',
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu tabla de diálogo interno se ha guardado en el Cuaderno Terapéutico.",
    });

    nextStep(); // Move to summary
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {steps[currentStep] === 'intro' && (
           <div className="text-center p-4">
             <p className="mb-6">Muchas veces postergas no por flojera, sino por lo que te dices justo antes de actuar. Este ejercicio te ayuda a escuchar ese diálogo interno y a crear una respuesta que te sostenga.</p>
             <Button onClick={nextStep}>Entrenar mi diálogo interno <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {steps[currentStep] === 'selection' && (
            <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                <Label className="font-semibold text-lg">Frases que alimentan la procrastinación</Label>
                <p className="text-sm text-muted-foreground">Marca las que sueles decirte:</p>
                <div className="space-y-2">
                    {sabotageOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={selections[opt.id] || false} onCheckedChange={(checked) => handleSelectionChange(opt.id, checked as boolean)} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                </div>
                <Button onClick={nextStep} className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        )}

        {steps[currentStep] === 'responses' && (
             <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                <h3 className="font-semibold text-lg">Tus respuestas entrenadas</h3>
                 {selectedOptions.length > 0 ? (
                    <div className="space-y-4">
                        {selectedOptions.map(opt => (
                            <div key={opt.id} className="p-3 border rounded-md bg-background">
                                <p className="text-sm text-muted-foreground">Ante el pensamiento:</p>
                                <p className="font-medium italic">"{opt.label}"</p>
                                <p className="text-sm text-muted-foreground mt-2">Tu nueva respuesta amable es:</p>
                                <p className="font-semibold text-primary">"{functionalResponses[opt.id]}"</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-muted-foreground italic">No has seleccionado ninguna frase común.</p> }
                <Button onClick={nextStep} className="w-full">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        )}

        {steps[currentStep] === 'custom' && (
            <form onSubmit={handleSave} className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                <h3 className="font-semibold text-lg">Crea tu tabla personal</h3>
                <p className="text-sm text-muted-foreground">¿Hay otra frase que te repites? Añádela aquí con tu propia respuesta realista.</p>
                <div className="space-y-2">
                    <Label htmlFor="custom-sabotage">Frase que te repites</Label>
                    <Textarea id="custom-sabotage" value={customSabotage} onChange={e => setCustomSabotage(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="custom-response">Respuesta realista y amable</Label>
                    <Textarea id="custom-response" value={customResponse} onChange={e => setCustomResponse(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" /> Guardar mi tabla de diálogo interno
                </Button>
            </form>
        )}

        {steps[currentStep] === 'summary' && (
            <div className="text-center p-4 space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">¡Ejercicio Guardado!</h3>
                <p className="text-muted-foreground">Tu forma de hablarte no tiene que ser perfecta. Solo necesita ayudarte a avanzar. Cada vez que te respondas con claridad y compasión, estarás construyendo un puente hacia la acción.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
