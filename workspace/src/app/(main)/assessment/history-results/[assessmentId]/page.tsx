
import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

// 🔧 Firma ultra-permisiva para satisfacer cualquier PageProps que genere Next.
// Acepta que `params` sea objeto o Promise, y lo "desenvuelve" si hace falta.
export default async function Page(props: any) {
  const p =
    (props?.params && typeof props.params?.then === "function")
      ? await props.params              // si viene como Promise
      : (props?.params ?? {});          // si viene como objeto

  const assessmentId = (p?.assessmentId ?? "") as string;

  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}


export async function generateMetadata(props: any): Promise<Metadata> {
  const p =
    (props?.params && typeof props.params?.then === "function")
      ? await props.params
      : (props?.params ?? {});

  const assessmentId = (p?.assessmentId ?? "") as string;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
