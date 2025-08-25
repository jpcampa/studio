
import type { Path } from '../pathsData';

export const supportNetworkPath: Path = {
  id: 'confiar-en-mi-red',
  title: 'Confiar en mi Red y Dejarme Sostener',
  description: 'Aprende a detectar apoyos nutritivos, pedir ayuda sin culpa y construir vínculos que te sostengan de verdad.',
  dataAiHint: 'support network friends community',
  modules: [
    {
      id: 'apoyo_sem1',
      title: 'Semana 1: ¿Cómo vivo el Pedir Ayuda?',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Cuántas veces has pensado “mejor no digo nada, no quiero molestar”? Esta semana vamos a romper con esa idea. Pedir ayuda no te resta valor, te humaniza. Descubrirás por qué a veces nos cuesta tanto pedir y cómo esos miedos nacen de creencias aprendidas (como “si pido, soy una carga”). Juntos/as vamos a darle la vuelta: aprenderás a ver el apoyo como un recurso legítimo y valioso.' },
        { type: 'title', text: 'Psicoeducación' },
        {
            type: 'collapsible',
            title: 'El mito de “Yo puedo siempre con todo”',
            content: [{ type: 'paragraph', text: 'Desde pequeños, a veces escuchamos frases como “tienes que ser fuerte”. Esto puede llevarnos a creer que necesitar a los demás es ser débil. La verdadera fortaleza está en saber cuándo avanzar por ti mismo/a y cuándo es momento de dejarte ayudar.' }]
        },
        {
            type: 'collapsible',
            title: '“Mejor no molestar” o el miedo a ser una carga',
            content: [{ type: 'paragraph', text: 'Muchas personas evitan pedir ayuda por miedo a incomodar, creyendo que su necesidad es un peso para el otro. Este patrón nace de experiencias pasadas donde mostrar necesidad tuvo un coste (críticas, rechazo). No molestar no siempre es cuidar la relación; a veces es limitar su profundidad.' }]
        },
        {
            type: 'collapsible',
            title: '“Ya me las apañaré” o la evitación de la vulnerabilidad',
            content: [{ type: 'paragraph', text: 'Rechazar ayuda por sistema puede llevar a la soledad no deseada. Nuestro cerebro social está diseñado para beneficiarse de la cooperación: aceptar apoyo activa redes neuronales que reducen la percepción de amenaza y favorecen la resiliencia.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
            type: 'supportMapExercise',
            title: 'EJERCICIO1: MAPA DE RELACIONES Y APOYO',
            objective: 'Visualiza de forma clara tu red de apoyo y reflexiona sobre cómo te relacionas con las personas que la forman.',
            duration: '10-15 min',
        },
        {
            type: 'blockingThoughtsExercise',
            title: 'EJERCICIO 2: REGISTRO DE PENSAMIENTOS BLOQUEANTES AL PEDIR AYUDA',
            objective: 'Aprende a detectar y reformular los pensamientos que te frenan al pedir ayuda.',
            duration: '8-12 min',
        },
      ]
    },
    {
      id: 'apoyo_sem2',
      title: 'Semana 2: Identifica Apoyos Reales y Nutritivos',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: 'No todas las personas que “ayudan” lo hacen de forma que te fortalece. Esta semana aprenderás a reconocer esas diferencias y a identificar tus relaciones nutritivas. Piensa en ello como elegir alimentos: algunos te nutren, otros solo te llenan… o incluso te hacen daño.' },
        { type: 'title', text: 'Psicoeducación' },
        {
            type: 'collapsible',
            title: 'Tres caras del apoyo: dependencia, exigencia y acompañamiento',
            content: [{ type: 'paragraph', text: '1. Dependencia patológica: Creer que sin el otro no puedes afrontar nada.\n2. Exigencia: Se basa en “deberías” y “tienes que”, a veces con chantaje emocional.\n3. Acompañamiento genuino: Respeto, escucha y validación que impulsa a crecer.' }]
        },
        {
            type: 'collapsible',
            title: 'Señales de un vínculo nutritivo',
            content: [{ type: 'list', items: ['Puedes mostrarte como eres, sin miedo a ser juzgado/a.', 'Hay empatía y validación emocional.', 'El apoyo fluye en ambas direcciones.', 'Respetan tus decisiones.'] }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
            type: 'nutritiveDrainingSupportMapExercise',
            title: 'EJERCICIO 1: MAPA DE APOYOS NUTRITIVOS Y DRENANTES',
            objective: 'Dibuja un mapa claro de quiénes en tu vida te suman y quiénes te restan, para que puedas cuidar mejor tu energía emocional.',
            duration: '10-15 min',
        },
        {
            type: 'nourishingConversationExercise',
            title: 'EJERCICIO 2: LA CONVERSACIÓN QUE NUTRE',
            objective: 'Aprende a provocar más momentos de conexión real y profunda usando claves sencillas de escucha, empatía y autenticidad.',
            duration: '15-20 min',
        },
      ]
    },
    {
      id: 'apoyo_sem3',
      title: 'Semana 3: Aprende a Pedir sin Culpa',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraph', text: 'Pedir no es suplicar ni imponer, es comunicar lo que necesitas de forma sencilla y respetuosa. Esta semana entrenaremos cómo hacerlo: qué decir, cómo decirlo y en qué momento. Descubrirás que cuando pides con claridad, das a la otra persona la oportunidad de decidir libremente.' },
        { type: 'title', text: 'Psicoeducación' },
        {
            type: 'collapsible',
            title: 'Necesidad legítima ≠ deuda emocional',
            content: [{ type: 'paragraph', text: 'Necesitar algo no significa que tengas que devolverlo multiplicado por diez. Pedir ayuda no es como pedir un préstamo: es compartir una necesidad para que otro pueda decidir si quiere y puede apoyarte.' }]
        },
        {
            type: 'collapsible',
            title: 'El mito de “puedo con todo”',
            content: [{ type: 'paragraph', text: 'Vivir bajo la idea de la autosuficiencia total puede dejarte agotado y aislado. Recibir ayuda no te quita valor, te conecta con lo que eres: una persona capaz… y también parte de una red de cuidado.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
            type: 'clearRequestMapExercise',
            title: 'EJERCICIO 1: EL MAPA DE PETICIONES CLARAS',
            objective: 'Aprende a formular peticiones tan claras que la otra persona sabrá exactamente qué hacer para apoyarte.',
            duration: '10-15 min',
        },
        {
            type: 'supportBankExercise',
            title: 'EJERCICIO 2: EL BANCO DE APOYOS',
            objective: 'Crea tu propio mapa de apoyos para saber a quién pedir ayuda según el momento y la necesidad.',
            duration: '15-20 min',
        },
      ]
    },
    {
        id: 'apoyo_sem4',
        title: 'Semana 4: Construye tu Red con Conciencia y Cuidado Mutuo',
        type: 'summary',
        estimatedTime: '15-20 min',
        content: [
            { type: 'paragraph', text: 'Las redes de apoyo no se improvisan: se cultivan con gestos pequeños y constantes. Esta semana trabajaremos cómo fortalecer vínculos desde la conciencia, el respeto y la reciprocidad. Diseñarás tu propio “círculo de sostén” y un plan simple para mantenerlo vivo.' },
            { type: 'title', text: 'Psicoeducación' },
            {
                type: 'collapsible',
                title: 'Estar para otros sin perderte',
                content: [{ type: 'paragraph', text: 'Acompañar a alguien no significa desdibujarte. Si siempre estás disponible para todos, pero nunca para ti, tu energía se vacía. El cuidado genuino nace de cuidarte primero.' }]
            },
            {
                type: 'collapsible',
                title: 'Reciprocidad y cuidado mutuo',
                content: [{ type: 'paragraph', text: 'Dar y recibir son las dos caras de la misma moneda en las relaciones sanas. El equilibrio no significa que las aportaciones sean idénticas, sino que exista la sensación de que ambos están presentes y comprometidos.' }]
            },
            { type: 'title', text: 'Técnicas Específicas' },
            {
                type: 'mutualCareCommitmentExercise',
                title: 'EJERCICIO 1: MI COMPROMISO CON EL CUIDADO MUTUO',
                objective: 'Elige tres acciones concretas para fortalecer las relaciones que te nutren. Son pequeños actos que, repetidos en el tiempo, construyen confianza y conexión.',
                duration: '8-10 min',
            },
            {
                type: 'symbolicSupportCircleExercise',
                title: 'EJERCICIO 2: CÍRCULO DE SOSTÉN SIMBÓLICO',
                objective: 'Crea un símbolo que represente tu red de apoyo, para que puedas acudir a él cuando necesites fuerza o calma.',
                duration: '10-12 min',
            },
            { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Ruta', prompts: ['¿Qué he descubierto sobre quiénes me sostienen?', '¿Cómo ha cambiado mi forma de pedir y recibir apoyo?', '¿Qué compromisos quiero mantener para cuidar mi red?'] },
            { type: 'quote', text: 'Una red de apoyo no se mide por la cantidad de personas, sino por la calidad de los vínculos que te sostienen y te hacen crecer.' },
        ]
    }
  ]
};
