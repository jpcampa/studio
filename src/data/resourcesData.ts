
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
  },
  {
    id: 'res5',
    title: 'No estás rota, solo cansada de fingir que puedes con todo',
    type: 'article',
    category: 'Bienestar Emocional',
    summary: 'Autoexigencia, perfeccionismo y desconexión emocional: las cicatrices invisibles del cansancio que no se nota, pero pesa.',
    content: `A veces no es tristeza, ni apatía, ni depresión. Es fatiga emocional acumulada. Es ese tipo de cansancio profundo que aparece cuando has sostenido demasiado sin darte el permiso de soltar. Cuando has sido fuerte por fuera... pero te has ido desgastando por dentro.\n\nY no, no es flojera, ni falta de actitud. Es el resultado de vivir en modo alerta, de dar mucho y recibir poco, de intentar hacerlo todo bien. De exigirte incluso cuando no puedes más. Si te suena familiar, esto también es para ti.\n\n**La fatiga emocional no es debilidad. Es saturación.**\n\nEs un estado de agotamiento físico y mental producido por el esfuerzo prolongado de sostener emociones intensas: las propias… o las de los demás. Escuchar, cuidar, contener, resolver… día tras día. Esa sobrecarga silenciosa, muchas veces invisible, puede llevar al cuerpo y al cerebro a funcionar en modo supervivencia. Se activa el sistema límbico (emoción), y la corteza prefrontal (razón) se agota. El resultado: irritabilidad, desconexión, confusión mental, hipersensibilidad… o bloqueo.\n\nEn estudios recientes sobre burnout emocional (Figley, 2002; Maslach & Leiter, 2016), se ha demostrado que el impacto del estrés empático sostenido puede ser tan debilitante como el estrés físico crónico. Es lo que también se conoce como fatiga por compasión.\n\n**¿Y si no es que no puedes más… sino que llevas demasiado solo/a?**\n\nMuchos de estos patrones no nacen de la nada. Se forman con el tiempo, con historias personales que enseñaron que ser valiente es no pedir ayuda, que ser responsable es no fallar, que ser buena persona es no poner límites. Y así, muchas personas terminan atrapadas en un ciclo de autoexigencia crónica, sin margen para la ternura hacia sí mismas.\nQuienes viven con estos niveles de exigencia suelen tener pensamientos como:\n\n- “Todo depende de mí”\n- “No puedo equivocarme”\n- “Si no lo hago perfecto, no vale”\n\nEste estilo de pensamiento activa de forma constante el sistema de estrés, genera una vigilancia permanente, disminuye el descanso y erosiona la autoestima (Beck, 2005; Young et al., 2003).\n\n**El perfeccionismo no te protege: te drena.**\n\nContrario a lo que muchas veces creemos, el perfeccionismo no es una virtud elevada, sino una forma de miedo muy bien disfrazada. Miedo al juicio, al error, a no ser suficiente.\nMantenerse en ese estado de evaluación constante, sin pausas ni refuerzos positivos, produce una tensión interna que a la larga se traduce en agotamiento psicológico. Un tipo de malestar que impacta en la salud, las relaciones y la capacidad de disfrutar.\n\n**¿Y la desconexión emocional? Es una defensa... que se vuelve prisión.**\n\nCuando llevas mucho tiempo conteniendo el dolor, es probable que empieces a desconectarte de lo que sientes. No porque no te importe, sino porque te ha dolido demasiado. Es un mecanismo de supervivencia: el cuerpo aprende a protegerse cerrando el acceso a emociones que duelen. Pero al hacerlo, también cierra el acceso a la ternura, al disfrute, al deseo.\nEsto se conoce como desconexión emocional funcional: se evita el contacto con las sensaciones internas por miedo a lo que puedan despertar. Pero evitar lo que sentimos no lo elimina: lo cronifica. A largo plazo, esta evitación está relacionada con mayor ansiedad, somatización y patrones de evitación interpersonal (Hayes et al., 1996; Linehan, 1993).\n\n**CIERRE:**\n\nSi todo esto te suena… no estás sola, ni solo. No estás rota ni roto.\nSolo estás agotado o agotada de aguantar tanto en silencio. Y eso también merece compasión.\nRevisar tu exigencia, recuperar tu ternura y darte el permiso de sentir, sin juicio, no es rendirse.\nEs el primer paso para cuidarte desde un lugar más sano, humano y sostenible.`,
    estimatedTime: '8 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'emotional fatigue burnout'
  }
];
