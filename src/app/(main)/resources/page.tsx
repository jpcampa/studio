
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { getResourcesCategories } from '@/lib/wordpress';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


export default async function ResourcesPage() {
  const t = useTranslations();
  let categories = [];
  let error = null;

  try {
    categories = await getResourcesCategories();
  } catch (e) {
    console.error("ResourcesPage: Failed to fetch categories", e);
    error = "No se pudieron cargar las categorías desde el blog. Por favor, revisa la conexión y la configuración de la API de WordPress.";
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.resourcesTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.resourcesIntro}
        </p>
      </div>

      {error && (
         <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && categories.length === 0 && (
         <div className="text-center text-muted-foreground">
          <p>No se encontraron categorías con artículos publicados en este momento.</p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/resources/category/${category.slug}`} legacyBehavior>
              <a className="block group">
                <Card className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: category.name }}/>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>Explora los {category.count} artículos y ejercicios sobre {category.name.toLowerCase()}.</CardDescription>
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
      )}
    </div>
  );
}
