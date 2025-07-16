import type { Path } from '../pathsData';

export const stressManagementPath: Path = {
  id: 'gestion-estres',
  title: 'Gestionar el Estrés con Conciencia',
  description: 'El estrés no es tu enemigo, es una señal que merece ser escuchada. En esta ruta aprenderás a reconocer cómo se activa en ti, regularlo con técnicas efectivas y responder con más calma y conciencia.',
  dataAiHint: 'stress management mindfulness',
  modules: [
    {
      id: 'estres_sem1',
      title: 'Semana 1: Comprende el Estrés y Cómo te Afecta',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: 'Esta semana vas a descubrir qué es realmente el estrés, por qué no es tu enemigo y cómo se manifiesta en ti. El objetivo es que empieces a escucharlo sin miedo y comprendas que es una señal valiosa: algo en tu vida necesita atención, cuidado o un cambio.' },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'paragraph', text: '¿Alguna vez has sentido que no llegas a todo, que te desbordas, que tu cuerpo va por un lado y tu cabeza por otro?\nEso que sientes tiene nombre: estrés. Y aunque solemos verlo como el enemigo, en realidad es un sistema que intenta ayudarte. Es una respuesta natural del cuerpo y la mente cuando percibimos que lo que se nos pide es más de lo que creemos poder dar.' },
        {
          type: 'collapsible',
          title: '¿Qué es el estrés?',
          content: [
            { type: 'paragraph', text: 'El estrés aparece cuando sentimos que las demandas del entorno —una tarea urgente, una discusión, un cambio inesperado— superan nuestros recursos. No es simplemente estar nervioso o tener prisa: es un conjunto de reacciones físicas, emocionales y mentales que se activan para intentar protegernos.\nAntiguamente, esta respuesta tenía mucho sentido. Si aparecía un depredador, el cuerpo se preparaba para luchar o huir: el corazón se aceleraba, los músculos se tensaban, el cerebro entraba en alerta. Hoy en día, nuestros “depredadores” son emails urgentes, facturas, críticas o nuestra propia autoexigencia. Y el cuerpo, que no distingue entre un tigre y una reunión complicada, reacciona igual.\nDesde la neurociencia sabemos que cuando estamos estresados, se activa un sistema de emergencia en el cerebro. Se liberan hormonas como la adrenalina y el cortisol, que nos preparan para actuar rápido. Esto puede ayudarnos en momentos puntuales, pero si se mantiene en el tiempo, empieza a desgastarnos: fatiga, insomnio, irritabilidad, dificultad para concentrarnos… Suena familiar, ¿verdad?' },
          ],
        },
        {
            type: 'collapsible',
            title: 'No todas las personas viven el estrés igual',
            content: [
              { type: 'paragraph', text: 'Lo que para una persona puede ser un reto motivador, para otra puede ser una amenaza angustiante. Esto depende de nuestras experiencias, nuestra forma de pensar y nuestra manera de ver el mundo. Si llevas unas “gafas” mentales teñidas por la autoexigencia, la anticipación del fracaso o el miedo a decepcionar, es más probable que sientas muchas situaciones como amenazantes.\nPor eso es tan importante empezar por entender cómo funciona el estrés en ti.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'Tipos de estrés',
            content: [
                { type: 'list', items: [
                    'Estrés agudo: aparece de forma puntual, como antes de un examen o tras una discusión. Puede ser útil si te moviliza.',
                    'Estrés crónico: se mantiene en el tiempo y agota tus recursos, como cuando lidias con una carga laboral constante o preocupaciones familiares continuas.',
                    'Eustrés: es el “estrés bueno”, el que te activa y motiva, como antes de una entrevista importante.',
                    'Distrés: es el que te desborda, te bloquea o te enferma.',
                ]},
                { type: 'paragraph', text: 'No todo el estrés es negativo. Lo que marca la diferencia es la duración, la intensidad y la sensación de control que tienes sobre lo que ocurre.'}
            ],
        },
        {
            type: 'collapsible',
            title: 'Tus “mínimos no negociables”',
            content: [
              { type: 'paragraph', text: 'Cuando el estrés aparece, lo primero que solemos dejar de lado son las cosas que más nos sostienen: dormir bien, comer con calma, movernos, hablar con alguien que nos escucha.\nEstas pequeñas acciones no son lujos, son necesidades básicas. Las llamamos “mínimos no negociables” porque son el suelo emocional sobre el que puedes caminar cada día. Si los abandonas, el estrés encuentra terreno fértil para crecer.\nDormir entre 7 y 8 horas, moverte al menos 15 minutos al día, comer con conciencia, tener pausas reales de desconexión y mantener vínculos afectivos de calidad… son tu mejor red de protección.' },
            ],
        },
        { type: 'quote', text: 'Tu cuerpo no está en tu contra. Te está hablando. La clave está en aprender a escucharlo con compasión.' },
        { type: 'title', text: 'Técnicas Específicas' },
        {
            type: 'exercise',
            title: 'Ejercicio 1: Mapa del Estrés Personal',
            objective: 'Con este ejercicio empezarás a reconocer cómo se manifiesta el estrés en ti. Al explorar tus pensamientos, emociones, sensaciones físicas y comportamientos cuando te sientes bajo presión, podrás comprender mejor lo que te ocurre y dar los primeros pasos para recuperar el equilibrio y sentirte más en calma.',
            duration: '5 a 10 minutos',
            content: [
                { type: 'paragraph', text: 'Piensa en una situación reciente que te haya generado estrés. Luego, completa paso a paso este registro guiado. Te acompañaré con preguntas breves para que puedas ir registrando lo que viviste.'}
            ]
        },
        {
            type: 'exercise',
            title: 'Ejercicio 2: Identifica tu disparador',
            objective: 'Aprender a diferenciar si lo que te está generando estrés viene del entorno (externo) o de ti mismo/a (interno), para empezar a responder con conciencia en lugar de reaccionar en automático.',
            duration: '5 a 8 minutos',
            content: [
                { type: 'paragraph', text: 'Cuando sientes que todo te supera, es fácil pensar que lo que te estresa está fuera de ti. Pero muchas veces, lo que más influye es lo que ocurre en tu interior. Por eso, aprender a diferenciar entre lo que pasa fuera (el estresor) y lo que sientes por dentro (la respuesta de estrés) es un paso clave para recuperar el control.'}
            ]
        },
        {
            type: 'title',
            text: 'Resumen Clave de la Semana 1'
        },
        {
            type: 'list',
            items: [
                'El estrés es una respuesta natural del cuerpo, no un enemigo.',
                'Cada persona vive el estrés de forma distinta, según sus pensamientos, historia y entorno.',
                'Existen diferentes tipos de estrés: agudo, crónico, positivo (eustrés) y negativo (distrés).',
                'El estrés prolongado puede afectar tu cuerpo, tus emociones, tu mente y tus relaciones.',
                'Tus hábitos básicos (dormir, comer, moverte, conectar) son esenciales para regularte.',
                'Observar qué te estresa y cómo reaccionas te ayuda a responder con mayor claridad.',
                'Aprender a distinguir entre lo externo y lo interno te devuelve el poder sobre ti.',
            ]
        }
      ],
    },
    // Weeks 2, 3, and 4 would be added here in a similar structure.
  ],
};
