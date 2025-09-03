
export interface WPPost {
  id: number;
  date: string; // ISO 8601 format
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  jetpack_featured_media_url: string;
  categories: number[];
  reading_time: number;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  parent: number;
}

const API_BASE_URL = 'http://workwellfut.hl1450.dinaserver.com/wp-json/wp/v2';
const PARENT_CATEGORY_NAME = 'recursos';

// Function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const noHtml = content.replace(/<[^>]*>/g, "");
  const textLength = noHtml.split(/\s+/).length; // Split by whitespace
  if (textLength > 0) {
    return Math.ceil(textLength / wordsPerMinute);
  }
  return 0;
}

async function fetchWithCache(url: string, revalidate: number = 3600): Promise<any> {
    try {
        const res = await fetch(url, { next: { revalidate } });
        if (!res.ok) {
            // Log the server's response for more context on the error
            const errorBody = await res.text();
            console.error(`Failed to fetch ${url}. Status: ${res.status}. Body: ${errorBody}`);
            throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Network or fetch error for ${url}:`, error);
        throw error; // Re-throw the error to be caught by the calling function
    }
}

/**
 * Fetches all categories, finds the 'recursos' category ID, 
 * and then fetches its direct subcategories.
 */
export async function getResourcesCategories(): Promise<WPCategory[]> {
  try {
    const allCategories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?per_page=100`);
    
    const parentCategory = allCategories.find(cat => cat.slug === PARENT_CATEGORY_NAME);
    
    if (!parentCategory) {
      console.warn(`Parent category "${PARENT_CATEGORY_NAME}" not found.`);
      return [];
    }

    const subCategories = allCategories.filter(cat => cat.parent === parentCategory.id && cat.count > 0);
    return subCategories;
  } catch (error) {
    console.error("Error fetching resources categories:", error);
    return []; // Return empty array on failure to prevent build errors
  }
}

/**
 * Fetches posts for a given category slug.
 */
export async function getPostsByCategorySlug(slug: string): Promise<WPPost[]> {
  try {
    const categories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?slug=${slug}`);
    if (!categories || categories.length === 0) {
      console.warn(`Category with slug "${slug}" not found.`);
      return [];
    }
    const categoryId = categories[0].id;
    const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?categories=${categoryId}&per_page=100&_fields=id,date,slug,title,content,excerpt,jetpack_featured_media_url,categories`);
    
    // Calculate reading time for each post
    return posts.map(post => ({
        ...post,
        reading_time: calculateReadingTime(post.content.rendered)
    }));

  } catch (error) {
    console.error(`Error fetching posts for category slug "${slug}":`, error);
    return [];
  }
}

/**
 * Fetches a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<WPPost[]> {
  try {
    const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?slug=${slug}&_fields=id,date,slug,title,content,excerpt,jetpack_featured_media_url,categories`);
    // Calculate reading time for the post
    return posts.map(post => ({
        ...post,
        reading_time: calculateReadingTime(post.content.rendered)
    }));
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error);
    return [];
  }
}

/**
 * Fetches a single category by its slug.
 */
export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
    try {
        const categories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?slug=${slug}`);
        return categories.length > 0 ? categories[0] : null;
    } catch (error) {
        console.error(`Error fetching category by slug "${slug}":`, error);
        return null;
    }
}

/**
 * Fetches all posts under the main 'recursos' category for static generation.
 */
export async function getAllResourcePosts(): Promise<WPPost[]> {
    try {
        const categories = await getResourcesCategories();
        if (!categories || categories.length === 0) {
            return [];
        }
        const categoryIds = categories.map(cat => cat.id);
        const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?categories=${categoryIds.join(',')}&per_page=100&_fields=id,slug,title`);
        return posts;
    } catch (error) {
        console.error("Error fetching all resource posts:", error);
        return [];
    }
}
