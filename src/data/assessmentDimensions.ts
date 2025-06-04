
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
}

export const assessmentDimensions: AssessmentDimension[] = [
  {
    id: 'dim1',
    name: 'Calma en la Tormenta',
    definition: 'Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.',
    items: [
      { id: 'dim1_item1', text: 'Suelo mantener la calma cuando las cosas se complican.' },
      { id: 'dim1_item2', text: 'Me desbordo fácilmente ante el estrés o la presión.', isInverse: true },
      { id: 'dim1_item3', text: 'Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.' },
      { id: 'dim1_item4', text: 'Las emociones intensas me paralizan o me bloquean.', isInverse: true },
      { id: 'dim1_item5', text: 'Me recupero con rapidez después de una situación emocionalmente intensa.' },
      { id: 'dim1_item6', text: 'Me cuesta manejar los cambios repentinos en mi entorno.', isInverse: true },
    ],
  },
  {
    id: 'dim2',
    name: 'Mente Abierta, Cambio Ágil',
    definition: 'Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.',
    items: [
      { id: 'dim2_item1', text: 'Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.' },
      { id: 'dim2_item2', text: 'Prefiero evitar los cambios y ceñirme a lo conocido.', isInverse: true },
      { id: 'dim2_item3', text: 'Suelo encontrar soluciones creativas cuando algo no sale como esperaba.' },
      { id: 'dim2_item4', text: 'Me incomoda enfrentar ideas diferentes a las mías.', isInverse: true },
      { id: 'dim2_item5', text: 'Disfruto cuestionando mis propias creencias o formas de pensar.' },
      { id: 'dim2_item6', text: 'Me adapto con rapidez cuando las circunstancias cambian.' },
    ],
  },
  {
    id: 'dim3',
    name: 'Foco y Constancia',
    definition: 'Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.',
    items: [
      { id: 'dim3_item1', text: 'Suelo cumplir mis objetivos aunque me cuesten.' },
      { id: 'dim3_item2', text: 'Me resulta difícil seguir una rutina durante mucho tiempo.', isInverse: true },
      { id: 'dim3_item3', text: 'Soy constante con mis compromisos personales y profesionales.' },
      { id: 'dim3_item4', text: 'Dejo tareas sin terminar cuando pierdo la motivación.', isInverse: true },
      { id: 'dim3_item5', text: 'Planifico mis días para aprovechar bien el tiempo.' },
      { id: 'dim3_item6', text: 'Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.', isInverse: true },
    ],
  },
  {
    id: 'dim4',
    name: 'Voz Propia',
    definition: 'Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.',
    items: [
      { id: 'dim4_item1', text: 'Me siento con derecho a expresar lo que necesito, aunque sea incómodo.' },
      { id: 'dim4_item2', text: 'A veces callo lo que pienso por miedo a generar conflicto.', isInverse: true },
      { id: 'dim4_item3', text: 'Soy capaz de defender mi opinión sin imponerla.' },
      { id: 'dim4_item4', text: 'Me cuesta decir "no", incluso cuando lo deseo.', isInverse: true },
      { id: 'dim4_item5', text: 'Disfruto compartiendo mis ideas y escuchando otras con apertura.' },
      { id: 'dim4_item6', text: 'En situaciones difíciles, puedo mantener mi postura con respeto.' },
    ],
  },
  {
    id: 'dim5',
    name: 'Puentes que Conectan',
    definition: 'Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.',
    items: [
      { id: 'dim5_item1', text: 'Me interesa entender cómo se sienten las personas que me rodean.' },
      { id: 'dim5_item2', text: 'A veces actúo sin considerar el impacto emocional que puede tener en otros.', isInverse: true },
      { id: 'dim5_item3', text: 'Suelo conectar fácilmente con las emociones de los demás.' },
      { id: 'dim5_item4', text: 'Me cuesta mostrar comprensión cuando alguien piensa distinto a mí.', isInverse: true },
      { id: 'dim5_item5', text: 'Disfruto ayudando a otros sin esperar nada a cambio.' },
      { id: 'dim5_item6', text: 'Tengo sensibilidad para detectar cuándo alguien necesita apoyo.' },
    ],
  },
  {
    id: 'dim6',
    name: 'Espejo Interior',
    definition: 'Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.',
    items: [
      { id: 'dim6_item1', text: 'Reflexiono con frecuencia sobre lo que siento y por qué.' },
      { id: 'dim6_item2', text: 'A veces reacciono de forma automática y luego no entiendo bien por qué.', isInverse: true },
      { id: 'dim6_item3', text: 'Conozco mis puntos fuertes y también mis áreas a mejorar.' },
      { id: 'dim6_item4', text: 'Me cuesta identificar qué me hace sentir mal en algunas situaciones.', isInverse: true },
      { id: 'dim6_item5', text: 'Estoy aprendiendo a reconocer cómo influyen mis emociones en mis decisiones.' },
      { id: 'dim6_item6', text: 'Comprenderme mejor me ayuda a crecer como persona.' },
    ],
  },
  {
    id: 'dim7',
    name: 'Norte Vital',
    definition: 'Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.',
    items: [
      { id: 'dim7_item1', text: 'Tengo claro qué es importante para mí en la vida.' },
      { id: 'dim7_item2', text: 'A menudo me siento sin rumbo o sin metas claras.', isInverse: true },
      { id: 'dim7_item3', text: 'Tomo decisiones alineadas con mis valores personales.' },
      { id: 'dim7_item4', text: 'Me cuesta mantenerme enfocado/a en lo que quiero lograr.', isInverse: true },
      { id: 'dim7_item5', text: 'Siento que lo que hago tiene sentido y propósito.' },
      { id: 'dim7_item6', text: 'Estoy construyendo un camino que me representa.' },
    ],
  },
  {
    id: 'dim8',
    name: 'Fortaleza Activa',
    definition: 'Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.',
    items: [
      { id: 'dim8_item1', text: 'Cuando tengo un problema, busco cómo solucionarlo sin quedarme estancado/a.' },
      { id: 'dim8_item2', text: 'Suelo evitar los conflictos esperando que se resuelvan solos.', isInverse: true },
      { id: 'dim8_item3', text: 'Me esfuerzo por aprender algo incluso en medio de las crisis.' },
      { id: 'dim8_item4', text: 'Me paralizo cuando algo no sale como esperaba.', isInverse: true },
      { id: 'dim8_item5', text: 'En momentos duros, intento mantener una actitud flexible.' },
      { id: 'dim8_item6', text: 'Me adapto sin perder de vista lo que quiero conseguir.' },
    ],
  },
  {
    id: 'dim9',
    name: 'Brújula Ética',
    definition: 'Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.',
    items: [
      { id: 'dim9_item1', text: 'Intento actuar con integridad, incluso cuando no es lo más fácil.' },
      { id: 'dim9_item2', text: 'A veces adapto mis principios si eso me beneficia personalmente.', isInverse: true },
      { id: 'dim9_item3', text: 'Me importa el impacto de mis acciones en otras personas.' },
      { id: 'dim9_item4', text: 'Me cuesta reconocer cuando me he equivocado éticamente.', isInverse: true },
      { id: 'dim9_item5', text: 'La honestidad guía mis decisiones, también en lo pequeño.' },
      { id: 'dim9_item6', text: 'Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.' },
    ],
  },
  {
    id: 'dim10',
    name: 'Raíz Propia',
    definition: 'Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.',
    items: [
      { id: 'dim10_item1', text: 'Reconozco cuándo he contribuido a que algo no salga como esperaba.' },
      { id: 'dim10_item2', text: 'A veces culpo a factores externos sin revisar mi parte.', isInverse: true },
      { id: 'dim10_item3', text: 'Cuando enfrento una dificultad, me pregunto qué puedo hacer diferente.' },
      { id: 'dim10_item4', text: 'Me cuesta aceptar las consecuencias de mis decisiones.', isInverse: true },
      { id: 'dim10_item5', text: 'Asumo la responsabilidad de mis actos incluso cuando es incómodo.' },
      { id: 'dim10_item6', text: 'Comprender mi parte en lo que vivo me ayuda a crecer.' },
    ],
  },
  {
    id: 'dim11',
    name: 'Red de Apoyo Consciente',
    definition: 'Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.',
    items: [
      { id: 'dim11_item1', text: 'Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.' },
      { id: 'dim11_item2', text: 'En mi entorno laboral, me siento respaldado/a por compañeros y superiores.' },
      { id: 'dim11_item3', text: 'Me cuesta pedir ayuda, incluso cuando la necesito.', isInverse: true },
      { id: 'dim11_item4', text: 'Sé a quién acudir si tengo un problema personal o emocional.' },
      { id: 'dim11_item5', text: 'En el trabajo, a veces siento que estoy solo/a para afrontar los retos.', isInverse: true },
      { id: 'dim11_item6', text: 'Me siento parte de una red de apoyo sólida y accesible.' },
    ],
  },
  {
    id: 'dim12',
    name: 'Valor Reconocido',
    definition: 'Grado en que el individuo siente que su labor, esfuerzo y presencia son valorados y reconocidos por su entorno laboral.',
    items: [
      { id: 'dim12_item1', text: 'En mi trabajo, siento que lo que hago importa.' },
      { id: 'dim12_item2', text: 'A menudo siento que mis logros pasan desapercibidos.', isInverse: true },
      { id: 'dim12_item3', text: 'Me siento respetado/a por quienes trabajan conmigo.' },
      { id: 'dim12_item4', text: 'Percibo que mi opinión es tomada en cuenta en mi equipo.' },
      { id: 'dim12_item5', text: 'A veces siento que podrían reemplazarme y nadie lo notaría.', isInverse: true },
      { id: 'dim12_item6', text: 'Recibo reconocimiento (explícito o implícito) por mi trabajo con regularidad.' },
    ],
  },
];

// Re-export likertOptions from here for consistency, if QuestionnaireForm needs it
export const likertOptions = [
  { value: 1, label: 'Frown', description: 'Totalmente en desacuerdo' },
  { value: 2, label: 'Annoyed', description: 'En desacuerdo' },
  { value: 3, label: 'Meh', description: 'Ni de acuerdo ni en desacuerdo' },
  { value: 4, label: 'Smile', description: 'De acuerdo' },
  { value: 5, label: 'Laugh', description: 'Totalmente de acuerdo' },
];

    