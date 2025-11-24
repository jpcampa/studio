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

/**
 * Obtiene todas las categorías de recursos desde la API de WordPress.
 * Si falla, devuelve un array vacío en lugar de lanzar un error.
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
    noStore();
    try {
        const res = await fetch(`${API_BASE_URL}/categories?per_page=100&_fields=id,name,slug,count`, { next: { revalidate: 3600 } });
        if (!res.ok) {
            console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
            return []; // Devuelve array vacío en caso de error de red o de API
        }
        const categories: ResourceCategory[] = await res.json();
        return categories.filter(cat => cat.slug !== 'sin-categoria' && cat.count > 0);
    } catch (error) {
        console.error("Error in getResourceCategories:", error);
        return []; // Devuelve array vacío en caso de error de fetch o de parsing
    }
}

/**
 * Obtiene todos los posts de recursos desde la API de WordPress.
 * Si falla, devuelve un array vacío en lugar de lanzar un error.
 */
export async function getResources(): Promise<ResourcePost[]> {
    noStore();
    try {
        const res = await fetch(`${API_BASE_URL}/posts?per_page=100&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`, { next: { revalidate: 3600 } });
        if (!res.ok) {
             console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
            return [];
        }
        const posts: ResourcePost[] = await res.json();
        return posts;
    } catch (error) {
        console.error("Error in getResources:", error);
        return [];
    }
}

/**
 * Obtiene los posts de una categoría específica por su slug.
 */
export async function getPostsByCategory(categorySlug: string): Promise<ResourcePost[]> {
    noStore();
    try {
        const categories = await getResourceCategories();
        const category = categories.find(cat => cat.slug === categorySlug);
        if (!category) return [];

        const allPosts = await getResources();
        return allPosts.filter(post => post.categories.includes(category.id));
    } catch (error) {
         console.error(`Error in getPostsByCategory for slug ${categorySlug}:`, error);
        return [];
    }
}

/**
 * Obtiene un post específico por su slug.
 */
export async function getPostBySlug(slug: string): Promise<ResourcePost | undefined> {
    noStore();
     try {
        const res = await fetch(`${API_BASE_URL}/posts?slug=${slug}&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`, { next: { revalidate: 3600 } });
        if (!res.ok) {
             console.error(`Failed to fetch post by slug ${slug}: ${res.status} ${res.statusText}`);
             return undefined;
        }
        const posts: ResourcePost[] = await res.json();
        return posts[0];
    } catch (error) {
        console.error(`Error in getPostBySlug for slug ${slug}:`, error);
        return undefined;
    }
}

/**
 * Obtiene una categoría específica por su slug.
 */
export async function getCategoryBySlug(slug: string): Promise<ResourceCategory | undefined> {
    noStore();
    try {
        const categories = await getResourceCategories();
        return categories.find(cat => cat.slug === slug);
    } catch (error) {
        console.error(`Error in getCategoryBySlug for slug ${slug}:`, error);
        return undefined;
    }
}
