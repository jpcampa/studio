
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

// Define the correct type for the page props
type PathDetailPageProps = {
  params: { pathId: string };
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  // Destructure pathId directly from params
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
