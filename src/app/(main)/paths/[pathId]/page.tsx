
"use client";

import { use, useState, useEffect } from 'react'; 
import { pathsData, PathModule, Path } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Headphones, Edit3, Clock, PlayCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCompletedModules, saveCompletedModules } from '@/lib/progressStore';
import { useActivePath } from '@/contexts/ActivePathContext';

interface PathDetailPageProps {
  params: Promise<{ pathId: string }>;
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
      // The line below was removed as it was redundant and likely causing a re-render loop.
      // activePathContext.updateModuleCompletion(path.id, '', false); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, loadPath]); // Dependencies updated to stable function reference from context and path object.


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
      case 'text': return <BookOpen className="h-6 w-6 text-primary" />;
      case 'audio': return <Headphones className="h-6 w-6 text-primary" />; 
      case 'reflection': return <Edit3 className="h-6 w-6 text-primary" />;
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
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg">{path.title}</h1>
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
          <Card key={module.id} className={`shadow-lg transition-all duration-300 hover:shadow-xl ${completedModules.has(module.id) ? 'opacity-70 border-green-500' : 'border-transparent'}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                {getModuleIcon(module.type)}
                <div>
                  <CardTitle className="text-xl text-accent">{t.module} {index + 1}: {module.title}</CardTitle>
                  {module.estimatedTime && (
                    <CardDescription className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" /> {module.estimatedTime}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {module.type === 'text' && (
                <Button asChild>
                  <Link href={module.content} target="_blank" rel="noopener noreferrer">
                    {t.startReading}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {module.type === 'audio' && module.content.startsWith('https://placehold.co') && (
                 <div className="my-4 p-4 border rounded-lg shadow-sm bg-muted/30" data-ai-hint="audio player interface">
                    <div className="flex items-center w-full gap-3 mb-3">
                        <PlayCircle className="w-10 h-10 text-primary flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                        <p className="font-semibold text-foreground truncate" title={module.title.replace('Audio: ', '')}>{module.title.replace('Audio: ', '')}</p>
                        <p className="text-xs text-muted-foreground">Reproductor simulado</p>
                        </div>
                    </div>
                    <Progress value={35} className="w-full h-2 mb-2" aria-label="Progreso de audio simulado" />
                    <p className="text-xs text-muted-foreground text-center">Contenido de audio no disponible en la demostración.</p>
                 </div>
              )}
              {module.type === 'reflection' && (
                <p className="text-base leading-relaxed whitespace-pre-line italic text-muted-foreground">{module.content}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleComplete(module.id, module.title)} variant={completedModules.has(module.id) ? "secondary" : "default"}>
                <CheckCircle className="mr-2 h-4 w-4" />
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
