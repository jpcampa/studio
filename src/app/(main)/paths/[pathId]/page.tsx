import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';

// Define la interfaz de props directamente aquí
interface PathDetailPageProps {
  params: { pathId: string };
}

// La función del componente ya no necesita ser doblemente async
export default function PathDetailPage({ params }: PathDetailPageProps) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

// Esta función sigue siendo async porque puede realizar operaciones asíncronas
export async function generateStaticParams() {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}
