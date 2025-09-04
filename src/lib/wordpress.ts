
export interface WPPost {
  id: number;
  date: string; // ISO 8601 format
  slug: string;
  link: string; // URL to the post
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  jetpack_featured_media_url: string; // Kept for compatibility but might be deprecated
  _embedded?: { // This is the new, more reliable way
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
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

const API_BASE_URL = 'https://workwellfut.hl1450.dinaserver.com/wp-json/wp/v2';
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

async function fetchWithCache(url: string): Promise<any> {
    try {
        const res = await fetch(url, { next: { revalidate: 0 } }); // Fetch on every request, no cache
        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`Failed to fetch ${url}. Status: ${res.status}. Body: ${errorBody}`);
            throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error(`Network or fetch error for ${url}:`, error);
        throw error;
    }
}

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
    return [];
  }
}

export async function getPostsByCategorySlug(slug: string): Promise<WPPost[]> {
  try {
    const categories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?slug=${slug}`);
    if (!categories || categories.length === 0) {
      console.warn(`Category with slug "${slug}" not found.`);
      return [];
    }
    const categoryId = categories[0].id;
    // Use _embed to include featured media data
    const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?categories=${categoryId}&per_page=100&_embed=true`);
    
    return posts.map(post => ({
        ...post,
        reading_time: calculateReadingTime(post.content.rendered)
    }));

  } catch (error) {
    console.error(`Error fetching posts for category slug "${slug}":`, error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost[]> {
  try {
    // Use _embed to include featured media data
    const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?slug=${slug}&_embed=true`);

    return posts.map(post => ({
        ...post,
        reading_time: calculateReadingTime(post.content.rendered)
    }));
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
    try {
        const categories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?slug=${slug}`);
        return categories.length > 0 ? categories[0] : null;
    } catch (error) {
        console.error(`Error fetching category by slug "${slug}":`, error);
        return null;
    }
}

export async function getAllResourcePosts(): Promise<WPPost[]> {
    try {
        const allCategories: WPCategory[] = await fetchWithCache(`${API_BASE_URL}/categories?per_page=100`);
        const parentCategory = allCategories.find((cat: WPCategory) => cat.slug === PARENT_CATEGORY_NAME);
        if (!parentCategory) {
            console.warn(`Parent category "${PARENT_CATEGORY_NAME}" not found for post pre-rendering.`);
            return [];
        }
        
        const subCategoryIds = allCategories
            .filter((cat: WPCategory) => cat.parent === parentCategory.id)
            .map((cat: WPCategory) => cat.id);
        
        const allResourceCategoryIds = [parentCategory.id, ...subCategoryIds];
        
        if (allResourceCategoryIds.length === 0) return [];
        
        // No need for _embed here as we only need the slug for generateStaticParams
        const posts: WPPost[] = await fetchWithCache(`${API_BASE_URL}/posts?categories=${allResourceCategoryIds.join(',')}&per_page=100&_fields=id,slug`);
        return posts;
    } catch (error) {
        console.error("Error fetching all resource posts:", error);
        return [];
    }
}
