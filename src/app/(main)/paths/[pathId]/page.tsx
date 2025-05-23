"use client";

import { pathsData, PathModule, Path } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Headphones, Edit3, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'; // For V1, progress is not saved. In V2, this would come from user data.

export default function PathDetailPage({ params }: { params: { pathId: string } }) {
  const t = useTranslations();
  const path = pathsData.find(p => p.id === params.pathId);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set()); // Mock completion state

  if (!path) {
    return <div className="container mx-auto py-8 text-center text-xl">{t.errorOccurred} Ruta no encontrada.</div>;
  }

  const toggleComplete = (moduleId: string) => {
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
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
              layout="fill" 
              objectFit="cover" 
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
              {module.type === 'audio' && module.content.startsWith('https://placehold.co') && (
                 <div className="my-4 flex justify-center items-center bg-gray-100 p-4 rounded-md">
                    <Image src={module.content} alt={module.title} width={100} height={100} data-ai-hint={module.dataAiHint || "audio player"} />
                    <p className="ml-4 text-muted-foreground">Contenido de audio no disponible en la demostración.</p>
                 </div>
              )}
              {module.type !== 'audio' && <p className="text-base leading-relaxed whitespace-pre-line">{module.content}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleComplete(module.id)} variant={completedModules.has(module.id) ? "secondary" : "default"}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {completedModules.has(module.id) ? "Marcar como No Completado" : t.markAsCompleted}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
            <Link href="/paths">Volver a todas las Rutas</Link>
        </Button>
      </div>
    </div>
  );
}
