
"use client";

import { useState, type FormEvent } from 'react';
import { assessmentQuestions, likertOptions, type Question } from '@/data/assessmentQuestions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, number>) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion: Question = assessmentQuestions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
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
    if (Object.keys(answers).length < assessmentQuestions.length && currentQuestionIndex !== assessmentQuestions.length -1 ) {
        // This condition is to ensure all questions are answered IF user clicks submit early.
        // Usually, submit button is only active on the last question.
        // alert("Por favor, responde todas las preguntas."); 
        // return;
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
            .replace('{total}', assessmentQuestions.length.toString())}
        </CardTitle>
        <CardDescription className="text-lg mt-1 min-h-[60px]">{currentQuestion.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-4"
          >
            {likertOptions.map(option => (
              <Label
                key={option.value}
                htmlFor={`${currentQuestion.id}-${option.value}`}
                className={cn(
                  "flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                  "hover:border-primary hover:shadow-md",
                  "w-16 h-16 sm:w-20 sm:h-20", // Responsive size for the clickable area
                  answers[currentQuestion.id] === option.value
                    ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                    : "bg-card border-input"
                )}
                title={option.description} // Accessibility: provides text for the emoji
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${currentQuestion.id}-${option.value}`}
                  className="sr-only" // Visually hide the radio button
                />
                <span className="text-2xl sm:text-3xl">{option.label}</span> 
              </Label>
            ))}
          </RadioGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0 || isSubmitting} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.previousQuestion}
        </Button>
        {currentQuestionIndex < assessmentQuestions.length - 1 ? (
          <Button onClick={handleNext} disabled={isSubmitting || !answers[currentQuestion.id]}>
            {t.nextQuestion} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length < assessmentQuestions.length}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.finishAssessment}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
