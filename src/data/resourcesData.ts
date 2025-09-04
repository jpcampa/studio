
export type ResourcePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  featured_media_url?: string;
};

export type ResourceCategory = {
    id: string;
    name: string;
    slug: string;
    count: number;
}

export const resourcesData: ResourcePost[] = [
  {
    id: 'post-1',
    slug: 'que-es-la-autoestima',
    title: '¿Qué es la autoestima y cómo influye en tu vida?',
    excerpt: 'La autoestima es el aprecio o consideración que uno tiene de sí mismo. No es un rasgo fijo, sino una valoración que construimos y que influye en nuestras decisiones, relaciones y bienestar emocional. Una autoestima sana no significa ser perfecto, sino tratarse con respeto y compasión.',
    content: `
      <h2>Comprendiendo la Autoestima</h2>
      <p>La autoestima es la valoración que tenemos de nosotros mismos. Abarca todas nuestras creencias, emociones y pensamientos sobre nuestro propio valor. No se trata de sentirse superior a los demás, sino de reconocer nuestro valor intrínseco como seres humanos.</p>
      <h2>Pilares de una Autoestima Sana</h2>
      <ul>
        <li><strong>Autoconocimiento:</strong> Saber quién eres, con tus fortalezas y debilidades.</li>
        <li><strong>Autoaceptación:</strong> Abrazar todas las partes de ti, incluso las que no te gustan.</li>
        <li><strong>Autocuidado:</strong> Proteger tu bienestar físico y emocional.</li>
        <li><strong>Autorrespeto:</strong> Poner límites y no permitir tratos que te dañen.</li>
      </ul>
      <p>Trabajar en la autoestima es un proceso continuo que implica un diálogo interno más amable y acciones coherentes con nuestros valores.</p>
    `,
    date: '2024-05-10T10:00:00Z',
    category: {
      id: 'cat-1',
      name: 'Autoestima',
      slug: 'autoestima',
    },
    featured_media_url: 'https://workwellfut.com/imgapp/600x400/default.png',
  },
  {
    id: 'post-2',
    slug: 'claves-para-gestionar-el-estres',
    title: 'Claves para Gestionar el Estrés Cotidiano',
    excerpt: 'El estrés es una respuesta natural del cuerpo, pero cuando se vuelve crónico, puede afectar nuestra salud. Aprender a identificar los estresores y aplicar técnicas de regulación es fundamental para mantener el equilibrio y el bienestar en el día a día.',
    content: `
      <h2>¿Por Qué Nos Estresamos?</h2>
      <p>El estrés es una reacción fisiológica que nos prepara para afrontar un desafío. El problema surge cuando esta reacción se mantiene en el tiempo sin que haya una amenaza real, agotando nuestros recursos físicos y mentales.</p>
      <h2>Estrategias Efectivas</h2>
      <ol>
        <li><strong>Identifica tus estresores:</strong> ¿Qué situaciones, personas o pensamientos disparan tu estrés?</li>
        <li><strong>Técnicas de relajación:</strong> Practica la respiración profunda, la meditación o el mindfulness para calmar tu sistema nervioso.</li>
        <li><strong>Ejercicio físico:</strong> El movimiento es una de las mejores formas de liberar la tensión acumulada.</li>
        <li><strong>Establece límites:</strong> Aprende a decir "no" para proteger tu tiempo y energía.</li>
      </ol>
      <p>Gestionar el estrés no significa eliminarlo, sino aprender a responder a él de una manera más saludable y consciente.</p>
    `,
    date: '2024-05-12T11:00:00Z',
    category: {
      id: 'cat-2',
      name: 'Estrés',
      slug: 'estres',
    },
    featured_media_url: 'https://workwellfut.com/imgapp/600x400/default.png',
  },
];

// Genera categorías y cuenta los posts para cada una
const categoryCounts = resourcesData.reduce((acc, post) => {
    acc[post.category.id] = (acc[post.category.id] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

export const resourcesCategories: ResourceCategory[] = Object.values(
    resourcesData.reduce((acc, post) => {
        if (!acc[post.category.id]) {
            acc[post.category.id] = {
                id: post.category.id,
                name: post.category.name,
                slug: post.category.slug,
                count: categoryCounts[post.category.id] || 0,
            };
        }
        return acc;
    }, {} as Record<string, ResourceCategory>)
);

export function getPostsByCategory(categorySlug: string): ResourcePost[] {
    return resourcesData.filter(post => post.category.slug === categorySlug);
}

export function getPostBySlug(slug: string): ResourcePost | undefined {
    return resourcesData.find(post => post.slug === slug);
}

export function getAllPostSlugs(): { slug: string }[] {
    return resourcesData.map(post => ({ slug: post.slug }));
}

export function getAllCategorySlugs(): { slug: string }[] {
    return resourcesCategories.map(cat => ({ slug: cat.slug }));
}

export function getCategoryBySlug(slug: string): ResourceCategory | undefined {
    return resourcesCategories.find(cat => cat.slug === slug);
}
