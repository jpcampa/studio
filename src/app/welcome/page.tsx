
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo'; // Import Logo

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

export default function WelcomePage() {
  const t = useTranslations();

  useEffect(() => {
    // Marcar como vista la primera vez que se carga
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <Logo className="mb-8" />
      <h1 className="text-6xl md:text-8xl font-bold text-primary mb-12">
        ¡Hola!
      </h1>
      <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-xs text-lg py-4 shadow-lg hover:shadow-primary/40 transition-shadow">
        <Link href="/assessment/intro">
          ¿Comenzamos?
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}

    