
"use client";

import { useState } from 'react';
import { QuestionnaireForm } from '@/components/assessment/QuestionnaireForm';
import { submitAssessment, type ServerAssessmentResult } from '@/actions/assessment';
import { saveAssessment, type SaveResult } from '@/actions/client-assessment';
import { useTranslations } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube2, ShieldQuestion, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getAssessmentDimensions } from '@/data/assessmentDimensions';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogModalTitle, DialogDescription as DialogModalDescription } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { saveAssessmentToHistory } from '@/data/assessmentHistoryStore';

const DEVELOPER_EMAIL = 'jpcampa@example.com';
const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';
const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';


interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, { score: number; weight: number }>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

export interface StoredAssessmentResults {
    aiInterpretation: InitialAssessmentOutput;
    rawAnswers: Record<string, { score: number; weight: number }>;
}

export default function AssessmentPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSaveUrl, setGeneratedSaveUrl] = useState<string | null>(null);
  const [isProcessingModalVisible, setIsProcessingModalVisible] = useState(false);

  const handleSubmit = async (answers: Record<string, { score: number; weight: number }>) => {
    setIsSubmitting(true);
    setIsProcessingModalVisible(true);
    setGeneratedSaveUrl(null); 

    // Remove in-progress data before submitting
    localStorage.removeItem(IN_PROGRESS_ANSWERS_KEY);

    const result: ServerAssessmentResult = await submitAssessment(answers);

    await new Promise(resolve => setTimeout(resolve, 2500)); 

    setIsProcessingModalVisible(false);

    if (result.success && result.data) {
      try {
        const resultsToStore: StoredAssessmentResults = {
            aiInterpretation: result.data,
            rawAnswers: answers
        };
        localStorage.setItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY, JSON.stringify(resultsToStore));
        console.log("AssessmentPage: Results and raw answers saved to sessionStorage:", JSON.stringify(resultsToStore).substring(0,200) + "...");
        
        const scoresOnlyForHistory: Record<string, number> = Object.entries(answers).reduce((acc, [key, value]) => {
          acc[key] = value.score;
          return acc;
        }, {} as Record<string, number>);

        saveAssessmentToHistory(result.data, scoresOnlyForHistory);
        console.log("AssessmentPage: Results also saved to local assessment history store.");

      } catch (error) {
        console.error("AssessmentPage: Error saving results to sessionStorage or history store:", error);
        toast({
            title: t.errorOccurred,
            description: "No se pudieron guardar temporalmente los resultados para mostrar.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return; 
      }

      toast({
        title: t.assessmentResultsReadyTitle,
        description: t.assessmentResultsReadyMessage,
      });

      // Attempt to save assessment to external API via Server Action
      if (user && user.id) {
        const assessmentTimestamp = new Date().toISOString();
        const assessmentId = crypto.randomUUID(); 

        const payloadToSave: AssessmentSavePayload = {
          assessmentId: assessmentId,
          userId: user.id,
          rawAnswers: answers,
          aiInterpretation: result.data,
          assessmentTimestamp: assessmentTimestamp,
        };
        
        const saveResult: SaveResult = await saveAssessment(payloadToSave);

        setGeneratedSaveUrl(saveResult.debugUrl || "No URL generated");

        toast({
          title: saveResult.success ? t.assessmentSavedSuccessTitle : t.assessmentSavedErrorTitle,
          description: saveResult.message,
          variant: saveResult.success ? "default" : "destructive",
          className: saveResult.success ? "bg-green-50 dark:bg-green-900/30 border-green-500" : undefined,
        });

      } else {
        setGeneratedSaveUrl(t.errorOccurred + " (User ID not available for debug URL)");
        toast({
          title: t.assessmentSaveSkippedTitle,
          description: t.assessmentSaveSkippedMessage,
          variant: "default", 
          className: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500",
        });
        console.warn("AssessmentPage: User not identified or user.id missing. Cannot save assessment to external API.");
      }
      
      router.push('/assessment/results-intro');

    } else {
      toast({
        title: t.errorOccurred,
        description: result.error,
        variant: "destructive",
      });
    }
    setIsSubmitting(false); 
  };

  const handleDevSubmit = async () => {
    const assessmentDimensions = await getAssessmentDimensions();
    const randomAnswers: Record<string, { score: number, weight: number }> = {};
    assessmentDimensions.forEach(dimension => {
      dimension.items.forEach(item => {
        randomAnswers[item.id] = {
          score: Math.floor(Math.random() * 5) + 1,
          weight: item.weight,
        };
      });
    });
    await handleSubmit(randomAnswers);
  };
  
  const isDeveloper = user?.email === DEVELOPER_EMAIL;
  
  return (
    <div className="container mx-auto py-8">
      {isDeveloper && (
        <div className="mb-4 text-center">
          <Button onClick={handleDevSubmit} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
            <TestTube2 className="mr-2 h-4 w-4" />
            🧪 Rellenar para Desarrollo
          </Button>
        </div>
      )}
      <QuestionnaireForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        
      {generatedSaveUrl && (
        <Card className="mt-8 shadow-md border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30">
        <CardHeader>
            <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300 flex items-center">
            <ShieldQuestion className="mr-2 h-5 w-5" />
            {t.generatedAssessmentSaveUrlLabel}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
            Esta URL se genera para el intento de guardado y se muestra aquí para depuración.
            </p>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
            <code>{generatedSaveUrl}</code>
            </pre>
        </CardContent>
        </Card>
      )}

      <Dialog open={isProcessingModalVisible}>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center text-center p-8">
          <DialogHeader>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
            <DialogModalTitle className="text-2xl font-bold text-primary">
              {t.assessmentCompletedModalTitle}
            </DialogModalTitle>
            <DialogModalDescription className="text-md text-muted-foreground mt-2">
              {t.assessmentProcessingModalMessage}
            </DialogModalDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
