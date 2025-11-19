
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
import { DailyCheckInProvider, useDailyCheckIn } from '@/hooks/use-daily-check-in.tsx';
import { DailyCheckInPopup } from '@/components/daily-check-in/DailyCheckInPopup';
import * as React from 'react';

// Wrapper component to manage the daily check-in popup logic
function DailyCheckInManager({ children }: { children: ReactNode }) {
  const { showPopup, closePopup } = useDailyCheckIn();
  return (
    <>
      {children}
      <DailyCheckInPopup isOpen={showPopup} onClose={closePopup} />
    </>
  );
}

// This is the main client layout component
export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DailyCheckInProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full flex-col">
            <AppSidebar />
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <DailyCheckInManager>{children}</DailyCheckInManager>
            </main>
          </div>
        </SidebarProvider>
      </DailyCheckInProvider>
    </TooltipProvider>
  );
}
