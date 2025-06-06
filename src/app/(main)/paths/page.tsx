
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { pathsData, Path } from '@/data/pathsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActivePath } from '@/contexts/ActivePathContext'; // Importar el contexto

export default function PathsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [highlightedPathId, setHighlightedPathId] = useState<string | null>(null);
  const { clearActivePath } = useActivePath(); // Usar el contexto

  useEffect(() => {
    const startWithPath = searchParams.get('start_with');
    if (startWithPath) {
      const path = pathsData.find(p => p.title.toLowerCase() === startWithPath.toLowerCase() || p.id === startWithPath);
      if (path) {
        setHighlightedPathId(path.id);
        const element = document.getElementById(`path-${path.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchParams]);

  // Limpiar la ruta activa al salir de la página de listado de rutas,
  // si no se quiere que el badge persista globalmente.
  // Opcional: Podría ser mejor limpiarlo al navegar a una sección completamente diferente (ej. dashboard).
  // Por ahora, lo dejamos así para que el badge se quite si el usuario vuelve aquí.
  // useEffect(() => {
  //   return () => {
  //     clearActivePath();
  //   };
  // }, [clearActivePath]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.pathsTitle}</h1>
        <p className="text-lg text-muted-foreground">{t.selectPathPrompt}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pathsData.map((path: Path) => (
          <Card 
            key={path.id} 
            id={`path-${path.id}`}
            className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col ${highlightedPathId === path.id ? 'ring-2 ring-primary scale-105' : ''}`}
          >
            <CardHeader>
              {path.dataAiHint && (
                <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                  <Image 
                    src={`https://placehold.co/600x400.png`} 
                    alt={path.title} 
                    fill // Reemplaza layout="fill" objectFit="cover"
                    className="object-cover"
                    data-ai-hint={path.dataAiHint}
                  />
                </div>
              )}
              <CardTitle className="text-2xl text-accent">{path.title}</CardTitle>
              <CardDescription className="text-sm min-h-[40px]">{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Optionally list first few modules or a summary */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/paths/${path.id}`}>
                  Explorar Ruta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
