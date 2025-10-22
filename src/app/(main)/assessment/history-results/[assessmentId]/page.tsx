import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

type PageProps = { params: { assessmentId: string } };

export default async function Page({ params }: PageProps) {
  const { assessmentId } = params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { assessmentId } = params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
