
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { getPostsByCategory, getCategoryBySlug, type ResourcePost, type ResourceCategory } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

// Fija la página a renderizado dinámico para asegurar que los datos se obtienen en cada petición
export const dynamic = 'force-dynamic';

export default async function Page({ params }: RoutePageProps<{ slug: string }>) {
  const { slug } = params;
  
  let category: ResourceCategory | undefined;
  let posts: ResourcePost[] = [];
  let error: string | null = null;

  try {
    // Se obtienen la categoría y los posts en paralelo para mayor eficiencia
    const [categoryResult, postsResult] = await Promise.all([
      getCategoryBySlug(slug),
      getPostsByCategory(slug),
    ]);

    category = categoryResult;
    posts = postsResult ?? []; // Asegura que posts sea un array aunque el resultado sea nulo

    // Si la categoría no existe, lanzamos un 404
    if (!category) {
      notFound();
    }
  } catch (e) {
      console.error(`Error fetching data for category '${slug}':`, e);
      // Asignamos un mensaje de error para mostrarlo en la UI
      error = "Ocurrió un error inesperado al cargar la página de esta categoría.";
  }
  
  // Este es un chequeo de seguridad final. Si la categoría no se encontró,
  // la función notFound() ya se habrá llamado, pero esto previene errores de renderizado.
  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4 capitalize">{category.name}</h1>
      </div>

       <div className="mb-8 text-center">
        <Button asChild variant="outline">
          <Link href="/resources">
            Ver todas las categorías
          </Link>
        </Button>
      </div>

       {error && (
         <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && posts.length === 0 && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertDescription>No hay artículos en esta categoría todavía.</AlertDescription>
          </Alert>
      )}

      {!error && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Se gestiona el cambio de dominio en la URL de la imagen
            let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            if (imageUrl) {
              imageUrl = imageUrl.replace('workwellfut.hl1450.dinaserver.com', 'workwellfut.com');
            }
            
            return (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    {imageUrl && (
                         <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                            <Image 
                                src={imageUrl}
                                alt={post.title.rendered} 
                                fill 
                                className="object-cover"
                                data-ai-hint="resource article"
                            />
                        </div>
                    )}
                    <CardTitle className="text-xl text-accent" dangerouslySetInnerHTML={{ __html: post.title.rendered }}/>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-foreground/80 [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}/>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/resources/post/${post.slug}`}>
                        Leer más <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}

// Función para generar los metadatos de la página (título de la pestaña)
export async function generateMetadata({ params }: RoutePageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);
  return {
    title: `Recursos sobre ${category?.name || 'Categoría'}`,
  };
}
