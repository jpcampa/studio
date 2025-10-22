
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

type WelcomeStep = 'hola' | 'pregunta' | 'opciones';

export default function WelcomePage() {
  const t = useTranslations();
  const [step, setStep] = useState<WelcomeStep>('hola');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    }

    const fadeInTimer = setTimeout(() => setVisible(true), 100);

    if (step === 'hola') {
        const transitionTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setStep('pregunta'), 500); // Change step after fade out
        }, 4100); // Duration of 'hola' screen

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(transitionTimer);
        };
    }
  }, []);

  useEffect(() => {
    if (step === 'pregunta' || step === 'opciones') {
      const fadeInTimer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(fadeInTimer);
    }
  }, [step]);
  
  const handleShowOptions = () => {
      setVisible(false);
      setTimeout(() => setStep('opciones'), 500);
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-4 w-full min-h-screen transition-colors duration-500 ease-in-out",
        (step === 'pregunta' || step === 'opciones') ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'
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
              onClick={handleShowOptions}
              size="lg"
              className="w-full sm:w-auto sm:max-w-xs text-lg py-4 shadow-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-shadow"
            >
              ¡Cuentame!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 'opciones' && (
            <div
                className={cn(
                "flex flex-col items-center justify-center space-y-8 transition-opacity duration-500 ease-in-out",
                visible ? "opacity-100" : "opacity-0"
                )}
            >
                <Link href="/assessment/intro" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Comenzar autoevaluación
                </Link>
                <Link href="/dashboard" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Mi Panel
                </Link>
                <Link href="/paths" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Rutas
                </Link>
                 <Link href="/resources" className="text-4xl md:text-5xl font-bold hover:opacity-80 transition-opacity">
                    Recursos
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
