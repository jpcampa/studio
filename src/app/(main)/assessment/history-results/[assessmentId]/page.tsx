
import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

export default async function Page({ params }: { params: { assessmentId: string } }) {
  const { assessmentId } = params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: { params: { assessmentId: string } }
): Promise<Metadata> {
  const { assessmentId } = params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
