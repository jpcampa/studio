
import { getPostsByCategorySlug, getCategoryBySlug, type WPPost, type WPCategory } from '@/lib/wordpress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 3600; // Revalidate every hour

async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [posts, category] = await Promise.all([
    getPostsByCategorySlug(slug),
    getCategoryBySlug(slug),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <FolderOpen className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-4">
          {category ? category.name : `Artículos`}
        </h1>
        {category && (
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
          {posts.map((post: WPPost) => (
            <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {post.jetpack_featured_media_url && (
                <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                  <Image
                    src={post.jetpack_featured_media_url}
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
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No hay artículos en esta categoría.</p>
      )}
    </div>
  );
}

export default CategoryPage;
