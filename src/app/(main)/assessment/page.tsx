
"use client";
import { useState, useEffect } from 'react';
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Esta es ahora la fuente ÚNICA de verdad para las preguntas.
async function fetchAssessmentQuestions(): Promise<AssessmentDimension[]> {
    const res = await fetch('/api/assessment-questions');
    if (!res.ok) {
        // Esto lanzará un error que será capturado por el bloque catch
        throw new Error(`Failed to fetch assessment questions: ${res.statusText}`);
    }
    return res.json();
}


export default function AssessmentPage() {
  const [dimensions, setDimensions] = useState<AssessmentDimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchAssessmentQuestions();
        setDimensions(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "No se pudieron cargar las preguntas.";
        setError(errorMessage);
        toast({
            title: "Error de Carga",
            description: "No se pudieron cargar las preguntas de la evaluación. Por favor, intenta recargar la página.",
            variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold">Error al Cargar</p>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Recargar Página
        </Button>
      </div>
    );
  }
  
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
    />
  );
}

