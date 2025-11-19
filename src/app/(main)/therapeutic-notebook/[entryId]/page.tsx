
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getNotebookEntryById, type NotebookEntry, formatEntryTimestamp } from '@/data/therapeuticNotebookStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, NotebookText, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NotebookEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = params.entryId as string;

  const [entry, setEntry] = useState<NotebookEntry | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (entryId) {
      const foundEntry = getNotebookEntryById(entryId);
      setEntry(foundEntry);
      setIsLoading(false);
    }
  }, [entryId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (entry === null || entry === undefined) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <p className="mt-4 text-lg font-semibold">Entrada no encontrada</p>
        <p className="text-muted-foreground">No se pudo encontrar una entrada con el ID proporcionado.</p>
        <Button onClick={() => router.push('/therapeutic-notebook')} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Cuaderno
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-3">
                <NotebookText className="h-6 w-6" />
                {entry.title}
              </CardTitle>
              <CardDescription className="flex items-center text-xs pt-2">
                <Calendar className="mr-2 h-4 w-4" />
                {formatEntryTimestamp(entry.timestamp)}
              </CardDescription>
            </div>
            {entry.pathId && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/paths/${entry.pathId}`}>
                  Ir a la ruta <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Usamos 'whitespace-pre-line' para respetar los saltos de línea y 'break-words' para evitar desbordamientos */}
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line break-words">
             {entry.content}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

