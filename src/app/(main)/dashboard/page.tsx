
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { DashboardSummaryCard } from "@/components/dashboard/DashboardSummaryCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { EmotionalEntryForm } from "@/components/dashboard/EmotionalEntryForm";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);

  const handleEmotionalEntrySubmit = (data: { situation: string; emotion: string }) => {
    console.log("Emotional Entry Submitted:", data);
    // TODO: Aquí se guardaría la entrada en Firestore
    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false); // Cierra el diálogo después de enviar
  };

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
            value={t.wellbeingPlaceholder}
            description={t.wellbeingDescription}
            icon={Smile}
            cardColorClass="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
            iconColorClass="text-green-600 dark:text-green-400"
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
          <DialogContent className="sm:max-w-[480px]"> {/* Increased width slightly */}
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
          <ChartPlaceholder
            title={t.myEvolution}
            description={t.myEvolutionDescription}
            icon={LineChartIcon}
            className="lg:h-[450px]"
          />
        </div>
      </section>
    </div>
  );
}
