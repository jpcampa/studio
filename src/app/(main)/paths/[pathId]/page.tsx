
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

interface PathDetailPageProps {
  params: { pathId: string };
}

// This is a Server Component. It fetches data.
export default function PathDetailPage({ params }: PathDetailPageProps) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  // The Server Component passes the data to the Client Component.
  return <PathDetailClient path={path} />;
}

// This function helps Next.js know which paths to pre-render at build time.
export async function generateStaticParams() {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}
