
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { getPostBySlug, type ResourcePost } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Metadata } from 'next';

type PageProps = { params: { slug: string } };

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  let post: ResourcePost | undefined;
  let error: string | null = null;
  
  try {
    post = await getPostBySlug(slug);
  } catch (e: unknown) {
    console.error(`Error fetching post ${slug}:`, e);
    error = "No se pudo cargar el artículo. Por favor, inténtalo de nuevo más tarde.";
  }

  if (error) {
    return (
        <div className="container mx-auto py-8 text-center">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            </Alert>
             <div className="mt-8">
                <Button variant="outline" asChild>
                <Link href="/resources">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Recursos
                </Link>
                </Button>
            </div>
        </div>
    );
  }

  if (!post) {
      notFound();
  }

  let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (imageUrl && imageUrl.startsWith('https://workwellfut.com')) {
    imageUrl = imageUrl.replace('https://', 'http://');
  }


  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="border-b p-0">
            {imageUrl && (
                <div className="relative h-64 w-full">
                    <Image 
                        src={imageUrl} 
                        alt={post.title.rendered} 
                        fill 
                        className="object-cover"
                        data-ai-hint="resource article header"
                    />
                </div>
            )}
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  return {
    title: post?.title.rendered || 'Artículo',
  };
}
