
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Smile, TrendingUp, Target, Lightbulb, Edit, Radar, LineChart as LineChartIcon, NotebookPen, CheckCircle, Info, UserCircle2, Lock, KeyRound, ShieldQuestion, Trash2, Activity, Send, FileText, RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { getRecentEmotionalEntries, addEmotionalEntry, formatEntryTimestamp, type EmotionalEntry, getEmotionalEntries, overwriteEmotionalEntries } from "@/data/emotionalEntriesStore";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { encryptDataAES, decryptDataAES, forceEncryptStringAES } from "@/lib/encryption";
import { useActivePath } from "@/contexts/ActivePathContext";
import type { ActivePathDetails as StoredActivePathDetails} from "@/lib/progressStore";
import { pathsData, type Path as AppPathData } from "@/data/pathsData";
import { fetchUserActivities } from "@/actions/auth";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { getAssessmentHistory, type AssessmentRecord } from "@/data/assessmentHistoryStore";
import { EmotionalProfileChart } from "@/components/dashboard/EmotionalProfileChart";
import type { AssessmentDimension } from '@/data/paths/pathTypes';


const assessmentDimensionsData: AssessmentDimension[] = [
    {
      "id": "dim1",
      "name": "Regulación Emocional y Estrés",
      "definition": "Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.",
      "recommendedPathId": "gestion-estres",
      "items": [
        { "id": "dim1_item1", "text": "Suelo mantener la calma cuando las cosas se complican.", "weight": 1 },
        { "id": "dim1_item2", "text": "Me desbordo fácilmente ante el estrés o la presión.", "weight": 1, "isInverse": true },
        { "id": "dim1_item3", "text": "Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.", "weight": 1 },
        { "id": "dim1_item4", "text": "Me recupero con rapidez después de una situación emocionalmente intensa.", "weight": 1 }
      ]
    },
    {
      "id": "dim2",
      "name": "Flexibilidad Mental y Adaptabilidad",
      "definition": "Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.",
      "recommendedPathId": "tolerar-incertidumbre",
      "items": [
        { "id": "dim2_item1", "text": "Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.", "weight": 1 },
        { "id": "dim2_item2", "text": "Suelo encontrar soluciones creativas cuando algo no sale como esperaba.", "weight": 1 },
        { "id": "dim2_item3", "text": "A menudo cuestiono mis propias creencias o formas de pensar.", "weight": 1 },
        { "id": "dim2_item4", "text": "Me adapto con rapidez cuando las circunstancias cambian.", "weight": 1 }
      ]
    },
    {
      "id": "dim3",
      "name": "Autorregulación personal y constancia",
      "definition": "Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.",
      "recommendedPathId": "superar-procrastinacion",
      "items": [
        { "id": "dim3_item1", "text": "Suelo cumplir mis objetivos, aunque me cuesten.", "weight": 1 },
        { "id": "dim3_item2", "text": "Soy constante con mis compromisos personales y profesionales.", "weight": 1 },
        { "id": "dim3_item3", "text": "Planifico mis días para aprovechar bien el tiempo.", "weight": 1 },
        { "id": "dim3_item4", "text": "Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.", "weight": 1, "isInverse": true }
      ]
    },
    {
      "id": "dim4",
      "name": "Autoafirmación y Expresión Personal",
      "definition": "Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.",
      "recommendedPathId": "poner-limites",
      "items": [
        { "id": "dim4_item1", "text": "Me siento con derecho a expresar lo que necesito, aunque sea incómodo.", "weight": 1 },
        { "id": "dim4_item2", "text": "Soy capaz de defender mi opinión sin imponerla.", "weight": 1 },
        { "id": "dim4_item3", "text": "Me cuesta decir \"no\", incluso cuando lo deseo.", "weight": 1, "isInverse": true },
        { "id": "dim4_item4", "text": "En situaciones difíciles, puedo mantener mi postura con respeto.", "weight": 1 }
      ]
    },
    {
      "id": "dim5",
      "name": "Empatía y Conexión Interpersonal",
      "definition": "Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.",
      "recommendedPathId": "relaciones-autenticas",
      "items": [
        { "id": "dim5_item1", "text": "Me interesa entender cómo se sienten las personas que me rodean.", "weight": 1 },
        { "id": "dim5_item2", "text": "A veces actúo sin considerar el impacto emocional que puede tener en otros.", "weight": 1, "isInverse": true },
        { "id": "dim5_item3", "text": "Suelo conectar fácilmente con las emociones de los demás.", "weight": 1 },
        { "id": "dim5_item4", "text": "Tengo sensibilidad para detectar cuándo alguien necesita apoyo.", "weight": 1 }
      ]
    },
    {
      "id": "dim6",
      "name": "Insight y Autoconciencia",
      "definition": "Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.",
      "recommendedPathId": "comprender-mejor-cada-dia",
      "items": [
        { "id": "dim6_item1", "text": "Reflexiono con frecuencia sobre lo que siento y por qué.", "weight": 1 },
        { "id": "dim6_item2", "text": "Se con claridad quién soy porque conozco mis puntos fuertes y también mis áreas a mejorar.", "weight": 1 },
        { "id": "dim6_item3", "text": "Soy consciente de cómo influyen mis emociones en mis decisiones.", "weight": 1 },
        { "id": "dim6_item4", "text": "Reconozco cuándo repito patrones que no me benefician y trato de cambiarlos.", "weight": 1 }
      ]
    },
    {
      "id": "dim7",
      "name": "Propósito Vital y Dirección Personal",
      "definition": "Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim7_item1", "text": "Tengo claro qué es importante para mí en la vida.", "weight": 1 },
        { "id": "dim7_item2", "text": "Tomo decisiones alineadas con mis prioridades y valores personales.", "weight": 1 },
        { "id": "dim7_item3", "text": "Siento que lo que hago tiene sentido y propósito.", "weight": 1 },
        { "id": "dim7_item4", "text": "Estoy construyendo un camino de vida que me representa.", "weight": 1 }
      ]
    },
    {
      "id": "dim8",
      "name": "Estilo de Afrontamiento",
      "definition": "Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.",
      "recommendedPathId": "resiliencia-en-accion",
      "items": [
        { "id": "dim8_item1", "text": "Cuando tengo un problema, rápidamente busco cómo solucionarlo sin quedarme estancado/a.", "weight": 1 },
        { "id": "dim8_item2", "text": "Trato de sacar un aprendizaje personal incluso en los momentos más difíciles.", "weight": 1 },
        { "id": "dim8_item3", "text": "Frente a la dificultad, trato de mantener la mente abierta y flexible.", "weight": 1 },
        { "id": "dim8_item4", "text": "Me adapto sin perder de vista lo que quiero conseguir.", "weight": 1 }
      ]
    },
    {
      "id": "dim9",
      "name": "Integridad y Coherencia Ética",
      "definition": "Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.",
      "recommendedPathId": "vivir-con-coherencia",
      "items": [
        { "id": "dim9_item1", "text": "Intento actuar con integridad, incluso cuando no es lo mejor o más fácil.", "weight": 1 },
        { "id": "dim9_item2", "text": "Me importa mucho el impacto de mis acciones en otras personas.", "weight": 1 },
        { "id": "dim9_item3", "text": "La honestidad guía mis decisiones, también en lo pequeño.", "weight": 1 },
        { "id": "dim9_item4", "text": "Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.", "weight": 1 }
      ]
    },
    {
      "id": "dim10",
      "name": "Responsabilidad Personal y Aceptación Consciente",
      "definition": "Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.",
      "recommendedPathId": "ni-culpa-ni-queja",
      "items": [
        { "id": "dim10_item1", "text": "Reflexiono y se reconocer cuándo he contribuido a que algo no salga como esperaba.", "weight": 1 },
        { "id": "dim10_item2", "text": "Cuando afronto dificultades, pienso y me pregunto qué puedo hacer diferente.", "weight": 1 },
        { "id": "dim10_item3", "text": "Asumo la responsabilidad de mis actos incluso cuando es incómodo.", "weight": 1 },
        { "id": "dim10_item4", "text": "Soy consciente del papel que tengo en las situaciones que vivo y eso me permite aprender y crecer.", "weight": 1 }
      ]
    },
    {
      "id": "dim11",
      "name": "Apoyo Social Percibido",
      "definition": "Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.",
      "recommendedPathId": "confiar-en-mi-red",
      "items": [
        { "id": "dim11_item1", "text": "Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.", "weight": 1 },
        { "id": "dim11_item2", "text": "En mi entorno laboral, me siento respaldado/a por compañeros y superiores.", "weight": 1 },
        { "id": "dim11_item3", "text": "Me cuesta pedir ayuda, incluso cuando la necesito.", "weight": 1, "isInverse": true },
        { "id": "dim11_item4", "text": "Me siento parte de una red de apoyo y sostén emocional sólida y accesible.", "weight": 1 }
      ]
    },
    {
      "id": "dim12",
      "name": "Estado de Ánimo",
      "definition": "Evaluación del estado de ánimo general y la presencia de síntomas relacionados con el desánimo o la anhedonia en las últimas semanas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim12_item1", "text": "Me siento triste o desanimado/a.", "weight": 1 },
        { "id": "dim12_item2", "text": "Tengo dificultad para disfrutar de las actividades que solían gustarme.", "weight": 1 },
        { "id": "dim12_item3", "text": "Me siento inútil o inferior a los demás.", "weight": 1 },
        { "id": "dim12_item4", "text": "Me siento culpable por cosas que hago o no hago.", "weight": 1 },
        { "id": "dim12_item5", "text": "Me siento agotado/a física o mentalmente.", "weight": 1 },
        { "id": "dim12_item6", "text": "Tengo dificultad para mantener la concentración en tareas.", "weight": 1 },
        { "id": "dim12_item7", "text": "Me falta motivación para realizar actividades cotidianas.", "weight": 1 },
        { "id": "dim12_item8", "text": "Siento que mi vida carece de sentido o dirección.", "weight": 1 },
        { "id": "dim12_item9", "text": "Me aíslo o evito el contacto con otras personas.", "weight": 1 },
        { "id": "dim12_item10", "text": "Siento que nada va a cambiar, aunque me esfuerce.", "weight": 1 },
        { "id": "dim12_item11", "text": "Siento que he perdido interés por cuidar de mí mismo/a (higiene, salud, descanso...).", "weight": 1 },
        { "id": "dim12_item12", "text": "Últimamente me cuesta identificar o expresar lo que siento.", "weight": 1 }
      ]
    },
    {
      "id": "dim13",
      "name": "Ansiedad Estado",
      "definition": "Evaluación del nivel de ansiedad y tensión experimentado en el momento presente o en los últimos días.",
      "recommendedPathId": "regular-ansiedad-paso-a-paso",
      "items": [
        { "id": "dim13_item1", "text": "Me siento tenso/a o nervioso/a actualmente.", "weight": 1 },
        { "id": "dim13_item2", "text": "Me preocupo por cosas que normalmente no me afectan.", "weight": 1 },
        { "id": "dim13_item3", "text": "Siento una inquietud interna difícil de controlar.", "weight": 1 },
        { "id": "dim13_item4", "text": "Me cuesta relajarme incluso en situaciones tranquilas.", "weight": 1 },
        { "id": "dim13_item5", "text": "Reacciono con irritabilidad ante pequeñas molestias.", "weight": 1 },
        { "id": "dim13_item6", "text": "Siento que pierdo el control fácilmente sobre mis emociones.", "weight": 1 }
      ]
    }
  ];

interface ProcessedChartDataPoint {
  date: string;
  moodScore: number;
  emotionLabel: string;
  fullDate: string;
}

interface SingleEmotionalEntryActivity {
  entry: EmotionalEntry;
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

const API_BASE_URL_FOR_ACTIVITY_SAVE = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY_FOR_ACTIVITY_SAVE = "4463";
const API_TIMEOUT_MS_ACTIVITY = 10000;
const NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD = 4;


export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();
  const { activePath: currentActivePath } = useActivePath();

  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<EmotionalEntry[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [allEntriesForChart, setAllEntriesForChart] = useState<EmotionalEntry[]>([]);
  const [isRefreshingEmotions, setIsRefreshingEmotions] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  const [assessmentDimensions, setAssessmentDimensions] = useState<AssessmentDimension[]>([]);


  const generateUserActivityApiUrl = useCallback((newEntryData: EmotionalEntry, userIdForUrlParam?: string | null): string => {
    const activityPayload: SingleEmotionalEntryActivity = { entry: newEntryData };
    const jsonPayloadForDatosActividad = encryptDataAES(activityPayload);
    let url = `${API_BASE_URL_FOR_ACTIVITY_SAVE}?apikey=${API_KEY_FOR_ACTIVITY_SAVE}&tipo=guardaractividad&datosactividad=${encodeURIComponent(jsonPayloadForDatosActividad)}`;
    
    if (userIdForUrlParam && typeof userIdForUrlParam === 'string' && userIdForUrlParam.trim() !== '') {
      try {
        const encryptedDirectUserId = forceEncryptStringAES(userIdForUrlParam);
        url += `&userID=${encodeURIComponent(encryptedDirectUserId)}`;
      } catch (encError) {
         console.error("DashboardPage (generateUserActivityApiUrl): Error encriptando userIdForUrlParam con forceEncryptStringAES:", encError);
      }
    }
    return url;
  }, []);


  useEffect(() => {
    const loadInitialData = () => {
        const loadedRecentEntries = getRecentEmotionalEntries(NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD);
        const loadedAllEntries = getEmotionalEntries(); 
        const assessmentHistory = getAssessmentHistory();
        
        if (assessmentHistory.length > 0) {
            setLatestAssessment(assessmentHistory[0]);
        }

        // Questions are now embedded, no need to fetch.
        setAssessmentDimensions(assessmentDimensionsData);

        setRecentEntries(loadedRecentEntries);
        setAllEntriesForChart(loadedAllEntries);

        if (loadedRecentEntries.length > 0) {
            const lastRegisteredEmotion = emotionOptions.find(e => e.value === loadedRecentEntries[0].emotion);
            if (lastRegisteredEmotion) {
                setLastEmotion(t[lastRegisteredEmotion.labelKey as keyof typeof t] || lastRegisteredEmotion.value);
            }
        }
    };
    loadInitialData();
  }, [t]);


  const chartData = useMemo(() => {
    if (!allEntriesForChart || allEntriesForChart.length === 0) {
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
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        if (moodScoreMapping[entry.emotion] === undefined) {
            console.warn(`MoodEvolutionChart Data Prep: Emotion string "${entry.emotion}" not found in moodScoreMapping. Defaulting to score 0.`);
        }
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
    return processedData;
  }, [allEntriesForChart, t]);


  const handleEmotionalEntrySubmit = async (data: { situation: string; thought: string; emotion: string }) => {
    if (!user || !user.id) {
      toast({
        title: "Error de Usuario",
        description: "No se pudo identificar al usuario. Intenta recargar la página o iniciar sesión de nuevo.",
        variant: "destructive",
      });
      console.warn("DashboardPage (handleEmotionalEntrySubmit): User or user.id not available. Cannot submit entry or send to API.");
      return;
    }
    const userIdFromContext = user.id;

    const newEntry = addEmotionalEntry(data);

    setRecentEntries(prevEntries => [newEntry, ...prevEntries].slice(0, NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD));
    setAllEntriesForChart(prevAllEntries => [newEntry, ...prevAllEntries].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    const lastRegisteredEmotionDetails = emotionOptions.find(e => e.value === newEntry.emotion);
    if (lastRegisteredEmotionDetails) {
        setLastEmotion(t[lastRegisteredEmotionDetails.labelKey as keyof typeof t] || lastRegisteredEmotionDetails.value);
    }

    toast({
      title: t.emotionalEntrySavedTitle,
      description: t.emotionalEntrySavedMessage,
    });
    setIsEntryDialogOpen(false);

    const currentEncryptedActivityApiUrl = generateUserActivityApiUrl(newEntry, userIdFromContext);

    if (currentEncryptedActivityApiUrl) {
      console.log("DashboardPage (handleEmotionalEntrySubmit): Sending NEW emotional entry to API:", currentEncryptedActivityApiUrl.substring(0,150) + "...");
      try {
        const signal = AbortSignal.timeout(API_TIMEOUT_MS_ACTIVITY);
        const response = await fetch(currentEncryptedActivityApiUrl, { signal });
        const responseText = await response.text();
        if (response.ok) {
          let apiResult;
          try {
            apiResult = JSON.parse(responseText);
            if (apiResult.status === "OK") {
              console.log("DashboardPage (handleEmotionalEntrySubmit): New entry saved successfully to API. Response:", apiResult);
              toast({
                title: "Emoción Sincronizada",
                description: "Tu última entrada emocional ha sido guardada en el servidor.",
                className: "bg-green-50 dark:bg-green-900/30 border-green-500",
                duration: 3000,
              });
            } else {
              console.warn("DashboardPage (handleEmotionalEntrySubmit): API reported 'NOOK' for new entry save. Message:", apiResult.message, "Full Response:", apiResult);
              toast({
                title: "Error de Sincronización",
                description: `La API indicó un problema al guardar la emoción: ${apiResult.message || 'Error desconocido.'}`,
                variant: "destructive",
              });
            }
          } catch (jsonError) {
             console.warn("DashboardPage (handleEmotionalEntrySubmit): Failed to parse JSON response from new entry save API. Raw text:", responseText, jsonError);
             toast({
                title: "Respuesta de Sincronización Inválida",
                description: "La API de actividad devolvió una respuesta inesperada.",
                variant: "destructive",
              });
          }
        } else {
          console.warn("DashboardPage (handleEmotionalEntrySubmit): Failed to save new entry to API. Status:", response.status, "Response Text:", responseText);
          toast({
            title: "Error al Guardar Emoción",
            description: `No se pudo guardar la emoción en el servidor (HTTP ${response.status}).`,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        let errorMessage = "Error de red al guardar la emoción. Verifica la consola del navegador para más detalles.";
        let errorType = "NetworkError";

        if (error.name === 'AbortError' || (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
            errorMessage = "Tiempo de espera agotado al guardar la emoción en el servidor.";
            errorType = "TimeoutError";
        } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
            errorMessage = "Fallo al contactar el servidor (Failed to fetch). Posible problema de CORS o red. Revisa la consola del navegador.";
            errorType = "FetchSetupOrCORSError";
        }

        console.error(`DashboardPage (handleEmotionalEntrySubmit): Error during API call to save new entry. Type: ${errorType}`);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.stack) {
          console.error("Error Stack:", error.stack);
        }
        console.error("Full Error Object:", error);
        console.error("URL attempted:", currentEncryptedActivityApiUrl);

        toast({
          title: "Error de Conexión con API",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.warn("DashboardPage (handleEmotionalEntrySubmit): No API URL generated for saving new entry. Skipping fetch.");
    }
  };

  const handleRefreshEmotions = async () => {
    if (!user || !user.id) {
      toast({
        title: "Error de Usuario",
        description: "No se puede refrescar sin un usuario identificado.",
        variant: "destructive",
      });
      return;
    }
    setIsRefreshingEmotions(true);
    console.log("DashboardPage (handleRefreshEmotions): Fetching activities for user:", user.id);
    const result = await fetchUserActivities(user.id);
    if (result.success && result.entries) {
      console.log("DashboardPage (handleRefreshEmotions): Successfully fetched activities. Entries count:", result.entries.length);
      overwriteEmotionalEntries(result.entries);
      const newRecent = getRecentEmotionalEntries(NUM_RECENT_ENTRIES_TO_SHOW_ON_DASHBOARD);
      const newAll = getEmotionalEntries();
      console.log("DashboardPage (handleRefreshEmotions): Entries from localStorage after overwrite (newAll first 5):", JSON.stringify(newAll.slice(0,5)));
      setRecentEntries(newRecent);
      setAllEntriesForChart(newAll);
      if (newRecent.length > 0) {
        const lastRegEmotion = emotionOptions.find(e => e.value === newRecent[0].emotion);
        setLastEmotion(lastRegEmotion ? (t[lastRegEmotion.labelKey as keyof typeof t] || lastRegEmotion.value) : null);
      } else {
        setLastEmotion(null);
      }
      toast({
        title: "Emociones Actualizadas",
        description: "Se han cargado tus últimos registros emocionales.",
      });
    } else {
      console.warn("DashboardPage (handleRefreshEmotions): Failed to fetch activities. Error:", result.error);
      toast({
        title: "Error al Refrescar",
        description: result.error || "No se pudieron obtener las emociones.",
        variant: "destructive",
      });
    }
    setIsRefreshingEmotions(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-10">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {t.welcome}, {user?.name || "Usuarie"}!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">{t.dashboardGreeting}</p>
      </div>

      <section aria-labelledby="quick-summary-heading">
        <h2 id="quick-summary-heading" className="sr-only">{t.quickSummary}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title={t.currentWellbeing}
            value={lastEmotion ? lastEmotion : t.wellbeingPlaceholder}
            description={t.wellbeingDescription}
            icon={lastEmotion ? CheckCircle : Smile}
            cardColorClass={lastEmotion ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700" : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700" }
            iconColorClass={lastEmotion ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}
          />
          <DashboardSummaryCard
            title={t.progressSinceLast}
            value={t.progressPlaceholder}
            description={t.progressDescription}
            icon={TrendingUp}
            cardColorClass="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            iconColorClass="text-blue-600 dark:text-blue-400"
          />
          <DashboardSummaryCard
            title={t.inFocus}
            value={t.inFocusPlaceholder}
            description={t.inFocusDescription}
            icon={Target}
            cardColorClass="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            iconColorClass="text-purple-600 dark:text-purple-400"
          />
          <DashboardSummaryCard
            title={t.nextStep}
            value={t.nextStepPlaceholder}
            description={t.nextStepDescription}
            icon={Lightbulb}
            cardColorClass="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            iconColorClass="text-yellow-600 dark:text-yellow-500"
          />
        </div>
      </section>

      <>
          <section aria-labelledby="emotional-registry-heading" className="py-6">
            <h2 id="emotional-registry-heading" className="sr-only">{t.emotionalRegistry}</h2>
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Edit className="mr-3 h-6 w-6" />
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

          <section aria-labelledby="recent-entries-heading">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-accent flex items-center">
                      <NotebookPen className="mr-3 h-6 w-6" />
                      {t.recentEmotionalEntriesTitle}
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRefreshEmotions}
                          disabled={!user || !user.id || isRefreshingEmotions}
                          aria-label="Refrescar emociones"
                        >
                          {isRefreshingEmotions ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refrescar lista de emociones</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                    <Button variant="link" asChild>
                        <Link href="/emotional-log">
                            {t.viewAllEntriesButton || "Ver todos los registros"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
               )}
            </Card>
          </section>
        </>

      <section aria-labelledby="visualizations-heading">
        <h2 id="visualizations-heading" className="sr-only">Visualizaciones de Progreso</h2>
        <div className="grid gap-8 lg:grid-cols-2">
            {latestAssessment ? (
                <EmotionalProfileChart 
                    results={latestAssessment.data}
                    assessmentDimensions={assessmentDimensions}
                    className="lg:h-[450px]"
                />
            ) : (
                <ChartPlaceholder
                    title={t.myEmotionalProfile}
                    description={t.myEmotionalProfileDescription}
                    icon={Radar}
                    className="lg:h-[450px]"
                />
            )}
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

    