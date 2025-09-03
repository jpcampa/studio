
import { getResourcesCategories, type WPCategory } from '@/lib/wordpress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';

async function ResourcesPage() {
  const categories: WPCategory[] = await getResourcesCategories();

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Recursos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explora nuestra biblioteca de artículos para nutrir tu bienestar.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/resources/category/${category.slug}`} legacyBehavior>
              <a className="block group">
                <Card className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                  <CardHeader>
                    <FolderKanban className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription dangerouslySetInnerHTML={{ __html: category.description || 'Explora los artículos de esta categoría.' }} />
                  </CardContent>
                  <CardContent>
                     <div className="flex items-center text-sm text-primary font-semibold">
                      Ver artículos <ArrowRight className="ml-2 h-4 w-4" />
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

export default ResourcesPage;
