import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = { params: { pathId: string } };

// Se fuerza el renderizado dinámico para evitar errores de compilación estática en producción.
export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

// Se elimina generateStaticParams para forzar renderizado dinámico.
// export async function generateStaticParams(): Promise<{pathId: string}[]> {
//   return pathsData.map((path) => ({
//     pathId: path.id,
//   }));
// }

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
