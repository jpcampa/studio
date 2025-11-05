
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentResultsDisplay } from '@/components/assessment/AssessmentResultsDisplay';
import { useTranslations } from '@/lib/translations';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAssessmentById, type AssessmentRecord } from '@/data/assessmentHistoryStore';
import { useUser } from '@/contexts/UserContext';
import { getAssessmentDimensions } from '@/data/assessmentDimensions';

interface HistoricalResultsPageClientProps {
  assessmentId: string;
}

export function HistoricalResultsPageClient({ assessmentId }: HistoricalResultsPageClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();

  const [assessmentRecord, setAssessmentRecord] = useState<AssessmentRecord | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) {
      try {
        const record = getAssessmentById(assessmentId);
        if (record) {
          setAssessmentRecord(record);
        } else {
          setError(`No se encontró una evaluación con el ID: ${assessmentId}.`);
          setAssessmentRecord(null);
        }
      } catch (e) {
        console.error("HistoricalAssessmentResultsPage: Error loading assessment from history store:", e);
        setError("Error al cargar los resultados de la evaluación histórica.");
        setAssessmentRecord(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("ID de evaluación no proporcionado.");
      setIsLoading(false);
      setAssessmentRecord(null);
    }
  }, [assessmentId]);

  const handleRetakeAssessment = () => {
    router.push('/assessment/intro');
  };

  const handleViewHistory = () => {
    router.push('/my-assessments');
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !assessmentRecord) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">{t.errorOccurred}</p>
        <p className="text-muted-foreground">{error || "No se pudo cargar la evaluación."}</p>
        <div className="mt-6 space-x-4">
          <Button onClick={handleViewHistory} variant="outline">
            Volver al Historial
          </Button>
          <Button onClick={handleRetakeAssessment}>
            {t.takeInitialAssessment}
          </Button>
        </div>
      </div>
    );
  }

  // We need to pass the nested 'data' object from the record to the component
  const resultsForDisplay = {
      emotionalProfile: assessmentRecord.data.emotionalProfile,
      priorityAreas: assessmentRecord.data.priorityAreas,
      feedback: assessmentRecord.data.feedback,
  };
  
  const [rawAnswersWithWeight, setRawAnswersWithWeight] = useState<Record<string, { score: number, weight: number }> | null>(null);

  useEffect(() => {
    const fetchDimensionsAndProcess = async () => {
      if (assessmentRecord?.data.respuestas) {
        const assessmentDimensions = await getAssessmentDimensions();
        const processedAnswers = Object.entries(assessmentRecord.data.respuestas).reduce((acc, [key, value]) => {
          let weight = 1;
          for (const dim of assessmentDimensions) {
            const item = dim.items.find(i => i.id === key);
            if (item) {
              weight = item.weight;
              break;
            }
          }
          acc[key] = { score: value, weight: weight };
          return acc;
        }, {} as Record<string, { score: number, weight: number }>);
        setRawAnswersWithWeight(processedAnswers);
      }
    };
    fetchDimensionsAndProcess();
  }, [assessmentRecord]);


  return (
    <div className="container mx-auto py-8">
      <AssessmentResultsDisplay 
        results={resultsForDisplay} 
        rawAnswers={rawAnswersWithWeight}
        userId={user?.id}
        onRetake={handleRetakeAssessment}
        assessmentTimestamp={assessmentRecord.timestamp} 
      />
       <div className="mt-8 text-center">
        <Button onClick={handleViewHistory} variant="outline">
          Volver al Historial de Evaluaciones
        </Button>
      </div>
    </div>
  );
}
