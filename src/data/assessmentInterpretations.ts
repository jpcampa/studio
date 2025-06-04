
// @fileOverview Contiene los textos de feedback interpretativo para cada dimensión de la evaluación.

import type { AssessmentDimension } from './assessmentDimensions'; // Para usar los IDs

export interface InterpretationLevels {
  low: string;
  medium: string;
  high: string;
  veryHigh?: string;
}

export const assessmentInterpretations: Record<AssessmentDimension['id'], InterpretationLevels> = {
  'dim1': { // Calma en la Tormenta
    low: "Puntuación Baja: Puede que te sientas fácilmente sobrepasado/a por el estrés o las emociones intensas. Es posible que experimentes altibajos emocionales frecuentes y que te cueste mantener la calma en momentos difíciles. Esto no significa debilidad: indica una sensibilidad emocional profunda que, bien canalizada, puede transformarse en fortaleza. Reconocer estas emociones es el primer paso para desarrollar herramientas de autorregulación.",
    medium: "Puntuación Media: En general, manejas bien tus emociones, aunque en situaciones de mucha presión puedes perder el equilibrio. Tienes recursos internos valiosos que te permiten volver a tu centro, aunque quizá puedas fortalecer aún más tu capacidad de regularte de forma consciente y sostenida.",
    high: "Puntuación Alta: Tienes una gran capacidad para gestionar tus emociones, incluso bajo presión. Sueles mantener la claridad mental en momentos de tensión y eres percibido/a como una persona estable y confiable. Es importante, sin embargo, no minimizar las emociones de los demás ni las propias cuando surgen con fuerza: mantener la apertura también es una forma de fortaleza.",
    veryHigh: "Muy alta (4.8–5.0): Una regulación emocional muy elevada podría llevarte a controlar en exceso tus emociones, reprimiendo necesidades auténticas o evitando mostrar vulnerabilidad. Recuerda que sentir y expresarte libremente también es parte de una salud emocional equilibrada."
  },
  'dim2': { // Mente Abierta, Cambio Ágil
    low: "Puntuación Baja: Tiendes a mantenerte en lo familiar y a resistir el cambio. Esto puede darte estabilidad, pero también limitar tus posibilidades de crecimiento o innovación. Quizá sientas inseguridad ante lo nuevo o diferentes formas de pensar. Cultivar la curiosidad y permitirte explorar fuera de tu zona de confort puede abrir nuevas puertas personales y profesionales.",
    medium: "Puntuación Media: Tienes una disposición equilibrada ante el cambio. Puedes adaptarte si es necesario, aunque a veces lo haces con cierto esfuerzo o duda. Te atraen las ideas nuevas, pero también valoras la estructura. Estás en un punto donde, con pequeños gestos, podrías expandir aún más tu creatividad y flexibilidad.",
    high: "Puntuación Alta: Tu mente es abierta, curiosa y dispuesta al cambio. Te entusiasma aprender, probar cosas nuevas y cuestionarte a ti mismo/a. Este rasgo es clave para tu crecimiento continuo. Solo recuerda que, en algunos momentos, también puede ser útil mantener la estabilidad y el enfoque para sostener lo que construyes.",
    veryHigh: "Muy alta (4.8-5.0): Una apertura excesiva puede llevarte a dispersarte, saltar de idea en idea sin consolidar aprendizajes o compromisos. Valora cuándo seguir explorando y cuándo sostener lo que ya funciona en tu vida."
  },
  'dim3': { // Foco y Constancia
    low: "Puntuación Baja: Puede que te cueste organizarte, mantener la disciplina o sostener hábitos a lo largo del tiempo. Tal vez pospongas tareas importantes o sientas que te falta motivación para completar lo que empiezas. Trabajar en tu estructura interna no es perder libertad, sino crear las condiciones para vivir con más propósito y serenidad.",
    medium: "Puntuación Media: En general, eres una persona responsable y constante, aunque puedes tener altibajos. Hay momentos en los que logras mantener el foco con firmeza, y otros en los que pierdes ritmo o claridad. Pequeños ajustes pueden ayudarte a consolidar tu organización sin caer en rigidez.",
    high: "Puntuación Alta: Eres muy constante, comprometido/a y disciplinado/a. Cumples tus responsabilidades con eficacia y te organizas de forma eficiente. Esto es una gran fortaleza, aunque conviene que no caigas en la autoexigencia excesiva o en la sobrecarga por querer abarcarlo todo. Recuerda que descansar también es parte del compromiso contigo mismo/a.",
    veryHigh: "Muy alta (4.8-5.0): Una disciplina demasiado rígida puede hacerte inflexible o llevarte al agotamiento. Aprender a pausar, delegar o flexibilizar planes también es un signo de madurez."
  },
  'dim4': { // Voz Propia
    low: "Puntuación Baja: Es posible que te cueste expresar tus opiniones o necesidades, especialmente si temes molestar o ser juzgado/a. Este patrón puede protegerte del conflicto, pero también generar frustración o invisibilidad. Recuperar tu voz no significa ser duro, sino aprender a honrar tus límites y deseos con amabilidad.",
    medium: "Puntuación Media: Sueles expresarte con claridad en muchas situaciones, aunque a veces prefieres evitar el conflicto o cedes más de lo que te gustaría. Con pequeños pasos, podrías fortalecer tu asertividad y desarrollar una comunicación aún más auténtica y respetuosa.",
    high: "Puntuación Alta: Tienes una presencia clara y firme. Expresas tus ideas con seguridad y sabes defender tus derechos sin agredir. Esta capacidad es esencial para relaciones equilibradas y una vida coherente. Solo recuerda mantener siempre el canal abierto a la escucha empática.",
    veryHigh: "Muy alta (4.8-5.0): Una afirmación personal constante puede, en algunos casos, derivar en rigidez, falta de escucha o conflicto innecesario. Reforzar la empatía y la capacidad de diálogo equilibran esta fuerza."
  },
  'dim5': { // Puentes que Conectan
    low: "Puntuación Baja: Tal vez te resulte difícil conectar con las emociones de los demás o mostrar interés por su experiencia interna. Esto no significa que no te importen, sino que podrías estar más centrado/a en tus propios procesos o protegiéndote del dolor ajeno. Cultivar la empatía puede enriquecer profundamente tus vínculos y tu bienestar.",
    medium: "Puntuación Media: Tienes una buena disposición hacia la conexión emocional, aunque puede que no siempre te resulte natural o fluida. A veces priorizas tus propias necesidades, y en otras logras abrirte al mundo emocional de quienes te rodean. Estás en camino de fortalecer aún más tu capacidad de empatía.",
    high: "Puntuación Alta: Tu capacidad de empatía es notable. Lees con facilidad las emociones de los demás y sueles actuar con compasión y sensibilidad. Esta fortaleza te convierte en una figura valiosa para tu entorno. Cuida también de ti: dar mucho a veces implica aprender a recibir o poner límites.",
    veryHigh: "Muy alta (4.8-5.0): Tu nivel de empatía podría llevarte a sobreimplicarte en las emociones de otros, descuidando tus propios límites. Cuidar tu energía emocional es esencial para sostener tu capacidad de conexión."
  },
  'dim6': { // Espejo Interior
    low: "Puntuación Baja: Puede que te cueste comprender tus emociones, pensamientos o patrones de comportamiento. Esto no te hace menos válido/a: simplemente indica que podrías beneficiarte de dedicar más espacio a la reflexión interna. El autoconocimiento es un camino, y cualquier paso que des hacia ti es valioso.",
    medium: "Puntuación Media: Tienes una conciencia moderada sobre ti mismo/a. Reconoces ciertas emociones y comportamientos, aunque en algunos momentos puedas sentirte confundido/a o sorprendido/a por tus propias reacciones. Estás en un punto fértil para profundizar en tu mundo interno con curiosidad y sin juicio.",
    high: "Puntuación Alta: Eres una persona muy consciente de tu mundo interno. Sueles identificar tus emociones, necesidades y motivaciones con claridad. Esta claridad te permite tomar decisiones más alineadas contigo mismo/a. Solo cuida de no caer en el sobreanálisis o en una autocrítica excesiva: el insight también necesita ternura.",
    veryHigh: "Muy alta (4.8-5.0): Una introspección excesiva puede hacerte caer en el sobreanálisis o la autocrítica paralizante. Confiar en tus decisiones sin buscar siempre entenderlo todo también forma parte del crecimiento."
  },
  'dim7': { // Norte Vital
    low: "Puntuación Baja: Es posible que sientas una falta de dirección clara en tu vida o que te cueste identificar tus metas personales y profesionales. Esto no implica ausencia de valor, sino la necesidad de reconectar con lo que da sentido a tu existencia. Darse permiso para explorar es un gran primer paso hacia el propósito.",
    medium: "Puntuación Media: Tienes una orientación vital moderadamente definida. Sabes hacia dónde quieres ir, aunque a veces surgen dudas o momentos de desconexión. Con algo más de claridad o compromiso con tus valores, podrías fortalecer el rumbo que estás construyendo.",
    high: "Puntuación Alta: Tienes una visión clara de lo que te importa y hacia dónde te diriges. Tus decisiones suelen estar alineadas con tus valores, lo que te aporta motivación y coherencia interna. Cuida de mantener esa conexión viva sin caer en la rigidez o el exceso de autoexigencia.",
    veryHigh: "Muy alta (4.8-5.0): Una orientación demasiado rígida al propósito puede generar frustración si las cosas no salen como esperas. Dejar espacio a lo inesperado puede enriquecer incluso tus planes más claros."
  },
  'dim8': { // Fortaleza Activa
    low: "Puntuación Baja: Puedes sentirte paralizado/a o desbordado/a cuando enfrentas problemas. Tal vez te cuesta encontrar herramientas para actuar con determinación o confianza en medio de las dificultades. Desarrollar estrategias de afrontamiento conscientes puede ayudarte a tomar el control con más seguridad.",
    medium: "Puntuación Medio: Sueles afrontar las situaciones con actitud constructiva, aunque en momentos de alta presión puedes sentirte inseguro/a. Estás en buen camino: con más consciencia de tus recursos internos, podrías ampliar aún más tu resiliencia y capacidad de acción.",
    high: "Puntuación Alta: Tienes una actitud activa y flexible frente a los desafíos. Buscas soluciones y te adaptas con agilidad. Esta fortaleza es clave en contextos complejos o inciertos. Solo recuerda que también está bien pedir ayuda o reconocer tus emociones cuando las cosas se ponen cuesta arriba.",
    veryHigh: "Muy alta (4.8-5.0): Estar siempre en modo solución o acción puede hacer que reprimas emociones o señales de agotamiento. Reconocer tu vulnerabilidad y descansar también es una forma de fortaleza."
  },
  'dim9': { // Brújula Ética
    low: "Puntuación Baja: Puedes tener tendencia a actuar según lo que resulta más conveniente, dejando en segundo plano tus valores o principios. Esto no significa que carezcas de ética, sino que podrías beneficiarte de revisar si tus acciones están realmente alineadas con lo que valoras. Conectar con tu integridad puede aportar paz y dirección.",
    medium: "Puntuación Media: En la mayoría de los casos, actúas con coherencia ética, aunque en ciertas situaciones puedas sentirte en conflicto entre lo que es correcto y lo que es práctico. Con algo más de claridad sobre tus principios, puedes reforzar tu capacidad de actuar con integridad.",
    high: "Puntuación Alta: Actúas con gran compromiso ético y congruencia entre lo que piensas, sientes y haces. Eres una persona confiable y consciente del impacto de tus decisiones. Mantener esta brújula activa te convierte en una influencia positiva para quienes te rodean.",
    veryHigh: "Muy alta (4.8-5.0): Tu alto estándar ético puede llevarte a exigirte demasiado o a juzgar con dureza a quienes no comparten tus valores. Practicar la compasión hacia ti y hacia los demás es clave para un equilibrio ético saludable."
  },
  'dim10': { // Raíz Propia
    low: "Puntuación Baja: Tal vez te resulte difícil asumir tu parte de responsabilidad en las situaciones que vives. Puede que sientas que las cosas te suceden sin poder hacer mucho al respecto. Aprender a reconocer tu influencia en lo que atraviesas puede empoderarte para transformar desde dentro.",
    medium: "Puntuación Media: Sueles asumir responsabilidad en tus circunstancias, aunque a veces te cuesta aceptar del todo las consecuencias de tus actos o revisar tu parte en los problemas. Estás desarrollando una mirada honesta que, con más profundidad, puede darte aún más libertad para actuar.",
    high: "Puntuación Alta: Asumes con madurez tu parte en lo que vives, sin caer en la culpa ni en la justificación. Reconoces tu capacidad de transformación y practicas la aceptación como base para avanzar. Este rasgo es clave para el crecimiento personal y profesional. Cultívalo como una fuerza interna que te sostiene.",
    veryHigh: "Muy alta (4.8-5.0): Asumir siempre la responsabilidad puede llevarte a cargar con lo que no te corresponde. Distinguir entre lo que es tuyo y lo que no lo es te dará más libertad interior."
  },
  'dim11': { // Red de Apoyo Consciente
    low: "Puntuación Baja: Puede que sientas que no cuentas con el apoyo suficiente en tu entorno, ya sea personal o profesional. Esta percepción puede aumentar el estrés y la sensación de carga emocional. A veces, también puede reflejar una dificultad para pedir ayuda o abrirte emocionalmente. Fortalecer vínculos y practicar la receptividad puede marcar una gran diferencia.",
    medium: "Puntuación Media: Percibes una red de apoyo moderadamente presente. En general, sabes que puedes contar con algunas personas, aunque quizá no siempre sientas que tienes respaldo emocional o profesional constante. Identificar, cuidar y ampliar tu red puede ayudarte a sentirte más acompañado/a y sostenido/a.",
    high: "Puntuación Alta: Sientes que cuentas con un entorno que te apoya, te escucha y te respalda tanto en lo personal como en lo profesional. Esta percepción es una base sólida para tu bienestar emocional. Mantener esos vínculos con conciencia y gratitud refuerza tu resiliencia.",
    veryHigh: "Muy alta (4.8-5.0): Esta fuerte percepción de apoyo puede volverse una dependencia si no va acompañada de autonomía emocional. Es importante que, además de apoyarte en otros, sigas fortaleciendo tu capacidad de sostenerte internamente."
  },
  'dim12': { // Valor Reconocido
    low: "Puntuación Baja: Es posible que sientas que tu trabajo no está siendo suficientemente valorado o reconocido. Esta sensación puede afectar tu motivación, confianza y conexión con el equipo. Reflexionar sobre lo que necesitas expresar o cambiar y buscar formas de visibilizar tu impacto puede ayudarte a transformar esta experiencia.",
    medium: "Puntuación Media: A veces te sientes valorado/a y respetado/a en tu entorno laboral, aunque no siempre de manera constante o clara. Puedes encontrar oportunidades para expresar tus logros con mayor seguridad y comunicar tus necesidades de reconocimiento con apertura y respeto.",
    high: "Puntuación Alta: Sientes que tu trabajo es tenido en cuenta, respetado y valorado. Esto refuerza tu motivación, compromiso y bienestar en el ámbito profesional. Aprovecha esta fortaleza para cultivar una cultura de reconocimiento mutuo y potenciar la colaboración en tu entorno laboral.",
    veryHigh: "Muy alta (4.8-5.0): Si bien el reconocimiento te impulsa, podrías correr el riesgo de depender excesivamente de la validación externa. Cultivar el reconocimiento interno puede equilibrar tu motivación y reforzar tu autovalía más allá de las opiniones ajenas."
  }
};

    