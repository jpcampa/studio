
import type { Path } from '../pathsData';

export const procrastinationPath: Path = {
  id: 'superar-procrastinacion',
  title: 'Superar la Procrastinación y Crear Hábitos',
  description: 'Aprende a desbloquearte, a comenzar sin esperar la motivación perfecta y a sostener lo que empiezas, cultivando una constancia amable y flexible.',
  dataAiHint: 'procrastination habits focus',
  modules: [
    {
      id: 'procrast_sem1',
      title: 'Semana 1: Comprende tu Procrastinación sin Juicio',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Te ha pasado que tienes claro lo que quieres hacer, pero algo dentro de ti te frena una y otra vez? Esta semana te acompaño a entender qué hay realmente detrás de la procrastinación —más allá de la pereza o la falta de voluntad— y cómo tu mente y tu cuerpo intentan protegerte del malestar emocional.\nVamos a observar ese ciclo con más claridad y menos juicio. Descubrirás que postergar no te hace débil, sino humano/a. Y que al comprenderlo, puedes empezar a transformarlo desde un lugar más amable y consciente.' },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'paragraph', text: '¿Te ha pasado que tienes una tarea pendiente —por importante que sea— y acabas haciendo cualquier otra cosa? No es pereza. Es una forma de protegerte de emociones incómodas.\nDesde la TCC, entendemos que la procrastinación es una estrategia de evitación emocional.' },
        {
          type: 'collapsible',
          title: 'Procrastinar no es flojear: es evitar sentir',
          content: [
            { type: 'paragraph', text: 'Muchas personas se juzgan duramente cuando procrastinan. Se dicen cosas como “soy un flojo o una floja”, “no tengo fuerza de voluntad” o “soy un desastre”.\nPero la verdad es que la procrastinación no es pereza: es una forma de protegerte emocionalmente.\nEvitas ciertas tareas porque, aunque sean importantes, despiertan en ti emociones incómodas:\n• Ansiedad (por no saber cómo hacerlo o por todo lo que implica)\n• Miedo al juicio (a fallar, a hacerlo mal, a que no sea suficiente)\n• Inseguridad (dudas sobre si eres capaz)\n• Tristeza o agotamiento emocional\nAl aplazarlas, tu mente siente un alivio momentáneo. Pero ese alivio dura poco, y con el tiempo aparece otra cadena de emociones: culpa, frustración, estrés o baja autoestima.\nNo es que no quieras hacer la tarea. Es que no quieres sentir lo que la tarea despierta.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'El círculo de la procrastinación',
          content: [
            { type: 'paragraph', text: 'Cuando postergas una tarea, tu cerebro experimenta un alivio inmediato. Y eso… le gusta.\nCada vez que evitas algo que te causa malestar, tu cerebro aprende:\n“¡Uy, esto me hizo sentir mejor! Vamos a repetirlo.”\nEste patrón se conoce como refuerzo negativo: no porque sea “malo”, sino porque refuerza una conducta al quitar algo desagradable (la ansiedad, el miedo, la tensión…).\nEs decir: te sientes mejor por evitar… y eso hace que sigas evitando.\nPero a la larga, ese círculo te atrapa:\nEvitas → Te sientes bien un rato → La tarea sigue pendiente → Te sientes peor → Vuelves a evitar…\nEl alivio es real, pero no soluciona el problema. Solo lo posterga… y lo agranda.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'Pensamientos que te bloquean',
          content: [
            { type: 'paragraph', text: 'A menudo no procrastinamos por las tareas en sí, sino por los pensamientos que tenemos sobre ellas. Estos pensamientos actúan como barreras invisibles que paralizan tu acción. A veces son tan automáticos que ni te das cuenta de que te están frenando.\nAquí tienes algunos ejemplos comunes:' },
            { type: 'collapsible', title: '“O lo hago perfecto, o no sirve.”', content: [{ type: 'paragraph', text: 'Este pensamiento es una trampa del perfeccionismo. Te exige un resultado ideal desde el principio, y eso puede hacer que ni siquiera empieces. Si no puedes hacerlo perfecto, tu mente prefiere no hacerlo en absoluto.' }] },
            { type: 'collapsible', title: '“No tengo energía suficiente.”', content: [{ type: 'paragraph', text: 'Cuando anticipas que algo será agotador o difícil, tu cerebro lo evita para protegerte. Pero muchas veces, es el propio bloqueo el que te quita más energía que la acción en sí.' }] },
            { type: 'collapsible', title: '“Seguro que lo haré mal.”', content: [{ type: 'paragraph', text: 'Este pensamiento nace del miedo al error o al juicio. Pero evita que practiques, que aprendas, y que te des permiso para mejorar poco a poco. El error no es enemigo: es parte del camino.' }] },
            { type: 'collapsible', title: '“Ya debería haberlo hecho.”', content: [{ type: 'paragraph', text: 'Este “debería” activa culpa y autoexigencia. Le da al pasado más peso del necesario y te desconecta del presente, que es donde realmente puedes actuar. La culpa no moviliza: paraliza.' }] },
            { type: 'collapsible', title: '“No voy a cambiar nunca.”', content: [{ type: 'paragraph', text: 'Es una idea que nace de la frustración o el agotamiento. Pero ningún cambio verdadero ocurre en línea recta. Cambiar no es no fallar: es volver a intentarlo sin castigarte.' }] },
            { type: 'paragraph', text: 'Estos pensamientos no te definen, ni son verdades absolutas. Solo son ideas que aprendiste… y que puedes aprender a cuestionar.' },
          ],
        },
        {
          type: 'collapsible',
          title: 'No siempre es miedo: a veces es agotamiento',
          content: [
            { type: 'paragraph', text: 'No toda procrastinación nace del miedo. A veces, simplemente estás emocionalmente agotado o agotada.\nTe sientes sin ganas, vacío o vacía por dentro, desconectado o desconectada de lo que antes te importaba.\nY en ese estado, cualquier tarea parece una montaña.\nEste tipo de bloqueo no se resuelve con fuerza de voluntad, ni con frases motivadoras. Se resuelve con descanso real, autocompasión y reconexión emocional.\nNo es que no te importe. Es que estás tan cansado o cansada que ya no puedes demostrar que te importa.\nUna mente saturada y un cuerpo agotado necesitan cuidado, no exigencia.\nA veces la mejor forma de avanzar… es parar con ternura.' },
          ],
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'exercise',
          title: 'Ejercicio 1: Mi Mapa del Bloqueo Personal',
          objective: 'Con este ejercicio vas a descubrir por qué postergas ciertas tareas y qué emociones, pensamientos o situaciones están detrás. Al observarlo con claridad, podrás empezar a desmontarlo con más comprensión y menos culpa.',
          duration: '8 a 12 minutos',
          content: [],
        },
        {
          type: 'exercise',
          title: 'Ejercicio 2: Reflexiona sin Culparte',
          objective: 'Este ejercicio te invita a observar con más comprensión lo que ocurre dentro de ti cuando procrastinas. El objetivo no es encontrar culpables, sino desarrollar una mirada más compasiva que te permita avanzar sin exigencia.',
          duration: '8 a 12 minutos',
          content: [],
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Qué emociones intento evitar cuando postergo?',
            'Lo que siento no me define, pero observarlo me transforma.',
          ]
        },
        { type: 'title', text: 'Resumen Clave de la Semana' },
        { type: 'list', items: [
            'La procrastinación no es pereza: es una forma aprendida de evitar emociones difíciles.',
            'El alivio que sentimos al evitar refuerza el bloqueo, pero es temporal.',
            'Comprender el ciclo sin juicio nos permite empezar a romperlo.',
            'Actuar, aunque sea con un paso pequeño, ya es una forma de transformación.',
            'No se trata de hacerlo perfecto, sino de empezar. Una y otra vez.',
          ] 
        },
        { type: 'quote', text: 'No eres flojo/a. Estás intentando protegerte de algo. Pero puedes elegir responder de otro modo.' },
      ],
    },
    {
      id: 'procrast_sem2',
      title: 'Semana 2: Crea Activación, Aunque Sea Pequeña',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
          { type: 'paragraph', text: '¿Te ha pasado que esperas a sentirte motivado para arrancar, pero la motivación nunca llega? Esta semana te acompaño a darle la vuelta a ese ciclo.\nDescubrirás que no necesitas energía para empezar… sino que empezar es lo que genera energía. Aprenderás a romper el bloqueo con acciones mínimas que activan tu sistema de recompensa, y a planificar sin exigencia desde tu realidad.\nEl primer paso no tiene que ser perfecto. Solo tiene que ser real.'},
          { type: 'title', text: 'Psicoeducación' },
          {
              type: 'collapsible',
              title: 'El mito de la motivación',
              content: [{ type: 'paragraph', text: '¿Alguna vez te has dicho “lo haré cuando me sienta con ganas”? Es una idea muy extendida… pero poco útil. La motivación no siempre aparece antes de actuar. De hecho, casi siempre es al revés: actuar es lo que genera motivación.' }],
          },
          {
              type: 'collapsible',
              title: 'Movimiento primero, motivación después',
              content: [{ type: 'paragraph', text: 'Muchas veces esperamos a sentirnos motivados o motivadas para empezar una tarea. Pero desde la psicología conductual y la neurociencia, sabemos que la motivación no es lo que da lugar al movimiento… es al revés. Cuando realizas una acción, aunque sea muy pequeña, tu cerebro libera dopamina, una sustancia asociada al placer, la activación y el sistema de recompensa. Esa pequeña dosis de "logro" crea una sensación de avance que alimenta tu energía y tu confianza. No esperes a tener ganas para actuar: empieza con un pequeño paso, y las ganas vendrán después.' }],
          },
          {
              type: 'collapsible',
              title: 'Tu cerebro necesita arrancar',
              content: [{ type: 'paragraph', text: 'Imagina que estás en una cuesta arriba con una bicicleta parada. Al principio, moverla parece imposible. Pero si logras impulsarla un poco… empieza a rodar. Tu mente funciona igual. Cuando estás bloqueado o bloqueada, lo difícil no es continuar: lo difícil es arrancar. Y por eso, necesitas un impulso inicial que rompa la inercia. No tienes que tener todo resuelto para empezar. Solo tienes que dar el primer paso.' }],
          },
          {
              type: 'collapsible',
              title: 'Microcomienzos: la clave para romper la inercia',
              content: [
                  { type: 'paragraph', text: 'Un microcomienzo es una acción tan pequeña que no te abruma… pero que activa tu sistema de acción.'},
                  { type: 'list', items: [
                      'En lugar de “hacer ejercicio”, solo ponte las zapatillas.',
                      'En lugar de “limpiar la casa”, solo recoge tres cosas.',
                      'En lugar de “escribir un informe”, solo abre el documento.',
                      'En lugar de “hacer la compra”, solo escribe los tres primeros productos.',
                  ]},
                  { type: 'paragraph', text: 'Esos gestos te sacan del bloqueo. Y si luego sigues, genial. Pero si no lo haces, también está bien: ya rompiste la barrera más difícil. Un microcomienzo no es poco: es el paso que lo cambia todo.'}
              ],
          },
          {
              type: 'collapsible',
              title: 'Cada paso es una prueba de identidad',
              content: [{ type: 'paragraph', text: 'Cada vez que actúas, incluso con un gesto mínimo, le estás enviando un mensaje a tu cerebro: “No soy alguien que siempre procrastina. Soy alguien que hoy ha empezado.” Tu identidad no se construye con grandes logros, sino con pequeñas decisiones repetidas. Y ese mensaje, repetido a lo largo del tiempo, transforma tu autoconcepto. Dejas de verte como alguien bloqueado o bloqueada, y comienzas a sentirte en marcha. Cada paso cuenta. Cada paso te define.' }],
          },
           {
              type: 'collapsible',
              title: 'Planificar con intención (no con presión)',
              content: [
                  { type: 'paragraph', text: 'Planificar no es exigirte más. Es prepararte mejor. Cuando defines con claridad cuándo, dónde y cómo harás una tarea, le das a tu cerebro una señal concreta de acción. Esto se llama intención de implementación, y ha demostrado en estudios que aumenta mucho la probabilidad de cumplir lo que te propones.' },
                  { type: 'paragraph', text: 'Ejemplo: En lugar de decir “tengo que caminar más”, te dices: “Cuando termine de cenar, saldré a caminar 10 minutos alrededor de mi casa.”' },
                  { type: 'list', items: [
                      'Realista, no perfecta.',
                      'Concreta, no ambigua.',
                      'Flexible, no rígida.',
                  ]},
                  { type: 'paragraph', text: 'Planear con ternura también es una forma de cuidarte.' },
              ],
          },
          { type: 'title', text: 'Técnicas Específicas' },
          {
            type: 'exercise',
            title: 'Ejercicio 1: La Regla de los 2 Minutos',
            objective: 'Este ejercicio te ayudará a romper la inercia del bloqueo cuando una tarea te parece demasiado grande o lejana. Al reducirla a una acción de menos de dos minutos, activas tu sistema de recompensa y creas el primer impulso que te saca de la parálisis.',
            duration: '5 a 7 minutos',
            content: [],
          },
          {
            type: 'exercise',
            title: 'Ejercicio 2: Tu Primer Microplan de Acción',
            objective: 'Con este ejercicio vas a crear una pequeña acción concreta para ponerte en marcha. No necesitas fuerza de voluntad infinita, solo claridad. Aprenderás a vincular un gesto sencillo a un momento cotidiano, para que tu cerebro lo reconozca como una señal de empezar.',
            duration: '5 a 8 minutos',
            content: [],
          },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana: Rompe el Ciclo', prompts: [
              'Cada pequeña acción que hiciste esta semana ha sido un paso contra el estancamiento. Este es tu espacio para integrarlo y reconocerte.',
              '¿Qué he podido activar?',
              '¿Cómo me sentí después?',
              '¿Qué descubrí sobre mí?',
              '¿Qué quiero reforzar?',
            ]
          },
          { type: 'title', text: 'Resumen Clave de la Semana' },
          { type: 'list', items: [
              'La motivación no llega antes: llega después de actuar.',
              'Las acciones pequeñas generan impulso real.',
              'Planificar el “cuándo y cómo” activa tu mente para avanzar.',
              'Cada microcomienzo es un voto a favor de tu nueva versión.',
              'Empezar es más poderoso que esperar.',
            ] 
          },
          { type: 'quote', text: 'Avanzar no siempre se nota al instante, pero cada pequeño movimiento te aleja de donde estabas. Hoy te has movido. Y eso ya transforma el camino.' },
      ],
    },
    {
      id: 'procrast_sem3',
      title: 'Semana 3: Desmonta tus Excusas Internas',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
          { type: 'paragraph', text: '¿Te ha pasado que te dices cosas como “ahora no es el momento” o “cuando me sienta mejor lo haré”… y los días siguen pasando? Esta semana te acompaño a detectar esas excusas internas que, sin querer, te mantienen bloqueado o bloqueada. Verás que muchas veces no son la causa real, sino la máscara de emociones más profundas: miedo, perfeccionismo, agotamiento o inseguridad. No vamos a atacarlas, sino a comprenderlas. Y desde ahí, empezar a construir un nuevo diálogo contigo: más realista, más flexible y más compasivo.'},
          { type: 'title', text: 'Psicoeducación' },
          {
            type: 'collapsible',
            title: '¿Por qué postergas, si sabes lo que tienes que hacer?',
            content: [{ type: 'paragraph', text: '¿Te ha pasado que sabes perfectamente lo que “deberías” estar haciendo, pero aun así no te pones con ello? Esa distancia entre lo que quieres hacer y lo que finalmente haces no se debe a falta de voluntad. Muchas veces, en medio de esa brecha hay una voz silenciosa pero poderosa: tu diálogo interno. Frases que parecen lógicas o razonables, pero que en realidad te alejan de tus objetivos. Esta semana vamos a observar con más atención qué te dices por dentro cuando postergas, y a entrenar nuevas formas de responderte con más conciencia y amabilidad.' }],
          },
          {
            type: 'collapsible',
            title: 'No son excusas: son formas de protegerte del malestar',
            content: [{ type: 'paragraph', text: 'Desde la Terapia Cognitivo-Conductual y la neurociencia, sabemos que lo que llamamos “excusas” no son simple pereza o falta de interés. Son mecanismos automáticos que tu mente utiliza para protegerte de emociones incómodas: como la ansiedad, la inseguridad, el miedo a equivocarte o el aburrimiento. Tu mente no trata de boicotearte. En realidad, intenta cuidarte. Pero a veces, ese cuidado malentendido te bloquea, te mantiene en pausa, y te aleja de lo que te hace bien.' }],
          },
          {
            type: 'collapsible',
            title: 'Diálogos internos que te frenan',
            content: [
                { type: 'paragraph', text: 'Estas frases son más comunes de lo que imaginas, y todos o todas las hemos dicho alguna vez:' },
                { type: 'list', items: [
                    '“Estoy demasiado cansado o cansada, lo haré más tarde.”',
                    '“Ahora no es el momento ideal.”',
                    '“Necesito estar más inspirado o inspirada.”',
                    '“¿Y si lo hago mal?”',
                    '“No estoy preparado o preparada.”',
                    '“Para lo que va a servir…”',
                  ] 
                },
                { type: 'paragraph', text: 'Parece que nos dan un respiro... pero nos mantienen atrapados en el mismo lugar.' },
            ],
          },
          {
            type: 'collapsible',
            title: 'Lo que hay detrás de esas frases',
            content: [
              { type: 'paragraph', text: 'Estas frases actúan como máscaras. Detrás de ellas se esconden emociones reales que merecen ser escuchadas:'},
              { type: 'list', items: [
                  'Evitación emocional encubierta: “No me apetece ahora” suele traducirse en ansiedad anticipada, miedo a fallar o sensación de que no podrás con ello.',
                  'Perfeccionismo paralizante: “Tiene que salir perfecto” oculta rigidez mental y temor a no estar a la altura.',
                  'Anticipación catastrofista: “¿Y si me sale mal?” es una señal de que tu sistema de amenaza está hiperactivo, y te bloquea para protegerte.',
                  'Agotamiento emocional: “No estoy para eso ahora” muchas veces refleja tristeza, saturación o desconexión emocional. No es falta de interés: es falta de energía emocional.',
                ]
              },
            ],
          },
          { type: 'title', text: 'Técnicas Específicas' },
          {
            type: 'delSabotajeALaAccionExercise',
            title: 'Ejercicio 1: Del Sabotaje a la Acción',
            objective: 'Este ejercicio te ayuda a identificar las frases internas que alimentan tu procrastinación y a entrenar respuestas más realistas, amables y útiles. No se trata de eliminar tus pensamientos, sino de aprender a responderte con una voz que te acompañe, no que te paralice.',
            duration: '10 a 15 minutos',
          },
          {
            type: 'exercise',
            title: 'Ejercicio 2: Visualización del Yo Futuro',
            objective: 'Este ejercicio te permite conectar con una imagen clara y emocionalmente poderosa de ti misma o de ti mismo sosteniendo el hábito que deseas. Te ayuda a motivarte desde la identidad, no solo desde la obligación. Visualizarte avanzando te impulsa a actuar hoy.',
            duration: '10 a 15 minutos',
            audioUrl: 'https://workwellfut.com/audios/rm/R3_Visualizacion_del_yo_futuro.mp3',
            content: [],
          },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
              '¿Qué frases me sabotean más? ¿Y cómo puedo empezar a responderme con claridad y sin exigencia?',
            ]
          },
          { type: 'title', text: 'Resumen Clave de la Semana' },
          { type: 'list', items: [
                'Muchas excusas internas son formas de evitar emociones difíciles.',
                'Tu diálogo interno no es enemigo: quiere protegerte, pero a veces te bloquea.',
                'Puedes cambiar tu forma de hablarte sin exigirte perfección.',
                'Visualizar tu yo futuro te ayuda a conectar con la versión de ti que ya está avanzando.',
                'Cada vez que te respondes con claridad, estás construyendo una nueva dirección.',
              ] 
          },
          { type: 'quote', text: 'Tú decides a quién escuchar: a tu miedo que evita o a tu voz que avanza.' },
      ],
    },
    {
      id: 'procrast_sem4',
      title: 'Semana 4: Consolida Hábitos que se Adapten a Ti',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
          { type: 'paragraph', text: '¿Te ha pasado que empiezas con fuerza un nuevo hábito, pero al poco tiempo lo dejas? Esta semana te acompaño a consolidar lo que has empezado, sin exigencia y sin rigidez. Vas a aprender a diseñar hábitos que se ajusten a ti —no al revés—, a sostenerlos desde el cuidado y no desde la presión, y a entender que la constancia amable vale más que la perfección. No estás buscando control. Estás construyendo continuidad.'},
          { type: 'title', text: 'Psicoeducación' },
          {
            type: 'collapsible',
            title: 'Un hábito no se impone: se construye',
            content: [{ type: 'paragraph', text: 'Ya diste varios pasos: reconociste bloqueos, te activaste, desarmaste pensamientos saboteadores. Ahora toca consolidar. Y eso no significa forzarte, sino encontrar un ritmo que puedas sostener desde tu realidad.' }],
          },
          {
            type: 'collapsible',
            title: '¿Qué hace que un hábito perdure?',
            content: [
              { type: 'paragraph', text: 'Crear un hábito no es solo repetir una acción. Es diseñarla de forma que tu mente y tu cuerpo puedan sostenerla sin agotamiento ni autoexigencia. Desde la TCC y la psicología del aprendizaje, sabemos que los hábitos más duraderos suelen tener cinco ingredientes clave:'},
              { type: 'collapsible', title: '1. Repetible (aunque no sea diario)', content: [{ type: 'paragraph', text: 'No necesitas hacerlo todos los días. Solo con repetirlo varias veces por semana, tu cerebro empieza a integrarlo como parte de tu vida. Lo importante es la regularidad, no la perfección.' }] },
              { type: 'collapsible', title: '2. Fácil de ejecutar', content: [{ type: 'paragraph', text: 'Cuanto más simple sea la acción, más probable es que la lleves a cabo. Un hábito sencillo es más resistente al cansancio, la pereza o los imprevistos. Ejemplo: En lugar de “meditar 20 minutos”, puedes empezar con “respirar conscientemente 2 minutos al despertar”.' }] },
              { type: 'collapsible', title: '3. Vinculado a una rutina que ya haces', content: [{ type: 'paragraph', text: 'Los hábitos se mantienen mejor si los colocas junto a algo que ya forma parte de tu día. Tu cerebro los asocia y automatiza más rápido. Ejemplo: Después de lavarte los dientes → escribes una frase en tu diario.' }] },
              { type: 'collapsible', title: '4. Refuerza una emoción positiva', content: [{ type: 'paragraph', text: 'Si al hacerlo sientes alivio, claridad o bienestar, será mucho más fácil que quieras repetirlo. No necesitas una gran recompensa. Basta con una sensación pequeña pero significativa. Ejemplo: Sentirte en paz tras escribir, orgulloso u orgullosa después de moverte.' }] },
              { type: 'collapsible', title: '5. Se alinea con tu identidad', content: [{ type: 'paragraph', text: 'Un hábito se consolida cuando no es solo “algo que haces”, sino una forma de ser o cuidarte. Cuando lo sientes como parte de tu manera de vivir, ya no necesitas motivación constante. Ejemplo: “No estoy haciendo yoga... soy alguien que se escucha y se cuida.”' }] },
            ],
          },
          {
            type: 'collapsible',
            title: 'No busques perfección: busca continuidad amable',
            content: [{ type: 'paragraph', text: 'No pasa nada si fallas un día. Lo importante es que vuelvas al hábito sin culpa ni juicio. Como dice James Clear: “No se trata de no romper la cadena. Se trata de no romperla dos veces seguidas.”' }],
          },
          { type: 'title', text: 'Técnicas Específicas' },
          {
            type: 'exercise',
            title: 'Ejercicio 1: Diseña tu Ritual Realista',
            objective: 'Este ejercicio te ayuda a transformar un propósito en una práctica concreta, mínima y sostenible. Crear un ritual no es hacer algo grande, sino algo que puedas mantener en tu contexto real, con tus recursos actuales.',
            duration: '7-10 minutos',
            content: [],
          },
          {
            type: 'exercise',
            title: 'Ejercicio 2: Seguimiento Amable + Refuerzo Visual',
            objective: 'Este ejercicio te permite registrar tus avances sin exigencia, reforzar tu constancia con símbolos positivos y conectar con una sensación de progreso real.',
            duration: '3 a 5 minutos al día',
            content: [],
          },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
              '¿Qué hábito me gustaría mantener a largo plazo?',
              '¿Qué me ha ayudado a mantenerlo?',
              '¿Qué quiero ajustar para que me funcione mejor?',
              '¿Cómo me quiero hablar si un día fallo?',
            ]
          },
           { type: 'title', text: 'Resumen Final de la Ruta' },
          { type: 'list', items: [
              'Procrastinar no es solo “pereza”: suele haber emociones incómodas detrás (miedo, inseguridad, agotamiento).',
              'Activarse no requiere esperar motivación perfecta: el movimiento puede venir primero.',
              'Pensar diferente cambia tu forma de actuar: reestructurar tus creencias te ayuda a desbloquearte.',
              'Un hábito funciona cuando es realista, sencillo, emocionalmente significativo y se adapta a ti.',
              'La constancia amable es más poderosa que la exigencia rígida.',
            ]
          },
          { type: 'quote', text: 'No hace falta que lo hagas todo hoy. Basta con empezar, seguir con suavidad, y volver cada vez que te alejes. Eso… ya es un nuevo camino.' },
      ],
    }
  ],
};
