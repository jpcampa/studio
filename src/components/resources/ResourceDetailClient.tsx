
"use client";

import { Resource } from '@/data/resourcesData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Headphones, Zap, Clock, ArrowLeft, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ResourceDetailClientProps {
  resource: Resource;
}

export function ResourceDetailClient({ resource }: ResourceDetailClientProps) {
  const t = useTranslations();

  if (!resource) {
    // This case should ideally be handled by the server component with notFound()
    return <div className="container mx-auto py-8 text-center text-xl">{t.errorOccurred} Recurso no encontrado.</div>;
  }

  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <BookOpen className="h-6 w-6 text-primary" />;
      case 'audio': return <Headphones className="h-6 w-6 text-primary" />;
      case 'exercise': return <Zap className="h-6 w-6 text-primary" />;
      default: return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-xl">
        {resource.imageUrl && resource.type !== 'audio' && (
            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
            <Image 
                src={resource.imageUrl} 
                alt={resource.title} 
                fill
                className="object-cover"
                data-ai-hint={resource.dataAiHint || "resource details image"}
            />
            </div>
        )}
         {resource.type === 'audio' && resource.imageUrl && ( // Specific image for audio card header if available
            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
              <Image 
                  src={resource.imageUrl} 
                  alt={resource.title} 
                  fill
                  className="object-cover"
                  data-ai-hint={resource.dataAiHint || "audio resource image"}
              />
            </div>
        )}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline">{resource.category}</Badge>
            {getResourceTypeIcon(resource.type)}
          </div>
          <CardTitle className="text-3xl font-bold text-primary">{resource.title}</CardTitle>
          {resource.estimatedTime && (
            <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
              <Clock className="h-4 w-4 mr-1" /> {resource.estimatedTime}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="py-6 px-6 md:px-8">
          {resource.type === 'audio' && resource.content?.startsWith('https://placehold.co') ? (
             <div className="my-4 p-4 border rounded-lg shadow-sm bg-muted/30" data-ai-hint="audio player interface">
                <div className="flex items-center w-full gap-3 mb-3">
                    <PlayCircle className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-foreground truncate" title={resource.title.replace('Audio: ', '')}>{resource.title.replace('Audio: ', '')}</p>
                    <p className="text-xs text-muted-foreground">Reproductor simulado</p>
                    </div>
                </div>
                <Progress value={60} className="w-full h-2 mb-2" aria-label="Progreso de audio simulado" />
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Contenido de audio no disponible en la demostración.
                  <br/> Normalmente, aquí encontrarías un reproductor de audio.
                </p>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-foreground dark:prose-invert" dangerouslySetInnerHTML={{ __html: resource.content?.replace(/\n/g, '<br />') || resource.summary }} />
          )}
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
          </Link>
        </Button>
      </div>
    </div>
  );
}
