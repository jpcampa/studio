
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assessmentDimensions } from '@/data/assessmentDimensions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentReviewPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Listado Completo de Preguntas de Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assessmentDimensions.map((dimension) => (
              <div key={dimension.id}>
                <h3 className="text-lg font-semibold text-accent mt-4 mb-2">
                  {dimension.name}
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {dimension.items.map((item) => (
                    <li key={item.id} className="text-sm">
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Link>
        </Button>
      </div>
    </div>
  );
}
