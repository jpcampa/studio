
"use client";

import { useState, useEffect } from 'react';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, AlertTriangle, FileJson, Link as LinkIcon, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { likertOptions } from '@/data/assessmentDimensions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useTranslations } from '@/lib/translations';

const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon, Annoyed: AnnoyedIcon, Meh: MehIcon, Smile: SmileIcon, Laugh: LaughIcon,
};


export default function DailyCheckInPage() {
  const t = useTranslations();
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useUser();

  const loadQuestion = async () => {
    if (!user || !user.id) {
        setError('Usuario no identificado. No se puede cargar la pregunta.');
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/daily-question?userId=${user.id}`);
      const rawData = await response.json();
      
      if (!response.ok) {
         throw new Error(rawData.details || `Error del servidor (HTTP ${response.status})`);
      }
      
      if (Array.isArray(rawData.questions) && rawData.questions.length > 0) {
          setQuestions(rawData.questions as DailyQuestion[]);
      } else if (rawData.questions && typeof rawData.questions === 'object' && !Array.isArray(rawData.questions)) {
          setQuestions([rawData.questions as DailyQuestion]);
      } else {
          setQuestions([]);
      }
    } catch (e: any) {
      setError('No se pudo cargar la pregunta diaria. ' + e.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
        loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      toast({ title: "Error", description: "No se puede guardar la respuesta sin un usuario identificado.", variant: "destructive" });
      return;
    }
    if (Object.keys(answers).length === 0) {
      toast({ title: "Sin respuesta", description: "Por favor, selecciona una respuesta antes de guardar.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const questionId = Object.keys(answers)[0];
    const answerValue = answers[questionId];

    if (!questionId || !answerValue) {
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/save-daily-check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          questionCode: questionId,
          answer: answerValue,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Respuesta Guardada",
          description: "Gracias por tu registro diario.",
        });
        setAnswers({}); // Clear answer to allow a new one
      } else {
        throw new Error(result.message || "Error al guardar la respuesta.");
      }
    } catch (error: any) {
      toast({
        title: "Error al Guardar",
        description: error.message || "No se pudo comunicar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Cargando pregunta...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-8">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.dailyCheckInPageTitle || "Pregunta del Día"}</CardTitle>
            <CardDescription>{t.dailyCheckInPageDescription || "Una pequeña pausa para conectar contigo."}</CardDescription>
          </div>
          <Button onClick={loadQuestion} variant="outline" size="icon" aria-label="Refrescar pregunta">
            <RefreshCw className="h-4 w-4"/>
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
         {error && (
             <div className="text-center text-destructive">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p className="font-semibold">Error al cargar la pregunta</p>
                <p className="text-sm">{error}</p>
            </div>
         )}
          {questions.length > 0 ? questions.map((q) => (
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
          )) : !error && (
            <div className="text-center text-muted-foreground">
                <p>No hay pregunta diaria disponible hoy.</p>
            </div>
          )}

          {questions.length > 0 && (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length === 0 || isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar Respuesta
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
