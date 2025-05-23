
export type PathModule = {
  id: string;
  title: string; // Spanish
  type: 'text' | 'audio' | 'reflection';
  content: string; // For text: URL to PDF; for reflection: prompt text; for audio: URL to audio placeholder/file
  estimatedTime?: string; // e.g., "5 min", "10 min"
  dataAiHint?: string; // For images related to audio/reflection if any
};

export type Path = {
  id: string;
  title: string; // Spanish
  description: string; // Spanish
  modules: PathModule[];
  dataAiHint?: string;
};

const examplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const pathsData: Path[] = [
  {
    id: 'autoestima',
    title: 'Fortalecer la Autoestima',
    description: 'Un camino para construir una relación más positiva y compasiva contigo mismo/a.',
    dataAiHint: 'self esteem empowerment',
    modules: [
      { 
        id: 'autoestima_m1', 
        title: 'Introducción a la Autoestima', 
        type: 'text', 
        content: examplePdfUrl, // Ahora es una URL de PDF
        estimatedTime: '5 min lectura',
      },
      { 
        id: 'autoestima_m2', 
        title: 'Audio: Meditación de Autoaceptación', 
        type: 'audio', 
        content: 'https://placehold.co/128x128.png/64B5F6/FFFFFF?text=Audio', 
        estimatedTime: '10 min',
        dataAiHint: 'meditation audio',
      },
      { 
        id: 'autoestima_m3', 
        title: 'Reflexión: Mis Fortalezas', 
        type: 'reflection', 
        content: 'Dedica unos minutos a pensar y escribir sobre tres cualidades o fortalezas que posees. ¿Cómo te han ayudado en el pasado? ¿Cómo puedes utilizarlas más en tu día a día?',
        estimatedTime: '15 min',
        dataAiHint: 'journal reflection',
      },
    ],
  },
  {
    id: 'estres',
    title: 'Manejo del Estrés',
    description: 'Aprende técnicas y estrategias para afrontar el estrés cotidiano y cultivar la calma interior.',
    dataAiHint: 'stress management calm',
    modules: [
      { 
        id: 'estres_m1', 
        title: 'Entendiendo el Estrés', 
        type: 'text', 
        content: examplePdfUrl, // Ahora es una URL de PDF
        estimatedTime: '7 min lectura' 
      },
      { 
        id: 'estres_m2', 
        title: 'Audio: Respiración Consciente', 
        type: 'audio', 
        content: 'https://placehold.co/128x128.png/64B5F6/FFFFFF?text=Audio',
        estimatedTime: '8 min',
        dataAiHint: 'breathing exercise',
      },
      { 
        id: 'estres_m3', 
        title: 'Reflexión: Estrategias de Afrontamiento', 
        type: 'reflection', 
        content: '¿Cuáles son tus estrategias actuales para manejar el estrés? ¿Son efectivas? Anota al menos una nueva técnica que te gustaría probar esta semana.',
        estimatedTime: '12 min',
        dataAiHint: 'coping strategies',
      },
    ],
  },
   {
    id: 'sueno',
    title: 'Mejorar el Descanso y Sueño',
    description: 'Descubre hábitos y técnicas para lograr un sueño reparador y mejorar tu energía.',
    dataAiHint: 'sleep improvement rest',
    modules: [
      { 
        id: 'sueno_m1', 
        title: 'La Importancia del Sueño', 
        type: 'text', 
        content: examplePdfUrl, // Ahora es una URL de PDF
        estimatedTime: '6 min lectura' 
      },
      { 
        id: 'sueno_m2', 
        title: 'Audio: Relajación para Dormir', 
        type: 'audio', 
        content: 'https://placehold.co/128x128.png/64B5F6/FFFFFF?text=Audio',
        estimatedTime: '12 min',
        dataAiHint: 'sleep meditation',
      },
      { 
        id: 'sueno_m3', 
        title: 'Reflexión: Higiene del Sueño', 
        type: 'reflection', 
        content: 'Revisa tus hábitos antes de dormir. ¿Hay algo que podrías cambiar para favorecer un mejor descanso? Establece un pequeño objetivo para esta semana.',
        estimatedTime: '10 min',
        dataAiHint: 'sleep hygiene journal',
      },
    ],
  }
];
