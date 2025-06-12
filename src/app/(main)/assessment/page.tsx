
"use client";

import { useState } from 'react';
import { QuestionnaireForm } from '@/components/assessment/QuestionnaireForm';
// AssessmentResultsDisplay is no longer directly used here
import { submitAssessment, ServerAssessmentResult } from '@/actions/assessment';
import { useTranslations } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, TestTube2, ShieldQuestion, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { assessmentDimensions } from '@/data/assessmentDimensions';
import { encryptDataAES } from '@/lib/encryption'; 
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogModalTitle, DialogDescription as DialogModalDescription } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';


const DEVELOPER_EMAIL = 'jpcampa@example.com';
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';

interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, number>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

export default function AssessmentPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  // No longer managing assessmentResults or showQuestionnaire directly here for displaying results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSaveUrl, setGeneratedSaveUrl] = useState<string | null>(null);
  const [isProcessingModalVisible, setIsProcessingModalVisible] = useState(false);

  const handleSubmit = async (answers: Record<string, number>) => {
    setIsSubmitting(true);
    setIsProcessingModalVisible(true);
    setGeneratedSaveUrl(null); 

    const result: ServerAssessmentResult = await submitAssessment(answers);

    await new Promise(resolve => setTimeout(resolve, 2500)); 

    setIsProcessingModalVisible(false);
    setIsSubmitting(false);

    if (result.success) {
      // Store results in sessionStorage
      try {
        localStorage.setItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY, JSON.stringify(result.data));
        console.log("AssessmentPage: Results saved to sessionStorage:", JSON.stringify(result.data).substring(0,200) + "...");
      } catch (error) {
        console.error("AssessmentPage: Error saving results to sessionStorage:", error);
        toast({
            title: t.errorOccurred,
            description: "No se pudieron guardar temporalmente los resultados para mostrar.",
            variant: "destructive",
        });
        return; // Prevent further navigation if storage fails
      }

      toast({
        title: t.assessmentResultsReadyTitle,
        description: t.assessmentResultsReadyMessage,
      });

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

        try {
          console.log("Payload a encriptar para guardar evaluación:", payloadToSave);
          const encryptedPayload = encryptDataAES(payloadToSave);
          const saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;
          setGeneratedSaveUrl(saveUrl); // Still set for debug display on this page if needed later
          console.log("Generated Assessment Save URL (for debug):", saveUrl);
        } catch (encError) {
          console.error("Error encrypting assessment payload:", encError);
          setGeneratedSaveUrl(t.errorOccurred + " (encryption failed)");
        }
      } else {
        setGeneratedSaveUrl(t.errorOccurred + " (User ID not available for debug URL)");
      }
      
      // Redirect to the new results intro page
      router.push('/assessment/results-intro');

    } else {
      toast({
        title: t.errorOccurred,
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDevSubmit = async () => {
    const randomAnswers: Record<string, number> = {};
    assessmentDimensions.forEach(dimension => {
      dimension.items.forEach(item => {
        randomAnswers[item.id] = Math.floor(Math.random() * 5) + 1; 
      });
    });
    await handleSubmit(randomAnswers);
  };
  
  const isDeveloper = user?.email === DEVELOPER_EMAIL;

  // The logic to display AssessmentResultsDisplay is removed from this page.
  // This page now only handles the questionnaire form and processing.
  
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
        
      {/* Debug display for generatedSaveUrl can remain if useful, or be removed */}
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
            Esta URL se genera para mostrar cómo se enviarían los datos. No se envía automáticamente.
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

    