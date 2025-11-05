
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { getAssessmentDimensions, likertOptions, type AssessmentItem, type AssessmentDimension } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowRight, CheckCircle, Save, Info, ArrowLeft, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon,
  Annoyed: AnnoyedIcon,
  Meh: MehIcon,
  Smile: SmileIcon,
  Laugh: LaughIcon,
};

const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';

interface InProgressData {
  answers: Record<string, { score: number; weight: number }>;
  position: {
    dimension: number;
    item: number;
  };
}

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, { score: number; weight: number }>) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  const [assessmentDimensions, setAssessmentDimensions] = useState<AssessmentDimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentItemIndexInDimension, setCurrentItemIndexInDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { score: number; weight: number }>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true);
        const dimensions = await getAssessmentDimensions();
        setAssessmentDimensions(dimensions);
        
        const savedProgress = localStorage.getItem(IN_PROGRESS_ANSWERS_KEY);
        if (savedProgress) {
          const parsedData = JSON.parse(savedProgress) as InProgressData;
          if (parsedData.answers && parsedData.position) {
              setAnswers(parsedData.answers);
              const isLastDimension = parsedData.position.dimension >= dimensions.length - 1;
              const isLastItem = isLastDimension && parsedData.position.item >= dimensions[dimensions.length - 1].items.length - 1;

              if (!isLastItem) {
                setCurrentDimensionIndex(parsedData.position.dimension);
                setCurrentItemIndexInDimension(parsedData.position.item);
              } else {
                setCurrentDimensionIndex(dimensions.length - 1);
                setCurrentItemIndexInDimension(dimensions[dimensions.length - 1].items.length - 1);
              }
              toast({
                title: "Evaluación Reanudada",
                description: "Hemos cargado tu progreso anterior.",
              });
          }
        }
      } catch (e) {
        setError("No se pudieron cargar las preguntas de la evaluación. Por favor, inténtalo de nuevo más tarde.");
        console.error("Error fetching assessment dimensions:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [toast]);
  
  const saveProgress = (dimIndex: number, itemIndex: number, currentAnswers: Record<string, { score: number; weight: number }>) => {
    try {
      const dataToSave: InProgressData = {
        answers: currentAnswers,
        position: { dimension: dimIndex, item: itemIndex }
      };
      localStorage.setItem(IN_PROGRESS_ANSWERS_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving partial progress:", error);
    }
  };

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const currentItem = currentDimension?.items[currentItemIndexInDimension];

  const overallProgress = assessmentDimensions.length > 0 ? Math.round(((currentDimensionIndex) / assessmentDimensions.length) * 100) : 0;
  const itemsInCurrentDimensionProgress = currentDimension ? Math.round(((currentItemIndexInDimension + 1) / currentDimension.items.length) * 100) : 0;

  const handleNextStep = () => {
    const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
    if (isLastItemInDimension) {
      if (!isSubmitting) { 
        setShowDimensionCompletedDialog(true);
      }
    } else {
      setCurrentItemIndexInDimension(prev => prev + 1);
    }
  };

  const handleAnswerChange = (item: AssessmentItem, value: string) => {
    const newAnswers = { ...answers, [item.id]: { score: parseInt(value), weight: item.weight } };
    setAnswers(newAnswers);
  };

  const handleDialogContinue = () => {
    setShowDimensionCompletedDialog(false);
    if (currentDimensionIndex < assessmentDimensions.length - 1) {
      const nextDimIndex = currentDimensionIndex + 1;
      setCurrentDimensionIndex(nextDimIndex);
      setCurrentItemIndexInDimension(0);
      saveProgress(nextDimIndex, 0, answers);
    } else {
      submitFullAssessment();
    }
  };
  
  const handleGoBack = () => {
    if (showDimensionCompletedDialog) {
        setShowDimensionCompletedDialog(false);
        return;
    }
    if (currentItemIndexInDimension > 0) {
      setCurrentItemIndexInDimension(prev => prev - 1);
    } else if (currentDimensionIndex > 0) {
      const prevDimensionIndex = currentDimensionIndex - 1;
      const prevDimension = assessmentDimensions[prevDimensionIndex];
      setCurrentDimensionIndex(prevDimensionIndex);
      setCurrentItemIndexInDimension(prevDimension.items.length - 1);
    }
  };

  const handleSaveForLater = () => {
    const isLastDimension = currentDimensionIndex === assessmentDimensions.length - 1;
    let dimToSave = currentDimensionIndex;
    let itemToSave = currentItemIndexInDimension;
    if (currentItemIndexInDimension === currentDimension.items.length - 1 && !isLastDimension) {
      dimToSave = currentDimensionIndex + 1;
      itemToSave = 0;
    }
    saveProgress(dimToSave, itemToSave, answers);
    toast({ title: "Progreso Guardado", description: "Puedes continuar tu evaluación más tarde desde 'Mis Evaluaciones'." });
    setShowDimensionCompletedDialog(false);
    router.push('/my-assessments');
  };
  
  const submitFullAssessment = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const allAnswered = assessmentDimensions.every(dim => dim.items.every(item => answers.hasOwnProperty(item.id) && answers[item.id].score >= 1 && answers[item.id].score <= 5));
    if (!allAnswered) {
       toast({ title: "Cuestionario Incompleto", description: "Por favor, responde a todas las preguntas antes de finalizar.", variant: "destructive" });
       return;
    }
    localStorage.removeItem(IN_PROGRESS_ANSWERS_KEY);
    await onSubmit(answers);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error al Cargar</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!currentDimension || !currentItem) {
    return <div className="text-center py-8">No se ha podido cargar la evaluación.</div>;
  }
  
  const isLastItemOfLastDimension = currentDimensionIndex === assessmentDimensions.length - 1 && currentItemIndexInDimension === currentDimension.items.length - 1;
  const allItemsAnswered = assessmentDimensions.every(dim => dim.items.every(item => answers.hasOwnProperty(item.id)));
  const isFirstQuestion = currentDimensionIndex === 0 && currentItemIndexInDimension === 0;

  const itemProgressText = t.itemProgress
    .replace('{currentItem}', (currentItemIndexInDimension + 1).toString())
    .replace('{totalItems}', currentDimension.items.length.toString())
    .replace('{currentDim}', (currentDimensionIndex + 1).toString())
    .replace('{totalDims}', assessmentDimensions.length.toString());

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <Progress value={overallProgress} className="w-full mb-4" aria-label={`Progreso general: ${overallProgress}%`} />
          <CardTitle className="text-lg font-semibold text-center text-primary">
            Cuestionario de Evaluación App: Personalidad, Estado de Ánimo y Ansiedad
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-2 text-center px-2">{currentDimension.definition}</CardDescription>
        </CardHeader>
        {!showDimensionCompletedDialog && (
          <CardContent className="pt-2 px-2 sm:px-6">
            <div key={currentItem.id} className={cn("py-4", "animate-in fade-in-0 slide-in-from-bottom-5 duration-500")}>
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">{itemProgressText}</p>
              <Progress value={itemsInCurrentDimensionProgress} className="w-3/4 mx-auto mb-4 h-2" aria-label={`Progreso en dimensión actual: ${itemsInCurrentDimensionProgress}%`} />
              <p className="text-md sm:text-lg font-semibold text-primary mb-4 min-h-[3em] text-center px-2">{currentItem.text}</p>
              <RadioGroup value={answers[currentItem.id]?.score.toString() || ""} onValueChange={(value) => handleAnswerChange(currentItem, value)} className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 pt-2" aria-label={currentItem.text}>
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label key={option.value} htmlFor={`${currentItem.id}-${option.value}`} className={cn("flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out", "hover:border-primary hover:shadow-md", "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16", answers[currentItem.id]?.score === option.value ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105" : "bg-background border-input")} title={option.description}>
                      <RadioGroupItem value={option.value.toString()} id={`${currentItem.id}-${option.value}`} className="sr-only" />
                      {IconComponent ? <IconComponent className="h-6 w-6 sm:h-7 sm:h-7 md:h-8 md:h-8 text-foreground/80" /> : option.label}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          </CardContent>
        )}
        {showDimensionCompletedDialog && (
             <CardContent>
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-500 my-4">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-medium text-center">
                         {t.dimensionCompletedMessage.replace("{dimensionNumber}", (currentDimensionIndex + 1).toString()).replace("{totalDimensions}", assessmentDimensions.length.toString())}
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 border-t">
          <Button variant="outline" onClick={handleGoBack} disabled={isFirstQuestion && !showDimensionCompletedDialog}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          {!isLastItemOfLastDimension && (
            <Button onClick={handleNextStep} disabled={!answers[currentItem.id]} className="w-full sm:w-auto mt-2 sm:mt-0">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {isLastItemOfLastDimension && (
            <Button onClick={submitFullAssessment} disabled={isSubmitting || !allItemsAnswered} className="w-full sm:w-auto mt-2 sm:mt-0">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {t.finishAssessment}
            </Button>
          )}
        </CardFooter>
      </Card>
      <AlertDialog open={showDimensionCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary flex items-center gap-2 justify-center"><CheckCircle className="h-7 w-7" /> {t.dimensionCompletedTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-base py-2 text-center">{t.dimensionCompletedMessage.replace("{dimensionNumber}", (currentDimensionIndex + 1).toString()).replace("{totalDimensions}", assessmentDimensions.length.toString())}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSaveForLater} disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> {t.saveForLaterButton}
            </Button>
            <Button onClick={handleDialogContinue} disabled={isSubmitting} className="w-full sm:w-auto" autoFocus>
              {currentDimensionIndex === assessmentDimensions.length - 1 ? (isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.finishAssessment) : t.continueButton} 
              {currentDimensionIndex < assessmentDimensions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              {currentDimensionIndex === assessmentDimensions.length - 1 && !isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
