
import { resourcesData } from '@/data/resourcesData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const categories = [...new Set(resourcesData.map(r => r.category))];
    return categories.map((category) => ({
      slug: category.toLowerCase().replace(/\s+/g, '-'),
    }));
}

function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  const categoryName = slug.replace(/-/g, ' ');
  const posts = resourcesData.filter(r => r.category.toLowerCase().replace(/\s+/g, '-') === slug);

  if (posts.length === 0) {
    notFound();
  }
  
  const currentCategory = posts[0].category;

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4 capitalize">{currentCategory}</h1>
      </div>

       <div className="mb-8 text-center">
        <Button asChild variant="outline">
          <Link href="/resources">
            Ver todas las categorías
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
           return (
            <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-accent">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="prose prose-sm dark:prose-invert max-w-none">{post.summary}</div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1.5" /> {post.estimatedTime}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/resources/post/${post.id}`}>
                      Leer más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
            </Card>
           )
        })}
      </div>
    </div>
  );
}

export default CategoryPage;
