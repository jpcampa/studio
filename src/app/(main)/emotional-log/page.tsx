
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import { emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { getEmotionalEntries, formatEntryTimestamp, type EmotionalEntry } from "@/data/emotionalEntriesStore";
import { ArrowLeft, NotebookPen, LineChart as LineChartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"; 

const moodScoreMapping: Record<string, number> = {
  alegria: 5, confianza: 5, sorpresa: 4, anticipacion: 4,
  enfado: 2, miedo: 2, tristeza: 1, asco: 1,
};

export default function EmotionalLogPage() {
  const t = useTranslations();
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);

  useEffect(() => {
    setAllEntries(getEmotionalEntries());
  }, []);

  const chartData = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return [];
    return allEntries
      .map(entry => ({ ...entry, timestampDate: new Date(entry.timestamp) }))
      .sort((a, b) => a.timestampDate.getTime() - b.timestampDate.getTime()) 
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        if (moodScoreMapping[entry.emotion] === undefined) {
            console.warn(`EmotionalLogPage Data Prep: Emotion string "${entry.emotion}" not found in moodScoreMapping. Defaulting to score 0.`);
        }
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      });
  }, [allEntries, t]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
            <LineChartIcon className="mr-3 h-8 w-8" />
            {t.fullEmotionalHistoryTitle}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToDashboard}
          </Link>
        </Button>
      </div>

      <MoodEvolutionChart
        data={chartData}
        title={t.myEvolution} 
        description={t.myEvolutionFullHistoryDescription}
        className="lg:h-[450px]"
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-accent flex items-center">
            <NotebookPen className="mr-3 h-6 w-6" />
            {t.allEmotionalEntriesTitle}
          </CardTitle>
          <CardDescription>
            {t.allEmotionalEntriesDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allEntries.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4"> 
              <ul className="space-y-4">
                {allEntries.map((entry, index) => {
                  const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                  const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                  return (
                    <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
                      <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                      <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words"> 
                        {entry.situation}
                      </p>
                      {index < allEntries.length - 1 && <Separator className="my-4" />}
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground italic text-center py-4">{t.noEntriesYet}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
