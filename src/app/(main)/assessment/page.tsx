
"use client";

import { useState } from 'react';
import { QuestionnaireForm } from '@/components/assessment/QuestionnaireForm';
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
import { saveAssessmentToHistory } from '@/data/assessmentHistoryStore'; // Import new store function


const DEVELOPER_EMAIL = 'jpcampa@example.com';
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';
const API_SAVE_TIMEOUT_MS = 15000; // 15 segundos para el guardado

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
        
        // Extraer solo las puntuaciones para el guardado en el historial local,
        // que espera un Record<string, number>
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

      // Attempt to save assessment to external API
      if (user && user.id) {
        const assessmentTimestamp = new Date().toISOString();
        const assessmentId = crypto.randomUUID(); 

        const payloadToSave: AssessmentSavePayload = {
          assessmentId: assessmentId,
          userId: user.id,
          rawAnswers: answers, // Ahora answers ya incluye el peso
          aiInterpretation: result.data,
          assessmentTimestamp: assessmentTimestamp,
        };

        let saveUrlForDebug = "";
        try {
          const encryptedPayload = encryptDataAES(payloadToSave);
          saveUrlForDebug = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;
          setGeneratedSaveUrl(saveUrlForDebug); 
          console.log("AssessmentPage: Attempting to save assessment to external API. URL (for server logging, payload encrypted):", saveUrlForDebug.substring(0,150) + "...");
          
          const saveResponse = await fetch(saveUrlForDebug, { signal: AbortSignal.timeout(API_SAVE_TIMEOUT_MS) });
          const saveResponseText = await saveResponse.text();

          if (saveResponse.ok) {
            const saveApiResult = JSON.parse(saveResponseText);
            if (saveApiResult.status === "OK") {
              toast({
                title: t.assessmentSavedSuccessTitle,
                description: t.assessmentSavedSuccessMessage,
                className: "bg-green-50 dark:bg-green-900/30 border-green-500",
              });
              console.log("AssessmentPage: Assessment successfully saved to API. Response:", saveApiResult);
            } else {
              toast({
                title: t.assessmentSavedErrorTitle,
                description: t.assessmentSavedErrorMessageApi.replace("{message}", saveApiResult.message || t.errorOccurred),
                variant: "destructive",
              });
              console.warn("AssessmentPage: API reported 'NOOK' for assessment save. Message:", saveApiResult.message, "Full Response:", saveApiResult);
            }
          } else {
            toast({
              title: t.assessmentSavedErrorNetworkTitle,
              description: t.assessmentSavedErrorNetworkMessage.replace("{status}", saveResponse.status.toString()).replace("{details}", saveResponseText.substring(0,100)),
              variant: "destructive",
            });
            console.warn("AssessmentPage: Failed to save assessment to API. Status:", saveResponse.status, "Response Text:", saveResponseText);
          }
        } catch (error: any) {
          let errorMessage = t.assessmentSavedErrorGeneric;
          if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
            errorMessage = t.assessmentSavedErrorTimeout;
          } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
            errorMessage = t.assessmentSavedErrorFetchFailed;
            console.error("AssessmentPage: 'Failed to fetch' error. This often indicates a CORS issue or network problem. Check the browser's console (Network tab) for more details, and ensure the server at", new URL(saveUrlForDebug || API_BASE_URL).origin, "is configured to accept requests from this origin (your app's domain).");
          } else if (error instanceof SyntaxError) { 
            errorMessage = "Error procesando la respuesta del servidor de guardado (JSON inválido).";
          }
          toast({
            title: t.assessmentSavedErrorTitle,
            description: errorMessage,
            variant: "destructive",
          });
          console.error("AssessmentPage: Error saving assessment to API:", error, "URL attempted:", saveUrlForDebug);
        }
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
    const randomAnswers: Record<string, { score: number, weight: number }> = {};
    assessmentDimensions.forEach(dimension => {
      dimension.items.forEach(item => {
        randomAnswers[item.id] = {
          score: Math.floor(Math.random() * 5) + 1,
          weight: item.weight, // Incluimos el peso real del item
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
            Esta URL se genera para mostrar cómo se enviarían los datos y se usa para el intento de guardado.
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
