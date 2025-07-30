"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NoGuiltTechniquesExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface NoGuiltTechniquesExerciseProps {
  content: NoGuiltTechniquesExerciseContent;
  pathId: string;
}

const techniques = {
  discoRayado: {
    title: "Técnica: Disco rayado",
    when: "Cuando te presionan o insisten para que cambies de opinión o cedas.",
    goal: "Te ayuda a mantener tu decisión con calma, sin entrar en discusiones, reforzando tu firmeza interna.",
    example: "“Lo entiendo, pero mi decisión sigue siendo la misma: esta vez no voy a poder.”"
  },
  bancoNiebla: {
    title: "Técnica: Banco de niebla",
    when: "Cuando no quieres discutir, pero tampoco ceder ni justificarte. Ideal en situaciones donde percibes que debatir solo generará más tensión.",
    goal: "Te ayuda a mantener tu posición sin enfrentarte ni engancharte en argumentos.",
    example: "“Entiendo que te moleste, pero esta vez necesito que respetes mi decisión.”"
  },
  aplazamientoAsertivo: {
    title: "Técnica: Aplazamiento asertivo",
    when: "Cuando sientes presión o confusión y necesitas tiempo para responder con claridad.",
    goal: "Evita respuestas impulsivas y te permite actuar desde la calma. Refuerza tu derecho a pensar antes de decidir.",
    example: "“Gracias por contar conmigo. Prefiero pensarlo con calma y darte una respuesta más tarde.”"
  },
  acuerdoParcial: {
    title: "Técnica: Acuerdo parcial o asertivo",
    when: "Cuando la otra persona tiene parte de razón y tú quieres reconocerlo honestamente, pero sin renunciar a tu necesidad o decisión.",
    goal: "Favorece un entendimiento real, mostrando que escuchas y validas al otro, sin dejarte de lado a ti.",
    example: "“Tienes razón en que esto es urgente, pero también necesito cuidar mis tiempos.”"
  },
  sandwich: {
    title: "Técnica: Técnica del sándwich",
    when: "Cuando quieres suavizar una negativa o límite, sin dejar de expresar lo que necesitas.",
    goal: "Te permite proteger el vínculo y decir que no con amabilidad. Refuerza tu empatía sin renunciar a ti.",
    example: "“Me encanta que me tengas en cuenta, pero este fin de semana necesito descansar. Seguro que lo resolvéis genial.”"
  },
  redireccion: {
    title: "Técnica: Redirección con foco",
    when: "Cuando quieres poner un límite sin romper el vínculo, ofreciendo una alternativa viable.",
    goal: "Te permite cuidar tus recursos sin cerrarte por completo. Refuerza tu equilibrio entre dar y cuidarte.",
    example: "“No puedo quedarme más tiempo hoy, pero mañana puedo ayudarte a repasar el informe.”"
  }
};

export function NoGuiltTechniquesExercise({ content, pathId }: NoGuiltTechniquesExerciseProps) {
  const { toast } = useToast();
  const [personalizedPhrases, setPersonalizedPhrases] = useState<Record<keyof typeof techniques, string>>({
      discoRayado: '', bancoNiebla: '', aplazamientoAsertivo: '', acuerdoParcial: '', sandwich: '', redireccion: ''
  });

  const handlePhraseChange = (techniqueKey: keyof typeof techniques, value: string) => {
    setPersonalizedPhrases(prev => ({...prev, [techniqueKey]: value}));
  };

  const handleSave = (techniqueKey: keyof typeof techniques) => {
    const phrase = personalizedPhrases[techniqueKey];
    if (!phrase.trim()) {
        toast({ title: "Frase Vacía", description: "Escribe tu versión personalizada para guardarla.", variant: "destructive" });
        return;
    }

    const notebookContent = `
**Ejercicio: ${techniques[techniqueKey].title}**

*Mi frase personalizada:*
"${phrase}"
    `;
    addNotebookEntry({ title: `Técnica asertiva: ${techniques[techniqueKey].title}`, content: notebookContent, pathId });
    toast({ title: "Frase Guardada", description: "Tu frase se ha guardado en el Cuaderno Terapéutico."});
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Usa estas técnicas como inspiración. Adáptalas, hazlas tuyas y practica decirlas en voz alta para que te salgan con naturalidad.</p>
        <Accordion type="multiple" className="w-full space-y-3">
          {Object.entries(techniques).map(([key, tech]) => (
            <AccordionItem value={key} key={key} className="border rounded-lg bg-background shadow-sm">
                <AccordionTrigger className="p-4 font-semibold hover:no-underline text-left text-primary">
                    {tech.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 border-t pt-4">
                    <div className="space-y-3 text-sm">
                        <p><strong className="text-foreground">¿Cuándo usarla?</strong> {tech.when}</p>
                        <p><strong className="text-foreground">¿Qué logra?</strong> {tech.goal}</p>
                        <div className="p-2 border-l-2 border-accent bg-accent/10 italic">
                            <p><strong>Ejemplo:</strong> "{tech.example}"</p>
                        </div>
                        <div className="space-y-2 pt-2">
                             <Label htmlFor={`phrase-${key}`} className="font-semibold">Tu versión personalizada:</Label>
                             <Textarea 
                                id={`phrase-${key}`}
                                value={personalizedPhrases[key as keyof typeof techniques]}
                                onChange={(e) => handlePhraseChange(key as keyof typeof techniques, e.target.value)}
                                placeholder="Escribe aquí cómo lo dirías tú..."
                             />
                             <Button onClick={() => handleSave(key as keyof typeof techniques)} size="sm" className="w-full">
                                <Save className="mr-2 h-4 w-4"/> Guardar en mi Cuaderno
                             </Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
