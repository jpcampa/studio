// src/app/api/wp-category/[slug]/route.ts
import { NextResponse } from 'next/server';
import type { ResourcePost } from '@/data/resourcesData';

type WPFeatured =
  | {
      id: number;
      source_url?: string;
      media_details?: {
        sizes?: Record<string, { source_url?: string }>;
      };
    }
  | undefined;

function getFeaturedUrl(post: any): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0] as WPFeatured;
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.source_url ||
    null
  );
}

const WP_API_BASE_URL = "https://workwellfut.com/wp-json/wp/v2";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug);

  try {
    // 1. Get category ID from slug
    const catRes = await fetch(`${WP_API_BASE_URL}/categories?slug=${slug}&_fields=id`, { next: { revalidate: 3600 } });
    if (!catRes.ok) throw new Error('Failed to fetch category');
    const catData = await catRes.json();
    if (catData.length === 0) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    const categoryId = catData[0].id;

    // 2. Get posts for that category
    const postsRes = await fetch(`${WP_API_BASE_URL}/posts?categories=${categoryId}&per_page=100&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`, { next: { revalidate: 3600 } });
    if (!postsRes.ok) throw new Error('Failed to fetch posts for category');
    
    const posts = await postsRes.json();

    // 3. Normalize data
    const normalizedPosts = posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      categories: post.categories,
      featured_media: getFeaturedUrl(post), // Use the robust function
       _embedded: post._embedded, // Keep original _embedded for other potential uses
    }));
    
    return NextResponse.json(normalizedPosts);

  } catch (error: any) {
    console.error(`Error in /api/wp-category/${slug}:`, error);
    return NextResponse.json({ error: 'Error al consultar los posts de la categoría', details: error.message }, { status: 502 });
  }
}
