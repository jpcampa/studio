
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8 dark:from-background dark:via-blue-950/30 dark:to-purple-950/30">
       <div className="absolute top-6 left-6">
        <Logo />
      </div>
      {children}
    </div>
  );
}
    
