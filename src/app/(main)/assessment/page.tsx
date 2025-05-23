"use client";

import { useState } from 'react';
import { QuestionnaireForm } from '@/components/assessment/QuestionnaireForm';
import { AssessmentResultsDisplay } from '@/components/assessment/AssessmentResultsDisplay';
import { submitAssessment, ServerAssessmentResult } from '@/actions/assessment';
import { useTranslations } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function AssessmentPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [assessmentResults, setAssessmentResults] = useState<InitialAssessmentOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

  const handleSubmit = async (answers: Record<string, number>) => {
    setIsSubmitting(true);
    const result: ServerAssessmentResult = await submitAssessment(answers);
    setIsSubmitting(false);

    if (result.success) {
      setAssessmentResults(result.data);
      setShowQuestionnaire(false);
      toast({
        title: "Evaluación Completada",
        description: "Tus resultados están listos.",
      });
    } else {
      toast({
        title: t.errorOccurred,
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleRetakeAssessment = () => {
    setAssessmentResults(null);
    setShowQuestionnaire(true);
  };

  if (!showQuestionnaire && assessmentResults) {
    return (
      <div className="container mx-auto py-8">
        <AssessmentResultsDisplay results={assessmentResults} />
        <div className="mt-8 text-center">
          <Button onClick={handleRetakeAssessment} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Realizar Evaluación de Nuevo
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{t.assessmentTitle}</CardTitle>
          <CardDescription className="text-lg">{t.assessmentIntro}</CardDescription>
        </CardHeader>
        {!showQuestionnaire && !assessmentResults && (
           <CardContent>
             <Button onClick={() => setShowQuestionnaire(true)}>{t.startAssessment}</Button>
           </CardContent>
        )}
      </Card>
      {showQuestionnaire && <QuestionnaireForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
    </div>
  );
}
