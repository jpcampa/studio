
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
import type { AssessmentDimension } from '@/data/assessmentDimensions';
import { getAssessmentDimensions } from '@/data/assessmentDimensions';

function DailyCheckInManager({ children }: { children: ReactNode }) {
  const { showPopup, closePopup } = useDailyCheckIn();
  return (
    <>
      {children}
      <DailyCheckInPopup isOpen={showPopup} onClose={closePopup} />
    </>
  );
}

// Este es el layout principal que ahora es un Server Component por defecto
export default async function MainAppLayout({ children }: { children: ReactNode }) {
  let assessmentDimensions: AssessmentDimension[] = [];
  try {
    // Cargamos las dimensiones en el servidor
    assessmentDimensions = await getAssessmentDimensions();
  } catch (error) {
    console.error("Failed to load assessment dimensions in MainAppLayout:", error);
    // Podemos decidir si mostrar un error o continuar sin los datos
  }

  return (
    <MainAppLayoutClient assessmentDimensions={assessmentDimensions}>
      {children}
    </MainAppLayoutClient>
  );
}


// Creamos un componente cliente para manejar la lógica de hooks
function MainAppLayoutClient({ children, assessmentDimensions }: { children: ReactNode, assessmentDimensions: AssessmentDimension[] }) {
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

  // Clonamos el children y le pasamos las props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { assessmentDimensions });
    }
    return child;
  });

  return (
    <TooltipProvider>
      <DailyCheckInProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full flex-col">
            <AppSidebar />
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <DailyCheckInManager>{childrenWithProps}</DailyCheckInManager>
            </main>
          </div>
        </SidebarProvider>
      </DailyCheckInProvider>
    </TooltipProvider>
  );
}
