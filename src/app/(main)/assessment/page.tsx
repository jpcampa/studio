
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
import { RotateCcw, TestTube2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { assessmentDimensions } from '@/data/assessmentDimensions';

const DEVELOPER_EMAIL = 'jpcampa@example.com';

export default function AssessmentPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
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

  const handleDevSubmit = async () => {
    const randomAnswers: Record<string, number> = {};
    assessmentDimensions.forEach(dimension => {
      dimension.items.forEach(item => {
        randomAnswers[item.id] = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
      });
    });
    await handleSubmit(randomAnswers);
  };
  
  const isDeveloper = user?.email === DEVELOPER_EMAIL;

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
      {showQuestionnaire && (
        <>
          {isDeveloper && (
            <div className="mb-4 text-center">
              <Button onClick={handleDevSubmit} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
                <TestTube2 className="mr-2 h-4 w-4" />
                🧪 Rellenar para Desarrollo
              </Button>
            </div>
          )}
          <QuestionnaireForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </>
      )}
    </div>
  );
}
