
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from 'lucide-react';
import type { DailyQuestion } from '@/types/daily-question';
import { likertOptions } from '@/data/assessmentDimensions';
import { cn } from '@/lib/utils';

interface DailyCheckInPopupProps {
  question: DailyQuestion;
  isOpen: boolean;
  onClose: () => void;
  onSave: (answer: { questionId: string, score: number }) => void;
}

const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon, Annoyed: AnnoyedIcon, Meh: MehIcon, Smile: SmileIcon, Laugh: LaughIcon,
};

export function DailyCheckInPopup({ question, isOpen, onClose, onSave }: DailyCheckInPopupProps) {
  const { toast } = useToast();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!selectedValue) {
      toast({
        title: "Respuesta requerida",
        description: "Por favor, selecciona una opción.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      onSave({ questionId: question.id, score: parseInt(selectedValue) });
      toast({ title: "Respuesta Guardada", description: "Gracias por tu registro diario." });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pregunta del Día</DialogTitle>
          <DialogDescription className="pt-2">{question.text}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <RadioGroup value={selectedValue || ""} onValueChange={setSelectedValue} className="flex flex-wrap justify-center items-center gap-2 pt-2">
                {likertOptions.map(option => {
                    const IconComponent = iconMap[option.label];
                    return (
                        <Label key={option.value} htmlFor={`daily-${option.value}`} className={cn("flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out", "hover:border-primary hover:shadow-md", "w-14 h-14", selectedValue === option.value.toString() ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105" : "bg-background border-input")} title={option.description}>
                            <RadioGroupItem value={option.value.toString()} id={`daily-${option.value}`} className="sr-only" />
                            {IconComponent ? <IconComponent className="h-7 h-7 text-foreground/80" /> : option.label}
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
