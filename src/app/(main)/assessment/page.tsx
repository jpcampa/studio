
"use client";

import { useState, useEffect } from 'react';
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/lib/translations';

const ASSESSMENT_QUESTIONS_STORAGE_KEY = 'workwell-assessment-questions-cache';

export default function AssessmentPage() {
  const t = useTranslations();
  const [dimensions, setDimensions] = useState<AssessmentDimension[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const cachedQuestions = localStorage.getItem(ASSESSMENT_QUESTIONS_STORAGE_KEY);
      if (cachedQuestions) {
        const parsedDimensions = JSON.parse(cachedQuestions) as AssessmentDimension[];
        if(parsedDimensions && parsedDimensions.length > 0) {
            setDimensions(parsedDimensions);
            console.log("AssessmentPage: Successfully loaded questions from localStorage.");
        } else {
            throw new Error("Cached data is empty or invalid.");
        }
      } else {
        throw new Error("No cached assessment questions found. Please visit the introduction page first.");
      }
    } catch (e: any) {
      console.error("AssessmentPage: Error loading questions from localStorage:", e);
      setError(`No se han podido cargar las preguntas de la evaluación. Asegúrate de visitar primero la página de introducción. Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  // Pass error and dimensions to the client component to handle rendering
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
      initialError={error}
    />
  );
}
