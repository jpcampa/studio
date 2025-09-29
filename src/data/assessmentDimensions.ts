

export interface AssessmentItem {
  id: string;
  text: string;
  isInverse?: boolean; // Optional: true if a lower score is better for the user
}

export interface AssessmentDimension {
  id: string;
  name: string;
  definition: string;
  items: AssessmentItem[];
  recommendedPathId?: string; // NEW: Explicitly link dimension to a path ID
}

export const assessmentDimensions: AssessmentDimension[] = [
  {
    id: 'dim1',
    name: 'Regulación Emocional y Estrés',
    definition: 'Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.',
    recommendedPathId: 'gestion-estres',
    items: [
      { id: 'dim1_item1', text: 'Suelo mantener la calma cuando las cosas se complican.' },
      { id: 'dim1_item2', text: 'Me desbordo fácilmente ante el estrés o la presión.', isInverse: true },
      { id: 'dim1_item3', text: 'Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.' },
      { id: 'dim1_item4', text: 'Me recupero con rapidez después de una situación emocionalmente intensa.' },
    ],
  },
  {
    id: 'dim2',
    name: 'Flexibilidad Mental y Adaptabilidad',
    definition: 'Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.',
    recommendedPathId: 'tolerar-incertidumbre',
    items: [
      { id: 'dim2_item1', text: 'Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.' },
      { id: 'dim2_item2', text: 'Suelo encontrar soluciones creativas cuando algo no sale como esperaba.' },
      { id: 'dim2_item3', text: 'A menudo cuestiono mis propias creencias o formas de pensar.' },
      { id: 'dim2_item4', text: 'Me adapto con rapidez cuando las circunstancias cambian.' },
    ],
  },
  {
    id: 'dim3',
    name: 'Autorregulación personal y constancia',
    definition: 'Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.',
    recommendedPathId: 'superar-procrastinacion',
    items: [
      { id: 'dim3_item1', text: 'Suelo cumplir mis objetivos, aunque me cuesten.' },
      { id: 'dim3_item2', text: 'Soy constante con mis compromisos personales y profesionales.' },
      { id: 'dim3_item3', text: 'Planifico mis días para aprovechar bien el tiempo.' },
      { id: 'dim3_item4', text: 'Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.', isInverse: true },
    ],
  },
  {
    id: 'dim4',
    name: 'Autoafirmación y Expresión Personal',
    definition: 'Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.',
    recommendedPathId: 'poner-limites',
    items: [
      { id: 'dim4_item1', text: 'Me siento con derecho a expresar lo que necesito, aunque sea incómodo.' },
      { id: 'dim4_item2', text: 'Soy capaz de defender mi opinión sin imponerla.' },
      { id: 'dim4_item3', text: 'Me cuesta decir "no", incluso cuando lo deseo.', isInverse: true },
      { id: 'dim4_item4', text: 'En situaciones difíciles, puedo mantener mi postura con respeto.' },
    ],
  },
  {
    id: 'dim5',
    name: 'Empatía y Conexión Interpersonal',
    definition: 'Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.',
    items: [
      { id: 'dim5_item1', text: 'Me interesa entender cómo se sienten las personas que me rodean.' },
      { id: 'dim5_item2', text: 'A veces actúo sin considerar el impacto emocional que puede tener en otros.', isInverse: true },
      { id: 'dim5_item3', text: 'Suelo conectar fácilmente con las emociones de los demás.' },
      { id: 'dim5_item4', text: 'Tengo sensibilidad para detectar cuándo alguien necesita apoyo.' },
    ],
  },
  {
    id: 'dim6',
    name: 'Insight y Autoconciencia',
    definition: 'Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.',
    items: [
      { id: 'dim6_item1', text: 'Reflexiono con frecuencia sobre lo que siento y por qué.' },
      { id: 'dim6_item2', text: 'Se con claridad quién soy porque conozco mis puntos fuertes y también mis áreas a mejorar.' },
      { id: 'dim6_item3', text: 'Soy consciente de cómo influyen mis emociones en mis decisiones.' },
      { id: 'dim6_item4', text: 'Reconozco cuándo repito patrones que no me benefician y trato de cambiarlos.' },
    ],
  },
  {
    id: 'dim7',
    name: 'Propósito Vital y Dirección Personal',
    definition: 'Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.',
    items: [
      { id: 'dim7_item1', text: 'Tengo claro qué es importante para mí en la vida.' },
      { id: 'dim7_item2', text: 'Tomo decisiones alineadas con mis prioridades y valores personales.' },
      { id: 'dim7_item3', text: 'Siento que lo que hago tiene sentido y propósito.' },
      { id: 'dim7_item4', text: 'Estoy construyendo un camino de vida que me representa.' },
    ],
  },
  {
    id: 'dim8',
    name: 'Estilo de Afrontamiento',
    definition: 'Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.',
    items: [
      { id: 'dim8_item1', text: 'Cuando tengo un problema, rápidamente busco cómo solucionarlo sin quedarme estancado/a.' },
      { id: 'dim8_item2', text: 'Trato de sacar un aprendizaje personal incluso en los momentos más difíciles.' },
      { id: 'dim8_item3', text: 'Frente a la dificultad, trato de mantener la mente abierta y flexible.' },
      { id: 'dim8_item4', text: 'Me adapto sin perder de vista lo que quiero conseguir.' },
    ],
  },
  {
    id: 'dim9',
    name: 'Integridad y Coherencia Ética',
    definition: 'Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.',
    items: [
      { id: 'dim9_item1', text: 'Intento actuar con integridad, incluso cuando no es lo mejor o más fácil.' },
      { id: 'dim9_item2', text: 'Me importa mucho el impacto de mis acciones en otras personas.' },
      { id: 'dim9_item3', text: 'La honestidad guía mis decisiones, también en lo pequeño.' },
      { id: 'dim9_item4', text: 'Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.' },
    ],
  },
  {
    id: 'dim10',
    name: 'Responsabilidad Personal y Aceptación Consciente',
    definition: 'Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.',
    items: [
      { id: 'dim10_item1', text: 'Reflexiono y se reconocer cuándo he contribuido a que algo no salga como esperaba.' },
      { id: 'dim10_item2', text: 'Cuando afronto dificultades, pienso y me pregunto qué puedo hacer diferente.' },
      { id: 'dim10_item3', text: 'Asumo la responsabilidad de mis actos incluso cuando es incómodo.' },
      { id: 'dim10_item4', text: 'Soy consciente del papel que tengo en las situaciones que vivo y eso me permite aprender y crecer.' },
    ],
  },
  {
    id: 'dim11',
    name: 'Apoyo Social Percibido',
    definition: 'Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.',
    items: [
      { id: 'dim11_item1', text: 'Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.' },
      { id: 'dim11_item2', text: 'En mi entorno laboral, me siento respaldado/a por compañeros y superiores.' },
      { id: 'dim11_item3', text: 'Me cuesta pedir ayuda, incluso cuando la necesito.', isInverse: true },
      { id: 'dim11_item4', text: 'Me siento parte de una red de apoyo y sostén emocional sólida y accesible.' },
    ],
  },
];

// Re-export likertOptions from here for consistency, if QuestionnaireForm needs it
export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nada' },
  { value: 2, label: 'Annoyed', description: 'Poco' },
  { value: 3, label: 'Meh', description: 'Moderadamente' },
  { value: 4, label: 'Smile', description: 'Bastante' },
  { value: 5, label: 'Laugh', description: 'Mucho' },
];
