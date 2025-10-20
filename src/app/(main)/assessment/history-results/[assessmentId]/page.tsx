import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

type RouteParams = { assessmentId: string };
type PageProps = { params: Promise<RouteParams> };

export default async function Page({ params }: PageProps) {
  const { assessmentId } = await params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { assessmentId } = await params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
