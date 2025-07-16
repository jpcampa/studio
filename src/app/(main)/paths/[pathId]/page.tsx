
"use client";

import { use, useState, useEffect } from 'react';
import { pathsData, Path, PathModule, ModuleContent } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Headphones, Edit3, Clock, PlayCircle, ExternalLink, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCompletedModules, saveCompletedModules } from '@/lib/progressStore';
import { useActivePath } from '@/contexts/ActivePathContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

interface PathDetailPageProps {
  params: Promise<{ pathId: string }>;
}

const renderContent = (contentItem: ModuleContent, index: number) => {
  switch (contentItem.type) {
    case 'title':
      return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3">{contentItem.text}</h3>;
    case 'paragraph':
      return <p key={index} className="text-base leading-relaxed whitespace-pre-line mb-4" dangerouslySetInnerHTML={{ __html: contentItem.text.replace(/\n/g, '<br />') }} />;
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4">
          {contentItem.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'collapsible':
      return (
        <Accordion key={index} type="single" collapsible className="w-full mb-4">
          <AccordionItem value={`item-${index}`} className="border rounded-lg shadow-sm">
            <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
              {contentItem.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4">
                {contentItem.content.map((item, i) => renderContent(item, i))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'exercise':
        return (
            <Card key={index} className="bg-muted/30 my-6 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{contentItem.title}</CardTitle>
                    {contentItem.objective && <CardDescription className="pt-2">{contentItem.objective}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {contentItem.content.map((item, i) => renderContent(item, i))}
                </CardContent>
                {contentItem.duration && <CardFooter className="text-xs text-muted-foreground"><Clock className="mr-2 h-3 w-3" />Duración sugerida: {contentItem.duration}</CardFooter>}
            </Card>
        );
    case 'quote':
        return <blockquote key={index} className="mt-6 border-l-2 pl-6 italic text-accent-foreground/80">"{contentItem.text}"</blockquote>;
    default:
      return null;
  }
};


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
                {module.content.map((contentItem, i) => renderContent(contentItem, i))}
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
