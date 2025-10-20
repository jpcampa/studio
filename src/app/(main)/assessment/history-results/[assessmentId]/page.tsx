import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

type RouteParams = { assessmentId: string };

export default async function Page({ params }: RoutePageProps<RouteParams>) {
  const { assessmentId } = await params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: RoutePageProps<RouteParams>
): Promise<Metadata> {
  const { assessmentId } = await params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
