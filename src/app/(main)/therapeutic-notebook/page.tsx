
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { getNotebookEntries, formatEntryTimestamp, type NotebookEntry } from "@/data/therapeuticNotebookStore";
import { ArrowLeft, NotebookText, Calendar, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";

export default function TherapeuticNotebookPage() {
  const t = useTranslations();
  const { user, loading: userLoading } = useUser();
  const [entries, setEntries] = useState<NotebookEntry[]>([]);

  // This function will be called to refresh the state from localStorage
  const updateEntriesAndDebugInfo = () => {
    setEntries(getNotebookEntries());
  };

  useEffect(() => {
    // Initial load when the component mounts
    updateEntriesAndDebugInfo();

    // Set up an event listener for when the notebook is updated elsewhere
    window.addEventListener('notebook-updated', updateEntriesAndDebugInfo);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('notebook-updated', updateEntriesAndDebugInfo);
    };
  }, []); // The empty dependency array ensures this runs only once on mount and unmount

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
                <p className="text-sm text-foreground/90 whitespace-pre-line">{entry.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12 px-6">
            <CardContent>
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">{t.noNotebookEntries}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
