
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

export default async function PathDetailPage({ params }: { params: { pathId: string } }) {
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
