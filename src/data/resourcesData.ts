// @/data/resourcesData.ts
import { unstable_noStore as noStore } from 'next/cache';

// Tipos de datos para los posts y categorías de recursos.
export type ResourcePost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  categories: number[];
  featured_media: number; 
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
    'wp:term'?: {
        id: number;
        name: string;
        slug: string;
    }[][];
  };
};

export type ResourceCategory = {
    id: number;
    name: string;
    slug: string;
    count: number;
};

const API_BASE_URL = "https://workwellfut.com/wp-json/wp/v2";

// --- Obtención de datos dinámicos desde la API de WordPress ---

/**
 * Obtiene todas las categorías de recursos desde la API de WordPress.
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/categories?per_page=100&_fields=id,name,slug,count`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const categories: ResourceCategory[] = await res.json();
        return categories.filter(cat => cat.slug !== 'sin-categoria' && cat.name.toLowerCase() !== 'recursos' && cat.count > 0);
    } catch (error) {
        console.error("Error fetching resource categories:", error);
        return [];
    }
}

/**
 * Obtiene todos los posts de recursos desde la API de WordPress.
 */
export async function getResources(): Promise<ResourcePost[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/posts?per_page=100&_embed=true`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.statusText}`);
        }
        const posts: ResourcePost[] = await res.json();
        return posts;
    } catch (error) {
        console.error("Error fetching resource posts:", error);
        return [];
    }
}

/**
 * Obtiene los posts de una categoría específica por su slug.
 */
export async function getPostsByCategory(categorySlug: string): Promise<ResourcePost[]> {
    const categories = await getResourceCategories();
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];

    const res = await fetch(`${API_BASE_URL}/posts?categories=${category.id}&_embed=true&per_page=100`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Failed to fetch posts for category ${categorySlug}: ${res.statusText}`);
    }
    const posts: ResourcePost[] = await res.json();
    return posts;
}

/**
 * Obtiene un post específico por su slug.
 */
export async function getPostBySlug(slug: string): Promise<ResourcePost | undefined> {
     try {
        const res = await fetch(`${API_BASE_URL}/posts?slug=${slug}&_embed=true`, { cache: 'no-store' });
        if (!res.ok) {
             throw new Error(`Failed to fetch post by slug: ${res.statusText}`);
        }
        const posts: ResourcePost[] = await res.json();
        return posts[0];
    } catch (error) {
        console.error(`Error fetching post with slug ${slug}:`, error);
        return undefined;
    }
}

/**
 * Obtiene una categoría específica por su slug.
 */
export async function getCategoryBySlug(slug: string): Promise<ResourceCategory | undefined> {
    const categories = await getResourceCategories();
    return categories.find(cat => cat.slug === slug);
}
