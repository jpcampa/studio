
import type { Path } from '../pathsData';

export const wellbeingPath: Path = {
  id: 'volver-a-sentirse-bien',
  title: 'Volver a lo que me hace sentir bien',
  description: 'Reconecta con tus fuentes de bienestar, recupera rutinas que te sostienen y aprende a activar tu motivación incluso en los días más grises.',
  dataAiHint: 'wellbeing motivation energy',
  modules: [
    {
      id: 'bienestar_sem1',
      title: 'Semana 1: Reconecta con tus Fuentes de Bienestar',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        {
          type: 'paragraph',
          text: 'El ánimo bajo se alimenta de un círculo difícil: haces menos cosas que disfrutas → recibes menos placer → tu ánimo baja más. En esta primera semana aprenderás a romper ese ciclo recordando qué cosas, personas y lugares te recargan. Crearás tu propio mapa de gratificación emocional y empezarás a observar qué te da energía y qué te la quita en tu día a día. Así tendrás un punto de partida claro: saber a qué recurrir cuando tu batería se queda en rojo.',
        },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Cuando tu batería se queda en rojo',
          content: [
            { type: 'paragraph', text: '¿Has tenido días en los que te sientes como un móvil con la batería al 5%? No importa cuánto descanses, parece que nada te recarga del todo. Estar bajo de ánimo es parecido: tu energía física, mental y emocional se apagan un poco. Lo que antes te motivaba ahora cuesta más, y hasta las cosas simples pueden parecer un esfuerzo enorme. Esta semana vamos a explorar cómo recargar esa batería sin depender de chispazos momentáneos, sino construyendo energía que dure.' },
          ],
        },
        {
            type: 'collapsible',
            title: 'No todo malestar es igual: tristeza, ánimo bajo y depresión',
            content: [
              { type: 'paragraph', text: 'Imagina tres intensidades de “nubes” que pueden tapar tu cielo:\n• ☁ Tristeza: nube pasajera, suele aparecer tras una pérdida o decepción. Se disipa con el tiempo o con apoyo.\n• 🌥 Estado de ánimo bajo: nubosidad persistente; no hay tormenta, pero el sol apenas asoma. Hay apatía, baja energía y menos disfrute.\n• 🌩 Depresión: tormenta prolongada e intensa; afecta a tu forma de pensar, sentir y actuar, e interfiere en tu vida diaria. Requiere intervención profesional.\nEn esta ruta trabajaremos el estado de ánimo bajo, esa fase intermedia que muchas veces pasa desapercibida… pero que, si la cuidamos, podemos revertir antes de que se intensifique.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'De dónde viene el estado de ánimo bajo',
            content: [
              { type: 'paragraph', text: 'El ánimo no baja “porque sí”. Suele ser el resultado de varios hilos que se entrelazan:\n• Eventos de vida y estrés: pérdidas, cambios importantes, problemas continuos.\n• Manera de pensar: creencias aprendidas y patrones de pensamiento que amplifican lo negativo y minimizan lo positivo.\n• Relaciones: entornos críticos, poco apoyo o vínculos que drenan tu energía.\n• Factores biológicos: cambios en neurotransmisores como la serotonina o la dopamina, que afectan tu motivación y capacidad de disfrutar.\n• Hábitos y estilo de vida: falta de sueño, poca actividad física, alimentación desequilibrada.\nAdemás, el estado de ánimo bajo se alimenta de un doble vacío:\n• La sensación de poco dominio sobre tu vida: cuando sientes que no puedes influir en lo que pasa, tu motivación se apaga.\n• La falta de gratificaciones reales: cuando apenas hay momentos de disfrute o satisfacción, el cerebro recibe pocas señales de “esto vale la pena repetirlo”, y se instala la apatía.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'Qué ocurre en tu cuerpo y tu mente',
            content: [
              { type: 'paragraph', text: 'Cuando el ánimo baja, no es solo cuestión de “pensar positivo”.\n• Tu cerebro emocional (amígdala) envía señales de alerta constantes, activando tensión y cansancio.\n• Tu cerebro pensante (corteza prefrontal) pierde un poco de claridad y energía para planificar o decidir.\n• Tus músculos, tu respiración y tu postura cambian, enviando mensajes silenciosos de que “todo pesa más”.\nSegún la neurociencia afectiva, estos cambios forman un bucle: menos energía → menos acción → menos placer → más ánimo bajo.\nPara romperlo, necesitamos entender de dónde viene nuestra energía vital y cómo mantenerla.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'La energía vital: mucho más que no estar cansado/a',
            content: [
                { type: 'paragraph', text: 'Piensa en tu energía como en un fuego:\n• Se alimenta de combustible físico (descanso, alimentación, movimiento).\n• Necesita chispa emocional (momentos que te hagan sentir vivo/a).\n• Y se mantiene con aire mental (propósitos, curiosidad, retos alcanzables).\nSin alguno de estos elementos, la llama se reduce y el ánimo baja.\nIncluso acciones de solo 10 minutos —como salir a la luz natural o tener una conversación agradable— pueden avivar ese fuego.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El espejismo de la gratificación inmediata',
            content: [
                { type: 'paragraph', text: 'Cuando la batería está baja, buscamos enchufes rápidos: comer algo dulce, mirar redes, ver series sin parar…\nEsto es gratificación inmediata: placer rápido, pero que dura lo que un sorbo de café en un día frío.\nEl bienestar sostenido, en cambio, es como encender una estufa que mantiene el calor mucho después: caminar, retomar un hobby, hablar con alguien que te importa.\nComo recuerda la Terapia Cognitivo-Conductual, las acciones que más levantan el ánimo suelen ser las que menos apetece hacer al principio.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Tu cerebro también busca recompensas',
            content: [
                { type: 'paragraph', text: 'Dentro de tu cabeza hay un sistema de recompensa que se activa no solo cuando consigues algo, sino también cuando lo anticipas.\n• Dopamina: la chispa que te mueve a actuar.\n• Núcleo accumbens: el radar de lo que puede hacerte sentir bien.\n• Corteza prefrontal: la que decide si vas hacia lo que de verdad importa o hacia lo que solo alivia un rato.\nCuando eliges conscientemente actividades con sentido, entrenas a tu cerebro para pedir más de eso.\nY ese es el camino para reconectar con lo que antes te hacía bien.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Por qué reconectar con lo que te hacía bien es clave',
            content: [
                { type: 'paragraph', text: 'El estado de ánimo bajo te empuja a hacer menos → recibes menos placer → el ánimo baja más.\nRomper ese círculo no siempre empieza con ganas; muchas veces empieza con acción consciente:\n• Retomar algo que antes disfrutabas.\n• Probar una versión más pequeña de una actividad que te gustaba.\n• Buscar compañía que te aporte calma o risa.\n“No esperes a tener ganas para empezar; empieza, y las ganas llegarán después.” — Principio de activación conductual.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Empezar por las actividades: un primer paso probado por la ciencia',
            content: [
                { type: 'paragraph', text: 'Cuando el ánimo está bajo, la mente suele decir: “No tengo fuerzas, primero necesito sentirme mejor para hacer cosas”.\nLa investigación en Terapia Cognitivo-Conductual muestra justo lo contrario: empezar a hacer cosas que te aportan placer o logro es uno de los primeros pasos más efectivos para mejorar el estado de ánimo, incluso en depresión.\nEs como encender una luz tenue en una habitación oscura: al principio no ilumina todo, pero te permite moverte, encontrar otros interruptores y, poco a poco, llenar la habitación de claridad.'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'emotionalGratificationMapExercise',
          title: 'EJERCICIO 1: MAPA DE GRATIFICACIÓN EMOCIONAL',
          objective: 'Este ejercicio te ayudará a reconectar con esas fuentes de bienestar: actividades, personas o lugares que, en algún momento de tu vida, te han hecho sentir bien. Al recordarlos y registrarlos, tendrás un mapa personal al que acudir cuando necesites recargar energía emocional.',
          duration: '7-10 min',
        },
        {
          type: 'dailyEnergyCheckExercise',
          title: 'EJERCICIO 2: MINI-CHECK DE ENERGÍA DIARIA',
          objective: 'Este ejercicio te ayudará a identificar qué actividades, personas y entornos recargan tu batería y cuáles la gastan más rápido, para que puedas elegir más de lo que te suma y reducir lo que te drena.',
          duration: '3-5 min',
        },
        {
          type: 'therapeuticNotebookReflection',
          title: 'Reflexión Final de la Semana',
          prompts: [
            '¿Qué he descubierto sobre mis niveles de energía y cómo suelo hacerme cargo de ellos?',
            '¿Hubo algo que me sorprendiera al observar mi energía día a día?',
            '¿Qué cosas identifiqué como “drenaje” y cómo puedo reducir su impacto?',
            'Si tuviera que elegir una sola acción para mantener mi energía la próxima semana, ¿cuál sería?',
            '¿Cómo puedo recordarme a mí mismo/a que no tengo que esperar a tener ganas para empezar a cuidarme?',
          ],
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'list',
          items: [
            'El estado de ánimo bajo no es debilidad ni pereza: es un conjunto de factores físicos, emocionales y mentales que podemos aprender a cuidar.',
            'Nuestra energía vital necesita tres ingredientes: combustible físico, chispa emocional y aire mental.',
            'Las gratificaciones rápidas (como redes, azúcar o maratones de series) alivian a corto plazo, pero no recargan a largo plazo.',
            'Reconectar con lo que antes nos hacía bien es una de las formas más potentes de romper el ciclo de ánimo bajo.',
            'Planificar y hacer actividades gratificantes, aunque no haya ganas al principio, es una estrategia validada por la ciencia para recuperar el ánimo.',
          ],
        },
        { type: 'quote', text: '“Cada paso que das para cuidar tu energía es una inversión en tu bienestar. No importa si es grande o pequeño: lo importante es que sigues encendiendo tu propia luz.”' },
      ],
    },
    {
      id: 'bienestar_sem2',
      title: 'Semana 2: Recupera Rutinas que te Nutran',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
         { type: 'paragraph', text: 'Cuando estamos bajos de ánimo, lo primero que suele romperse es lo más básico: dormir bien, comer con calma, mover el cuerpo. Esto aumenta el malestar y nos deja más vulnerables. Esta semana aprenderás a reinstalar pequeños rituales de cuidado —microhábitos físicos, emocionales y mentales— que actúan como anclas en tu día. No se trata de hacer todo perfecto, sino de tener gestos breves, amables y repetidos que te devuelvan estabilidad y energía.'},
         { type: 'title', text: 'Psicoeducación' },
         {
             type: 'collapsible',
             title: 'Rutinas que son anclas',
             content: [
                 {type: 'paragraph', text: 'Las rutinas saludables no son simples tareas repetidas: son anclas emocionales que estabilizan tu día, regulan tu estado de ánimo y alimentan tu motivación. Desde la neurociencia del estrés sabemos que cuando cuidas lo básico —alimentación, descanso y movimiento— tu sistema nervioso interpreta que estás a salvo, lo que reduce la sobreactivación de la amígdala (la “alarma” emocional) y te ayuda a pensar con más claridad.'}
             ]
         },
         {
            type: 'collapsible',
            title: 'El papel de las rutinas en tu equilibrio emocional',
            content: [
                {type: 'paragraph', text: 'Recuperar rutinas que te nutren no solo mejora tu energía física: fortalece tu estabilidad emocional. Las acciones que repites cada día actúan como un hilo conductor que te ayuda a mantener el rumbo incluso cuando hay turbulencias. Cuando estás en tus rutinas de cuidado: pones nombre a lo que sientes, aceptas sin juicio y eliges cómo responder. Esto te da más claridad y paz mental.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'La fuerza de los pequeños pasos',
            content: [
                {type: 'paragraph', text: 'La Terapia Cognitivo-Conductual y la psicología del hábito coinciden: no necesitas un cambio radical para notar mejoras. Los pequeños pasos tienen un efecto acumulativo enorme. Gestos como moverte 10 minutos al día, preparar un desayuno nutritivo o reservar un rato para algo que disfrutas, aunque parezcan mínimos, generan una sensación de logro que alimenta tu motivación. En palabras de BJ Fogg, experto en hábitos, “el cambio se crea sintiéndote bien con lo que haces, no castigándote por lo que no haces”.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Rutina rígida vs. ritual de cuidado',
            content: [
                {type: 'paragraph', text: 'No todas las rutinas son iguales: algunas se vuelven rígidas y limitantes, mientras que otras actúan como un refugio flexible que te recarga.\n• Rutina rígida disfuncional → Inflexible, vivida como obligación, genera ansiedad ante cambios.\n• Ritual de cuidado → Intencional, flexible y enfocado en tu bienestar, adaptable a tus circunstancias.\nUn ritual de cuidado no depende de que todo vaya bien para existir. Según la neurociencia del hábito, la flexibilidad y la asociación con emociones positivas aumentan la probabilidad de mantenerlo en el tiempo.'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'dailyWellbeingPlanExercise',
          title: 'EJERCICIO 1: MI PLAN DIARIO DE BIENESTAR: 3 MICROHÁBITOS CLAVE',
          objective: 'Este ejercicio te ayudará a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles, para que actúen como anclas que sostengan tu bienestar.',
          duration: '6-8 min',
        },
        {
          type: 'morningRitualExercise',
          title: 'EJERCICIO 2: MI RITUAL DE INICIO: UNA MAÑANA AMABLE Y CONSCIENTE',
          objective: 'Tus primeras acciones al despertar marcan el tono de todo lo que viene después. En este ejercicio vas a diseñar una rutina inicial breve que te permita aterrizar en tu día con presencia y equilibrio.',
          duration: '8-10 min',
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            'En tu experiencia pasada, ¿qué papel crees que han jugado los hábitos en tu bienestar físico, emocional y mental?',
            'Cuando tus hábitos se debilitan o desaparecen, ¿cómo sueles reaccionar y qué podrías hacer para asumir un papel más activo en recuperarlos?',
            '¿Qué microhábitos o rituales has puesto en marcha y cómo te han hecho sentir?',
            '¿Cómo cambia tu ánimo y tu energía cuando cuidas lo básico de tu cuerpo, tus emociones y tu mente?',
          ]
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'list',
          items: [
            'Tus rutinas son anclas emocionales que estabilizan tu día y te ayudan a pensar con más claridad.',
            'Cuidar lo básico (descanso, alimentación, movimiento) reduce la activación del sistema de alarma y mejora tu regulación emocional.',
            'Los microhábitos pequeños y realistas tienen un efecto acumulativo enorme en tu bienestar y motivación.',
            'La diferencia entre rutina rígida y ritual de cuidado está en la flexibilidad y la conexión con tu bienestar.',
            'Un buen inicio de día (mañana amable) actúa como chispa que enciende tu energía y tu foco para el resto de la jornada.',
          ],
        },
        { type: 'quote', text: '“El cuidado de ti no depende de grandes gestos, sino de los pequeños actos que repites con intención, incluso en los días más difíciles.”' },
      ],
    },
     {
      id: 'bienestar_sem3',
      title: 'Semana 3: Reactiva la Motivación Bloqueada',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
         { type: 'paragraph', text: 'Uno de los síntomas más comunes del ánimo bajo es la falta de ganas. Sabes lo que deberías hacer, pero el impulso no llega. La clave está en no esperar a tener ganas para empezar: muchas veces, la motivación aparece después de la acción. Esta semana entrenarás cómo dar el primer paso incluso sin motivación, conectando cada acción con tus valores y con la vida que quieres construir.'},
         { type: 'title', text: 'Psicoeducación' },
         {
             type: 'collapsible',
             title: 'La motivación: algo más que ganas',
             content: [
                 {type: 'paragraph', text: 'La motivación es ese empujón interno que nos mueve a hacer cosas que nos acercan a lo que nos hace bien. Puede nacer de un deseo de cambiar cómo nos sentimos, de una emoción que nos impulsa o de la anticipación de una recompensa. No solemos buscar la acción por sí misma, sino la sensación que creemos que nos dará.'}
             ]
         },
        {
            type: 'collapsible',
            title: 'Por qué a veces las ganas no llegan',
            content: [
                {type: 'paragraph', text: 'En etapas de ánimo bajo, es común perder la motivación positiva. Esto puede deberse a pensamientos que desaniman (“es inútil intentarlo”), cansancio, perfeccionismo o falta de conexión emocional con la tarea. Estos bloqueos pueden sentirse como un muro, pero se pueden transformar.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Del “tengo que” al “quiero elegir”',
            content: [
                {type: 'paragraph', text: 'La forma en la que te hablas cambia cómo percibes una tarea. “Tengo que” suena a obligación y activa resistencia. “Quiero” o “elijo” conecta con lo que valoras y despierta motivación propia. Este cambio no es solo de palabras: modifica cómo el cerebro procesa la tarea, activando zonas de sentido y recompensa.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'El círculo de la activación',
            content: [
                {type: 'paragraph', text: 'La acción y la motivación se alimentan mutuamente: si no haces nada, tienes menos satisfacción y menos ganas. Si das un paso, por pequeño que sea, generas una sensación de logro que te impulsa a seguir. Este es el núcleo de la “activación conductual”: romper el ciclo de la inacción con gestos pequeños.'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'motivationIn3LayersExercise',
          title: 'EJERCICIO 1: MOTIVACIÓN EN 3 CAPAS',
          objective: 'Con este ejercicio vas a descubrir las tres capas que dan fuerza a la motivación: lo que haces, por qué lo haces y para qué mayor lo haces. Al completarla, tendrás un recordatorio claro que te ayudará a empezar incluso en días de poca energía.',
          duration: '7 min',
        },
        {
          type: 'visualizeDayExercise',
          title: 'EJERCICIO 2: VISUALIZACIÓN DEL DÍA QUE QUIERO VIVIR',
          objective: 'Con este ejercicio vas a diseñar mentalmente el día que quieres vivir, conectándolo con sensaciones y comportamientos que te acerquen a tu mejor versión. Al practicarlo, tu mente y tu cuerpo se preparan para vivir lo que has imaginado.',
          duration: '5-7 min',
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Qué has descubierto sobre la motivación y las ganas esta semana?',
            '¿Qué ejercicio o técnica te resultó más útil para activar tus ganas cuando estabas bloqueado/a?',
            '¿Cómo ha cambiado tu forma de ver la motivación tras trabajar con las tres capas (acción–valor–sentido)?',
          ]
        },
        { type: 'title', text: 'Resumen Clave' },
        {
          type: 'list',
          items: [
            'La motivación no siempre precede a la acción; a menudo aparece después de dar el primer paso.',
            'Cambiar el “tengo que” por “quiero” o “elijo” aumenta la motivación propia.',
            'Conectar cada acción con un valor personal y un sentido mayor le da profundidad y dirección.',
            'La activación conductual rompe el ciclo de la inacción con gestos pequeños y fáciles.',
            'La visualización del día ideal prepara tu mente y tu cuerpo para actuar de forma coherente con tu intención.',
          ],
        },
        { type: 'quote', text: '“Las ganas pueden tardar en llegar, pero si das el primer paso, siempre sabrán encontrarte.”' },
      ],
    },
     {
      id: 'bienestar_sem4',
      title: 'Semana 4: Crea tu Reserva Emocional Positiva',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
         { type: 'paragraph', text: 'El ánimo bajo reduce los momentos agradables y aumenta la presencia de lo negativo. Para equilibrar la balanza, necesitas crear tu propia mochila de recursos positivos: recuerdos, hábitos, apoyos y actitudes que te sostengan en los días grises. Esta semana aprenderás a entrenar tu mente para capturar lo bueno, revivir recuerdos positivos y diseñar un botiquín emocional con recursos listos para usar cuando lo necesites.'},
         { type: 'title', text: 'Psicoeducación' },
         {
            type: 'collapsible',
            title: 'Qué es la reserva emocional positiva',
            content: [
                {type: 'paragraph', text: 'Es la capacidad de generar y mantener estados emocionales que nos fortalecen, junto con recursos internos y externos para afrontar momentos difíciles. Se alimenta de hábitos, relaciones y actitudes. No se trata solo de “sentirse bien”, sino de cultivar activamente aquello que nos aporta calma, energía y sentido.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Por qué es clave en la recuperación',
            content: [
                {type: 'paragraph', text: 'Las emociones positivas no son solo “sensaciones agradables”. Cumplen un papel activo en la recuperación del ánimo bajo: amplían la perspectiva, equilibran la balanza emocional y sostienen la resiliencia. No es un optimismo ingenuo, sino un realismo que reconoce lo que sí funciona.'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Principios de activación conductual',
            content: [
                {type: 'paragraph', text: 'Cuando el ánimo está bajo, esperar a “sentirse con energía” para actuar suele llevar a la inactividad. Por eso, en psicología usamos el principio acción → emoción: primero actúas, incluso sin ganas, y luego, con la repetición, el estado de ánimo empieza a mejorar. Esto se logra programando actividades agradables (placer) y de logro (propósito).'}
            ]
        },
        {
            type: 'collapsible',
            title: 'Qué dice la neurociencia',
            content: [
                {type: 'paragraph', text: 'Las emociones positivas activan el sistema dopaminérgico (motivación y recompensa), calman la hiperactividad de la amígdala (alarma de miedo) y favorecen la neuroplasticidad, creando “caminos” neuronales que facilitan que esas emociones vuelvan a aparecer. Tienen un efecto acumulativo: regar una planta con pequeñas dosis constantes la mantiene fuerte.'}
            ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'illuminatingMemoriesAlbumExercise',
          title: 'EJERCICIO 1: MI ÁLBUM DE RECUERDOS QUE ILUMINAN',
          objective: 'Este ejercicio te ayudará a entrenar tu mente para equilibrar el “sesgo negativo” natural del cerebro, capturando y conservando los momentos que te nutren para que puedas revivirlos en días difíciles.',
          duration: '10-12 min',
        },
        {
          type: 'positiveEmotionalFirstAidKitExercise',
          title: 'EJERCICIO 2: MI BOTIQUÍN EMOCIONAL POSITIVO',
          objective: 'Este ejercicio te ayudará a diseñar un kit personal de recursos prácticos para regular tu ánimo y recuperar el equilibrio, basado en estrategias que la ciencia ha demostrado efectivas.',
          duration: '12-15 min',
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Ruta', prompts: [
            '¿Qué hábitos, rutinas o pequeños gestos descubrí que me ayudan a sentirme con más calma o energía?',
            '¿Qué he comprendido sobre la relación entre acción y motivación? ¿Cómo puedo aplicarlo en los días en los que me falten las ganas?',
            '¿Qué recursos de mi “mochila positiva” siento que son los más poderosos para levantar mi ánimo en momentos difíciles?',
          ]
        },
        { type: 'title', text: 'Resumen Final de la Ruta' },
        {
          type: 'list',
          items: [
            'El ánimo bajo se puede regular con estrategias concretas y sostenibles.',
            'Tu energía vital se sostiene en hábitos básicos, chispa emocional y dirección mental.',
            'La motivación no siempre precede a la acción; a menudo, la acción genera motivación.',
            'Conectar cada acción con un valor y un sentido mayor le da fuerza y continuidad.',
            'Cultivar una reserva emocional positiva protege tu bienestar y fortalece tu resiliencia.',
          ],
        },
        { type: 'quote', text: '“Volver a lo que te hace sentir bien no es regresar al pasado, sino construir, paso a paso, un presente más habitable. Cada gesto, cada recuerdo y cada elección consciente son semillas de bienestar que seguirán creciendo dentro de ti.”' },
      ],
    },
  ],
};
