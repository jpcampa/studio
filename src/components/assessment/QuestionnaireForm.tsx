
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { assessmentDimensions, likertOptions, type AssessmentItem, type AssessmentDimension } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowRight, CheckCircle, Save, Info } from 'lucide-react';
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

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, number>) => Promise<void>;
  isSubmitting: boolean;
}

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

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentItemIndexInDimension, setCurrentItemIndexInDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false);

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const currentItem = currentDimension?.items[currentItemIndexInDimension];

  // Calcula el progreso general basado en las dimensiones
  const overallProgress = Math.round(((currentDimensionIndex) / assessmentDimensions.length) * 100);

  useEffect(() => {
    if (!currentItem || showDimensionCompletedDialog || answers[currentItem.id] === undefined) {
      return;
    }

    const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;

    if (isLastItemInDimension) {
      setShowDimensionCompletedDialog(true);
    } else {
      setCurrentItemIndexInDimension(prev => prev + 1);
    }
  }, [answers, currentItem, currentDimension.items.length, currentItemIndexInDimension, showDimensionCompletedDialog]);


  const handleAnswerChange = (itemId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [itemId]: parseInt(value) }));
    // El avance se maneja en el useEffect
  };

  const handleContinue = () => {
    setShowDimensionCompletedDialog(false);
    if (currentDimensionIndex < assessmentDimensions.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      setCurrentItemIndexInDimension(0);
    } else {
      // Es la última dimensión, finalizar evaluación
      submitFullAssessment();
    }
  };

  const handleSaveForLater = () => {
    console.log("Guardar para luego - Respuestas actuales:", answers);
    // Aquí se implementaría la lógica para guardar el progreso.
    // Por ahora, solo un mensaje y redirigir.
    setShowDimensionCompletedDialog(false);
    // Idealmente, se guardaría en localStorage o backend el estado actual:
    // { answers, currentDimensionIndex, currentItemIndexInDimension }
    // Y un toast para el usuario.
    router.push('/dashboard');
  };

  const submitFullAssessment = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    // Validación final antes de enviar (aunque el flujo debería asegurar esto)
    const allAnswered = assessmentDimensions.every(dim =>
      dim.items.every(item => answers.hasOwnProperty(item.id))
    );
    if (!allAnswered) {
       console.warn("Intento de envío, pero no todas las preguntas están respondidas.");
       // Podría ser útil mostrar un error al usuario aquí.
       return;
    }
    await onSubmit(answers);
  };

  if (!currentDimension || !currentItem) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const isLastDimensionAndLastItem = 
    currentDimensionIndex === assessmentDimensions.length - 1 &&
    currentItemIndexInDimension === currentDimension.items.length - 1;

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <Progress value={overallProgress} className="w-full mb-4" aria-label={`Progreso general: ${overallProgress}%`} />
          <CardTitle className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            {t.dimensionProgress
              .replace('{current}', (currentDimensionIndex + 1).toString())
              .replace('{total}', assessmentDimensions.length.toString())}
            : {currentDimension.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">{currentDimension.definition}</CardDescription>
        </CardHeader>

        {!showDimensionCompletedDialog && (
          <>
            <CardContent className="pt-2">
              <div className="py-4 border-t border-b">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t.itemProgress
                    .replace('{currentItem}', (currentItemIndexInDimension + 1).toString())
                    .replace('{totalItems}', currentDimension.items.length.toString())
                    .replace('{currentDim}', (currentDimensionIndex + 1).toString())
                    .replace('{totalDims}', assessmentDimensions.length.toString())
                  }
                </p>
                <p className="text-md sm:text-lg font-semibold text-primary mb-4 min-h-[3em]">{currentItem.text}</p>
                <RadioGroup
                  value={answers[currentItem.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentItem.id, value)}
                  className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 pt-2"
                  aria-label={currentItem.text}
                >
                  {likertOptions.map(option => {
                    const IconComponent = iconMap[option.label];
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`${currentItem.id}-${option.value}`}
                        className={cn(
                          "flex flex-col items-center justify-center p-1 sm:p-2 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                          "hover:border-primary hover:shadow-md",
                          "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
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
                        {IconComponent ? <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-foreground/80" /> : option.label}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            </CardContent>
             <CardFooter className="flex justify-end mt-4">
              {isLastDimensionAndLastItem && answers[currentItem.id] !== undefined && (
                 <Button 
                    onClick={submitFullAssessment} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {t.finishAssessment}
                  </Button>
              )}
            </CardFooter>
          </>
        )}
        {showDimensionCompletedDialog && !isLastDimensionAndLastItem && (
             <CardContent>
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-500">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                         {t.dimensionCompletedMessage
                            .replace("{dimensionNumber}", (currentDimensionIndex + 1).toString())
                            .replace("{dimensionName}", currentDimension.name)}
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
      </Card>

      <AlertDialog open={showDimensionCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary flex items-center gap-2">
                <CheckCircle className="h-7 w-7" /> {t.dimensionCompletedTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-2">
              {t.dimensionCompletedMessage
                .replace("{dimensionNumber}", (currentDimensionIndex + 1).toString())
                .replace("{dimensionName}", currentDimension.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={handleSaveForLater} disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> {t.saveForLaterButton}
            </Button>
            <Button onClick={handleContinue} disabled={isSubmitting} className="w-full sm:w-auto" autoFocus>
              {currentDimensionIndex === assessmentDimensions.length - 1 ? t.finishAssessment : t.continueButton} 
              {currentDimensionIndex < assessmentDimensions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
