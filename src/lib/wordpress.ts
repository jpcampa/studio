
// src/lib/wordpress.ts
import "server-only";

export interface WpPost {
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
  categories: number[];
  featured_media_url?: string;
}

export interface WpCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

const API_BASE_URL = "https://workwellfut.hl1450.dinaserver.com/wp-json/wp/v2";
const RECURSOS_CATEGORY_ID = 3; 

async function fetchWithCache(url: string): Promise<{ data: any, error?: string }> {
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Failed to fetch ${url}. Status: ${res.status}. Body: ${errorBody}`);
      return { data: null, error: `Error del servidor de WordPress (HTTP ${res.status}).` };
    }
    const data = await res.json();
    return { data };
  } catch (error: any) {
    console.error(`Network error fetching ${url}:`, error.message);
    if (error.cause?.code === 'ENOTFOUND') {
      console.error("This is a DNS resolution error. Ensure the hostname is correct and reachable from the server environment.");
    }
    return { data: null, error: "No se pudieron cargar las categorías desde el blog. Por favor, revisa la conexión y la configuración de la API de WordPress." };
  }
}

// Gets all sub-categories of "Recursos" that have at least one post
export async function getResourcesCategories(): Promise<{ categories: WpCategory[], error?: string }> {
  try {
    const url = `${API_BASE_URL}/categories?parent=${RECURSOS_CATEGORY_ID}&hide_empty=true&per_page=100`;
    const { data: categories, error } = await fetchWithCache(url);
    if (error) {
        return { categories: [], error };
    }
    return { categories };
  } catch (error: any) {
    console.error("Error in getResourcesCategories:", error);
    return { categories: [], error: "No se pudieron cargar las categorías desde el blog. Por favor, revisa la conexión y la configuración de la API de WordPress." };
  }
}


// Gets all posts for a given category ID
export async function getPostsByCategory(categoryId: number): Promise<{ posts: WpPost[], error?: string }> {
  try {
    const url = `${API_BASE_URL}/posts?categories=${categoryId}&_embed&per_page=100`;
    const { data: posts, error } = await fetchWithCache(url);
     if (error) {
        return { posts: [], error };
    }

    const formattedPosts = posts.map((post: any) => ({ // Use 'any' temporarily to access _embedded
      ...post,
      featured_media_url: post['_embedded']?.['wp:featuredmedia']?.[0]?.source_url || undefined
    }));

    return { posts: formattedPosts };
  } catch (error: any) {
    console.error("Error in getPostsByCategory:", error);
    return { posts: [], error: "No se pudieron cargar los artículos para esta categoría." };
  }
}

// Gets a single post by its slug
export async function getPostBySlug(slug: string): Promise<{ post: WpPost | null, error?: string }> {
  try {
    const url = `${API_BASE_URL}/posts?slug=${slug}&_embed`;
    const { data: posts, error } = await fetchWithCache(url);
     if (error) {
        return { post: null, error };
    }
    if (!posts || posts.length === 0) {
      return { post: null };
    }
    const post = posts[0];
    const formattedPost = {
        ...post,
        featured_media_url: (post as any)['_embedded']?.['wp:featuredmedia']?.[0]?.source_url || undefined
    };
    return { post: formattedPost };
  } catch (error: any) {
    console.error("Error in getPostBySlug:", error);
    return { post: null, error: "No se pudo cargar el artículo." };
  }
}

// Gets all post slugs for generateStaticParams
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
    try {
        const url = `${API_BASE_URL}/posts?per_page=100&_fields=slug`;
        const { data: posts, error } = await fetchWithCache(url);
        if (error || !posts) {
            return [];
        }
        return posts.map((post: { slug: string }) => ({ slug: post.slug }));
    } catch (error) {
        console.error("Error fetching all post slugs:", error);
        return [];
    }
}

// Gets all category slugs for generateStaticParams
export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
    try {
        const { categories, error } = await getResourcesCategories();
        if (error || !categories) {
            return [];
        }
        return categories.map((category: WpCategory) => ({ slug: category.slug }));
    } catch (error) {
        console.error("Error fetching all category slugs:", error);
        return [];
    }
}
