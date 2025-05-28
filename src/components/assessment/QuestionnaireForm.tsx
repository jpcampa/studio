
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { assessmentDimensions, likertOptions, type AssessmentItem } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowLeft, ArrowRight, Frown, Annoyed, Meh, Smile, Laugh, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, number>) => Promise<void>;
  isSubmitting: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Frown,
  Annoyed,
  Meh,
  Smile,
  Laugh,
};

const totalNumberOfAllItems = assessmentDimensions.reduce((acc, dim) => acc + dim.items.length, 0);

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const progressValue = ((currentDimensionIndex + 1) / assessmentDimensions.length) * 100;

  const handleAnswerChange = (itemId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [itemId]: parseInt(value) }));
  };

  const areAllItemsInCurrentDimensionAnswered = useMemo(() => {
    if (!currentDimension) return false;
    return currentDimension.items.every(item => answers.hasOwnProperty(item.id));
  }, [currentDimension, answers]);

  const areAllItemsInAllDimensionsAnswered = useMemo(() => {
    return Object.keys(answers).length === totalNumberOfAllItems;
  }, [answers]);

  const handleNext = () => {
    if (areAllItemsInCurrentDimensionAnswered && currentDimensionIndex < assessmentDimensions.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!areAllItemsInAllDimensionsAnswered) {
       // This should ideally not be reached if button is disabled correctly.
       console.warn("Submit attempted but not all questions are answered.");
       return;
    }
    await onSubmit(answers);
  };

  if (!currentDimension) {
    // Should not happen if logic is correct, but a safeguard
    return <div>Cargando dimensión...</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full mb-4" />
        <CardTitle className="text-2xl font-semibold text-center sm:text-left">
          {t.dimensionProgress
            .replace('{current}', (currentDimensionIndex + 1).toString())
            .replace('{total}', assessmentDimensions.length.toString())}
        </CardTitle>
        <h3 className="text-xl font-medium text-primary mt-2 text-center sm:text-left">{currentDimension.name}</h3>
        <CardDescription className="text-sm text-muted-foreground mt-1">{currentDimension.definition}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentDimension.items.map((item: AssessmentItem, itemIndex: number) => (
            <div key={item.id} className="py-4 border-b last:border-b-0">
              <p className="text-md font-medium text-foreground mb-3">{itemIndex + 1}. {item.text}</p>
              <RadioGroup
                value={answers[item.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(item.id, value)}
                className="flex flex-wrap justify-center items-center gap-3 sm:gap-4"
                aria-label={item.text}
              >
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`${item.id}-${option.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                        "hover:border-primary hover:shadow-md",
                        "w-16 h-16 sm:w-20 sm:h-20", 
                        answers[item.id] === option.value
                          ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                          : "bg-card border-input"
                      )}
                      title={option.description} 
                    >
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`${item.id}-${option.value}`}
                        className="sr-only" 
                      />
                      {IconComponent && <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-foreground/80 group-hover:text-primary" />}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
        <Button 
          onClick={handlePrevious} 
          disabled={currentDimensionIndex === 0 || isSubmitting} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.previousDimension}
        </Button>
        {currentDimensionIndex < assessmentDimensions.length - 1 ? (
          <Button 
            onClick={handleNext} 
            disabled={isSubmitting || !areAllItemsInCurrentDimensionAnswered}
            className="w-full sm:w-auto"
          >
            {t.nextDimension} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !areAllItemsInAllDimensionsAnswered}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.finishAssessment}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
