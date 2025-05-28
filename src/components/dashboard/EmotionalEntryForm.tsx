
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface EmotionalEntryFormProps {
  onSubmit: (data: { situation: string; emotion: string }) => void;
}

// Moved emotions here to be exportable and usable by dashboard page
export const emotions = [
  { value: "alegria", labelKey: "emotionJoy" },
  { value: "tristeza", labelKey: "emotionSadness" },
  { value: "enfado", labelKey: "emotionAnger" },
  { value: "miedo", labelKey: "emotionFear" },
  { value: "sorpresa", labelKey: "emotionSurprise" },
  { value: "anticipacion", labelKey: "emotionAnticipation" },
  { value: "confianza", labelKey: "emotionTrust" },
  { value: "asco", labelKey: "emotionDisgust" },
];

export function EmotionalEntryForm({ onSubmit }: EmotionalEntryFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [situation, setSituation] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !selectedEmotion) {
      toast({
        title: t.errorOccurred,
        description: t.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    onSubmit({ situation, emotion: selectedEmotion });
    // Reset form fields after successful submission
    setSituation("");
    setSelectedEmotion("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="situation" className="text-base">
          {t.situationLabel}
        </Label>
        <Textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={t.situationPlaceholder}
          rows={4}
          className="text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="emotion" className="text-base">
          {t.emotionLabel}
        </Label>
        <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
          <SelectTrigger id="emotion" className="w-full text-sm">
            <SelectValue placeholder={t.emotionPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {emotions.map((emo) => (
              <SelectItem key={emo.value} value={emo.value} className="text-sm">
                {t[emo.labelKey as keyof typeof t] || emo.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full mt-2">
        {t.saveEntryButton}
      </Button>
    </form>
  );
}

    