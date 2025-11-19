
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentResultsDisplay } from '@/components/assessment/AssessmentResultsDisplay';
import { useTranslations } from '@/lib/translations';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StoredAssessmentResults } from '@/components/assessment/AssessmentPageClient';
import { useUser } from '@/contexts/UserContext';


const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';

export default function CurrentResultsPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();
  const [storedResults, setStoredResults] = useState<StoredAssessmentResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = localStorage.getItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY);
      if (item) {
        const parsedResults = JSON.parse(item) as StoredAssessmentResults;
        // Basic validation
        if (parsedResults && parsedResults.aiInterpretation && parsedResults.rawAnswers && parsedResults.assessmentDimensions) {
          setStoredResults(parsedResults);
        } else {
          setError("Los datos de la evaluación guardados son inválidos o incompletos.");
          console.error("CurrentResultsPage: Invalid assessment data structure in sessionStorage", parsedResults);
        }
      } else {
        setError("No se encontraron resultados de la evaluación actual. Por favor, completa la evaluación primero.");
        console.warn("CurrentResultsPage: No assessment results found in sessionStorage.");
      }
    } catch (e) {
      console.error("CurrentResultsPage: Error parsing assessment results from sessionStorage:", e);
      setError("Error al cargar los resultados de la evaluación actual.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetakeAssessment = () => {
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

  if (!storedResults) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No hay resultados actuales para mostrar.</p>
         <Button onClick={handleRetakeAssessment} className="mt-6">
          {t.takeInitialAssessment}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AssessmentResultsDisplay 
        results={storedResults.aiInterpretation}
        rawAnswers={storedResults.rawAnswers}
        assessmentDimensions={storedResults.assessmentDimensions}
        userId={user?.id}
        onRetake={handleRetakeAssessment} 
      />
    </div>
  );
}
