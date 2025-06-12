
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentResultsDisplay } from '@/components/assessment/AssessmentResultsDisplay';
import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { useTranslations } from '@/lib/translations';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';

export default function ShowResultsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [results, setResults] = useState<InitialAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedResults = localStorage.getItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY);
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults) as InitialAssessmentOutput;
        // Basic validation of parsed results structure
        if (parsedResults && parsedResults.emotionalProfile && parsedResults.priorityAreas && parsedResults.feedback) {
          setResults(parsedResults);
        } else {
          setError("Los datos de la evaluación guardados son inválidos.");
          console.error("ShowResultsPage: Invalid assessment data structure in sessionStorage", parsedResults);
        }
      } else {
        setError("No se encontraron resultados de la evaluación. Por favor, completa la evaluación primero.");
        console.warn("ShowResultsPage: No assessment results found in sessionStorage.");
      }
    } catch (e) {
      console.error("ShowResultsPage: Error parsing assessment results from sessionStorage:", e);
      setError("Error al cargar los resultados de la evaluación.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetakeAssessment = () => {
    // Optionally clear the results from sessionStorage when retaking
    // localStorage.removeItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY);
    router.push('/assessment/intro');
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">{t.errorOccurred}</p>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={handleRetakeAssessment} className="mt-6">
          {t.takeInitialAssessment}
        </Button>
      </div>
    );
  }

  if (!results) {
    // This case should ideally be caught by error state, but as a fallback:
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No hay resultados para mostrar.</p>
         <Button onClick={handleRetakeAssessment} className="mt-6">
          {t.takeInitialAssessment}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AssessmentResultsDisplay results={results} onRetake={handleRetakeAssessment} />
    </div>
  );
}

    