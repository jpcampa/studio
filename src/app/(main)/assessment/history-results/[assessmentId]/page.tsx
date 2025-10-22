import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

type RouteParams = { assessmentId: string };

export default async function Page(
  { params }: { params: Promise<RouteParams> }
) {
  const { assessmentId } = await params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { assessmentId } = await params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
