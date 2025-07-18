
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, NotebookText, AlertCircle, Sparkles, Heart, Zap, BrainCircuit, Users } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { WellbeingPlanExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface WellbeingPlanExerciseProps {
  content: WellbeingPlanExerciseContent;
}

const planSections = {
  signals: {
    title: "Mis señales de alerta personal",
    icon: AlertCircle,
    prompt: "¿Qué me indica que estoy empezando a sobrecargarme?",
    categories: {
      cognitive: {
        title: "Cognitivas / Mentales",
        options: [
          { id: 'cog-concentration', label: 'Me cuesta concentrarme' },
          { id: 'cog-loop', label: 'Tengo pensamientos en bucle' },
          { id: 'cog-overwhelmed', label: 'Siento que no llego a todo, por más que haga' },
          { id: 'cog-perfectionism', label: 'Me pongo muy autoexigente o perfeccionista' },
          { id: 'cog-decisions', label: 'Me cuesta tomar decisiones' },
        ],
      },
      behavioral: {
        title: "Conductuales",
        options: [
          { id: 'beh-avoidance', label: 'Evito tareas, conversaciones o compromisos' },
          { id: 'beh-procrastination', label: 'Empiezo a procrastinar más de lo habitual' },
          { id: 'beh-disconnect', label: 'Me desconecto de lo que me importa' },
          { id: 'beh-irritability', label: 'Estoy más irritable o impaciente' },
          { id: 'beh-pleasing', label: 'Me vuelvo muy complaciente con los demás' },
        ]
      },
       emotional: {
        title: "Emocionales",
        options: [
          { id: 'emo-irritability', label: 'Me siento más irritable, ansioso/a o frustrado/a' },
          { id: 'emo-apathy', label: 'Me noto más apático/a o desconectado/a' },
          { id: 'emo-guilt', label: 'Me invade la culpa si no estoy siendo “productivo/a”' },
          { id: 'emo-crying', label: 'Lloro con facilidad o me cuesta expresar lo que siento' },
          { id: 'emo-overwhelmed', label: 'Siento que todo me supera o me siento desbordado/a' },
        ]
      },
      physical: {
        title: "Físicas / Fisiológicas",
        options: [
            { id: 'phy-sleep', label: 'Duermo mal o me cuesta conciliar el sueño' },
            { id: 'phy-tired', label: 'Me levanto ya cansado/a o sin energía' },
            { id: 'phy-pain', label: 'Tengo dolores musculares o tensión' },
            { id: 'phy-appetite', label: 'Se me corta el apetito o como por ansiedad' },
            { id: 'phy-breath', label: 'Me cuesta respirar profundo o noto el pecho cerrado' },
        ]
      }
    }
  },
  techniques: {
    title: "Mis técnicas de regulación favoritas",
    icon: Sparkles,
    prompt: "¿Qué estrategias me ayudan a volver a mi centro?",
    options: [
      { id: 'tech-breathing', label: 'Respiración diafragmática o 4-2-6' },
      { id: 'tech-scan', label: 'Escaneo corporal' },
      { id: 'tech-walk', label: 'Paseo breve sin distracciones' },
      { id: 'tech-anchor', label: 'Frase ancla: “Estoy en un momento difícil, pero puedo afrontarlo.”' },
      { id: 'tech-journal', label: 'Autorregistro (escribir lo que pienso, siento y hago)' },
      { id: 'tech-restructure', label: 'Reestructuración de pensamientos estresantes' },
    ]
  },
  nonNegotiables: {
    title: "Mínimos no negociables (rutinas de autocuidado)",
    icon: Heart,
    prompt: "¿Qué necesito mantener cada día para estar bien?",
    options: [
      { id: 'min-sleep', label: 'Dormir al menos 7 horas' },
      { id: 'min-eat', label: 'Comer sin pantallas' },
      { id: 'min-breaks', label: 'Hacer pausas reales durante el día' },
      { id: 'min-regulate', label: 'Practicar una técnica de regulación emocional' },
      { id: 'min-connect', label: 'Mantener contacto afectivo con alguien de confianza' },
      { id: 'min-unplug', label: 'Tiempo sin móvil o redes sociales' },
    ]
  },
  supportNetwork: {
    title: "Mi red de apoyo emocional",
    icon: Users,
    prompt: "¿A quién puedo acudir si me siento sobrepasada/o?",
     options: [
      { id: 'sup-friend', label: 'Amistad cercana' },
      { id: 'sup-partner', label: 'Pareja / familiar' },
      { id: 'sup-professional', label: 'Profesional (terapeuta, médico...)' },
      { id: 'sup-group', label: 'Grupo o espacio seguro' },
    ]
  },
  criticalPlan: {
    title: "Plan personal para momentos críticos",
    icon: Zap,
    prompt: "¿Qué haré si vuelvo a sentirme al límite?",
  }
};


export function WellbeingPlanExercise({ content }: WellbeingPlanExerciseProps) {
  const { toast } = useToast();
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelections(prev => ({ ...prev, [id]: checked }));
  };

  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let notebookContent = `**${content.title}**\n\n`;

    Object.values(planSections).forEach(section => {
        notebookContent += `**${section.title}**\n`;
        notebookContent += `*${section.prompt}*\n\n`;

        if ('categories' in section) {
            Object.values(section.categories).forEach(cat => {
                notebookContent += `*${cat.title}:*\n`;
                const selectedInCategory = cat.options.filter(opt => selections[opt.id]).map(opt => `  - ${opt.label}`).join('\n');
                if (selectedInCategory) notebookContent += `${selectedInCategory}\n`;
                const note = notes[`${cat.title.toLowerCase().replace(/\s/g, '-')}-note`];
                if (note) notebookContent += `  - Mis señales propias: ${note}\n`;
            });
             notebookContent += `\n`;
        } else if ('options' in section) {
            const selectedOptions = section.options.filter(opt => selections[opt.id]).map(opt => `  - ${opt.label}`).join('\n');
            if (selectedOptions) notebookContent += `${selectedOptions}\n`;
            const note = notes[`${section.title.toLowerCase().replace(/\s/g, '-')}-note`];
            if (note) notebookContent += `  - Otra: ${note}\n`;
            notebookContent += `\n`;
        } else { // Critical Plan
            const note = notes['critical-plan-note'];
            if (note) notebookContent += `${note}\n\n`;
        }
    });
    
    addNotebookEntry({
      title: content.title,
      content: notebookContent,
      pathId: 'gestion-estres',
    });

    toast({
      title: "Plan Guardado",
      description: "Tu Plan de Bienestar Emocional ha sido guardado en el Cuaderno Terapéutico.",
    });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <Accordion type="multiple" className="w-full space-y-4">
                {Object.entries(planSections).map(([key, section]) => {
                    const SectionIcon = section.icon;
                    return (
                        <AccordionItem value={key} key={key} className="border rounded-lg shadow-sm bg-background">
                            <AccordionTrigger className="p-4 font-semibold hover:no-underline text-left text-primary">
                                <div className="flex items-center gap-3">
                                    <SectionIcon className="h-5 w-5"/>
                                    {section.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 border-t">
                                <p className="text-sm text-muted-foreground mt-2 mb-4">{section.prompt}</p>
                                { 'categories' in section && (
                                    <div className="space-y-4">
                                        {Object.entries(section.categories).map(([catKey, category]) => (
                                            <div key={catKey}>
                                                <Label className="font-medium text-foreground/90">{category.title}</Label>
                                                <div className="space-y-2 mt-2 pl-2">
                                                    {category.options.map(opt => (
                                                        <div key={opt.id} className="flex items-center space-x-2">
                                                            <Checkbox id={opt.id} checked={selections[opt.id] || false} onCheckedChange={(checked) => handleCheckboxChange(opt.id, checked as boolean)} disabled={isSaved} />
                                                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Textarea value={notes[`${catKey}-note`] || ''} onChange={e => handleNoteChange(`${catKey}-note`, e.target.value)} placeholder="Mis señales propias..." disabled={isSaved} className="mt-2 text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                { 'options' in section && (
                                    <div className="space-y-2">
                                        {section.options.map(opt => (
                                            <div key={opt.id} className="flex items-center space-x-2">
                                                <Checkbox id={opt.id} checked={selections[opt.id] || false} onCheckedChange={(checked) => handleCheckboxChange(opt.id, checked as boolean)} disabled={isSaved} />
                                                <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                                            </div>
                                        ))}
                                        <Textarea value={notes[`${key}-note`] || ''} onChange={e => handleNoteChange(`${key}-note`, e.target.value)} placeholder="Otra/s..." disabled={isSaved} className="mt-2 text-sm" />
                                    </div>
                                )}
                                 { key === 'criticalPlan' && (
                                    <Textarea value={notes['critical-plan-note'] || ''} onChange={e => handleNoteChange('critical-plan-note', e.target.value)} placeholder="Ej: Si noto que me desbordo, me daré 5 minutos de pausa, escribiré lo que siento, usaré una técnica de respiración y hablaré con alguien antes de decidir o actuar." disabled={isSaved} rows={4} />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          
          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar mi Plan en el Cuaderno
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu Plan de Bienestar ha sido guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
