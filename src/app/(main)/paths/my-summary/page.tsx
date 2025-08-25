"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowLeft, BookCheck } from 'lucide-react';
import { pathsData, type Path } from '@/data/pathsData';
import { PathProgressCard } from '@/components/paths/PathProgressCard';

export default function MyPathsSummaryPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 text-center sm:text-left">
        <div>
          <BookCheck className="mx-auto sm:mx-0 h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-3">{t.myPathsSummaryTitle}</h1>
          <p className="text-lg text-muted-foreground">{t.myPathsSummaryDescription}</p>
        </div>
        <Button asChild variant="outline" className="mt-4 sm:mt-0">
          <Link href="/paths">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.allPaths}
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pathsData.map((path: Path) => (
          <PathProgressCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
