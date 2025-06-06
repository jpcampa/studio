
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser, type User } from "@/contexts/UserContext";
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
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle, Info, UserCircle2, Lock, KeyRound, ShieldQuestion, Trash2, Activity } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext"; 
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { encryptDataAES, decryptDataAES } from "@/lib/encryption"; 
import { useActivePath } from "@/contexts/ActivePathContext";
import { type ActivePathDetails as StoredActivePathDetails, getCompletedModules } from "@/lib/progressStore";
import { pathsData, type Path as AppPathData } from "@/data/pathsData";


interface ProcessedChartDataPoint {
  date: string; 
  moodScore: number;
  emotionLabel: string;
  fullDate: string; 
}

interface PathProgressInfo {
  pathId: string;
  pathTitle: string;
  totalModules: number;
  completedModulesCount: number;
  progressPercentage: number;
  isCompleted: boolean;
}

interface UserActivitySummary {
  user: User | null;
  emotionalEntries: EmotionalEntry[];
  activePath: StoredActivePathDetails | null;
  allPathsProgress: PathProgressInfo[];
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
const SESSION_STORAGE_REGISTER_URL_KEY = 'workwell-debug-register-url';
const SESSION_STORAGE_LOGIN_URL_KEY = 'workwell-debug-login-url';
const API_BASE_URL_FOR_DEBUG = "http://workwell.hl1448.dinaserver.com/wp-content/programacion/wscontenido.php"; 
const API_KEY_FOR_DEBUG = "4463"; 


export default function DashboardPage() {
  console.log("DashboardPage: Component rendering or re-rendering.");
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const { isEmotionalDashboardEnabled } = useFeatureFlag(); 
  const { activePath: currentActivePath } = useActivePath();
  
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntriesForChart, setAllEntriesForChart] = useState<EmotionalEntry[]>([]);
  
  const [userActivityForDisplay, setUserActivityForDisplay] = useState<string | null>(null);
  const [encryptedUserActivityForTest, setEncryptedUserActivityForTest] = useState<string | null>(null);
  const [decryptedDataForTest, setDecryptedDataForTest] = useState<string | null>(null);
  const [lastGeneratedRegisterApiUrl, setLastGeneratedRegisterApiUrl] = useState<string | null>(null);
  const [lastGeneratedLoginApiUrl, setLastGeneratedLoginApiUrl] = useState<string | null>(null);
  const [debugDeleteApiUrlForDisplay, setDebugDeleteApiUrlForDisplay] = useState<string | null>(null);
  const [debugChangePasswordApiUrlForDisplay, setDebugChangePasswordApiUrlForDisplay] = useState<string | null>(null);


  useEffect(() => {
    console.log("DashboardPage: Initial Load useEffect running. Emotional Dashboard Enabled:", isEmotionalDashboardEnabled);
    if (isEmotionalDashboardEnabled) {
      const loadedRecentEntries = getRecentEmotionalEntries();
      const loadedAllEntries = getEmotionalEntries();
      
      setRecentEntries(loadedRecentEntries);
      setAllEntriesForChart(loadedAllEntries);

      if (loadedRecentEntries.length > 0) {
        const lastRegisteredEmotion = emotionOptions.find(e => e.value === loadedRecentEntries[0].emotion);
        if (lastRegisteredEmotion) {
          setLastEmotion(t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value);
        }
      }

      const storedRegisterUrl = sessionStorage.getItem(SESSION_STORAGE_REGISTER_URL_KEY);
      if (storedRegisterUrl) setLastGeneratedRegisterApiUrl(storedRegisterUrl);

      const storedLoginUrl = sessionStorage.getItem(SESSION_STORAGE_LOGIN_URL_KEY);
      if (storedLoginUrl) setLastGeneratedLoginApiUrl(storedLoginUrl);

      if (user && user.email) {
        try {
            // Baja URL
            const deletePayloadToEncrypt = { email: user.email };
            const encryptedDeletePayload = encryptDataAES(deletePayloadToEncrypt);
            const finalEncryptedDeletePayloadForUrl = encodeURIComponent(encryptedDeletePayload);
            const deleteType = "baja";
            const generatedDeleteUrl = `${API_BASE_URL_FOR_DEBUG}?apikey=${API_KEY_FOR_DEBUG}&tipo=${deleteType}&usuario=${finalEncryptedDeletePayloadForUrl}`;
            setDebugDeleteApiUrlForDisplay(generatedDeleteUrl);
            
            // Change Password URL
            const exampleNewPassword = "nuevaPassword123";
            const changePasswordPayloadToEncrypt = { email: user.email, newPassword: exampleNewPassword };
            const encryptedChangePasswordPayload = encryptDataAES(changePasswordPayloadToEncrypt);
            const finalEncryptedChangePasswordPayloadForUrl = encodeURIComponent(encryptedChangePasswordPayload);
            const changePasswordType = "cambiocontraseña";
            const generatedChangePasswordUrl = `${API_BASE_URL_FOR_DEBUG}?apikey=${API_KEY_FOR_DEBUG}&tipo=${changePasswordType}&usuario=${finalEncryptedChangePasswordPayloadForUrl}`;
            setDebugChangePasswordApiUrlForDisplay(generatedChangePasswordUrl);

        } catch (error) {
            console.error("DashboardPage: Error generating simulated API URLs for display:", error);
            setDebugDeleteApiUrlForDisplay("Error generando URL de baja simulada.");
            setDebugChangePasswordApiUrlForDisplay("Error generando URL de cambio de contraseña simulada.");
        }
      } else {
        setDebugDeleteApiUrlForDisplay(null);
        setDebugChangePasswordApiUrlForDisplay(null);
      }
    } else {
      setRecentEntries([]);
      setAllEntriesForChart([]);
      setLastEmotion(null);
      setLastGeneratedRegisterApiUrl(null);
      setLastGeneratedLoginApiUrl(null);
      setDebugDeleteApiUrlForDisplay(null);
      setDebugChangePasswordApiUrlForDisplay(null);
    }
  }, [t, isEmotionalDashboardEnabled, user]); 

  useEffect(() => {
    if (user && isEmotionalDashboardEnabled) {
      const allEmotionalEntries = getEmotionalEntries();
      const allPathsProgressData = pathsData.map((appPath: AppPathData): PathProgressInfo => {
        const completedModuleIdsSet = getCompletedModules(appPath.id);
        const completedModulesCount = completedModuleIdsSet.size;
        const totalModules = appPath.modules.length;
        const progressPercentage = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;
        return {
          pathId: appPath.id,
          pathTitle: appPath.title,
          totalModules,
          completedModulesCount,
          progressPercentage,
          isCompleted: progressPercentage === 100 && totalModules > 0,
        };
      });

      const summary: UserActivitySummary = {
        user,
        emotionalEntries: allEmotionalEntries,
        activePath: currentActivePath,
        allPathsProgress: allPathsProgressData,
      };

      setUserActivityForDisplay(JSON.stringify(summary, null, 2));
      
      try {
        const encryptedString = encryptDataAES(summary);
        setEncryptedUserActivityForTest(encryptedString);
      } catch (error) {
        console.error("Error encrypting user activity summary for test display:", error);
        setEncryptedUserActivityForTest("Error durante la encriptación de los datos de actividad del usuario para prueba.");
      }
    } else if (isEmotionalDashboardEnabled) {
      setUserActivityForDisplay("No hay datos de usuario para construir el resumen de actividad.");
      setEncryptedUserActivityForTest("No hay datos de usuario para encriptar.");
    } else {
      setUserActivityForDisplay(null);
      setEncryptedUserActivityForTest(null);
    }
  }, [user, currentActivePath, isEmotionalDashboardEnabled, pathsData]); 

  useEffect(() => {
    if (isEmotionalDashboardEnabled) {
      const decryptedObject = decryptDataAES(ENCRYPTED_STRING_FOR_DECRYPTION_TEST);
      if (decryptedObject && typeof decryptedObject === 'object') {
        setDecryptedDataForTest(JSON.stringify(decryptedObject, null, 2));
      } else {
        setDecryptedDataForTest("Error al desencriptar la cadena de prueba o resultado no es un objeto.");
      }
    } else {
        setDecryptedDataForTest(null);
    }
  }, [isEmotionalDashboardEnabled]);


  const chartData = useMemo(() => {
    if (!isEmotionalDashboardEnabled || !allEntriesForChart || allEntriesForChart.length === 0) {
      return [];
    }

    const processedData = allEntriesForChart
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
    return processedData;
  }, [allEntriesForChart, t, isEmotionalDashboardEnabled]);


  const handleEmotionalEntrySubmit = (data: { situation: string; emotion: string }) => {
    if (!isEmotionalDashboardEnabled) return;
    const newEntry = addEmotionalEntry(data);
    setRecentEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 5)); 
    setAllEntriesForChart(prevAllEntries => [newEntry, ...prevAllEntries].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    const lastRegisteredEmotionDetails = emotionOptions.find(e => e.value === newEntry.emotion);
    if (lastRegisteredEmotionDetails) {
        setLastEmotion(t[lastRegisteredEmotionDetails.labelKey as keyof typeof t] || lastRegisteredEmotionDetails.value);
    }
     if (user) {
      const allEmotionalEntries = getEmotionalEntries();
      const allPathsProgressData = pathsData.map((appPath: AppPathData): PathProgressInfo => {
        const completedModuleIdsSet = getCompletedModules(appPath.id);
        return {
          pathId: appPath.id,
          pathTitle: appPath.title,
          totalModules: appPath.modules.length,
          completedModulesCount: completedModuleIdsSet.size,
          progressPercentage: appPath.modules.length > 0 ? Math.round((completedModuleIdsSet.size / appPath.modules.length) * 100) : 0,
          isCompleted: (appPath.modules.length > 0 && completedModuleIdsSet.size === appPath.modules.length),
        };
      });
      const summary: UserActivitySummary = { user, emotionalEntries: allEmotionalEntries, activePath: currentActivePath, allPathsProgress: allPathsProgressData };
      setUserActivityForDisplay(JSON.stringify(summary, null, 2));
      setEncryptedUserActivityForTest(encryptDataAES(summary));
    }
    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false); 
  };

  const handleClearDebugUrl = (key: string, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    sessionStorage.removeItem(key);
    setter(null);
    toast({ title: "URL de prueba eliminada", description: `La URL para ${key === SESSION_STORAGE_REGISTER_URL_KEY ? 'registro' : 'login'} ha sido eliminada de sessionStorage.` });
  };
  
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
            
            <div className="mt-6 p-4 border rounded-lg bg-muted/20 text-left max-w-2xl mx-auto space-y-4 shadow">
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Resumen de Actividad del Usuario (para prueba):
                </p>
                {userActivityForDisplay ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner max-h-96">
                    <code>{userActivityForDisplay}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Resumen de actividad no disponible o cargando...]</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Resumen de Actividad Encriptado (para prueba):
                </p>
                {encryptedUserActivityForTest ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner max-h-60">
                    <code>{encryptedUserActivityForTest}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Calculando o valor no disponible...]</p>
                )}
                <p className="text-xs mt-2 text-muted-foreground">
                  Esto es para verificar la función <code>encryptDataAES(userActivitySummaryObject)</code>.
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
              <Separator />
               {lastGeneratedRegisterApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    Última URL de Registro Generada (para prueba):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{lastGeneratedRegisterApiUrl}</code>
                  </pre>
                  <Button variant="outline" size="sm" onClick={() => handleClearDebugUrl(SESSION_STORAGE_REGISTER_URL_KEY, setLastGeneratedRegisterApiUrl)} className="mt-2">
                    <Trash2 className="mr-2 h-3 w-3" /> Limpiar URL de Registro
                  </Button>
                </div>
               )}
               {lastGeneratedLoginApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    Última URL de Login Generada (para prueba):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{lastGeneratedLoginApiUrl}</code>
                  </pre>
                  <Button variant="outline" size="sm" onClick={() => handleClearDebugUrl(SESSION_STORAGE_LOGIN_URL_KEY, setLastGeneratedLoginApiUrl)} className="mt-2">
                    <Trash2 className="mr-2 h-3 w-3" /> Limpiar URL de Login
                  </Button>
                </div>
               )}
               {debugDeleteApiUrlForDisplay && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Baja (Simulada para Depuración):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugDeleteApiUrlForDisplay}</code>
                  </pre>
                   <p className="text-xs mt-2 text-muted-foreground">
                    Generada al cargar el dashboard si el usuario está logueado.
                  </p>
                </div>
               )}
               {debugChangePasswordApiUrlForDisplay && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Cambio Contraseña (Simulada para Depuración):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugChangePasswordApiUrlForDisplay}</code>
                  </pre>
                   <p className="text-xs mt-2 text-muted-foreground">
                    Generada al cargar el dashboard si el usuario está logueado (con contraseña de ejemplo).
                  </p>
                </div>
               )}
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
