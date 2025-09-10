
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { getPostsByCategory, getAllCategorySlugs, getCategoryBySlug } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PageProps } from 'next';

export async function generateStaticParams() {
    return getAllCategorySlugs();
}

export default async function CategoryPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params; 
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }
  
  const posts = getPostsByCategory(slug);
  const error = null;

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
            const imageUrl = post.featured_media_url || 'https://workwellfut.com/imgapp/600x400/default.png';
            return (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    {imageUrl && (
                         <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
                            <Image 
                                src={imageUrl}
                                alt={post.title} 
                                fill 
                                className="object-cover"
                                data-ai-hint="resource article"
                            />
                        </div>
                    )}
                    <CardTitle className="text-xl text-accent">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-foreground/80 [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt }}/>
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
