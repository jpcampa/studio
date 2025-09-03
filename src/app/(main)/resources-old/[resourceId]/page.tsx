
import { resourcesData } from '@/data/resourcesDataOld';
import { ResourceDetailClient } from '@/components/resources-old/ResourceDetailClient';
import { notFound } from 'next/navigation';

interface ResourceDetailPageProps {
  params: { resourceId: string };
}

// This is a Server Component.
export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { resourceId } = params;
  const resource = resourcesData.find(r => r.id === resourceId);

  if (!resource) {
    notFound();
  }

  return <ResourceDetailClient resource={resource} />;
}

export async function generateStaticParams() {
  return resourcesData.map((resource) => ({
    resourceId: resource.id,
  }));
}
