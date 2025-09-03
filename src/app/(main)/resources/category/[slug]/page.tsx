
import { getPostsByCategorySlug, getCategoryBySlug, getResourcesCategories, type WPPost, type WPCategory } from '@/lib/wordpress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const categories = await getResourcesCategories();
  if (!categories || categories.length === 0) {
    return [];
  }
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let posts: WPPost[] = [];
  let category: WPCategory | null = null;
  let error: string | null = null;

  try {
      [posts, category] = await Promise.all([
        getPostsByCategorySlug(slug),
        getCategoryBySlug(slug),
      ]);
  } catch (e) {
      console.error(`Error fetching data for category ${slug}:`, e);
      error = "No se pudo cargar el contenido. Por favor, inténtalo de nuevo más tarde.";
  }

  if (!category) {
    notFound();
  }

  if (error) {
    return (
        <div className="container mx-auto py-8 text-center">
             <Alert variant="destructive" className="max-w-xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error de Conexión</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <FolderOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-4">
          {category.name}
        </h1>
        {category.description && (
          <div
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>

       <div className="mb-8 text-center">
        <Button asChild variant="outline">
          <Link href="/resources">
            Ver todas las categorías
          </Link>
        </Button>
      </div>

    {posts.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: WPPost) => {
           const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || post.jetpack_featured_media_url;
           return (
            <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                {imageUrl && (
                <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                    <Image
                    src={imageUrl}
                    alt={post.title.rendered}
                    fill
                    className="object-cover"
                    data-ai-hint="blog post topic"
                    />
                </div>
                )}
                <CardHeader>
                <CardTitle className="text-xl text-accent">{post.title.rendered}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                <CardDescription dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1.5" /> {post.reading_time} min de lectura
                </div>
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
       ) : (
        <div className="text-center text-muted-foreground mt-12">
          <p>No se encontraron artículos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
