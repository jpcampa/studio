"use client";

import { resourcesData, Resource } from '@/data/resourcesData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Headphones, Zap, Clock, ArrowLeft } from 'lucide-react';

export default function ResourceDetailPage({ params }: { params: { resourceId: string } }) {
  const t = useTranslations();
  const resource = resourcesData.find(r => r.id === params.resourceId);

  if (!resource) {
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
        {resource.imageUrl && (
            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
            <Image 
                src={resource.imageUrl} 
                alt={resource.title} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={resource.dataAiHint || "resource details image"}
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
            <div className="my-4 flex flex-col justify-center items-center bg-gray-100 p-6 rounded-md">
                <Image src={resource.content} alt={resource.title} width={128} height={128} data-ai-hint={resource.dataAiHint || "audio player icon"} />
                <p className="mt-4 text-muted-foreground text-center">Contenido de audio no disponible en la demostración.<br/> Normalmente, aquí encontrarías un reproductor de audio.</p>
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
