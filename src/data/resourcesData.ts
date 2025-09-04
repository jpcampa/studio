
// src/data/resourcesData.ts

// This file acts as a local database for your blog content.
// By storing the content here, we avoid network errors and ensure the app is fast and reliable.

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
  name: string;
  slug: string;
}

// Manually define categories here
export const categoriesData: WpCategory[] = [
  {
    "id": 18,
    "count": 4,
    "description": "",
    "name": "Coherencia y Valores",
    "slug": "coherencia-y-valores"
  },
  {
    "id": 13,
    "count": 4,
    "description": "",
    "name": "Comprenderme Mejor",
    "slug": "comprenderme-mejor"
  },
  {
    "id": 1,
    "count": 0,
    "description": "",
    "name": "Sin categoría",
    "slug": "sin-categoria"
  }
];

// Manually define posts here
export const postsData: WpPost[] = [
  {
    "id": 140,
    "date": "2024-05-19T10:39:15",
    "slug": "mi-brujula-de-coherencia",
    "title": {
      "rendered": "Mi brújula de coherencia"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 1: MI BRÚJULA DE COHERENCIA</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Descubre en qué partes de tu vida estás alineado o alineada contigo, y en cuáles sientes que hay una desconexión.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>10-15 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 1: MI BRÚJULA DE COHERENCIA Objetivo: Descubre en qué partes de tu vida estás alineado o alineada contigo, y en cuáles sientes que hay una desconexión. Duración: 10-15 min</p>\n"
    },
    "categories": [
      18
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Vivir-con-Coherencia-Personal-scaled.jpeg"
  },
  {
    "id": 139,
    "date": "2024-05-19T10:38:39",
    "slug": "registro-de-decisiones-pequenas",
    "title": {
      "rendered": "Registro de decisiones pequeñas"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 2: REGISTRO DE DECISIONES PEQUEÑAS</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Observa cómo eliges en tu día a día, si actúas desde lo que realmente quieres o desde lo que crees que “debes” hacer.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>5-10 min diarios</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 2: REGISTRO DE DECISIONES PEQUEÑAS Objetivo: Observa cómo eliges en tu día a día, si actúas desde lo que realmente quieres o desde lo que crees que “debes” hacer. Duración: 5-10 min diarios</p>\n"
    },
    "categories": [
      18
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Vivir-con-Coherencia-Personal-scaled.jpeg"
  },
  {
    "id": 138,
    "date": "2024-05-19T10:38:09",
    "slug": "mapa-de-tensiones-internas",
    "title": {
      "rendered": "Mapa de tensiones internas"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 1: MAPA DE TENSIONES INTERNAS</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Detecta cuándo lo que piensas, sientes y haces no están en sintonía, para entender qué lo provoca y decidir qué quieres cambiar o mantener.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>15 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 1: MAPA DE TENSIONES INTERNAS Objetivo: Detecta cuándo lo que piensas, sientes y haces no están en sintonía, para entender qué lo provoca y decidir qué quieres cambiar o mantener. Duración: 15 min</p>\n"
    },
    "categories": [
      18
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Vivir-con-Coherencia-Personal-scaled.jpeg"
  },
  {
    "id": 137,
    "date": "2024-05-19T10:37:37",
    "slug": "el-espejo-etico",
    "title": {
      "rendered": "El espejo ético"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 2: EL ESPEJO ÉTICO</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Aclara si tus decisiones están alineadas con tus valores, imaginando que se las explicas a alguien a quien respetas.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>10-12 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 2: EL ESPEJO ÉTICO Objetivo: Aclara si tus decisiones están alineadas con tus valores, imaginando que se las explicas a alguien a quien respetas. Duración: 10-12 min</p>\n"
    },
    "categories": [
      18
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Vivir-con-Coherencia-Personal-scaled.jpeg"
  },
  {
    "id": 136,
    "date": "2024-05-19T10:36:20",
    "slug": "detective-de-emociones",
    "title": {
      "rendered": "“Detective de emociones”"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 1: “DETECTIVE DE EMOCIONES”</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Aprende a distinguir emoción, pensamiento e impulso, para empezar a entenderte con más claridad y menos juicio.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>5–10 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 1: “DETECTIVE DE EMOCIONES” Objetivo: Aprende a distinguir emoción, pensamiento e impulso, para empezar a entenderte con más claridad y menos juicio. Duración: 5–10 min</p>\n"
    },
    "categories": [
      13
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Comprenderme-Mejor-Cada-Dia-scaled.jpeg"
  },
  {
    "id": 135,
    "date": "2024-05-19T10:35:46",
    "slug": "una-palabra-cada-dia",
    "title": {
      "rendered": "“Una palabra cada día”"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 2: “UNA PALABRA CADA DÍA”</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Entrena el hábito de chequear cómo te sientes cada día con honestidad y respeto, creando una relación más amable contigo.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>2–3 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 2: “UNA PALABRA CADA DÍA” Objetivo: Entrena el hábito de chequear cómo te sientes cada día con honestidad y respeto, creando una relación más amable contigo. Duración: 2–3 min</p>\n"
    },
    "categories": [
      13
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Comprenderme-Mejor-Cada-Dia-scaled.jpeg"
  },
  {
    "id": 134,
    "date": "2024-05-19T10:34:55",
    "slug": "mapa-emocion-necesidad-cuidado",
    "title": {
      "rendered": "Mapa emoción – necesidad – cuidado"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 1: MAPA EMOCIÓN – NECESIDAD – CUIDADO</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Traduce una emoción en una necesidad, y luego, transforma esa necesidad en una acción real que te cuide.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>5-10 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 1: MAPA EMOCIÓN – NECESIDAD – CUIDADO Objetivo: Traduce una emoción en una necesidad, y luego, transforma esa necesidad en una acción real que te cuide. Duración: 5-10 min</p>\n"
    },
    "categories": [
      13
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Comprenderme-Mejor-Cada-Dia-scaled.jpeg"
  },
  {
    "id": 133,
    "date": "2024-05-19T10:34:25",
    "slug": "carta-desde-la-emocion",
    "title": {
      "rendered": "Carta desde la emoción"
    },
    "content": {
      "rendered": "\n<p><strong>EJERCICIO 2: CARTA DESDE LA EMOCIÓN</strong></p>\n\n\n\n<p><strong>Objetivo:</strong></p>\n\n\n\n<p>Permite que tu emoción se exprese sin juicio, con honestidad, como si fuera una voz interior que quiere cuidarte, no herirte.</p>\n\n\n\n<p><strong>Duración:</strong></p>\n\n\n\n<p>10 min</p>\n"
    },
    "excerpt": {
      "rendered": "<p>EJERCICIO 2: CARTA DESDE LA EMOCIÓN Objetivo: Permite que tu emoción se exprese sin juicio, con honestidad, como si fuera una voz interior que quiere cuidarte, no herirte. Duración: 10 min</p>\n"
    },
    "categories": [
      13
    ],
    "featured_media_url": "https://workwellfut.hl1450.dinaserver.com/wp-content/uploads/2025/09/Comprenderme-Mejor-Cada-Dia-scaled.jpeg"
  }
];

// --- Helper Functions ---

// Gets all categories that have at least one post
export function getResourcesCategories(): WpCategory[] {
  const postCounts: Record<number, number> = {};
  postsData.forEach(post => {
    post.categories.forEach(catId => {
      postCounts[catId] = (postCounts[catId] || 0) + 1;
    });
  });

  return categoriesData.filter(cat => postCounts[cat.id] > 0).map(cat => ({
      ...cat,
      count: postCounts[cat.id] || 0
  }));
}

// Gets all posts for a given category slug
export function getPostsByCategorySlug(slug: string): { posts: WpPost[], name: string } {
  const category = categoriesData.find(cat => cat.slug === slug);
  if (!category) {
    return { posts: [], name: '' };
  }
  const posts = postsData.filter(post => post.categories.includes(category.id));
  return { posts, name: category.name };
}

// Gets a single post by its slug
export function getPostBySlug(slug: string): WpPost | undefined {
  return postsData.find(post => post.slug === slug);
}

// Gets all post slugs for generateStaticParams
export function getAllPostSlugs(): { slug: string }[] {
    return postsData.map(post => ({ slug: post.slug }));
}

// Gets all category slugs for generateStaticParams
export function getAllCategorySlugs(): { slug: string }[] {
    const categoriesWithPosts = getResourcesCategories();
    return categoriesWithPosts.map(category => ({ slug: category.slug }));
}
