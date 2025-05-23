export type Resource = {
  id: string;
  title: string; // Spanish
  type: 'article' | 'audio' | 'exercise';
  category: string; // Spanish e.g., 'Estrés', 'Autoestima'
  summary: string; // Short summary of the resource
  content?: string; // Full text for article, or description/URL for audio/exercise
  estimatedTime?: string;
  imageUrl?: string; // URL for a relevant image
  dataAiHint?: string;
};

export const resourcesData: Resource[] = [
  {
    id: 'res1',
    title: 'Cómo manejar la autocrítica desde la compasión',
    type: 'article',
    category: 'Autoestima',
    summary: 'Aprende a transformar tu diálogo interno crítico en uno más amable y compasivo.',
    content: 'La autocrítica excesiva puede ser un gran obstáculo para nuestro bienestar emocional. En lugar de motivarnos, a menudo nos paraliza y nos hace sentir peor. Este artículo explora cómo la autocompasión puede ser una herramienta poderosa para cambiar esta dinámica. Hablaremos sobre reconocer los patrones de autocrítica, entender su origen y practicar activamente la amabilidad hacia uno mismo, especialmente en momentos difíciles. Incluye ejercicios prácticos para fomentar un diálogo interno más saludable.',
    estimatedTime: '10 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'self compassion journal'
  },
  {
    id: 'res2',
    title: 'Ejercicio de Respiración para Calmar la Ansiedad',
    type: 'exercise',
    category: 'Estrés',
    summary: 'Una técnica de respiración simple y efectiva para reducir la ansiedad en momentos de tensión.',
    content: 'Este ejercicio de respiración diafragmática te ayudará a activar la respuesta de relajación de tu cuerpo. Sigue estos pasos:\n1. Siéntate o acuéstate en una posición cómoda.\n2. Coloca una mano sobre tu pecho y la otra sobre tu abdomen.\n3. Inhala lentamente por la nariz, sintiendo cómo tu abdomen se expande. El pecho debe moverse mínimamente.\n4. Exhala lentamente por la boca, sintiendo cómo tu abdomen se contrae.\n5. Repite durante 5-10 minutos.',
    estimatedTime: '5 min',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'breathing exercise calm'
  },
  {
    id: 'res3',
    title: 'Audio: Visualización Guiada para el Descanso',
    type: 'audio',
    category: 'Sueño y descanso',
    summary: 'Un audio para ayudarte a relajar cuerpo y mente antes de dormir.',
    content: 'https://placehold.co/128x128.png/B39DDB/FFFFFF?text=Audio', // Placeholder image for audio
    estimatedTime: '15 min',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'sleep meditation audio'
  },
  {
    id: 'res4',
    title: 'La Importancia de Establecer Límites Saludables',
    type: 'article',
    category: 'Relaciones Sociales',
    summary: 'Descubre por qué establecer límites es crucial para tu bienestar y cómo hacerlo de manera efectiva.',
    content: 'Establecer límites saludables es esencial para mantener relaciones equilibradas y proteger tu energía emocional. Este artículo explora los diferentes tipos de límites (físicos, emocionales, mentales), las señales de que podrías necesitar establecerlos y estrategias prácticas para comunicarlos de forma asertiva y respetuosa. Aprender a decir "no" cuando es necesario es un acto de autocuidado.',
    estimatedTime: '12 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'healthy boundaries communication'
  }
];
