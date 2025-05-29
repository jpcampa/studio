
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { assessmentDimensions, likertOptions, type AssessmentItem, type AssessmentDimension } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowRight, CheckCircle, Save, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Helper para asegurar que los iconos se cargan correctamente
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

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, number>) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentItemIndexInDimension, setCurrentItemIndexInDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false);

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const currentItem = currentDimension?.items[currentItemIndexInDimension];

  const overallProgress = Math.round(((currentDimensionIndex) / assessmentDimensions.length) * 100);
  
  const itemsInCurrentDimensionProgress = currentDimension ? Math.round(((currentItemIndexInDimension +1) / currentDimension.items.length) * 100) : 0;


  useEffect(() => {
    if (!currentItem || showDimensionCompletedDialog || answers[currentItem.id] === undefined) {
      return;
    }
  
    const timer = setTimeout(() => {
      const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
  
      if (isLastItemInDimension) {
        setShowDimensionCompletedDialog(true);
      } else {
        setCurrentItemIndexInDimension(prev => prev + 1);
      }
    }, 300); 
  
    return () => clearTimeout(timer);
  }, [answers, currentItem, currentDimension?.items.length, currentItemIndexInDimension, showDimensionCompletedDialog, setCurrentItemIndexInDimension, setShowDimensionCompletedDialog, currentDimension]);


  const handleAnswerChange = (itemId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [itemId]: parseInt(value) }));
  };

  const handleDialogContinue = () => {
    setShowDimensionCompletedDialog(false);
    if (currentDimensionIndex < assessmentDimensions.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      setCurrentItemIndexInDimension(0);
    } else {
      submitFullAssessment();
    }
  };

  const handlePreviousDimension = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(prev => prev - 1);
      setCurrentItemIndexInDimension(0); 
      setShowDimensionCompletedDialog(false);
    }
  };

  const handleSaveForLater = () => {
    console.log("Guardar para luego - Respuestas actuales:", answers);
    setShowDimensionCompletedDialog(false);
    router.push('/dashboard');
  };

  const submitFullAssessment = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const allAnswered = assessmentDimensions.every(dim =>
      dim.items.every(item => answers.hasOwnProperty(item.id) && answers[item.id] >= 1 && answers[item.id] <=5)
    );

    if (!allAnswered) {
       console.warn("Intento de envío final, pero no todas las preguntas están respondidas.");
       // Idealmente, mostrar un mensaje al usuario
       return;
    }
    await onSubmit(answers);
  };

  if (!currentDimension || !currentItem) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const isAllCurrentDimensionItemsAnswered = currentDimension.items.every(item => answers.hasOwnProperty(item.id));
  const isLastDimension = currentDimensionIndex === assessmentDimensions.length - 1;
  const isLastItemOfLastDimension = isLastDimension && currentItemIndexInDimension === currentDimension.items.length - 1;
  const allItemsAnswered = assessmentDimensions.every(dim => dim.items.every(item => answers.hasOwnProperty(item.id)));


  const itemProgressText = t.itemProgress
    .replace('{currentItem}', (currentItemIndexInDimension + 1).toString())
    .replace('{totalItems}', currentDimension.items.length.toString())
    .replace('{currentDim}', (currentDimensionIndex + 1).toString())
    .replace('{totalDims}', assessmentDimensions.length.toString());

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <Progress value={overallProgress} className="w-full mb-2" aria-label={`Progreso general: ${overallProgress}%`} />
          <p className="text-xs text-center text-muted-foreground mb-2">
             {t.dimensionProgress
              .replace('{current}', (currentDimensionIndex + 1).toString())
              .replace('{total}', assessmentDimensions.length.toString())}
          </p>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
            {currentDimension.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1 text-center px-2">{currentDimension.definition}</CardDescription>
        </CardHeader>

        {!showDimensionCompletedDialog && (
          <CardContent className="pt-2 px-2 sm:px-6">
            <div 
              key={currentItem.id} 
              className={cn(
                "py-4",
                "animate-in fade-in-0 slide-in-from-bottom-5 duration-500" 
              )}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                {itemProgressText}
              </p>
              <Progress value={itemsInCurrentDimensionProgress} className="w-3/4 mx-auto mb-4 h-2" aria-label={`Progreso en dimensión actual: ${itemsInCurrentDimensionProgress}%`} />
              <p className="text-md sm:text-lg font-semibold text-primary mb-4 min-h-[3em] text-center px-2">{currentItem.text}</p>
              <RadioGroup
                value={answers[currentItem.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentItem.id, value)}
                className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 pt-2"
                aria-label={currentItem.text}
              >
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`${currentItem.id}-${option.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                        "hover:border-primary hover:shadow-md",
                        "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16", 
                        answers[currentItem.id] === option.value
                          ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                          : "bg-background border-input"
                      )}
                      title={option.description}
                    >
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`${currentItem.id}-${option.value}`}
                        className="sr-only"
                      />
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
                         {t.dimensionCompletedMessage
                            .replace("{dimensionNumber}", (currentDimensionIndex + 1).toString())
                            .replace("{dimensionName}", currentDimension.name)}
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 border-t">
          <Button 
            onClick={handlePreviousDimension} 
            disabled={isSubmitting || currentDimensionIndex === 0}
            variant="outline"
            className="w-full sm:w-auto mb-2 sm:mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.previousDimension}
          </Button>
          {isLastItemOfLastDimension && answers[currentItem.id] !== undefined && !showDimensionCompletedDialog && (
            <Button 
              onClick={submitFullAssessment} 
              disabled={isSubmitting || !allItemsAnswered}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {t.finishAssessment}
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDimensionCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary flex items-center gap-2 justify-center">
                <CheckCircle className="h-7 w-7" /> {t.dimensionCompletedTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-2 text-center">
              {t.dimensionCompletedMessage
                .replace("{dimensionNumber}", (currentDimensionIndex + 1).toString())
                .replace("{dimensionName}", currentDimension.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSaveForLater} disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> {t.saveForLaterButton}
            </Button>
            <Button onClick={handleDialogContinue} disabled={isSubmitting} className="w-full sm:w-auto" autoFocus>
              {isLastDimension ? (isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.finishAssessment) : t.continueButton} 
              {!isLastDimension && <ArrowRight className="ml-2 h-4 w-4" />}
              {isLastDimension && !isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
