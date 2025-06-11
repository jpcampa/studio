
"use client";

import { useState, useEffect, useMemo, useCallback, type FormEvent } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import { EmotionalEntryForm, emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { getEmotionalEntries, formatEntryTimestamp, addEmotionalEntry, type EmotionalEntry } from "@/data/emotionalEntriesStore";
import { ArrowLeft, NotebookPen, LineChart as LineChartIcon, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// ScrollArea import is removed as it's no longer used
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { encryptDataAES, forceEncryptStringAES } from "@/lib/encryption";

const moodScoreMapping: Record<string, number> = {
  alegria: 5, confianza: 5, sorpresa: 4, anticipacion: 4,
  enfado: 2, miedo: 2, tristeza: 1, asco: 1,
};

const API_BASE_URL_FOR_DEBUG = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY_FOR_DEBUG = "4463";
const API_TIMEOUT_MS_ACTIVITY = 10000;

interface SingleEmotionalEntryActivity {
  entry: EmotionalEntry;
}


export default function EmotionalLogPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);

  useEffect(() => {
    setAllEntries(getEmotionalEntries());
  }, []);

  const generateUserActivityApiUrl = useCallback((newEntryData: EmotionalEntry, userIdForUrlParam?: string | null): string => {
    const activityPayload: SingleEmotionalEntryActivity = { entry: newEntryData };
    const jsonPayloadForDatosActividad = encryptDataAES(activityPayload);
    let url = `${API_BASE_URL_FOR_DEBUG}?apikey=${API_KEY_FOR_DEBUG}&tipo=guardaractividad&datosactividad=${encodeURIComponent(jsonPayloadForDatosActividad)}`;

    if (userIdForUrlParam && typeof userIdForUrlParam === 'string' && userIdForUrlParam.trim() !== '') {
      try {
        const encryptedDirectUserId = forceEncryptStringAES(userIdForUrlParam);
        url += `&userID=${encodeURIComponent(encryptedDirectUserId)}`;
      } catch (encError) {
         console.error("EmotionalLogPage (generateUserActivityApiUrl): Error encrypting userIdForUrlParam:", encError);
      }
    }
    return url;
  }, []);

  const handleEmotionalEntrySubmit = async (data: { situation: string; emotion: string }) => {
    if (!user || !user.id) {
      toast({
        title: "Error de Usuario",
        description: "No se pudo identificar al usuario. Intenta recargar la página o iniciar sesión de nuevo.",
        variant: "destructive",
      });
      return;
    }
    const userIdFromContext = user.id;
    const newEntry = addEmotionalEntry(data);

    setAllEntries(prevAllEntries => [newEntry, ...prevAllEntries].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    
    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false);

    const currentEncryptedActivityApiUrl = generateUserActivityApiUrl(newEntry, userIdFromContext);
    if (currentEncryptedActivityApiUrl) {
      console.log("EmotionalLogPage (handleEmotionalEntrySubmit): Sending NEW emotional entry to API:", currentEncryptedActivityApiUrl.substring(0,150) + "...");
      try {
        const signal = AbortSignal.timeout(API_TIMEOUT_MS_ACTIVITY);
        const response = await fetch(currentEncryptedActivityApiUrl, { signal });
        const responseText = await response.text();
        if (response.ok) {
          let apiResult;
          try {
            apiResult = JSON.parse(responseText);
            if (apiResult.status === "OK") {
              console.log("EmotionalLogPage (handleEmotionalEntrySubmit): New entry saved successfully to API. Response:", apiResult);
              toast({
                title: "Emoción Sincronizada",
                description: "Tu última entrada emocional ha sido guardada en el servidor.",
                className: "bg-green-50 dark:bg-green-900/30 border-green-500",
                duration: 3000,
              });
            } else {
              console.warn("EmotionalLogPage (handleEmotionalEntrySubmit): API reported 'NOOK'. Message:", apiResult.message);
              toast({ title: "Error de Sincronización", description: `API: ${apiResult.message || 'Error desconocido.'}`, variant: "destructive"});
            }
          } catch (jsonError) {
             console.warn("EmotionalLogPage (handleEmotionalEntrySubmit): Failed to parse API JSON. Text:", responseText, jsonError);
             toast({ title: "Respuesta de Sincronización Inválida", variant: "destructive"});
          }
        } else {
          console.warn("EmotionalLogPage (handleEmotionalEntrySubmit): Failed to save new entry to API. Status:", response.status, "Text:", responseText);
          toast({ title: "Error al Guardar Emoción en Servidor", description: `HTTP ${response.status}`, variant: "destructive" });
        }
      } catch (error: any) {
        console.error(`EmotionalLogPage (handleEmotionalEntrySubmit): API call error:`, error);
        toast({ title: "Error de Conexión con API de Actividad", description: error.message, variant: "destructive" });
      }
    }
  };

  const chartData = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return [];
    return allEntries
      .map(entry => ({ ...entry, timestampDate: new Date(entry.timestamp) }))
      .sort((a, b) => a.timestampDate.getTime() - b.timestampDate.getTime())
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        if (moodScoreMapping[entry.emotion] === undefined) {
            console.warn(`EmotionalLogPage Data Prep: Emotion string "${entry.emotion}" not found in moodScoreMapping. Defaulting to score 0.`);
        }
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
  }, [allEntries, t]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            <LineChartIcon className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8" />
            {t.fullEmotionalHistoryTitle}
        </h1>
        <div className="flex gap-2">
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="shadow-md">
                  <Edit className="mr-2 h-4 w-4" />
                  {t.registerEmotion}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{t.registerEmotionDialogTitle}</DialogTitle>
                  <DialogDescription>
                    {t.registerEmotionDialogDescription}
                  </DialogDescription>
                </DialogHeader>
                <EmotionalEntryForm onSubmit={handleEmotionalEntrySubmit} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToDashboard}
            </Link>
            </Button>
        </div>
      </div>

      <MoodEvolutionChart
        data={chartData}
        title={t.myEvolution}
        description={t.myEvolutionFullHistoryDescription}
        className="lg:h-[450px]"
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-accent flex items-center">
            <NotebookPen className="mr-3 h-6 w-6" />
            {t.allEmotionalEntriesTitle}
          </CardTitle>
          <CardDescription>
            {t.allEmotionalEntriesDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allEntries.length > 0 ? (
            <ul className="space-y-4">
              {allEntries.map((entry, index) => {
                const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                return (
                  <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                    <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
                    <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                    <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                      {entry.situation}
                    </p>
                    {index < allEntries.length - 1 && <Separator className="my-4" />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground italic text-center py-4">{t.noEntriesYet}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
