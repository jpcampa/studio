
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getNotebookEntryById, type NotebookEntry, formatEntryTimestamp } from '@/data/therapeuticNotebookStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, NotebookText, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Componente mejorado para formatear el contenido del cuaderno
function FormattedNotebookContent({ content }: { content: string }) {
    const blocks = content.split('\n\n'); // Dividir por párrafos (doble salto de línea)

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            {blocks.map((block, blockIndex) => {
                const lines = block.split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) return null;
                
                // Detectar si es una lista
                const isList = lines.every(line => line.trim().startsWith('-'));
                if (isList) {
                    return (
                        <ul key={blockIndex} className="list-disc space-y-1 pl-5">
                            {lines.map((item, itemIndex) => (
                                <li key={itemIndex} className="!my-1">{item.trim().substring(1).trim()}</li>
                            ))}
                        </ul>
                    );
                }

                // Procesar cada línea dentro del bloque
                return (
                    <div key={blockIndex} className="space-y-2">
                        {lines.map((line, lineIndex) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                    <h4 key={lineIndex} className="font-semibold text-primary !mt-6 !mb-2 text-xl">
                                        {line.substring(2, line.length - 2)}
                                    </h4>
                                );
                            }
                            if (line.startsWith('*') && line.endsWith('*')) {
                                return <p key={lineIndex} className="italic text-muted-foreground !my-1">{line.substring(1, line.length - 1)}</p>;
                            }
                            // Detectar una línea que es una pregunta (termina con :)
                            if (line.trim().endsWith(':')) {
                                return <p key={lineIndex} className="font-semibold text-foreground !mb-1">{line}</p>;
                            }
                            return <p key={lineIndex} className="!my-1 whitespace-pre-wrap">{line}</p>;
                        })}
                    </div>
                );
            })}
        </div>
    );
}


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
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl text-primary flex items-center gap-3">
                <NotebookText className="h-7 w-7" />
                {entry.title}
              </CardTitle>
              <CardDescription className="flex items-center text-sm pt-2 text-muted-foreground">
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
        <CardContent className="py-6">
          <FormattedNotebookContent content={entry.content} />
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
