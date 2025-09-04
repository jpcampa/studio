
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export async function generateStaticParams() {
    return getAllPostSlugs();
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let post = null;
  let error = null;

  try {
    post = await getPostBySlug(slug);
  } catch (e) {
    console.error(`PostPage: Failed to fetch post for slug ${slug}`, e);
    error = "No se pudo cargar el artículo. Puede que no exista o haya un problema de conexión.";
  }
  
  if (!post) {
      notFound();
  }

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {error && (
         <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {post && (
        <Card className="shadow-xl overflow-hidden">
          <CardHeader className="border-b p-0">
             {/* {imageUrl && (
              <div className="relative h-72 w-full">
                <Image
                  src={imageUrl}
                  alt={post.title.rendered}
                  fill
                  className="object-cover"
                />
              </div>
            )} */}
            <div className="p-6">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <CardDescription className="flex flex-wrap items-center text-sm text-muted-foreground pt-2 gap-x-4 gap-y-1">
                    <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" /> Publicado el {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="py-6 px-6 md:px-8">
             <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
          </Link>
        </Button>
      </div>
    </div>
  );
}
