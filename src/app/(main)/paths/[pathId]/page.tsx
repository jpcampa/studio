
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

type RouteParams = { pathId: string };
type PageProps = { params: Promise<RouteParams> };

export default async function Page({ params }: PageProps) {
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
  { params }: PageProps
) {
  const { pathId } = await params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
