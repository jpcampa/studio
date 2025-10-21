
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo'; // Import Logo
import { cn } from '@/lib/utils';

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

type WelcomeStep = 'hola' | 'pregunta';

export default function WelcomePage() {
  const t = useTranslations();
  const [step, setStep] = useState<WelcomeStep>('hola');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Marcar como vista la primera vez que se carga
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    }

    // Iniciar la animación de fade-in
    const fadeInTimer = setTimeout(() => setVisible(true), 100);

    // Configurar la transición al siguiente paso
    const transitionTimer = setTimeout(() => {
      setVisible(false); // Inicia el fade-out
      setTimeout(() => setStep('pregunta'), 500); // Cambia el texto después del fade-out
    }, 5100); // 5 segundos visible + 100ms de inicio

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  useEffect(() => {
    // Activa el fade-in para el nuevo texto cuando cambia el paso
    if (step === 'pregunta') {
      const fadeInTimer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(fadeInTimer);
    }
  }, [step]);


  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <Logo className="mb-8" />
      
      <div className="relative h-28 mb-12 flex items-center justify-center">
        <h1
          className={cn(
            "text-6xl md:text-8xl font-bold text-primary transition-opacity duration-500 ease-in-out absolute",
            step === 'hola' && visible ? "opacity-100" : "opacity-0"
          )}
        >
          ¡Hola!
        </h1>
        <h1
          className={cn(
            "text-6xl md:text-8xl font-bold text-primary transition-opacity duration-500 ease-in-out absolute",
            step === 'pregunta' && visible ? "opacity-100" : "opacity-0"
          )}
        >
          ¿Cómo estás hoy?
        </h1>
      </div>

      <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-xs text-lg py-4 shadow-lg hover:shadow-primary/40 transition-shadow">
        <Link href="/assessment/intro">
          ¿Comenzamos?
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
