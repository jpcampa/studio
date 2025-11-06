
"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDailyCheckIn } from '@/hooks/useDailyCheckIn';
import { DailyCheckInPopup } from '@/components/daily-check-in/DailyCheckInPopup';
import { addEmotionalEntry } from '@/data/emotionalEntriesStore';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const { showPopup, question, markAsDone } = useDailyCheckIn();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleSaveDailyAnswer = (answer: { questionId: string, score: number }) => {
    // For now, we will log it. In the future, this could be saved to a specific store.
    console.log("Daily check-in answer saved:", answer);
    
    // We can also add it to the main emotional log as a generic entry.
    addEmotionalEntry({
      situation: `Respuesta a la pregunta diaria: "${question?.text}"`,
      emotion: `puntuacion_${answer.score}`, // Emotion can be mapped from score if needed
    });

    markAsDone();
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col">
          <AppSidebar />
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              {children}
          </main>
          {showPopup && question && (
            <DailyCheckInPopup
              question={question}
              isOpen={showPopup}
              onClose={markAsDone}
              onSave={handleSaveDailyAnswer}
            />
          )}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
