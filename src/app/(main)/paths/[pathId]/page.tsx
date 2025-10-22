
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

type Params = { pathId: string };

export default async function Page({ params }: { params: Params }) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

export async function generateStaticParams(): Promise<Params[]> {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}

export async function generateMetadata(
  { params }: { params: Params }
) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
