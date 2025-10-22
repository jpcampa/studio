
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

type RouteParams = { pathId: string };

export default async function Page({ params }: { params: RouteParams }) {
  const { pathId } = params;
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
  { params }: { params: RouteParams }
) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
