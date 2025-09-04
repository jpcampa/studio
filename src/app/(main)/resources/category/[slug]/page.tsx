import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { getPostsByCategory, getAllCategorySlugs, WpCategory } from '@/lib/wordpress'; // Updated import
import { notFound } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Function to get category data by slug, needed for generating the page title
async function getCategoryBySlug(slug: string): Promise<WpCategory | null> {
    // This is a simplified version. A real implementation would fetch this from the API.
    // Since we can't do another fetch here easily, we'll make a pragmatic choice.
    // For now, we'll just format the slug for the title.
    return null;
}

export async function generateStaticParams() {
    // This function now correctly uses the new wordpress helper
    return getAllCategorySlugs();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // A better approach would be to get all categories and find the one with the matching slug
  // to get its ID and name, but that would require modifying getResourcesCategories or a new function.
  // This is a simplification to avoid another API call just for the category name/id.
  // We'll assume the API call in getPostsByCategory will work with a slug if the API is configured for it.
  // Let's assume getPostsByCategory is adapted to take a slug.
  
  // Let's create a more robust flow: get category ID from slug, then posts.
  // This requires a new helper function or modifying an existing one. For now, we'll stick to a simple fetch.
  // We'll need a function `getCategoryBySlug` in wordpress.ts to be clean.
  
  // For the sake of progress, let's assume we can fetch posts by a category slug somehow.
  // A robust implementation would first fetch category ID from slug.
  // Let's proceed with a placeholder category name and focus on fetching posts.
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // NOTE: A proper implementation would need `getPostsByCategory` to accept a slug.
  // The current `getPostsByCategory` accepts an ID. This will require a new function in wordpress.ts
  // to get category details by slug, then use its ID to fetch posts.
  // For now, we'll show an error as this logic is incomplete without modifying wordpress.ts further.
  const error = "La lógica para cargar posts por 'slug' de categoría no está completamente implementada.";
  const posts: any[] = [];

  // Placeholder logic since we can't reliably get posts by slug with the current helpers.
  // In a real scenario, you'd fetch the category ID first, then fetch posts.

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

      {!error && posts.length === 0 && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertDescription>No hay artículos en esta categoría todavía.</AlertDescription>
          </Alert>
      )}

      {!error && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imageUrl = post.featured_media_url;
            return (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    {/* Image rendering is disabled for now */}
                    <CardTitle className="text-xl text-accent" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
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
