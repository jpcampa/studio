
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAssessmentTimestamp, type AssessmentRecord } from '@/data/assessmentHistoryStore';
import { History, Eye, ListChecks, ArrowRight, Loader2, AlertTriangle, RefreshCw, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { forceEncryptStringAES, decryptDataAES } from '@/lib/encryption';
import { z } from 'zod';
import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Alert, AlertDescription } from '@/components/ui/alert';

// API constants
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 20000;

// Zod schema for validating the structure of a single assessment record from the API
const ApiSingleAssessmentRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
  data: z.object({
    emotionalProfile: z.union([
      z.record(z.string(), z.number().min(1).max(5)), // Original object format
      z.array(z.object({ // New array format (assuming array of objects like {dimensionName: string, score: number})
        dimensionName: z.string(),
        score: z.number().min(1).max(5)
      }))
    ]).transform((profile, ctx) => {
      if (Array.isArray(profile)) {
        // console.log("MyAssessmentsPage: Transforming emotionalProfile from array of objects:", JSON.stringify(profile).substring(0, 200));
        const newRecord: Record<string, number> = {};
        let conversionOk = true;
        for (const item of profile as { dimensionName: string, score: number }[]) {
          if (typeof item.dimensionName === 'string' && typeof item.score === 'number') {
             newRecord[item.dimensionName] = item.score;
          } else {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid item structure in emotionalProfile array during transformation: ${JSON.stringify(item)}. Expected {dimensionName: string, score: number}.`,
            });
            conversionOk = false;
            break;
          }
        }
        if (!conversionOk) return z.NEVER; 
        return newRecord;
      }
      return profile;
    }),
    priorityAreas: z.array(z.string()).min(3).max(3),
    feedback: z.string().min(1),
  }),
});

const ApiFetchedAssessmentsSchema = z.array(ApiSingleAssessmentRecordSchema);

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: any; 
}

export default function MyAssessmentsPage() {
  const t = useTranslations();
  const { user, loading: userLoading } = useUser();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugApiUrl, setDebugApiUrl] = useState<string | null>(null); // State for debug URL

  const fetchAssessments = async () => {
    if (!user || !user.id) {
      setError(t.errorOccurred + " (Usuario no autenticado o ID de usuario no disponible para la API)");
      setIsLoading(false);
      setDebugApiUrl("Error: Usuario no autenticado o ID no disponible.");
      console.warn("MyAssessmentsPage: Fetch aborted. User or user.id is not available.", "User:", user);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssessments([]); 
    setDebugApiUrl(null);

    const currentUserId = user.id;
    console.log("MyAssessmentsPage: Preparing to fetch assessments for user.id:", currentUserId);

    let constructedApiUrl = "";
    try {
      const encryptedUserId = forceEncryptStringAES(currentUserId);
      console.log("MyAssessmentsPage: Encrypted user ID (for API request):", encryptedUserId.substring(0, 50) + "...");
      
      constructedApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getEvaluacion&usuario=${encodeURIComponent(encryptedUserId)}`;
      setDebugApiUrl(constructedApiUrl); // Set the URL for display
      console.log("MyAssessmentsPage: Fetching assessments from URL (first 150 chars):", constructedApiUrl.substring(0,150) + "...");

      const signal = AbortSignal.timeout(API_TIMEOUT_MS);
      const response = await fetch(constructedApiUrl, { signal });
      let responseText = await response.text();
      
      console.log("MyAssessmentsPage: Raw API Response Text (first 500 chars before any parsing):", responseText.substring(0,500) + (responseText.length > 500 ? "..." : ""));

      let jsonToParse = responseText;
      const varDumpRegex = /^string\(\d+\)\s*"(.*)"\s*$/s;
      const match = responseText.match(varDumpRegex);

      if (match && match[1]) {
        console.log("MyAssessmentsPage: Detected var_dump-like output. Attempting to extract JSON content.");
        jsonToParse = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        console.log("MyAssessmentsPage: Extracted potential JSON string for parsing (first 500 chars):", jsonToParse.substring(0,500) + (jsonToParse.length > 500 ? "..." : ""));
      }


      if (!response.ok) {
        console.error(`MyAssessmentsPage: API Error HTTP ${response.status}. StatusText: ${response.statusText}. ResponseBody (potentially stripped, first 300 chars): ${jsonToParse.substring(0,300)}`);
        throw new Error(`${t.errorOccurred} (HTTP ${response.status}): ${response.statusText || jsonToParse.substring(0,100) || 'Error del servidor'}`);
      }
      
      let apiResult: ExternalApiResponse;
      try {
        apiResult = JSON.parse(jsonToParse);
      } catch (jsonError: any) {
        let devErrorMessage = "MyAssessmentsPage: Failed to parse JSON response from API.";
        if (typeof responseText === 'string' && responseText.trim().toLowerCase().startsWith('string(') && !match) {
            devErrorMessage += " The response looks like PHP var_dump() output, but regex extraction or subsequent parsing failed.";
        } else if (match && jsonToParse !== responseText) { 
             devErrorMessage = "MyAssessmentsPage: Failed to parse extracted JSON from var_dump-like output.";
        }
        console.error(devErrorMessage, "Raw text was (first 500 chars):", responseText.substring(0,500), "Error:", jsonError);
        setError(t.errorOccurred + " (Respuesta del servidor no es JSON válido. Revisa la consola del navegador para ver la respuesta cruda del servidor.)");
        setIsLoading(false);
        return;
      }
      
      console.log("MyAssessmentsPage: API call status OK. Parsed API Result (from jsonToParse, first 500 chars of stringified):", JSON.stringify(apiResult).substring(0,500) + "...");


      if (apiResult.status === "OK") {
        let potentialAssessmentsArray: any = null;

        if (Array.isArray(apiResult.data)) {
          console.log("MyAssessmentsPage: Data from API is already an array.");
          potentialAssessmentsArray = apiResult.data;
        } else if (typeof apiResult.data === 'string' && apiResult.data.trim() !== '') {
          console.log("MyAssessmentsPage: Data from API is a string, attempting decryption...");
          const decryptedData = decryptDataAES(apiResult.data);
          console.log("MyAssessmentsPage: Decrypted data (type " + typeof decryptedData + ", first 500 chars of stringified):", JSON.stringify(decryptedData).substring(0,500) + "...");
          if (decryptedData && Array.isArray(decryptedData)) {
            console.log("MyAssessmentsPage: Successfully decrypted API data into an array.");
            potentialAssessmentsArray = decryptedData;
          } else {
            console.warn(
                "MyAssessmentsPage: Decrypted API data is NOT an array or decryption was not successful. Type of decryptedData:", 
                typeof decryptedData, 
                ". Value (first 200 chars):", JSON.stringify(decryptedData).substring(0,200),
                ". This will likely cause a validation error next."
            );
            potentialAssessmentsArray = decryptedData; 
          }
        } else if (apiResult.data === null || (typeof apiResult.data === 'string' && (apiResult.data.trim() === '' || apiResult.data.trim() === "[]" || apiResult.data.toLowerCase().includes("no hay evaluaciones")))) {
            console.log("MyAssessmentsPage: API reported 'OK' but data is null, empty, or indicates no assessments. Treating as empty list.");
            potentialAssessmentsArray = [];
        }

        if (potentialAssessmentsArray !== null && potentialAssessmentsArray !== undefined) { 
          console.log("MyAssessmentsPage: Data before Zod validation (potentialAssessmentsArray, first 1000 chars):", JSON.stringify(potentialAssessmentsArray).substring(0,1000) + "...");
          const validationResult = ApiFetchedAssessmentsSchema.safeParse(potentialAssessmentsArray);
          if (validationResult.success) {
            const sortedAssessments = validationResult.data.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setAssessments(sortedAssessments);
            console.log("MyAssessmentsPage: Successfully fetched, processed, and validated assessments:", sortedAssessments.length, "records.");
            if (sortedAssessments.length === 0) { 
                setError(null); 
            }
          } else {
            const flatErrors = validationResult.error.flatten();
            console.error(
              "MyAssessmentsPage: Zod validation failed.",
              "Flattened errors:", flatErrors,
              "Full Zod error object:", validationResult.error,
              "Zod error issues (stringified):", JSON.stringify(validationResult.error.issues, null, 2)
            );
            console.error("MyAssessmentsPage: Data that FAILED Zod validation (potentialAssessmentsArray, first 1000 chars):", JSON.stringify(potentialAssessmentsArray).substring(0,1000) + "...");
            
            let userErrorMessage = t.errorOccurred + " (Datos de evaluación recibidos no son válidos o tienen un formato incorrecto)";
            if (validationResult.error.issues.length > 0) {
                const firstIssue = validationResult.error.issues[0];
                userErrorMessage += `. Detalle: ${firstIssue.message} en la ruta '${firstIssue.path.join('.')}'`;
            }
            setError(userErrorMessage);
          }
        } else { 
          console.warn("MyAssessmentsPage: No valid array of assessments obtained after processing API data. Original apiResult.data type:", typeof apiResult.data, "apiResult.data:", apiResult.data);
           setError(t.errorOccurred + " (No se pudieron procesar los datos de evaluaciones. Formato inesperado o fallo en desencriptación.)");
        }

      } else { 
        console.warn("MyAssessmentsPage: API reported 'NOOK'. Message:", apiResult.message);
        if (apiResult.message && apiResult.message.toLowerCase().includes("no hay evaluaciones")) {
            setAssessments([]); 
            setError(null); 
        } else {
            setError(`${t.errorOccurred}: ${apiResult.message || 'Error desconocido del servidor'}`);
        }
      }
    } catch (e: any) {
      console.error("MyAssessmentsPage: Error fetching or processing assessments:", e);
      let errorMessage = t.errorOccurred;
      if (e.name === 'AbortError' || (e.cause && e.cause.code === 'UND_ERR_CONNECT_TIMEOUT')) {
        errorMessage = t.errorOccurred + " (Tiempo de espera agotado)";
      } else if (e instanceof SyntaxError) { 
        errorMessage = t.errorOccurred + " (Respuesta del servidor no es JSON válido incluso después de intentar procesarla. Revisa la consola.)";
      } else if (e.message) {
        errorMessage = e.message; 
      }
      setError(errorMessage);
      setDebugApiUrl(constructedApiUrl || "Error: No se pudo construir la URL de la API antes del fallo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user && user.id) { 
      fetchAssessments();
    } else if (!userLoading && (!user || !user.id)) {
      setIsLoading(false);
      setError(t.errorOccurred + " (Debes iniciar sesión y tener un ID de usuario para ver tus evaluaciones)");
      setDebugApiUrl("Error: Usuario no cargado o ID no disponible.");
      console.warn("MyAssessmentsPage: User not loaded or user.id missing. User:", user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]); 

  if (isLoading || userLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 text-center sm:text-left">
        <div>
          <History className="mx-auto sm:mx-0 h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-3">{t.myAssessmentsTitle}</h1>
          <p className="text-lg text-muted-foreground">{t.myAssessmentsDescription}</p>
        </div>
        <Button onClick={fetchAssessments} variant="outline" disabled={isLoading || !user || !user.id}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

      {debugApiUrl && (
        <Card className="mb-8 shadow-md border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300 flex items-center">
              <ShieldQuestion className="mr-2 h-5 w-5" />
              URL de API Construida (Depuración)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Esta es la URL que se intentó (o se intentará) usar para obtener el historial de evaluaciones. El parámetro 'usuario' está encriptado.
            </p>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
              <code>{debugApiUrl}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {assessments.length === 0 && !isLoading && !error && (
        <Card className="max-w-lg mx-auto text-center shadow-lg">
          <CardHeader>
            <CardTitle>{t.noAssessmentsFound}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Parece que aún no has completado ninguna evaluación o no se pudieron cargar. Intenta refrescar o realiza una nueva.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/assessment/intro">
                {t.takeInitialAssessment} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {assessments.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                        {formatAssessmentTimestamp(assessment.timestamp)}
                    </Badge>
                    <History className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-accent">{t.assessmentDateLabel.replace("{date}", formatAssessmentTimestamp(assessment.timestamp).split(',')[0])}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {assessment.data.priorityAreas && assessment.data.priorityAreas.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-primary/80" />
                        Áreas Prioritarias Identificadas:
                    </p>
                    <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm">
                      {assessment.data.priorityAreas.slice(0, 2).map((area, index) => (
                        <li key={index} className="truncate" title={area}>{area.split('(')[0].trim()}</li>
                      ))}
                      {assessment.data.priorityAreas.length > 2 && (
                        <li className="text-xs text-muted-foreground italic">...y {assessment.data.priorityAreas.length - 2} más.</li>
                      )}
                    </ul>
                  </>
                )}
                {(!assessment.data.priorityAreas || assessment.data.priorityAreas.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No se identificaron áreas prioritarias específicas en esta evaluación.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link href={`/assessment/history-results/${assessment.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t.viewAssessmentResultsButton}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

