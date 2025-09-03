
import { getPostBySlug, getAllResourcePosts, type WPPost } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const revalidate = 3600; // Revalidate every hour

// Generate static paths for all posts
export async function generateStaticParams() {
    const allPosts = await getAllResourcePosts();
    if (!allPosts || allPosts.length === 0) {
        return [];
    }

    return allPosts.map((post) => ({
        slug: post.slug,
    }));
}


async function PostPage({ params }: { params: { slug: string } }) {
  const posts: WPPost[] = await getPostBySlug(params.slug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const post = posts[0];

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-xl overflow-hidden">
        {post.jetpack_featured_media_url && (
          <div className="relative h-48 md:h-72 w-full">
            <Image
              src={post.jetpack_featured_media_url}
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <CardHeader className="border-b">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
            {post.title.rendered}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center text-sm text-muted-foreground pt-2 gap-x-4 gap-y-1">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" /> Publicado el {format(parseISO(post.date), "dd 'de' MMMM, yyyy", { locale: es })}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" /> {post.reading_time} min de lectura
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-6 md:px-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
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

export default PostPage;
