
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
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle, Info, UserCircle2, Lock, KeyRound, ShieldQuestion, Trash2, Activity } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext"; 
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { encryptDataAES, decryptDataAES, forceEncryptStringAES } from "@/lib/encryption"; 
import { useActivePath } from "@/contexts/ActivePathContext";
import { type ActivePathDetails as StoredActivePathDetails, getCompletedModules } from "@/lib/progressStore";
import { pathsData, type Path as AppPathData } from "@/data/pathsData";


interface ProcessedChartDataPoint {
  date: string; 
  moodScore: number;
  emotionLabel: string;
  fullDate: string; 
}

interface UserActivitySummary {
  ID?: string | null; // User ID from UserContext, value will be the result of forceEncryptStringAES.
  emotionalEntries: EmotionalEntry[];
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
  const { user } = useUser(); // User from UserContext
  const { toast } = useToast();
  const { isEmotionalDashboardEnabled } = useFeatureFlag(); 
  const { activePath: currentActivePath } = useActivePath();
  
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntriesForChart, setAllEntriesForChart] = useState<EmotionalEntry[]>([]);
  
  const [userActivityForDisplay, setUserActivityForDisplay] = useState<string | null>(null);
  const [outputOfEncryptFunctionForTest, setOutputOfEncryptFunctionForTest] = useState<string | null>(null);
  const [outputOfDecryptFunctionForTest, setOutputOfDecryptFunctionForTest] = useState<string | null>(null);
  
  const [debugRegisterApiUrl, setDebugRegisterApiUrl] = useState<string | null>(null);
  const [debugLoginApiUrl, setDebugLoginApiUrl] = useState<string | null>(null);
  const [debugDeleteApiUrl, setDebugDeleteApiUrl] = useState<string | null>(null);
  const [debugChangePasswordApiUrl, setDebugChangePasswordApiUrl] = useState<string | null>(null);
  const [debugUserActivityApiUrl, setDebugUserActivityApiUrl] = useState<string | null>(null);
  const [rawUserObjectForDebug, setRawUserObjectForDebug] = useState<string | null>(null);


  const generateApiUrlWithParams = (type: string, params: Record<string, any>): string => {
    const encodedParams = Object.entries(params)
      .map(([key, valueObj]) => {
        const payloadString = encryptDataAES(valueObj); 
        return `${key}=${encodeURIComponent(payloadString)}`;
      })
      .join('&');
    return `${API_BASE_URL_FOR_DEBUG}?apikey=${API_KEY_FOR_DEBUG}&tipo=${type}&${encodedParams}`;
  };

  const generateUserActivityApiUrl = (activitySummary: UserActivitySummary, userIdFromContext?: string | null): string => {
    console.log("DashboardPage (generateUserActivityApiUrl): Received activitySummary for datosactividad:", JSON.stringify(activitySummary).substring(0,200) + "...");
    console.log("DashboardPage (generateUserActivityApiUrl): Received userIdFromContext for &userID= param:", userIdFromContext);
    
    const jsonPayloadForDatosActividad = encryptDataAES(activitySummary); 
    let url = `${API_BASE_URL_FOR_DEBUG}?apikey=${API_KEY_FOR_DEBUG}&tipo=guardaractividad&datosactividad=${encodeURIComponent(jsonPayloadForDatosActividad)}`;
    console.log("DashboardPage (generateUserActivityApiUrl): URL base (con datosactividad):", url.substring(0, 200) + "...");

    if (userIdFromContext && typeof userIdFromContext === 'string' && userIdFromContext.trim() !== '') {
      console.log("DashboardPage (generateUserActivityApiUrl): userIdFromContext es válido. Procediendo a encriptar para parámetro userID.");
      const encryptedDirectUserId = forceEncryptStringAES(userIdFromContext);
      console.log("DashboardPage (generateUserActivityApiUrl): Salida de forceEncryptStringAES para userIdFromContext (parámetro userID):", encryptedDirectUserId);
      url += `&userID=${encodeURIComponent(encryptedDirectUserId)}`;
      console.log("DashboardPage (generateUserActivityApiUrl): URL final con parámetro userID añadido:", url.substring(0, 250) + "...");
    } else {
      console.log("DashboardPage (generateUserActivityApiUrl): userIdFromContext es nulo, vacío o no es un string. El parámetro userID no se añadirá. Valor de userIdFromContext:", userIdFromContext);
    }
    return url;
  };


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
      if (storedRegisterUrl) {
        setDebugRegisterApiUrl(storedRegisterUrl);
      } else {
        const exampleRegisterUser = { id: `reg-id-${crypto.randomUUID().substring(0,8)}`, name: "Usuario Ejemplo", email: "registro@ejemplo.com", ageRange: "25_34", gender: "female", initialEmotionalState: 4 };
        const registerParams = {
          usuario: exampleRegisterUser,
          name: { value: exampleRegisterUser.name },
          email: { value: exampleRegisterUser.email },
          password: { value: "PasswordDeRegistro123" }
        };
        setDebugRegisterApiUrl(generateApiUrlWithParams("registro", registerParams));
      }

      const storedLoginUrl = sessionStorage.getItem(SESSION_STORAGE_LOGIN_URL_KEY);
      if (storedLoginUrl) {
        setDebugLoginApiUrl(storedLoginUrl);
      } else {
        const loginParams = {
          usuario: { email: "login@ejemplo.com" },
          password: { value: "PasswordDeLogin123" }
        };
        setDebugLoginApiUrl(generateApiUrlWithParams("login", loginParams));
      }
      
      const currentUserEmailForSetup = user?.email; 
      if (currentUserEmailForSetup) {
        setDebugDeleteApiUrl(generateApiUrlWithParams("baja", { usuario: { email: currentUserEmailForSetup } }));
        setDebugChangePasswordApiUrl(generateApiUrlWithParams("cambiocontraseña", { usuario: { email: currentUserEmailForSetup, newPassword: "nuevaPassword123" } }));
      } else {
        setDebugDeleteApiUrl(generateApiUrlWithParams("baja", { usuario: { email: "baja_ejemplo@workwell.app" } }));
        setDebugChangePasswordApiUrl(generateApiUrlWithParams("cambiocontraseña", { usuario: { email: "cambio_ejemplo@workwell.app", newPassword: "PasswordEjemplo123" } }));
      }

    } else {
      setRecentEntries([]);
      setAllEntriesForChart([]);
      setLastEmotion(null);
      setDebugRegisterApiUrl(null);
      setDebugLoginApiUrl(null);
      setDebugDeleteApiUrl(null);
      setDebugChangePasswordApiUrl(null);
      setDebugUserActivityApiUrl(null);
    }
  }, [t, isEmotionalDashboardEnabled, user]); 

  useEffect(() => {
    let activitySummaryForUrlGeneration: UserActivitySummary | null = null;

    console.log("DashboardPage (Activity Summary UE): Current user object from context:", JSON.stringify(user, null, 2));
    setRawUserObjectForDebug(user ? JSON.stringify(user, null, 2) : "Usuario no disponible o cargando...");

    const userIdFromContext = user?.id; 
    console.log("DashboardPage (Activity Summary UE): User ID from UserContext (for summary.ID and &userID= param):", userIdFromContext, "(Type:", typeof userIdFromContext, ")");
    console.log("DashboardPage (Activity Summary UE DEBUG): Para el parámetro userID, se usará este ID del UserContext (antes de encriptar):", user?.id);


    if (isEmotionalDashboardEnabled) {
      const allEmotionalEntries = getEmotionalEntries();
      
      const summary: UserActivitySummary = {
        emotionalEntries: allEmotionalEntries,
      };
      
      if (userIdFromContext && typeof userIdFromContext === 'string' && userIdFromContext.trim() !== '') {
        console.log("DashboardPage (Activity Summary UE): User ID from UserContext is valid. Encrypting for summary.ID.");
        const encryptedIdForSummary = forceEncryptStringAES(userIdFromContext);
        console.log("DashboardPage (Activity Summary UE): forceEncryptStringAES output for summary.ID:", encryptedIdForSummary);
        summary.ID = encryptedIdForSummary; 
      } else {
        console.log("DashboardPage (Activity Summary UE): User ID from UserContext is NOT valid for encryption for summary.ID. 'ID' field will be omitted from summary. User object:", user);
      }

      activitySummaryForUrlGeneration = summary;
      setUserActivityForDisplay(JSON.stringify(summary, null, 2)); 
      
      try {
        const outputOfEncryptCall = encryptDataAES(summary); 
        setOutputOfEncryptFunctionForTest(outputOfEncryptCall);
      } catch (error) {
        console.error("Error processing user activity summary for test display:", error);
        setOutputOfEncryptFunctionForTest("Error durante el procesamiento de los datos de actividad del usuario para prueba.");
      }
      
      console.log("DashboardPage (useEffect for API URL): User ID from UserContext being passed to generateUserActivityApiUrl for &userID= param:", userIdFromContext);
      setDebugUserActivityApiUrl(generateUserActivityApiUrl(summary, userIdFromContext)); 
    } else {
      setUserActivityForDisplay(null);
      setOutputOfEncryptFunctionForTest(null);
      setDebugUserActivityApiUrl(null);
    }

  }, [isEmotionalDashboardEnabled, user, currentActivePath, t]); 


  useEffect(() => {
    if (isEmotionalDashboardEnabled) {
      const decryptedObjectOrString = decryptDataAES(ENCRYPTED_STRING_FOR_DECRYPTION_TEST);
      if (typeof decryptedObjectOrString === 'object' && decryptedObjectOrString !== null) {
        setOutputOfDecryptFunctionForTest(JSON.stringify(decryptedObjectOrString, null, 2));
      } else if (typeof decryptedObjectOrString === 'string') {
        setOutputOfDecryptFunctionForTest(decryptedObjectOrString);
      } else {
        setOutputOfDecryptFunctionForTest("Error al procesar la cadena de prueba o resultado no esperado.");
      }
    } else {
        setOutputOfDecryptFunctionForTest(null);
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

    const allEmotionalEntries = getEmotionalEntries();
    const summary: UserActivitySummary = { emotionalEntries: allEmotionalEntries };
    
    const userIdFromContext = user?.id; 
    console.log("DashboardPage (handleEmotionalEntrySubmit): User ID from UserContext:", userIdFromContext);

    if (userIdFromContext && typeof userIdFromContext === 'string' && userIdFromContext.trim() !== '') {
      console.log("DashboardPage (handleEmotionalEntrySubmit): User ID from UserContext is valid. Encrypting for summary.ID.");
      summary.ID = forceEncryptStringAES(userIdFromContext); 
    } else {
      console.log("DashboardPage (handleEmotionalEntrySubmit): User ID from UserContext is NOT valid for encryption for summary.ID. 'ID' field will be omitted. User object:", user);
    }
    
    setUserActivityForDisplay(JSON.stringify(summary, null, 2));
    setOutputOfEncryptFunctionForTest(encryptDataAES(summary)); 
    console.log("DashboardPage (handleEmotionalEntrySubmit): User ID from UserContext being passed to generateUserActivityApiUrl for &userID= param:", userIdFromContext);
    setDebugUserActivityApiUrl(generateUserActivityApiUrl(summary, userIdFromContext)); 


    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false); 
  };

  const handleClearDebugUrl = (key: string, setter: React.Dispatch<React.SetStateAction<string | null>>, exampleUrlGenerator: () => string) => {
    sessionStorage.removeItem(key);
    setter(exampleUrlGenerator()); 
    toast({ title: "URL de prueba eliminada de SessionStorage", description: `Se ha regenerado la URL de ejemplo para ${key === SESSION_STORAGE_REGISTER_URL_KEY ? 'registro' : 'login'}.` });
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
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  User Object del Contexto (RAW):
                </p>
                <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner max-h-96">
                  <code>{rawUserObjectForDebug || "No disponible o cargando..."}</code>
                </pre>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Payload JSON para 'datosactividad' (Campo 'ID' Encriptado opcionalmente):
                </p>
                {userActivityForDisplay ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner max-h-96">
                    <code>{userActivityForDisplay}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Resumen de actividad no disponible o cargando...]</p>
                )}
                 <p className="text-xs mt-1 text-muted-foreground">
                    Nota: El campo <code>ID</code> (si está presente y el ID del usuario del contexto estaba disponible) contiene un string JSON (con 'iv' y 'data') que es el ID del usuario encriptado con AES. Los registros emocionales (<code>emotionalEntries</code>) están en texto plano. Si el ID del usuario del contexto no estaba disponible, el campo <code>ID</code> se omitirá del JSON.
                  </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Prueba de Función `encryptDataAES` (Encriptación GLOBAL DESACTIVADA):
                </p>
                {outputOfEncryptFunctionForTest ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner max-h-60">
                    <code>{outputOfEncryptFunctionForTest}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Calculando o valor no disponible...]</p>
                )}
                <p className="text-xs mt-2 text-muted-foreground">
                  Con la encriptación GLOBAL DESACTIVADA, <code>encryptDataAES(objeto)</code> devuelve directamente el objeto como cadena JSON.
                  En el caso del resumen de actividad, el campo <code>ID</code> dentro del objeto (si existe) ya fue pre-encriptado por <code>forceEncryptStringAES</code> (resultando en un string JSON).
                </p>
              </div>
              <Separator />
               <div>
                <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Prueba de Función `decryptDataAES` (Encriptación GLOBAL DESACTIVADA):
                </p>
                {outputOfDecryptFunctionForTest ? (
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{outputOfDecryptFunctionForTest}</code>
                  </pre>
                ) : (
                  <p className="text-xs italic text-muted-foreground">[Calculando o valor no disponible...]</p>
                )}
                <p className="text-xs mt-2 text-muted-foreground">
                  Con la encriptación GLOBAL DESACTIVADA, <code>decryptDataAES(cadena)</code> intenta parsear la cadena como JSON. Si es JSON válido, devuelve el objeto. Si no (ej. es un string encriptado con IV/data), lo devuelve tal cual si no es JSON.
                </p>
              </div>
              <Separator />
               {debugRegisterApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Registro (Depuración - Payloads son JSON):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugRegisterApiUrl}</code>
                  </pre>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Nota: Los parámetros `usuario`, `name`, `email`, `password` contienen strings JSON (encriptación global AES desactivada).
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleClearDebugUrl(SESSION_STORAGE_REGISTER_URL_KEY, setDebugRegisterApiUrl, () => {
                     const exampleRegisterUser = { id: `reg-id-${crypto.randomUUID().substring(0,8)}`, name: "Usuario Ejemplo", email: "registro@ejemplo.com", ageRange: "25_34", gender: "female", initialEmotionalState: 4 };
                     const registerParams = { usuario: exampleRegisterUser, name: { value: exampleRegisterUser.name }, email: { value: exampleRegisterUser.email }, password: { value: "PasswordDeRegistro123" }};
                     return generateApiUrlWithParams("registro", registerParams);
                  })} className="mt-2">
                    <Trash2 className="mr-2 h-3 w-3" /> Limpiar URL (para regenerar ejemplo)
                  </Button>
                </div>
               )}
               {debugLoginApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Login (Depuración - Payloads son JSON):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugLoginApiUrl}</code>
                  </pre>
                   <p className="text-xs mt-1 text-muted-foreground">
                    Nota: Los parámetros `usuario` y `password` contienen strings JSON (encriptación global AES desactivada).
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleClearDebugUrl(SESSION_STORAGE_LOGIN_URL_KEY, setDebugLoginApiUrl, () => {
                    const loginParams = { usuario: { email: "login@ejemplo.com" }, password: { value: "PasswordDeLogin123" } };
                    return generateApiUrlWithParams("login", loginParams);
                  })} className="mt-2">
                    <Trash2 className="mr-2 h-3 w-3" /> Limpiar URL (para regenerar ejemplo)
                  </Button>
                </div>
               )}
               {debugDeleteApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Baja (Depuración - Payload es JSON):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugDeleteApiUrl}</code>
                  </pre>
                   <p className="text-xs mt-1 text-muted-foreground">
                    Nota: El parámetro `usuario` contiene un string JSON (encriptación global AES desactivada). Generada usando el email del usuario actual o un ejemplo si no hay sesión.
                  </p>
                </div>
               )}
               {debugChangePasswordApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    URL de API de Cambio Contraseña (Depuración - Payload es JSON):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugChangePasswordApiUrl}</code>
                  </pre>
                   <p className="text-xs mt-1 text-muted-foreground">
                    Nota: El parámetro `usuario` contiene un string JSON (encriptación global AES desactivada). Generada usando el email del usuario actual (y contraseña de ejemplo) o datos de ejemplo si no hay sesión.
                  </p>
                </div>
               )}
               {debugUserActivityApiUrl && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-primary flex items-center">
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                     URL de API para Guardar Actividad (Depuración):
                  </p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                    <code>{debugUserActivityApiUrl}</code>
                  </pre>
                   <p className="text-xs mt-1 text-muted-foreground">
                    Nota: El parámetro <code>datosactividad</code> contiene un string JSON. Dentro de este, el campo <code>ID</code> (si está presente y el ID del usuario del contexto estaba disponible) es un string JSON que representa el ID del usuario encriptado (AES). El resto (<code>emotionalEntries</code>) está en texto plano. Adicionalmente, si el ID del usuario del contexto está disponible, se añade un parámetro <code>userID</code> a la URL con el ID del usuario del contexto encriptado directamente.
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

