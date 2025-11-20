
"use client";

import { useState, useEffect } from 'react';
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
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
            throw new Error("Los datos de preguntas en caché están vacíos o son inválidos.");
        }
      } else {
        throw new Error("No se han podido cargar las preguntas de la evaluación. Por favor, vuelve a la página de introducción para que se carguen e inténtalo de nuevo.");
      }
    } catch (e: any) {
      console.error("AssessmentPage: Error loading questions from localStorage:", e);
      setError(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pasamos todos los estados al componente cliente para que él decida qué renderizar.
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
      initialError={error}
      isLoading={isLoading}
    />
  );
}
