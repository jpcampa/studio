
"use client";

import { useState, useEffect } from 'react';
import { getDailyQuestion } from '@/data/dailyQuestion';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { likertOptions } from '@/data/assessmentDimensions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon, Annoyed: AnnoyedIcon, Meh: MehIcon, Smile: SmileIcon, Laugh: LaughIcon,
};


export default function DailyCheckInPage() {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    async function loadQuestion() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedQuestion = await getDailyQuestion();
        // The API returns an array, so we handle it as such
        setQuestions(fetchedQuestion ? [fetchedQuestion] : []);
      } catch (e) {
        setError('No se pudo cargar la pregunta diaria. Por favor, inténtalo de nuevo más tarde.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestion();
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log('Respuestas guardadas:', answers);
    toast({
      title: "Respuesta Guardada",
      description: "Gracias por tu registro diario.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Cargando pregunta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">Error</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No hay pregunta diaria disponible hoy.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Pregunta del Día</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <p className="text-lg font-semibold mb-4">{q.text}</p>
              <RadioGroup
                value={answers[q.id] || ""}
                onValueChange={(value) => handleAnswerChange(q.id, value)}
                className="flex flex-wrap justify-center items-center gap-2 pt-2"
              >
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`${q.id}-${option.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                        "hover:border-primary hover:shadow-md",
                        "w-16 h-16",
                        answers[q.id] === option.value.toString()
                          ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                          : "bg-background border-input"
                      )}
                      title={option.description}
                    >
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`${q.id}-${option.value}`}
                        className="sr-only"
                      />
                      {IconComponent && <IconComponent className="h-8 w-8 text-foreground/80" />}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length === 0} className="w-full">
            Guardar Respuesta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
