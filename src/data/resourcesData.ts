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
  featured_media: string | null; // This will now hold the final URL string
  _embedded?: any; // Keep for flexibility, but we rely on featured_media
};

export type ResourceCategory = {
    id: number;
    name: string;
    slug: string;
    count: number;
};

// Use relative paths to our new local API
const API_BASE_URL = "/api";

// --- Obtención de datos dinámicos desde NUESTRA API local ---

export async function getResourceCategories(): Promise<ResourceCategory[]> {
    noStore(); 
    try {
        const res = await fetch(`${API_BASE_URL}/wp-categories`);
        if (!res.ok) {
            throw new Error(`Failed to fetch categories from local API: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching resource categories:", error);
        return [];
    }
}

export async function getResources(): Promise<ResourcePost[]> {
   // This function might be less used now, as we fetch by category/slug
   // But we can keep it for a potential "all posts" page.
   // Note: We would need to create an endpoint for this. For now, it is unused.
   return [];
}

export async function getPostsByCategory(categorySlug: string): Promise<ResourcePost[]> {
    noStore();
    try {
        const res = await fetch(`${API_BASE_URL}/wp-category/${categorySlug}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch posts for category ${categorySlug}: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching posts for category ${categorySlug}:`, error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<ResourcePost | undefined> {
     noStore();
     try {
        const res = await fetch(`${API_BASE_URL}/wp-post/${slug}`);
        if (!res.ok) {
             throw new Error(`Failed to fetch post by slug ${slug}: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching post with slug ${slug}:`, error);
        return undefined;
    }
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
    const categories = await getResourceCategories();
    return categories.map(cat => ({ slug: cat.slug }));
}

export async function getCategoryBySlug(slug: string): Promise<ResourceCategory | undefined> {
    const categories = await getResourceCategories();
    return categories.find(cat => cat.slug === slug);
}
