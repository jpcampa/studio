
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

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
    <Card className="w-full max-w-3xl shadow-2xl my-8">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
          {t.welcomePageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center px-6 md:px-10">
        <p className="text-md md:text-lg leading-relaxed text-foreground whitespace-pre-line">
          {t.welcomePageMainText1}
        </p>
        <p className="text-md md:text-lg leading-relaxed text-foreground whitespace-pre-line">
          {t.welcomePageMainText2}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground italic pt-4">
          {t.welcomePageLegalDisclaimer}
        </p>
        <p className="text-lg md:text-xl font-semibold text-accent pt-6 pb-2">
          {t.welcomePageMotivationalQuote}
        </p>
      </CardContent>
      <CardFooter className="flex-col items-center gap-4 pt-6 pb-8">
        <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-xs text-base py-3 shadow-lg hover:shadow-primary/40 transition-shadow">
          <Link href="/assessment">
            {t.welcomePageStartAssessmentButton}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="link" asChild className="mt-3 text-muted-foreground hover:text-primary">
          <Link href="/dashboard">
             <LayoutDashboard className="mr-2 h-4 w-4" />
            {t.welcomePageSkipToDashboardButton}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    