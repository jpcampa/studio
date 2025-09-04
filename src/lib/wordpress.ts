// src/lib/wordpress.ts
import { notFound } from 'next/navigation';

const API_BASE_URL = "https://workwellfut.com/wp-json/wp/v2";

interface WpPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}

interface WpCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
}

async function fetchWithCache(url: string): Promise<any> {
  try {
    // Change caching strategy to 'no-store' for a more direct fetch.
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Failed to fetch ${url}. Status: ${res.status}. Body: ${errorBody}`);
      throw new Error(`Failed to fetch data from WordPress API. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Network error or fetch failed for ${url}:`, error);
    // Rethrow to be caught by the calling function, which can handle UI.
    throw error;
  }
}

// Gets all categories that have at least one post
export async function getResourcesCategories(): Promise<WpCategory[]> {
  // hide_empty=true is crucial for the user's request
  const url = `${API_BASE_URL}/categories?hide_empty=true&per_page=50`;
  return fetchWithCache(url);
}

// Gets all posts for a given category slug
export async function getPostsByCategorySlug(slug: string): Promise<WpPost[]> {
  const categories = await fetchWithCache(`${API_BASE_URL}/categories?slug=${slug}`);
  if (!categories || categories.length === 0) {
    console.warn(`No category found for slug: ${slug}`);
    notFound();
  }
  const categoryId = categories[0].id;
  const url = `${API_BASE_URL}/posts?categories=${categoryId}&_embed=true&per_page=100`;
  return fetchWithCache(url);
}

// Gets a single post by its slug
export async function getPostBySlug(slug: string): Promise<WpPost> {
  const posts = await fetchWithCache(`${API_BASE_URL}/posts?slug=${slug}&_embed=true`);
  if (!posts || posts.length === 0) {
    console.warn(`No post found for slug: ${slug}`);
    notFound();
  }
  return posts[0];
}

// Gets all post slugs for generateStaticParams
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
    try {
        const posts: WpPost[] = await fetchWithCache(`${API_BASE_URL}/posts?per_page=100&_fields=slug`);
        return posts.map(post => ({ slug: post.slug }));
    } catch (error) {
        console.error("Could not fetch post slugs for generateStaticParams:", error);
        return [];
    }
}

// Gets all category slugs for generateStaticParams
export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
     try {
        const categories: WpCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?hide_empty=true&_fields=slug`);
        return categories.map(category => ({ slug: category.slug }));
    } catch (error) {
        console.error("Could not fetch category slugs for generateStaticParams:", error);
        return [];
    }
}
