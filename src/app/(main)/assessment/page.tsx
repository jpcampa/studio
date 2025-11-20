
"use client";

import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { getAssessmentDimensions } from '@/data/assessmentDimensions';

export default function AssessmentPage() {
  // Las dimensiones ahora se cargan desde el archivo de datos centralizado.
  const dimensions: AssessmentDimension[] = getAssessmentDimensions();

  // Pasamos las dimensiones directamente al componente cliente.
  // Ya no necesitamos estados de carga o error para esta parte.
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
    />
  );
}
