
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { ArrowRight, HeartHandshake, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SESSION_STORAGE_ASSESSMENT_RESULTS_KEY = 'workwell-assessment-results';
const SKIP_INTRO_SCREENS_KEY = 'workwell-skip-intro-screens';

export default function AssessmentResultsIntroPage() {
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipIntro = localStorage.getItem(SKIP_INTRO_SCREENS_KEY) === 'true';
      if (skipIntro) {
        router.replace('/assessment/show-results');
        return; // Importante salir temprano para evitar la verificación de resultados si se omite
      }

      // Check if results exist in sessionStorage, if not, redirect back to assessment start
      const results = localStorage.getItem(SESSION_STORAGE_ASSESSMENT_RESULTS_KEY);
      if (!results) {
        console.warn("AssessmentResultsIntroPage: No assessment results found in sessionStorage. Redirecting to assessment intro.");
        router.replace('/assessment/intro');
      }
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-3xl shadow-xl my-8">
        <CardHeader className="text-center pb-6">
          <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
            {t.assessmentResultsIntroTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-6 md:px-10 text-base leading-relaxed text-foreground">
          <p className="text-center text-lg md:text-xl text-muted-foreground whitespace-pre-line">
            {t.assessmentResultsIntroMainText1}
          </p>
          <p className="whitespace-pre-line">
            {t.assessmentResultsIntroMainText2}
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>{t.assessmentResultsIntroListItem1}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>{t.assessmentResultsIntroListItem2}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>{t.assessmentResultsIntroListItem3}</span>
            </li>
          </ul>
          <p className="whitespace-pre-line">
            {t.assessmentResultsIntroMainText3}
          </p>
           <p className="whitespace-pre-line font-medium text-accent">
            {t.assessmentResultsIntroMainText4}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-center gap-4 pt-8 pb-8">
          <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-md text-base py-3 shadow-lg hover:shadow-primary/40 transition-shadow">
            <Link href="/assessment/show-results">
              {t.assessmentResultsIntroViewProfileButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
