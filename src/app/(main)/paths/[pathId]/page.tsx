
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

// ✅ Define el tipo de props correcto directamente en la firma
type PathDetailPageProps = {
  params: { pathId: string };
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { pathId } = params; // ✅ Sin await
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
