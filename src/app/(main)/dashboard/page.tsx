
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { DashboardSummaryCard } from "@/components/dashboard/DashboardSummaryCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, BarChart3 } from "lucide-react"; // BarChart3 to avoid conflict

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useUser();

  const handleRegisterEmotion = () => {
    // TODO: Implement modal or navigation for emotional registry
    console.log("Botón 'Registrar Emoción' pulsado.");
    // For now, you can use a toast or alert
    // import { useToast } from "@/hooks/use-toast";
    // const { toast } = useToast();
    // toast({ title: "Próximamente", description: "El registro de emociones estará disponible pronto." });
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
            ctaLink="/assessment" // Example link
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.progressSinceLast}
            value={t.progressPlaceholder}
            description={t.progressDescription}
            icon={TrendingUp}
            cardColorClass="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            iconColorClass="text-blue-600 dark:text-blue-400"
            ctaLink="/assessment" // Example link
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.inFocus}
            value={t.inFocusPlaceholder}
            description={t.inFocusDescription}
            icon={Target}
            cardColorClass="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            iconColorClass="text-purple-600 dark:text-purple-400"
            ctaLink="/paths" // Example link
            ctaLabel={t.viewDetails}
          />
          <DashboardSummaryCard
            title={t.nextStep}
            value={t.nextStepPlaceholder}
            description={t.nextStepDescription}
            icon={Lightbulb}
            cardColorClass="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            iconColorClass="text-yellow-600 dark:text-yellow-500"
            ctaLink="/paths" // Example link
            ctaLabel={t.viewDetails}
          />
        </div>
      </section>

      {/* Registro Emocional */}
      <section aria-labelledby="emotional-registry-heading" className="text-center py-6">
        <h2 id="emotional-registry-heading" className="sr-only">{t.emotionalRegistry}</h2>
        <Button size="lg" onClick={handleRegisterEmotion} className="shadow-md hover:shadow-lg transition-shadow">
          <Edit className="mr-2 h-5 w-5" />
          {t.registerEmotion}
        </Button>
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
            icon={LineChartIcon} // Using LineChartIcon alias for lucide
            className="lg:h-[450px]"
          />
        </div>
      </section>
        
      {/* Botón de Evaluación (si se quiere mantener) */}
      {/* <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/assessment">
            {t.takeInitialAssessment} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div> */}
    </div>
  );
}
