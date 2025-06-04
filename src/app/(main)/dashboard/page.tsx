
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
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle, Info, UserCircle2, Lock, KeyRound } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext"; 
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { encryptDataAES, decryptDataAES } from "@/lib/encryption"; 

interface ProcessedChartDataPoint {
  date: string; 
  moodScore: number;
  emotionLabel: string;
  fullDate: string; 
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

const ENCRYPTED_STRING_FOR_DECRYPTION_TEST = '{"iv":"+qlG7LRW9es5HVkyZb5qBw==","data":"XGFYeXI0c1YgbLsx0n1atZ1iEvvWztRUnCmHQmeSwtnG70CJC6OUq7qrCOP830RGaV15IqJtp13co1fEUnirCH6W4CDarwqQnBGstSwsTAA="}';


export default function DashboardPage() {
  console.log("DashboardPage: Component rendering or re-rendering.");
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const { isEmotionalDashboardEnabled } = useFeatureFlag(); 
  
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);
  const [encryptedUserDataForTest, setEncryptedUserDataForTest] = useState<string | null>(null);
  const [decryptedDataForTest, setDecryptedDataForTest] = useState<string | null>(null);
  const [currentUserDisplay, setCurrentUserDisplay] = useState<string | null>(null);

  useEffect(() => {
    console.log("DashboardPage: Initial Load useEffect running. Emotional Dashboard Enabled:", isEmotionalDashboardEnabled);
    if (isEmotionalDashboardEnabled) {
      const loadedRecentEntries = getRecentEmotionalEntries();
      const loadedAllEntries = getEmotionalEntries();
      
      console.log("DashboardPage: Initial Load (Emotional Dashboard Enabled) - loadedRecentEntries:", loadedRecentEntries);
      console.log("DashboardPage: Initial Load (Emotional Dashboard Enabled) - loadedAllEntries:", loadedAllEntries);

      setRecentEntries(loadedRecentEntries);
      setAllEntries(loadedAllEntries);

      if (loadedRecentEntries.length > 0) {
        const lastRegisteredEmotion = emotionOptions.find(e => e.value === loadedRecentEntries[0].emotion);
        if (lastRegisteredEmotion) {
          setLastEmotion(t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value);
        }
      }
    } else {
      setRecentEntries([]);
      setAllEntries([]);
      setLastEmotion(null);
    }
    console.log("DashboardPage: Initial Load useEffect finished.");
  }, [t, isEmotionalDashboardEnabled]); 

  useEffect(() => {
    console.log("DashboardPage: Encrypt User Data Test Value useEffect running. Current user:", user);
    if (user && isEmotionalDashboardEnabled) {
      try {
        const encryptedString = encryptDataAES(user);
        console.log('DashboardPage - Encrypted User Data for Test (encryptDataAES output):', encryptedString);
        setEncryptedUserDataForTest(encryptedString);
      } catch (error) {
        console.error("Error encrypting user data for test display:", error);
        setEncryptedUserDataForTest("Error durante la encriptación de los datos de usuario para prueba.");
      }
    } else if (isEmotionalDashboardEnabled) {
      setEncryptedUserDataForTest("No hay datos de usuario para encriptar.");
    } else {
      setEncryptedUserDataForTest(null);
    }
  }, [user, isEmotionalDashboardEnabled]); 

  useEffect(() => {
    if (isEmotionalDashboardEnabled) {
      console.log("DashboardPage: Decrypt Specific String Test useEffect running.");
      const decryptedObject = decryptDataAES(ENCRYPTED_STRING_FOR_DECRYPTION_TEST);
      if (decryptedObject && typeof decryptedObject === 'object') {
        setDecryptedDataForTest(JSON.stringify(decryptedObject, null, 2));
        console.log('DashboardPage - Decrypted Specific String for Test:', decryptedObject);
      } else {
        setDecryptedDataForTest("Error al desencriptar la cadena de prueba o resultado no es un objeto.");
        console.error('DashboardPage - Failed to decrypt specific string or result was not an object:', decryptedObject);
      }
    } else {
        setDecryptedDataForTest(null);
    }
  }, [isEmotionalDashboardEnabled]);

  useEffect(() => {
    if (user && isEmotionalDashboardEnabled) {
      console.log("DashboardPage: Current user data for display:", user);
      setCurrentUserDisplay(JSON.stringify(user, null, 2));
    } else if (!isEmotionalDashboardEnabled) {
      setCurrentUserDisplay(null); 
    }
  }, [user, isEmotionalDashboardEnabled]);


  const chartData = useMemo(() => {
    if (!isEmotionalDashboardEnabled || !allEntries || allEntries.length === 0) {
      console.log("DashboardPage: No entries for chartData calculation or dashboard disabled.");
      return [];
    }
    console.log("DashboardPage: Recalculating chartData. allEntries count:", allEntries.length);

    const processedData = allEntries
      .map(entry => ({
        ...entry,
        timestampDate: new Date(entry.timestamp), 
      }))
      .sort((a, b) => a.timestampDate.getTime() - b.timestampDate.getTime()) 
      .slice(-15) 
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0], 
          moodScore: moodScoreMapping[entry.emotion] ?? 0, 
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
    console.log("DashboardPage: Processed chartData:", processedData);
    return processedData;
  }, [allEntries, t, isEmotionalDashboardEnabled]);


  const handleEmotionalEntrySubmit = (data: { situation: string; emotion: string }) => {
    console.log("DashboardPage: handleEmotionalEntrySubmit called with:", data);
    if (!isEmotionalDashboardEnabled) return;

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
  
  console.log("DashboardPage: Rendering JSX. User:", user?.name, "Emotional Dashboard Enabled:", isEmotionalDashboardEnabled);

  return (
    <div className="container mx-auto py-8 space-y-10">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {t.welcome}, {user?.name || "Usuarie"}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-1">{t.dashboardGreeting}</p>
      </div>

      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="text-2xl font-semibold text-accent mb-6">
          {t.quickSummary}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title={t.currentWellbeing}
            value={isEmotionalDashboardEnabled && lastEmotion ? lastEmotion : t.wellbeingPlaceholder}
            description={isEmotionalDashboardEnabled ? t.wellbeingDescription : ""}
            icon={isEmotionalDashboardEnabled && lastEmotion ? CheckCircle : Smile}
            cardColorClass={isEmotionalDashboardEnabled && lastEmotion ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700" }
            iconColorClass={isEmotionalDashboardEnabled && lastEmotion ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
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

      {!isEmotionalDashboardEnabled && (
        <Alert variant="default" className="shadow-md bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            {t.emotionalDashboardDisabledMessage}
            {user?.email === 'jpcampa@example.com' && " Puedes activarlo en Configuración > Utilidades de Desarrollo."}
          </AlertDescription>
        </Alert>
      )}

      {isEmotionalDashboardEnabled && (
        <>
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
            
            <div className="mt-6 p-4 border rounded-lg bg-muted/20 text-left max-w-xl mx-auto space-y-4 shadow">
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Datos del Usuario Actual (para prueba):
                </p>
                {currentUserDisplay ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{currentUserDisplay}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Datos de usuario no disponibles o cargando...]</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Datos de Usuario Actual Encriptados (para prueba):
                </p>
                {encryptedUserDataForTest ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{encryptedUserDataForTest}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Calculando o valor no disponible...]</p>
                )}
                <p className="text-xs mt-2 text-muted-foreground">
                  Esto es para verificar la función <code>encryptDataAES(currentUserObject)</code>.
                </p>
              </div>
              <Separator />
               <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Resultado Desencriptación de Cadena Específica (para prueba):
                </p>
                {decryptedDataForTest ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{decryptedDataForTest}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Calculando o valor no disponible...]</p>
                )}
                <p className="text-xs mt-2 text-muted-foreground">
                  Esto es para verificar <code>decryptDataAES</code> con una cadena predefinida.
                </p>
              </div>
            </div>
          </section>

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
        </>
      )}

      <section aria-labelledby="visualizations-heading">
        <h2 id="visualizations-heading" className="sr-only">Visualizaciones de Progreso</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ChartPlaceholder
            title={t.myEmotionalProfile}
            description={t.myEmotionalProfileDescription}
            icon={Radar}
            className="lg:h-[450px]"
          />
          {isEmotionalDashboardEnabled ? (
             <MoodEvolutionChart 
              data={chartData} 
              title={t.myEvolution}
              description={t.myEvolutionDescription}
              className="lg:h-[450px]"
            />
          ) : (
            <ChartPlaceholder
              title={t.myEvolution}
              description={t.myEvolutionDescription}
              icon={LineChartIcon}
              className="lg:h-[450px]"
            />
          )}
        </div>
      </section>
    </div>
  );
}
    

    

      

