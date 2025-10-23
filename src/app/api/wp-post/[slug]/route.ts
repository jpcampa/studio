// src/app/api/wp-post/[slug]/route.ts
import { NextResponse } from "next/server";

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

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug);

  const url = `https://workwellfut.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(
    slug
  )}&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h
  if (!res.ok) {
    return NextResponse.json(
      { error: "Error al consultar WordPress" },
      { status: 502 }
    );
  }

  const data = (await res.json()) as any[];
  const post = data?.[0];
  if (!post) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  const featuredImage = getFeaturedUrl(post);

  // Normaliza lo que expones a la app
  return NextResponse.json({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    categories: post.categories ?? [],
    // We send the processed URL and the original _embedded for flexibility
    featured_media: featuredImage, 
    _embedded: post._embedded,
  });
}
