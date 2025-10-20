import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';
import type { RoutePageProps } from '@/types/page-props';

type RouteParams = { pathId: string };

export default async function Page({ params }: RoutePageProps<RouteParams>) {
  const { pathId } = await params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}

export async function generateMetadata(
  { params }: RoutePageProps<RouteParams>
) {
  const { pathId } = await params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
