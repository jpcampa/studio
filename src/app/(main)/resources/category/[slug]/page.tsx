
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { getPostsByCategory, getCategoryBySlug, type ResourceCategory, type ResourcePost } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Tipo local para los parámetros de esta ruta específica
type CategoryPageProps = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  let category: ResourceCategory | undefined;
  let posts: ResourcePost[] = [];
  let error: string | null = null;

  try {
    // Usamos Promise.all para hacer las peticiones en paralelo
    const [categoryResult, postsResult] = await Promise.all([
      getCategoryBySlug(slug).catch(e => {
        console.error(`Error fetching category '${slug}':`, e);
        return undefined; // Devolvemos undefined en caso de error
      }),
      getPostsByCategory(slug).catch(e => {
        console.error(`Error fetching posts for category '${slug}':`, e);
        return []; // Devolvemos un array vacío en caso de error
      })
    ]);

    category = categoryResult;
    posts = postsResult;

    if (!category) {
      notFound();
    }

  } catch (e: unknown) {
    // Este catch es para errores inesperados en el bloque Promise.all
    console.error(`Unexpected error fetching data for category '${slug}':`, e);
    error = "Ocurrió un error inesperado al cargar la página.";
  }

  if (!category) {
    // Si la categoría no se encontró, notFound() ya se habrá llamado.
    // Esto es un seguro extra.
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
            const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
            ? `https://workwellfut.hl1450.dinaserver.com/wp-json/yootheme/image?src=${encodeURIComponent(new URL(post._embedded['wp:featuredmedia'][0].source_url).pathname.replace('/wp-content/',''))}&hash=0e98bbb8`
            : 'https://workwellfut.com/imgapp/600x400/default.png';
            
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
