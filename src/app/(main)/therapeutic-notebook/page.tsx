
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { getNotebookEntries, formatEntryTimestamp, type NotebookEntry } from "@/data/therapeuticNotebookStore";
import { ArrowLeft, NotebookText, Calendar, ChevronRight, ShieldQuestion, Database, Code } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext"; // Import useUser

const DEBUG_NOTEBOOK_SAVE_URL_KEY = "workwell-debug-notebook-url";
const DEBUG_NOTEBOOK_SAVE_PAYLOAD_KEY = "workwell-debug-notebook-payload";
const DEBUG_NOTEBOOK_FETCH_URL_KEY = "workwell-debug-notebook-fetch-url";

export default function TherapeuticNotebookPage() {
  const t = useTranslations();
  const { user, loading: userLoading } = useUser(); // Get user and loading state
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [debugSaveUrl, setDebugSaveUrl] = useState<string | null>(null);
  const [debugSavePayload, setDebugSavePayload] = useState<string | null>(null);
  const [debugFetchUrl, setDebugFetchUrl] = useState<string | null>(null);

  const updateEntriesAndDebugInfo = () => {
    setEntries(getNotebookEntries());
    const storedSaveUrl = sessionStorage.getItem(DEBUG_NOTEBOOK_SAVE_URL_KEY);
    const storedSavePayload = sessionStorage.getItem(DEBUG_NOTEBOOK_SAVE_PAYLOAD_KEY);
    const storedFetchUrl = sessionStorage.getItem(DEBUG_NOTEBOOK_FETCH_URL_KEY);

    if (storedSaveUrl) setDebugSaveUrl(storedSaveUrl);
    if (storedSavePayload) setDebugSavePayload(storedSavePayload);
    if (storedFetchUrl) setDebugFetchUrl(storedFetchUrl);
  };

  useEffect(() => {
    // Initial load and also re-load when user context changes (e.g., after login)
    if (!userLoading) {
        updateEntriesAndDebugInfo();
    }
    
    // Listen for custom event to update URL and payload when a new entry is added from another component
    const handleUpdate = () => updateEntriesAndDebugInfo();
    window.addEventListener('notebook-url-updated', handleUpdate);
    window.addEventListener('notebook-updated', handleUpdate); // Listen for general updates

    return () => {
      window.removeEventListener('notebook-url-updated', handleUpdate);
      window.removeEventListener('notebook-updated', handleUpdate);
    };
  }, [user, userLoading]); // Add user and userLoading as dependencies

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
            <NotebookText className="mr-3 h-10 w-10 text-primary" />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                    {t.therapeuticNotebookTitle}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t.therapeuticNotebookDescription}
                </p>
            </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToDashboard}
          </Link>
        </Button>
      </div>

      {(debugSaveUrl || debugFetchUrl) && (
        <Card className="shadow-md border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300 flex items-center">
              <ShieldQuestion className="mr-2 h-5 w-5" />
              Datos de API (Depuración)
            </CardTitle>
            <CardDescription className="text-xs">
              Esta es la información de las llamadas al servidor para guardar y cargar las entradas del cuaderno.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {debugSavePayload && (
                <div>
                    <h4 className="text-sm font-semibold flex items-center mb-1">
                      <Database className="mr-2 h-4 w-4" />
                      Contenido Guardado (Desencriptado)
                    </h4>
                    <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                      <code>{debugSavePayload}</code>
                    </pre>
                </div>
             )}
             {debugSaveUrl && (
                <div>
                     <h4 className="text-sm font-semibold flex items-center mb-1">
                        <Code className="mr-2 h-4 w-4" />
                        URL Final de Guardado (Encriptada)
                    </h4>
                    <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                      <code>{debugSaveUrl}</code>
                    </pre>
                </div>
             )}
             {(debugSaveUrl && debugFetchUrl) && <Separator />}
             {debugFetchUrl && (
                <div>
                    <h4 className="text-sm font-semibold flex items-center mb-1">
                        <Code className="mr-2 h-4 w-4" />
                        URL de Carga de Datos (Encriptada)
                    </h4>
                    <pre className="text-xs bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap break-all shadow-inner">
                        <code>{debugFetchUrl}</code>
                    </pre>
                </div>
             )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-accent">{entry.title}</CardTitle>
                <CardDescription className="flex items-center text-xs pt-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatEntryTimestamp(entry.timestamp)}
                  {entry.pathId && (
                     <>
                        <Separator orientation="vertical" className="h-4 mx-2" />
                        <Link href={`/paths/${entry.pathId}`} className="flex items-center text-primary hover:underline">
                            Ver en la ruta <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                     </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: entry.content.replace(/\n/g, '<br />') }}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12 px-6">
            <CardContent>
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Aún no tienes entradas en tu cuaderno. Completa los ejercicios de reflexión en las rutas para empezar.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
