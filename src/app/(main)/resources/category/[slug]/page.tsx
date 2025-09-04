
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { getPostsByCategorySlug, getAllCategorySlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export async function generateStaticParams() {
    return getAllCategorySlugs();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let posts = [];
  let error = null;
  let categoryName = slug.replace(/-/g, ' ');

  try {
    posts = await getPostsByCategorySlug(slug);
    if (posts.length > 0) {
       // This is a trick to get the category name from the first post if needed, but we'll try to get it from a better source if available
    }
  } catch (e) {
    console.error(`CategoryPage: Failed to fetch posts for slug ${slug}`, e);
    error = "No se pudieron cargar los artículos para esta categoría.";
  }

  if (!error && posts.length === 0) {
      // This case might be hit if a category exists but has 0 posts and wasn't filtered by hide_empty
      error = "No hay artículos en esta categoría todavía.";
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4 capitalize">{categoryName}</h1>
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

      {!error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            return (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    {/* {imageUrl && (
                      <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title.rendered}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )} */}
                    <CardTitle className="text-xl text-accent" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}/>
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
