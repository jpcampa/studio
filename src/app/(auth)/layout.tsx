
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary text-primary-foreground p-4 sm:p-6 lg:p-8">
      <div className="absolute top-6 left-6">
        <Logo className="text-primary-foreground" />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
