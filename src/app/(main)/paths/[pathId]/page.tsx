
"use client";

import { use, useState, useEffect, type FormEvent } from 'react';
import { pathsData, Path, PathModule, ModuleContent } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Edit3, Clock, PlayCircle, ExternalLink, AlertTriangle, ChevronRight, Check, Save, NotebookText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCompletedModules, saveCompletedModules } from '@/lib/progressStore';
import { useActivePath } from '@/contexts/ActivePathContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { StressMapExercise } from '@/components/paths/StressMapExercise';
import { TriggerExercise } from '@/components/paths/TriggerExercise';
import { DetectiveExercise } from '@/components/paths/DetectiveExercise';
import { DemandsExercise } from '@/components/paths/DemandsExercise';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';


interface PathDetailPageProps {
  params: Promise<{ pathId: string }>;
}

const renderContent = (contentItem: ModuleContent, index: number, pathId: string) => {
  switch (contentItem.type) {
    case 'title':
      return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3">{contentItem.text}</h3>;
    case 'paragraph':
      return <p key={index} className="text-base leading-relaxed whitespace-pre-line mb-4" dangerouslySetInnerHTML={{ __html: contentItem.text.replace(/\n/g, '<br />') }} />;
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4">
          {contentItem.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/☐/g, '<span class="inline-block w-4 h-4 border border-foreground/50 rounded-sm mr-2"></span>') }} />)}
        </ul>
      );
    case 'collapsible':
      return (
        <Accordion key={index} type="single" collapsible className="w-full mb-4">
          <AccordionItem value={`item-${index}`} className="border rounded-lg shadow-sm">
            <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline text-left">
              {contentItem.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4">
                {contentItem.content.map((item, i) => renderContent(item, i, pathId))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'exercise':
        if (contentItem.title === 'Ejercicio 2: Ensayo de Crisis Imaginaria') {
            return <CrisisRehearsalExercise key={index} content={contentItem} pathId={pathId} />;
        }
        return (
            <Card key={index} className="bg-muted/30 my-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{contentItem.title}</CardTitle>
                    {contentItem.objective && <CardDescription className="pt-2">{contentItem.objective}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {contentItem.content.map((item, i) => renderContent(item, i, pathId))}
                </CardContent>
                {contentItem.duration && <CardFooter className="text-xs text-muted-foreground"><Clock className="mr-2 h-3 w-3" />Duración sugerida: {contentItem.duration}</CardFooter>}
            </Card>
        );
    case 'quote':
        return <blockquote key={index} className="mt-6 border-l-2 pl-6 italic text-accent-foreground/80">"{contentItem.text}"</blockquote>;
    case 'stressMapExercise':
        return <StressMapExercise key={index} content={contentItem} />;
    case 'triggerExercise':
        return <TriggerExercise key={index} content={contentItem} />;
    case 'detectiveExercise':
        return <DetectiveExercise key={index} content={contentItem} />;
    case 'demandsExercise':
        return <DemandsExercise key={index} content={contentItem} />;
    default:
      return null;
  }
};

// Componente específico para el ejercicio de Ensayo de Crisis
function CrisisRehearsalExercise({ content, pathId }: { content: ModuleContent, pathId: string }) {
    const { toast } = useToast();
    const [whatWouldYouDo, setWhatWouldYouDo] = useState('');
    const [whatWouldYouSay, setWhatWouldYouSay] = useState('');
    const [whatTool, setWhatTool] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    if (content.type !== 'exercise') return null;

    const handleSaveReflection = (e: FormEvent) => {
        e.preventDefault();
        if (!whatWouldYouDo.trim() || !whatWouldYouSay.trim() || !whatTool.trim()) {
            toast({ title: "Reflexión Incompleta", description: "Por favor, completa todos los campos del ensayo.", variant: "destructive" });
            return;
        }

        const reflectionContent = `
**Ejercicio: ${content.title}**

*He visualizado una situación de crisis pasada y reflexiono sobre cómo actuaría hoy:*

**¿Qué haría diferente?**
${whatWouldYouDo}

**¿Qué me diría a mí mismo/a?**
${whatWouldYouSay}

**¿Qué herramienta usaría primero?**
${whatTool}
        `;

        addNotebookEntry({
            title: `Reflexión: ${content.title}`,
            content: reflectionContent,
            pathId: pathId,
        });

        toast({ title: "Ensayo Guardado", description: "Tu reflexión ha sido guardada en el Cuaderno Terapéutico." });
        setIsSaved(true);
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent>
                {content.content.map((item, i) => renderContent(item, i, pathId))}
                <form onSubmit={handleSaveReflection} className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="what-would-you-do">¿Qué harías diferente?</Label>
                        <Textarea id="what-would-you-do" value={whatWouldYouDo} onChange={e => setWhatWouldYouDo(e.target.value)} disabled={isSaved} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="what-would-you-say">¿Qué te dirías?</Label>
                        <Textarea id="what-would-you-say" value={whatWouldYouSay} onChange={e => setWhatWouldYouSay(e.target.value)} disabled={isSaved} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="what-tool">¿Qué herramienta usarías primero?</Label>
                        <Textarea id="what-tool" value={whatTool} onChange={e => setWhatTool(e.target.value)} disabled={isSaved} />
                    </div>
                    {!isSaved ? (
                        <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" /> Guardar Ensayo en mi Cuaderno
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <p className="font-medium">Tu ensayo ha sido guardado.</p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

export default function PathDetailPage({ params: paramsPromise }: PathDetailPageProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { loadPath, updateModuleCompletion: contextUpdateModuleCompletion } = useActivePath();
  
  const params = use(paramsPromise); 
  const path = pathsData.find(p => p.id === params.pathId);

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [showPathCongratsDialog, setShowPathCongratsDialog] = useState(false);

  useEffect(() => {
    if (path) {
      const initialCompleted = getCompletedModules(path.id);
      setCompletedModules(initialCompleted);
      loadPath(path.id, path.title, path.modules.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, loadPath]);


  if (!path) {
    return (
      <div className="container mx-auto py-8 text-center text-xl flex flex-col items-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        {t.errorOccurred} Ruta no encontrada.
        <Button asChild variant="outline">
          <Link href="/paths">{t.allPaths}</Link>
        </Button>
      </div>
    );
  }

  const toggleComplete = (moduleId: string, moduleTitle: string) => {
    const newCompletedModules = new Set(completedModules);
    let justCompletedModule = false;

    if (newCompletedModules.has(moduleId)) {
      newCompletedModules.delete(moduleId);
    } else {
      newCompletedModules.add(moduleId);
      justCompletedModule = true;
    }

    setCompletedModules(newCompletedModules);
    saveCompletedModules(path.id, newCompletedModules);
    contextUpdateModuleCompletion(path.id, moduleId, justCompletedModule);


    if (justCompletedModule) {
      toast({
        title: t.moduleCompletedTitle,
        description: t.moduleCompletedMessage.replace("{moduleTitle}", moduleTitle),
        duration: 3000,
      });

      const allModulesCompleted = path.modules.every(m => newCompletedModules.has(m.id));
      if (allModulesCompleted) {
        setShowPathCongratsDialog(true);
      }
    }
  };
  
  const getModuleIcon = (type: PathModule['type']) => {
    switch (type) {
      case 'introduction': return <BookOpen className="h-6 w-6 text-primary" />;
      case 'skill_practice': return <Edit3 className="h-6 w-6 text-primary" />;
      case 'summary': return <CheckCircle className="h-6 w-6 text-primary" />;
      default: return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-12 shadow-xl overflow-hidden">
        {path.dataAiHint && (
          <div className="relative h-64 w-full">
            <Image 
              src={`https://placehold.co/800x300.png`} 
              alt={path.title} 
              fill 
              className="object-cover"
              data-ai-hint={path.dataAiHint} 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg">{path.title}</h1>
            </div>
          </div>
        )}
        {!path.dataAiHint && (
             <CardHeader className="bg-muted/30 p-8 text-center">
                <h1 className="text-4xl font-bold text-primary">{path.title}</h1>
             </CardHeader>
        )}
        <CardContent className="p-8">
          <p className="text-lg text-muted-foreground mt-2 text-center">{path.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {path.modules.map((module: PathModule, index: number) => (
          <Card key={module.id} className={`shadow-lg transition-all duration-300 hover:shadow-xl ${completedModules.has(module.id) ? 'opacity-80 border-green-500' : 'border-transparent'}`}>
            <CardHeader>
              <div className="flex items-center gap-4">
                {getModuleIcon(module.type)}
                <div>
                  <CardTitle className="text-xl text-accent">{module.title}</CardTitle>
                  {module.estimatedTime && (
                    <CardDescription className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" /> {module.estimatedTime}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
                {module.content.map((contentItem, i) => renderContent(contentItem, i, path.id))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleComplete(module.id, module.title)} variant={completedModules.has(module.id) ? "secondary" : "default"}>
                <Check className="mr-2 h-4 w-4" />
                {completedModules.has(module.id) ? t.markAsNotCompleted : t.markAsCompleted}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
            <Link href="/paths">{t.allPaths}</Link>
        </Button>
      </div>

      <AlertDialog open={showPathCongratsDialog} onOpenChange={setShowPathCongratsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary">{t.pathCompletedTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t.pathCompletedMessage.replace("{pathTitle}", path.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPathCongratsDialog(false)}>{t.continueLearning}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
