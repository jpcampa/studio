
"use client";

import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
// Importamos las preguntas directamente del archivo JSON local.
import assessmentQuestions from '@/components/resources/assesment-questions.json';

export default function AssessmentPage() {
  // Las dimensiones ahora se cargan estáticamente desde el archivo importado.
  const dimensions: AssessmentDimension[] = assessmentQuestions;

  // Pasamos las dimensiones directamente al componente cliente.
  // Ya no necesitamos estados de carga o error para esta parte.
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
    />
  );
}
