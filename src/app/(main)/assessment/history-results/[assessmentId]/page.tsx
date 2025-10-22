import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

type Params = { assessmentId: string };

export default async function Page({ params }: { params: Params }) {
  const { assessmentId } = params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { assessmentId } = params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
