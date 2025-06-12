
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAssessmentTimestamp, type AssessmentRecord } from '@/data/assessmentHistoryStore';
import { History, Eye, ListChecks, ArrowRight, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
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
    emotionalProfile: z.record(z.string(), z.number().min(1).max(5)),
    priorityAreas: z.array(z.string()).min(3).max(3),
    feedback: z.string().min(1),
  }),
});

// Zod schema for validating the array of assessment records
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

  const fetchAssessments = async () => {
    if (!user || !user.id) {
      setError(t.errorOccurred + " (Usuario no autenticado)");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssessments([]);

    try {
      const encryptedUserId = forceEncryptStringAES(user.id);
      const apiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getEvaluacion&usuario=${encodeURIComponent(encryptedUserId)}`;
      
      console.log("MyAssessmentsPage: Fetching assessments from URL:", apiUrl.substring(0,150) + "...");

      const signal = AbortSignal.timeout(API_TIMEOUT_MS);
      const response = await fetch(apiUrl, { signal });
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`MyAssessmentsPage: API Error HTTP ${response.status}. StatusText: ${response.statusText}. ResponseBody: ${responseText}`);
        throw new Error(`${t.errorOccurred} (HTTP ${response.status}): ${response.statusText || responseText.substring(0,100) || 'Error del servidor'}`);
      }

      const apiResult: ExternalApiResponse = JSON.parse(responseText);
      console.log("MyAssessmentsPage: API call status OK. Raw API Result:", JSON.stringify(apiResult).substring(0,500) + "...");


      if (apiResult.status === "OK") {
        let potentialAssessmentsArray: any = null;

        if (Array.isArray(apiResult.data)) {
          console.log("MyAssessmentsPage: Data from API is already an array.");
          potentialAssessmentsArray = apiResult.data;
        } else if (typeof apiResult.data === 'string' && apiResult.data.trim() !== '') {
          console.log("MyAssessmentsPage: Data from API is a string, attempting decryption...");
          const decryptedData = decryptDataAES(apiResult.data);
          console.log("MyAssessmentsPage: Decrypted data (type " + typeof decryptedData + "):", JSON.stringify(decryptedData).substring(0,500) + "...");
          if (decryptedData && Array.isArray(decryptedData)) {
            console.log("MyAssessmentsPage: Successfully decrypted API data into an array.");
            potentialAssessmentsArray = decryptedData;
          } else if (decryptedData === null && apiResult.data.toLowerCase().includes("no hay evaluaciones")) {
            console.log("MyAssessmentsPage: API data decrypted to null, original string indicated no evaluations.");
            potentialAssessmentsArray = [];
          } else {
            console.warn("MyAssessmentsPage: Decrypted API data is not an array or decryption failed. Decrypted data:", decryptedData);
          }
        } else if (apiResult.data === null || (typeof apiResult.data === 'string' && (apiResult.data.trim() === '' || apiResult.data.trim() === "[]" || apiResult.data.toLowerCase().includes("no hay evaluaciones")))) {
            console.log("MyAssessmentsPage: API reported 'OK' but data is null, empty, or indicates no assessments. Treating as empty list.");
            potentialAssessmentsArray = [];
        }

        if (potentialAssessmentsArray && Array.isArray(potentialAssessmentsArray)) {
          const validationResult = ApiFetchedAssessmentsSchema.safeParse(potentialAssessmentsArray);
          if (validationResult.success) {
            const sortedAssessments = validationResult.data.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setAssessments(sortedAssessments);
            console.log("MyAssessmentsPage: Successfully fetched, processed, and validated assessments:", sortedAssessments.length, "records.");
            if (sortedAssessments.length === 0) {
                setError(null); // Clear previous errors if we get an empty list back successfully
            }
          } else {
            console.error("MyAssessmentsPage: Validation failed for processed assessment data:", validationResult.error.flatten());
            setError(t.errorOccurred + " (Datos de evaluación recibidos no son válidos)");
          }
        } else {
          // This case means data was not an array, not a decryptable string to array, or was explicitly empty/null.
          // If it was meant to be "no evaluations", it should have become an empty array above.
          // So, if we reach here and potentialAssessmentsArray is still not an array, it's an unexpected format.
          console.warn("MyAssessmentsPage: No valid array of assessments obtained after processing API data. Original apiResult.data type:", typeof apiResult.data, "apiResult.data:", apiResult.data);
          if(apiResult.data && typeof apiResult.data === 'string' && (apiResult.data.trim() === '' || apiResult.data.toLowerCase().includes("no hay evaluaciones"))){
            setAssessments([]); // Explicitly set to empty if string indicates no evaluations
            console.log("MyAssessmentsPage: Original data string was empty or indicated no evaluations. Setting assessments to [].");
          } else {
            setError(t.errorOccurred + " (No se pudieron procesar los datos de evaluaciones. Formato inesperado.)");
          }
        }

      } else { // apiResult.status === "NOOK"
        console.warn("MyAssessmentsPage: API reported 'NOOK'. Message:", apiResult.message);
        if (apiResult.message && apiResult.message.toLowerCase().includes("no hay evaluaciones")) {
            setAssessments([]); 
            setError(null); // Clear previous error if API correctly reports no evaluations
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
        errorMessage = t.errorOccurred + " (Respuesta del servidor no válida)";
      } else if (e.message) {
        errorMessage = e.message; // Already includes (HTTP XXX) if thrown above
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchAssessments();
    } else if (!userLoading && !user) {
      setIsLoading(false);
      setError(t.errorOccurred + " (Debes iniciar sesión para ver tus evaluaciones)");
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
        <Button onClick={fetchAssessments} variant="outline" disabled={isLoading} className="mt-4 sm:mt-0">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

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

