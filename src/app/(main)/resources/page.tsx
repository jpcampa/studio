"use client";

import Link from 'next/link';
import Image from 'next/image';
import { resourcesData, Resource } from '@/data/resourcesData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/lib/translations';
import { BookOpen, Headphones, Zap, ArrowRight, Clock } from 'lucide-react'; // Zap for exercise

export default function ResourcesPage() {
  const t = useTranslations();

  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return <BookOpen className="h-5 w-5 mr-2 text-primary" />;
      case 'audio': return <Headphones className="h-5 w-5 mr-2 text-primary" />;
      case 'exercise': return <Zap className="h-5 w-5 mr-2 text-primary" />;
      default: return <BookOpen className="h-5 w-5 mr-2 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.resourcesTitle}</h1>
        <p className="text-lg text-muted-foreground">{t.resourcesIntro}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resourcesData.map((resource: Resource) => (
          <Card key={resource.id} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            {resource.imageUrl && (
                 <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                    <Image 
                        src={resource.imageUrl} 
                        alt={resource.title} 
                        layout="fill" 
                        objectFit="cover" 
                        data-ai-hint={resource.dataAiHint || "resource image"}
                    />
                 </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{resource.category}</Badge>
                {getResourceTypeIcon(resource.type)}
              </div>
              <CardTitle className="text-xl text-accent">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-sm leading-relaxed">{resource.summary}</CardDescription>
              {resource.estimatedTime && (
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" /> {resource.estimatedTime}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/resources/${resource.id}`}>
                  Leer más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
