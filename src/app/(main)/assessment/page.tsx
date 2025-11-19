
import { fetchExternalAssessmentDimensions as getAssessmentDimensions } from '@/data/assessment-service'; // Importar desde el nuevo servicio
import { QuestionnaireForm } from '@/components/assessment/QuestionnaireForm';
import { AssessmentPageClient } from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function AssessmentPageWrapper() {
  let assessmentDimensions: AssessmentDimension[] = [];
  let error: string | null = null;

  try {
    // Llamada directa a la función del servicio, sin fetch a la API interna
    assessmentDimensions = await getAssessmentDimensions();
  } catch (e) {
    console.error("Error fetching assessment dimensions on server:", e);
    error = e instanceof Error ? e.message : "No se pudieron cargar las preguntas de la evaluación. Por favor, inténtalo de nuevo más tarde.";
  }

  if (error || assessmentDimensions.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error al Cargar la Evaluación</AlertTitle>
          <AlertDescription>
            {error || "No se encontraron preguntas para la evaluación."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <AssessmentPageClient assessmentDimensions={assessmentDimensions} />;
}

export default AssessmentPageWrapper;
