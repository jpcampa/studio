
"use client";

import { useState, type FormEvent } from 'react';
import { assessmentDimensions, likertOptions } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

// Flatten the dimensions and items into a single list for sequential presentation
const allAssessmentItems = assessmentDimensions.flatMap(dimension =>
  dimension.items.map(item => ({
    ...item, // Contains id, text, isInverse (optional)
    dimensionId: dimension.id,
    dimensionName: dimension.name, // Full name of the dimension
  }))
);

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = allAssessmentItems[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / allAssessmentItems.length) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allAssessmentItems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // The submit button is only enabled when all questions are answered,
    // but we keep this check for robustness.
    if (Object.keys(answers).length < allAssessmentItems.length && currentQuestionIndex !== allAssessmentItems.length -1) {
      // This should ideally not be reached if button is disabled correctly.
      // Consider a toast or more user-friendly feedback if this case is hit.
    }
    await onSubmit(answers);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full mb-4" />
        <CardTitle className="text-2xl font-semibold">
          {t.questionProgress
            .replace('{current}', (currentQuestionIndex + 1).toString())
            .replace('{total}', allAssessmentItems.length.toString())}
        </CardTitle>
        {/* Display dimension name as a sub-header, then the item text */}
        <p className="text-md font-medium text-muted-foreground mt-2">{currentQuestion.dimensionName}</p>
        <CardDescription className="text-lg mt-1 min-h-[60px]">{currentQuestion.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-4"
            aria-label={currentQuestion.text} // For accessibility
          >
            {likertOptions.map(option => {
              const IconComponent = iconMap[option.label];
              return (
                <Label
                  key={option.value}
                  htmlFor={`${currentQuestion.id}-${option.value}`}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                    "hover:border-primary hover:shadow-md",
                    "w-16 h-16 sm:w-20 sm:h-20", 
                    answers[currentQuestion.id] === option.value
                      ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                      : "bg-card border-input"
                  )}
                  title={option.description} 
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`${currentQuestion.id}-${option.value}`}
                    className="sr-only" 
                  />
                  {IconComponent && <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-foreground/80 group-hover:text-primary" />}
                </Label>
              );
            })}
          </RadioGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0 || isSubmitting} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.previousQuestion}
        </Button>
        {currentQuestionIndex < allAssessmentItems.length - 1 ? (
          <Button onClick={handleNext} disabled={isSubmitting || !answers[currentQuestion.id]}>
            {t.nextQuestion} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || Object.keys(answers).length < allAssessmentItems.length}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.finishAssessment}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

    