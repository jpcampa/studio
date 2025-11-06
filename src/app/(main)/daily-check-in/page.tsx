
"use client";

import { useState, useEffect } from 'react';
import { getDailyQuestion } from '@/data/dailyQuestion';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, AlertTriangle, FileJson } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  const [debugData, setDebugData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadQuestion() {
      setIsLoading(true);
      setError(null);
      setDebugData(null);
      try {
        // We'll fetch and see the raw response for debugging
        const response = await fetch('/api/daily-question');
        const rawData = await response.json();
        setDebugData(rawData);

        if (!response.ok) {
           throw new Error(`Error del servidor (HTTP ${response.status})`);
        }

        // Now process the data as before
        if (Array.isArray(rawData) && rawData.length > 0) {
            setQuestions(rawData as DailyQuestion[]);
        } else if (rawData) { // It might be a single object
            setQuestions([rawData as DailyQuestion]);
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

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pregunta del Día</CardTitle>
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
                      key={`${q.id}-${option.value}`}
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
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length === 0} className="w-full">
              Guardar Respuesta
            </Button>
          )}
        </CardContent>
      </Card>
      
      {debugData && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-amber-700 dark:text-amber-300 flex items-center">
              <FileJson className="mr-2 h-5 w-5" />
              Datos de Depuración (Respuesta de la API)
            </CardTitle>
            <CardDescription>
              Este es el contenido JSON crudo recibido desde la ruta `/api/daily-question`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-background p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
              <code>{JSON.stringify(debugData, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
