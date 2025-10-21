
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

type WelcomeStep = 'hola' | 'pregunta';

export default function WelcomePage() {
  const t = useTranslations();
  const [step, setStep] = useState<WelcomeStep>('hola');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    }

    const fadeInTimer = setTimeout(() => setVisible(true), 100);

    const transitionTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setStep('pregunta'), 500); // Change step after fade out
    }, 4100); // Shortened to 4 seconds for a quicker pace

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  useEffect(() => {
    if (step === 'pregunta') {
      const fadeInTimer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(fadeInTimer);
    }
  }, [step]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-4 w-full min-h-screen transition-colors duration-500 ease-in-out",
        step === 'pregunta' ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'
      )}
    >
      <div className="relative flex-grow flex flex-col items-center justify-center w-full">
        {step === 'hola' && (
          <h1
            className={cn(
              "text-8xl md:text-9xl font-bold transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            ¡Hola!
          </h1>
        )}

        {step === 'pregunta' && (
          <div
            className={cn(
              "flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            <Logo className="mb-12 text-primary-foreground" />
            <h1 className="text-6xl md:text-8xl font-bold mb-12">
              ¿Cómo estás hoy?
            </h1>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto sm:max-w-xs text-lg py-4 shadow-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-shadow"
            >
              <Link href="/assessment/intro">
                ¿Comenzamos?
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
