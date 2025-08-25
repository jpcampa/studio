"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle } from 'lucide-react';
import type { Path } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { getCompletedModules } from '@/lib/progressStore';

interface PathProgressCardProps {
  path: Path;
}

export function PathProgressCard({ path }: PathProgressCardProps) {
  const t = useTranslations();
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    setIsClient(true);
    setCompletedModules(getCompletedModules(path.id));
  }, [path.id]);

  if (!isClient) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return null; 
  }

  const totalModules = path.modules.length;
  const completedCount = completedModules.size;
  const progressPercentage = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  const isCompleted = progressPercentage === 100;
  const hasStarted = completedCount > 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-accent">{path.title}</CardTitle>
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completada
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm min-h-[40px]">{path.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm text-muted-foreground">
            <span>Progreso</span>
            <span>{t.completedModules.replace('{completed}', completedCount.toString()).replace('{total}', totalModules.toString())}</span>
          </div>
          <Progress value={progressPercentage} aria-label={`Progreso de la ruta: ${progressPercentage.toFixed(0)}%`} />
        </div>
        {!hasStarted && (
            <p className="text-xs text-muted-foreground italic text-center">{t.pathNotStarted}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/paths/${path.id}`}>
            {hasStarted ? <PlayCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {hasStarted ? t.continuePath : t.startPath}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
