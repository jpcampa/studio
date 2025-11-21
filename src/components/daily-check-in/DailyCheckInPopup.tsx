
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, AlertTriangle, Save } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { likertOptions } from '@/data/assessmentQuestions';
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

interface DailyCheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyCheckInPopup({ isOpen, onClose }: DailyCheckInPopupProps) {
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadQuestion = async () => {
      if (!isOpen || !user || !user.id) return;
      
      setIsLoading(true);
      setError(null);
      setAnswers({});
      setQuestions([]);

      try {
        const response = await fetch(`/api/daily-question?userId=${user.id}`);
        const rawData = await response.json();
        
        if (!response.ok) {
           throw new Error(rawData.details || `Error del servidor (HTTP ${response.status})`);
        }
        
        if (Array.isArray(rawData.questions) && rawData.questions.length > 0) {
            setQuestions(rawData.questions as DailyQuestion[]);
        } else {
            setError("No se encontraron preguntas para hoy.");
        }
      } catch (e: any) {
        setError('No se pudo cargar la pregunta diaria. ' + e.message);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [isOpen, user]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, questionCode: questionId, answer: answerValue }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Respuesta Guardada", description: "Gracias por tu registro diario." });
        onClose(); // Cierra el popup en éxito
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.dailyCheckInPageTitle || "Pregunta del Día"}</DialogTitle>
          <DialogDescription>{t.dailyCheckInPageDescription || "Una pequeña pausa para conectar contigo."}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive h-40 flex flex-col items-center justify-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error al cargar la pregunta</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <p className="text-lg font-semibold text-center">{q.text}</p>
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
                          "w-14 h-14",
                          answers[q.id] === option.value.toString()
                            ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                            : "bg-background border-input"
                        )}
                        title={option.description}
                      >
                        <RadioGroupItem value={option.value.toString()} id={`${q.id}-${option.value}`} className="sr-only" />
                        {IconComponent && <IconComponent className="h-8 w-8 text-foreground/80" />}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            ))
          ) : (
             <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
                <p>No hay pregunta diaria disponible hoy.</p>
            </div>
          )}
        </div>
        {questions.length > 0 && !error && (
            <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={Object.keys(answers).length === 0 || isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Respuesta
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
