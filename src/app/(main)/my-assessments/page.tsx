
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssessmentHistory, formatAssessmentTimestamp, type AssessmentRecord } from '@/data/assessmentHistoryStore';
import { History, Eye, ListChecks, ArrowRight } from 'lucide-react'; // Assuming History icon
import { Badge } from '@/components/ui/badge';

export default function MyAssessmentsPage() {
  const t = useTranslations();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAssessments(getAssessmentHistory());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Basic loader, can be replaced with a spinner component
    return <div className="container mx-auto py-8 text-center">{t.loading}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <History className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-3">{t.myAssessmentsTitle}</h1>
        <p className="text-lg text-muted-foreground">{t.myAssessmentsDescription}</p>
      </div>

      {assessments.length === 0 ? (
        <Card className="max-w-lg mx-auto text-center shadow-lg">
          <CardHeader>
            <CardTitle>{t.noAssessmentsFound}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Parece que aún no has completado ninguna evaluación. Tu historial aparecerá aquí una vez que lo hagas.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/assessment/intro">
                {t.takeInitialAssessment} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                        {formatAssessmentTimestamp(assessment.timestamp)}
                    </Badge>
                    <History className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-accent">{t.assessmentDateLabel.replace("{date}", formatAssessmentTimestamp(assessment.timestamp).split(',')[0])}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {assessment.data.priorityAreas && assessment.data.priorityAreas.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-primary/80" />
                        Áreas Prioritarias Identificadas:
                    </p>
                    <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm">
                      {assessment.data.priorityAreas.slice(0, 2).map((area, index) => (
                        <li key={index} className="truncate" title={area}>{area.split('(')[0].trim()}</li>
                      ))}
                      {assessment.data.priorityAreas.length > 2 && (
                        <li className="text-xs text-muted-foreground italic">...y {assessment.data.priorityAreas.length - 2} más.</li>
                      )}
                    </ul>
                  </>
                )}
                {!assessment.data.priorityAreas || assessment.data.priorityAreas.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No se identificaron áreas prioritarias específicas en esta evaluación.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link href={`/assessment/history-results/${assessment.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t.viewAssessmentResultsButton}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
