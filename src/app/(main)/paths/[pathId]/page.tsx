
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

// ✅ Tipo local y correcto para los parámetros de la ruta.
type PathDetailPageProps = {
  params: { pathId: string };
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  // ✅ Acceso directo a `pathId`, sin await.
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

export async function generateStaticParams() {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}
