
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { ArrowRight, Info, Shield, ListChecks, UserCheck, BookOpen } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SKIP_INTRO_SCREENS_KEY = 'workwell-skip-intro-screens';

export default function AssessmentIntroPage() {
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipIntro = localStorage.getItem(SKIP_INTRO_SCREENS_KEY) === 'true';
      if (skipIntro) {
        router.replace('/assessment');
      }
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-3xl shadow-xl my-8">
        <CardHeader className="text-center pb-6">
          <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
            {t.assessmentIntroPageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-6 md:px-10 text-base leading-relaxed text-foreground">
          <p className="text-center italic text-lg md:text-xl text-muted-foreground whitespace-pre-line">
            {t.assessmentIntroPageTagline}
          </p>
          <p className="whitespace-pre-line">
            {t.assessmentIntroPageMainText1}
          </p>
          
          <div className="space-y-3 p-4 border-l-4 border-accent bg-accent/10 rounded-md">
            <h3 className="text-xl font-semibold text-accent flex items-center">
              <ListChecks className="mr-3 h-6 w-6" />
              {t.assessmentIntroPagePurposeTitle}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-5 text-foreground/90">
              <li>{t.assessmentIntroPagePurpose1}</li>
              <li>{t.assessmentIntroPagePurpose2}</li>
              <li>{t.assessmentIntroPagePurpose3}</li>
            </ul>
          </div>

          <div className="space-y-3 p-4 border-l-4 border-primary bg-primary/10 rounded-md">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Info className="mr-3 h-6 w-6" />
              {t.assessmentIntroPageWhatToKnowTitle}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-5 text-foreground/90">
              <li><strong>{t.assessmentIntroPageWhatToKnowDurationLabel}</strong> {t.assessmentIntroPageWhatToKnowDurationText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowContentLabel}</strong> {t.assessmentIntroPageWhatToKnowContentText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowFormatLabel}</strong> {t.assessmentIntroPageWhatToKnowFormatText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowResultsLabel}</strong> {t.assessmentIntroPageWhatToKnowResultsText}</li>
              <li><strong>{t.assessmentIntroPageWhatToKnowPrivacyLabel}</strong> {t.assessmentIntroPageWhatToKnowPrivacyText}</li>
            </ul>
          </div>
          
          <div className="p-4 border border-destructive/50 bg-destructive/5 dark:bg-destructive/15 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-destructive flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              {t.assessmentIntroPageImportantLabel}
            </p>
            <p className="text-sm text-destructive/90 mt-1">
              {t.assessmentIntroPageImportantText}
            </p>
          </div>

          <p className="text-center font-semibold text-lg md:text-xl text-accent pt-6 whitespace-pre-line">
            {t.assessmentIntroPageFinalWords}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-center gap-4 pt-8 pb-8">
          <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-md text-base py-3 shadow-lg hover:shadow-primary/40 transition-shadow">
            <Link href="/assessment">
              {t.assessmentIntroPageStartButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
