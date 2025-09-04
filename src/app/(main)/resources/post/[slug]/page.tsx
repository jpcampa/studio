
import { resourcesData } from '@/data/resourcesData';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, Calendar, BookOpen, Headphones, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export async function generateStaticParams() {
    return resourcesData.map((resource) => ({
        slug: resource.id,
    }));
}

function PostPage({ params }: { params: { slug: string } }) {
  const post = resourcesData.find(p => p.id === params.slug);

  if (!post) {
    notFound();
  }
  
  const getResourceTypeIcon = (type: 'article' | 'audio' | 'exercise') => {
    switch (type) {
      case 'article': return <BookOpen className="h-5 w-5 mr-2 text-primary" />;
      case 'audio': return <Headphones className="h-5 w-5 mr-2 text-primary" />;
      case 'exercise': return <Zap className="h-5 w-5 mr-2 text-primary" />;
      default: return <BookOpen className="h-5 w-5 mr-2 text-primary" />;
    }
  };


  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="border-b">
           <div className="flex items-center justify-between mb-3">
            <Badge variant="outline">{post.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
             {getResourceTypeIcon(post.type)}
             <span className="capitalize">{post.type}</span>
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{post.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center text-sm text-muted-foreground pt-2 gap-x-4 gap-y-1">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" /> {post.estimatedTime}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-6 md:px-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || '' }}
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
