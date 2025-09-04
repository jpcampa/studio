
"use client";

import Link from 'next/link';
import { resourcesData, Resource } from '@/data/resourcesData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/lib/translations';
import { BookOpen, Headphones, Zap, ArrowRight, Clock } from 'lucide-react';

// Helper to get unique categories
const getUniqueCategories = (resources: Resource[]) => {
  const categories = resources.map(r => r.category);
  return [...new Set(categories)];
};

export default function ResourcesPage() {
  const t = useTranslations();
  const categories = getUniqueCategories(resourcesData);

  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.resourcesTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.resourcesIntro}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category} href={`/resources/category/${getCategorySlug(category)}`} legacyBehavior>
              <a className="block group">
                <Card className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>Explora los artículos y ejercicios sobre {category.toLowerCase()}.</CardDescription>
                  </CardContent>
                  <CardContent>
                     <div className="flex items-center text-sm text-primary font-semibold">
                      Ver categoría <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No se encontraron categorías de recursos en este momento.</p>
        </div>
      )}
    </div>
  );
}
