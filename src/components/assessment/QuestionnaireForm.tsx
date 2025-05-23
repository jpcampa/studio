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
import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';

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
    // Check if all questions are answered (optional, could add validation)
    if (Object.keys(answers).length < assessmentQuestions.length) {
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
        <CardDescription className="text-lg mt-1">{currentQuestion.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="space-y-3"
          >
            {likertOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={option.value.toString()} id={`${currentQuestion.id}-${option.value}`} />
                <Label 
                  htmlFor={`${currentQuestion.id}-${option.value}`} 
                  className="text-3xl flex-1 cursor-pointer text-center" // Increased emoji size and centered
                >
                  {option.label}
                </Label>
              </div>
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
