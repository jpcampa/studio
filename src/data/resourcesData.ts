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
 * Cachea la respuesta para mejorar el rendimiento.
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
    noStore(); // Asegura que los datos se obtienen dinámicamente en cada petición en modo desarrollo
    try {
        const res = await fetch(`${API_BASE_URL}/categories?per_page=100`, { next: { revalidate: 3600 } }); // Cache por 1 hora
        if (!res.ok) {
            throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const categories: ResourceCategory[] = await res.json();
        // Filtramos "Sin categoría"
        return categories.filter(cat => cat.slug !== 'sin-categoria' && cat.count > 0);
    } catch (error) {
        console.error("Error fetching resource categories:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}

/**
 * Obtiene todos los posts de recursos desde la API de WordPress.
 * El parámetro _embed añade información anidada como la imagen destacada y las categorías.
 */
export async function getResources(): Promise<ResourcePost[]> {
    noStore();
    try {
        const res = await fetch(`${API_BASE_URL}/posts?per_page=100&_embed=true`, { next: { revalidate: 3600 } });
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
 * Obtiene los posts de una categoría específica por su ID.
 */
export async function getPostsByCategory(categorySlug: string): Promise<ResourcePost[]> {
    noStore();
    const categories = await getResourceCategories();
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];

    const res = await fetch(`${API_BASE_URL}/posts?categories=${category.id}&_embed=true&per_page=100`, { next: { revalidate: 3600 } });
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
    noStore();
     try {
        const res = await fetch(`${API_BASE_URL}/posts?slug=${slug}&_embed=true`, { next: { revalidate: 3600 } });
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
 * Obtiene todos los slugs de los posts para la generación de páginas estáticas.
 */
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
    const posts = await getResources();
    return posts.map(post => ({ slug: post.slug }));
}

/**
 * Obtiene todos los slugs de las categorías para la generación de páginas estáticas.
 */
export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
    const categories = await getResourceCategories();
    return categories.map(cat => ({ slug: cat.slug }));
}

/**
 * Obtiene una categoría específica por su slug.
 */
export async function getCategoryBySlug(slug: string): Promise<ResourceCategory | undefined> {
    const categories = await getResourceCategories();
    return categories.find(cat => cat.slug === slug);
}