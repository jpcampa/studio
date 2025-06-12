
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
import { RotateCcw, TestTube2, ShieldQuestion, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { assessmentDimensions } from '@/data/assessmentDimensions';
import { encryptDataAES } from '@/lib/encryption'; // Import encryption utility
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogModalTitle, DialogDescription as DialogModalDescription } from "@/components/ui/dialog"; // Renamed to avoid conflict
import { useRouter } from 'next/navigation';


const DEVELOPER_EMAIL = 'jpcampa@example.com';

// Constants for URL generation
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";


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
  const [assessmentResults, setAssessmentResults] = useState<InitialAssessmentOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [generatedSaveUrl, setGeneratedSaveUrl] = useState<string | null>(null);
  const [isProcessingModalVisible, setIsProcessingModalVisible] = useState(false);

  const handleSubmit = async (answers: Record<string, number>) => {
    setIsSubmitting(true);
    setIsProcessingModalVisible(true);
    setGeneratedSaveUrl(null); 

    const result: ServerAssessmentResult = await submitAssessment(answers);

    // Artificial delay to simulate further processing after AI returns
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    setIsProcessingModalVisible(false);
    setIsSubmitting(false);

    if (result.success) {
      setAssessmentResults(result.data);
      setShowQuestionnaire(false);
      toast({
        title: t.assessmentResultsReadyTitle, // Using specific toast message
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
          setGeneratedSaveUrl(saveUrl);
          console.log("Generated Assessment Save URL:", saveUrl);
        } catch (encError) {
          console.error("Error encrypting assessment payload:", encError);
          setGeneratedSaveUrl(t.errorOccurred + " (encryption failed)");
        }
      } else {
        setGeneratedSaveUrl(t.errorOccurred + " (User ID not available)");
      }

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
    setGeneratedSaveUrl(null); 
    router.push('/assessment/intro');
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

  if (!showQuestionnaire && assessmentResults) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <AssessmentResultsDisplay results={assessmentResults} onRetake={handleRetakeAssessment} />
        
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
                Esta URL se genera para mostrar cómo se enviarían los datos, incluyendo un `assessmentId` único. No se envía automáticamente.
              </p>
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                <code>{generatedSaveUrl}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
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
       {!showQuestionnaire && !assessmentResults && !isProcessingModalVisible && ( 
           <div className="text-center py-10">
             <p className="text-muted-foreground">{t.loading}...</p>
             <Button onClick={() => router.push('/assessment/intro')} className="mt-4">{t.startAssessment}</Button>
           </div>
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
