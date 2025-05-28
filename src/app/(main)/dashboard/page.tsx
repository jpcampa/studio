
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { DashboardSummaryCard } from "@/components/dashboard/DashboardSummaryCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { EmotionalEntryForm, emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";

interface ProcessedChartDataPoint {
  date: string; // Formatted for X-axis label (e.g., "dd MMM")
  moodScore: number;
  emotionLabel: string;
  fullDate: string; // Full date for tooltip
}

const moodScoreMapping: Record<string, number> = {
  alegria: 5,
  confianza: 5,
  sorpresa: 4,
  anticipacion: 4,
  enfado: 2,
  miedo: 2,
  tristeza: 1,
  asco: 1,
};


export default function DashboardPage() {
  console.log("DashboardPage: Component rendering or re-rendering.");
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);

  useEffect(() => {
    console.log("DashboardPage: Initial Load useEffect running.");
    // Load entries from localStorage on mount
    const loadedRecentEntries = getRecentEmotionalEntries();
    const loadedAllEntries = getEmotionalEntries();
    
    console.log("DashboardPage: Initial Load - loadedRecentEntries:", loadedRecentEntries);
    console.log("DashboardPage: Initial Load - loadedAllEntries:", loadedAllEntries);

    setRecentEntries(loadedRecentEntries);
    setAllEntries(loadedAllEntries);

    if (loadedRecentEntries.length > 0) {
      const lastRegisteredEmotion = emotionOptions.find(e => e.value === loadedRecentEntries[0].emotion);
      if (lastRegisteredEmotion) {
        setLastEmotion(t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value);
      }
    }
    console.log("DashboardPage: Initial Load useEffect finished.");
  }, [t]); // Added t to dependencies as it's used inside

  const chartData = useMemo(() => {
    console.log("DashboardPage: Recalculating chartData. allEntries count:", allEntries.length);
    if (!allEntries || allEntries.length === 0) {
      console.log("DashboardPage: No entries for chartData calculation.");
      return [];
    }

    const processedData = allEntries
      .map(entry => ({
        ...entry,
        timestampDate: new Date(entry.timestamp), // Convert string to Date for sorting
      }))
      .sort((a, b) => a.timestampDate.getTime() - b.timestampDate.getTime()) // Sort oldest to newest
      .slice(-15) // Take last 15 entries for the chart
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0], // e.g., "25 May"
          moodScore: moodScoreMapping[entry.emotion] ?? 0, // Default to 0 if not mapped
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
    console.log("DashboardPage: Processed chartData:", processedData);
    return processedData;
  }, [allEntries, t]);


  const handleEmotionalEntrySubmit = (data: { situation: string; emotion: string }) => {
    console.log("DashboardPage: handleEmotionalEntrySubmit called with:", data);
    const newEntry = addEmotionalEntry(data);
    
    setRecentEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 5)); 
    setAllEntries(prevAllEntries => [newEntry, ...prevAllEntries].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));


    const lastRegisteredEmotionDetails = emotionOptions.find(e => e.value === newEntry.emotion);
    if (lastRegisteredEmotionDetails) {
        setLastEmotion(t[lastRegisteredEmotionDetails.labelKey as keyof typeof t] || lastRegisteredEmotionDetails.value);
    }

    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false); 
    console.log("DashboardPage: Emotional entry submitted and states updated.");
  };
  
  console.log("DashboardPage: Rendering JSX. User:", user?.name);

  return (
    <div className="container mx-auto py-8 space-y-10">
      {/* Saludo */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {t.welcome}, {user?.name || "Usuarie"}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-1">{t.dashboardGreeting}</p>
      </div>

      {/* Resumen Rápido */}
      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="text-2xl font-semibold text-accent mb-6">
          {t.quickSummary}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title={t.currentWellbeing}
            value={lastEmotion || t.wellbeingPlaceholder}
            description={t.wellbeingDescription}
            icon={lastEmotion ? CheckCircle : Smile}
            cardColorClass={lastEmotion ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700" }
            iconColorClass={lastEmotion ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
            ctaLink="/assessment" 
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.progressSinceLast}
            value={t.progressPlaceholder}
            description={t.progressDescription}
            icon={TrendingUp}
            cardColorClass="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            iconColorClass="text-blue-600 dark:text-blue-400"
            ctaLink="/assessment"
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.inFocus}
            value={t.inFocusPlaceholder}
            description={t.inFocusDescription}
            icon={Target}
            cardColorClass="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            iconColorClass="text-purple-600 dark:text-purple-400"
            ctaLink="/paths"
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.nextStep}
            value={t.nextStepPlaceholder}
            description={t.nextStepDescription}
            icon={Lightbulb}
            cardColorClass="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            iconColorClass="text-yellow-600 dark:text-yellow-500"
            ctaLink="/paths"
            ctaLabel={t.viewDetails}
          />
        </div>
      </section>

      {/* Registro Emocional */}
      <section aria-labelledby="emotional-registry-heading" className="text-center py-6">
        <h2 id="emotional-registry-heading" className="sr-only">{t.emotionalRegistry}</h2>
        <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Edit className="mr-2 h-5 w-5" />
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
      </section>

      {/* Mis Registros Emocionales Recientes */}
      <section aria-labelledby="recent-entries-heading">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-accent flex items-center">
                <NotebookPen className="mr-3 h-6 w-6" />
                {t.recentEmotionalEntriesTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <ul className="space-y-4">
                {recentEntries.map((entry, index) => {
                  const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                  const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                  return (
                    <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
                      <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                      <p className="text-sm text-foreground mt-1 truncate" title={entry.situation}>
                        {entry.situation}
                      </p>
                       {index < recentEntries.length - 1 && <Separator className="my-4" />}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground italic text-center py-4">{t.noRecentEntries}</p>
            )}
          </CardContent>
           {recentEntries.length > 0 && (
             <CardFooter className="justify-center pt-4">
                <Button variant="link" disabled>Ver todos los registros (próximamente)</Button>
            </CardFooter>
           )}
        </Card>
      </section>

      {/* Visualizaciones */}
      <section aria-labelledby="visualizations-heading">
        <h2 id="visualizations-heading" className="sr-only">Visualizaciones de Progreso</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ChartPlaceholder
            title={t.myEmotionalProfile}
            description={t.myEmotionalProfileDescription}
            icon={Radar}
            className="lg:h-[450px]"
          />
          {/* <ChartPlaceholder
            title={t.myEvolution}
            description={t.myEvolutionDescription}
            icon={LineChartIcon}
            className="lg:h-[450px]"
          /> */}
           <MoodEvolutionChart 
            data={chartData} 
            title={t.myEvolution}
            description={t.myEvolutionDescription}
            className="lg:h-[450px]"
          />
        </div>
      </section>
    </div>
  );
}
    

    