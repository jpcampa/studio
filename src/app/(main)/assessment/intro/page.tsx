
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { ArrowRight, Info, Shield, ListChecks, UserCheck, BookOpen, FileJson } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchExternalAssessmentDimensions } from '@/data/assessment-service';
import { useToast } from '@/hooks/use-toast';

const ASSESSMENT_QUESTIONS_STORAGE_KEY = 'workwell-assessment-questions-cache';

export default function AssessmentIntroPage() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  // Pre-fetch questions when the component mounts on the client
  useEffect(() => {
    const preFetchQuestions = async () => {
      try {
        console.log('AssessmentIntroPage: Pre-fetching assessment questions...');
        const dimensions = await fetchExternalAssessmentDimensions();
        if (dimensions && dimensions.length > 0) {
          localStorage.setItem(ASSESSMENT_QUESTIONS_STORAGE_KEY, JSON.stringify(dimensions));
          console.log('AssessmentIntroPage: Questions pre-fetched and stored successfully.');
        } else {
          throw new Error('No dimensions fetched.');
        }
      } catch (error) {
        console.error("AssessmentIntroPage: Failed to pre-fetch assessment questions:", error);
        // Optionally, inform the user that there might be an issue
        toast({
          title: "Error de Carga",
          description: "No se pudieron precargar las preguntas de la evaluación. La página podría no funcionar correctamente.",
          variant: "destructive"
        });
        // Clear any old/bad data
        localStorage.removeItem(ASSESSMENT_QUESTIONS_STORAGE_KEY);
      }
    };
    preFetchQuestions();
  }, [toast]);


  const questionsJsonUrl = "https://firebasestorage.googleapis.com/v0/b/workwell-c4rlk.firebasestorage.app/o/assessment-questions.json?alt=media&token=02f5710e-38c0-4a29-90d5-0e3681acf4c4";

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-3xl shadow-xl my-8 overflow-hidden">
        <CardHeader className="p-0 relative h-64 w-full">
            <Image 
                src="https://workwellfut.com/imgapp/800x300/imagenEvaluacion.jpg"
                alt="Evaluación de bienestar" 
                fill 
                className="object-cover"
                data-ai-hint="wellness assessment concept"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // prevents looping
                    target.src = 'https://workwellfut.com/imgapp/800x300/default_800x300.jpg';
                }}
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
                <BookOpen className="h-16 w-16 text-white mb-4 bg-primary/50 rounded-full p-2 border-2 border-white/80" />
                <CardTitle className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {t.assessmentIntroPageTitle}
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-8 px-6 md:px-10 pt-8 text-base leading-relaxed text-foreground">
          <p className="text-center italic text-lg md:text-xl text-muted-foreground whitespace-pre-line">
            {t.assessmentIntroPageTagline}
          </p>
          <p className="whitespace-pre-line">
            {t.assessmentIntroPageMainText1}
          </p>
          
          <div className="space-y-3 p-4 border-l-4 border-accent bg-accent/10 rounded-md">
            <h3 className="text-xl font-semibold text-accent flex items-center">
              <ListChecks className="mr-3 h-6 w-6" />
              {t.assessmentIntroPagePurposeTitle}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-5 text-foreground/90">
              <li>{t.assessmentIntroPagePurpose1}</li>
              <li>{t.assessmentIntroPagePurpose2}</li>
              <li>{t.assessmentIntroPagePurpose3}</li>
            </ul>
          </div>

          <div className="space-y-3 p-4 border-l-4 border-primary bg-primary/10 rounded-md">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Info className="mr-3 h-6 w-6" />
              {t.assessmentIntroPageWhatToKnowTitle}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-5 text-foreground/90">
              <li><strong>{t.assessmentIntroPageWhatToKnowDurationLabel}</strong> {t.assessmentIntroPageWhatToKnowDurationText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowContentLabel}</strong> {t.assessmentIntroPageWhatToKnowContentText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowFormatLabel}</strong> {t.assessmentIntroPageWhatToKnowFormatText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowResultsLabel}</strong> {t.assessmentIntroPageWhatToKnowResultsText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowPrivacyLabel}</strong> {t.assessmentIntroPageWhatToKnowPrivacyText}</li>
            </ul>
          </div>
          
          <div className="p-4 border border-destructive/50 bg-destructive/5 dark:bg-destructive/15 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-destructive flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              {t.assessmentIntroPageImportantLabel}
            </p>
            <p className="text-sm text-destructive/90 mt-1">
              {t.assessmentIntroPageImportantText}
            </p>
          </div>

          <p className="text-center font-semibold text-lg md:text-xl text-accent pt-6 whitespace-pre-line">
            {t.assessmentIntroPageFinalWords}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-center gap-4 pt-8 pb-8">
          <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-md text-base py-3 shadow-lg hover:shadow-primary/40 transition-shadow">
            <Link href="/assessment">
              {t.assessmentIntroPageStartButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={questionsJsonUrl} target="_blank" rel="noopener noreferrer">
              <FileJson className="mr-2 h-4 w-4" />
              Ver JSON de Preguntas
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
