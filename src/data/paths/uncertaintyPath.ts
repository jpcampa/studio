

import type { Path } from '../pathsData';

export const uncertaintyPath: Path = {
  id: 'tolerar-incertidumbre',
  title: 'Tolerar la Incertidumbre con Confianza',
  description: 'Aprende a convivir con lo incierto sin perder el equilibrio, transformando el control en confianza y la ansiedad en calma consciente.',
  dataAiHint: 'uncertainty trust mindfulness',
  modules: [
    {
      id: 'incertidumbre_sem1',
      title: 'Semana 1: Entiende qué es la Incertidumbre y cómo la vivo',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { 
            type: 'paragraphWithAudio', 
            text: '¿Te ha pasado que cuanto menos sabes sobre algo, más te preocupas? Esta semana te acompaño a comprender qué es la incertidumbre, por qué tu cuerpo y tu mente reaccionan con incomodidad cuando no tienes el control, y cómo puedes empezar a relacionarte con lo incierto desde un lugar más flexible y sereno. No se trata de eliminar la incertidumbre, sino de aprender a sostenerla sin que dirija tu vida.',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion1.mp3'
        },
        { 
          type: 'title', 
          text: 'Psicoeducación'
        },
        { 
            type: 'collapsible',
            title: '¿Qué es la incertidumbre?',
            content: [
                { type: 'paragraph', text: 'La incertidumbre es la ausencia de certezas. Es no saber qué va a pasar. Y aunque todos la experimentamos, no siempre sabemos sostenerla sin malestar. A veces hay un riesgo real, pero muchas otras veces lo que sentimos es ambigüedad, imprevisibilidad o simplemente falta de información clara.\nNuestro cerebro —diseñado para anticiparse y protegernos— interpreta esa falta de claridad como una posible amenaza. Y ahí empieza el malestar.' },
            ]
        },
        {
          type: 'collapsible',
          title: '¿Por qué nos cuesta tanto la incertidumbre?',
          audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio4Ruta2Sesion1.mp3',
          content: [
            { type: 'paragraph', text: 'Porque nuestro sistema emocional busca seguridad. Preferimos incluso una mala noticia conocida antes que quedarnos en el “no sé”.\nEstudios en neurociencia han demostrado que la incertidumbre activa el sistema de amenaza cerebral (en especial, la amígdala) de forma parecida a como lo haría un peligro real.\nCuando esto ocurre, muchas personas sienten:\n•\tNecesidad de controlarlo todo.\n•\tPensamientos de anticipación (“¿Y si…?”).\n•\tEvitación de decisiones o situaciones inciertas.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'La intolerancia a la incertidumbre',
          audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio4Ruta2Sesion1.mp3',
          content: [
            { type: 'paragraph', text: 'No es solo incomodidad. Es la creencia de que lo incierto es peligroso, insoportable o inmanejable.\nEsto suele dar lugar a un estilo de pensamiento rígido, perfeccionista y catastrofista, donde todo debe estar planificado y bajo control.\nEjemplos comunes:\n•\t“Necesito saber exactamente cómo va a salir esto.”\n•\t“Si no tengo respuestas claras, no puedo avanzar.”\n•\t“Prefiero no intentarlo antes que equivocarme.”\nEste patrón puede estar vinculado a experiencias pasadas de inseguridad, exigencia o trauma. Y aunque parezca protector, suele generar más ansiedad.' }
          ]
        },
        {
          type: 'collapsible',
          title: '¿Cómo reacciona tu cuerpo?',
          content: [
            { type: 'paragraph', text: 'Cuando enfrentas una situación incierta, tu cuerpo reacciona: el corazón se acelerada, se tensan los músculos, la mente se agita.\nEsto es adaptativo: tu cerebro intenta protegerte anticipando lo peor. Pero si esa respuesta se vuelve constante, vives en modo alerta, con un “radar” emocional encendido todo el tiempo.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'La alternativa: flexibilidad mental',
          audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio6Ruta2Sesion1.mp3',
          content: [
            { type: 'paragraph', text: 'No puedes eliminar la incertidumbre. Pero sí puedes fortalecer tu capacidad para adaptarte a ella sin quedarte paralizado/a.\nA esto lo llamamos flexibilidad cognitiva: pensar de forma más abierta, matizada y adaptativa.\nLa flexibilidad:\n•\tSe puede entrenar (no es un rasgo fijo).\n•\tImplica reinterpretar lo que pasa, sin necesidad de tenerlo todo claro.\n•\tEs la base de una regulación emocional más sólida.'}
          ]
        },
        {
          type: 'collapsible',
          title: 'En resumen…',
          content: [
            { type: 'list', items: [
              'La incertidumbre es parte de la vida, pero muchas veces la vivimos como amenaza.',
              'Nuestro cuerpo y mente tienden a sobreprotegernos cuando sentimos que no tenemos el control.',
              'La intolerancia a la incertidumbre se manifiesta en necesidad de control, rigidez y evitación.',
              'No puedes controlar todo, pero puedes aprender a moverte con flexibilidad.',
              'Diferenciar entre lo que depende de ti y lo que no, alivia la ansiedad y te devuelve poder.'
            ]}
          ]
        },
        { type: 'quote', text: 'No podemos eliminar la incertidumbre, pero sí podemos aprender a vivir con ella desde un lugar más flexible y sereno.' },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'uncertaintyMapExercise',
          title: 'Ejercicio 1: Mi Mapa de la Incertidumbre',
          objective: 'Reconoce en qué áreas te afecta más la incertidumbre y cómo reaccionas. Al observarlo, podrás tomar decisiones más conscientes y recuperar calma.',
          duration: '5 a 8 minutos',
          audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion1tecnica1.mp3'
        },
        {
          type: 'controlTrafficLightExercise',
          title: 'Ejercicio 2: El Semáforo del Control',
          objective: 'Diferencia entre lo que depende de ti, lo que puedes influir y lo que está fuera de tu control para enfocar tu energía en lo que sí puedes transformar.',
          duration: '6 a 9 minutos'
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', 
        audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio9Ruta2Sesion1.mp3',
        prompts: [
          '¿Qué intenté controlar esta semana que no estaba en mis manos?',
          '¿Cómo me sentí al soltarlo?',
          '¿Qué ideas me llevo sobre mi forma de vivir lo incierto?',
        ]},
        { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio10Ruta2Sesion1.mp3' },
        { type: 'list', items: [
            'La incertidumbre es parte de la vida, pero muchas veces la vivimos como amenaza.',
            'Nuestro cuerpo y mente tienden a sobreprotegernos cuando sentimos que no tenemos el control.',
            'La intolerancia a la incertidumbre se manifiesta en necesidad de control, rigidez y evitación.',
            'No puedes controlar todo, pero puedes aprender a moverte con flexibilidad.',
            'Diferenciar entre lo que depende de ti y lo que no, alivia la ansiedad y te devuelve poder.'
          ]
        },
        { type: 'quote', text: 'No necesitas tenerlo todo claro para avanzar. Solo confiar en tu capacidad para adaptarte, un paso cada vez.'}
      ]
    },
    {
      id: 'incertidumbre_sem2',
      title: 'Semana 2: Regular la Ansiedad ante lo Incierto',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
          { 
            type: 'paragraphWithAudio', 
            text: '¿Te ha pasado que, cuando estás esperando algo importante o no sabes qué va a ocurrir, tu mente empieza a imaginar mil escenarios negativos?   En esta segunda semana vamos a trabajar precisamente en eso: en comprender por qué ocurre y cómo dejar de anticipar lo peor. No se trata de controlar cada detalle de tu vida, sino de descubrir que puedes vivir con más calma incluso cuando no tienes todas las respuestas.   Vas a entender cómo funciona la anticipación ansiosa y por qué tu cuerpo reacciona con alarma ante lo incierto, aunque no haya un peligro real.  Aprenderás a entrenar tu mente para frenar los pensamientos catastrofistas y a reconectar con el presente usando técnicas de exposición, regulación y atención plena.   También comenzarás a distinguir entre lo que tu mente imagina y lo que realmente está ocurriendo. Porque esta semana no se trata de eliminar la ansiedad, sino de reducir su poder sobre ti y ganar confianza paso a paso.',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2Sesion2.mp3',
          },
          { type: 'title', text: 'Psicoeducación' },
          { 
            type: 'collapsible',
            title: '¿Por qué imaginamos lo peor?',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion2.mp3',
            content: [
                { type: 'paragraph', text: 'A veces, tu cuerpo reacciona con ansiedad sin que haya pasado nada realmente peligroso. Solo hace falta un pensamiento como “¿Y si me equivoco?” o “¿Y si esto sale mal?” para que tu mente entre en bucle y tu cuerpo se ponga en alerta. \n\nEsto es lo que llamamos anticipación ansiosa: una forma de preocupación centrada en lo que podría pasar. Aunque sea solo imaginación, activa emociones, sensaciones y comportamientos como si el peligro fuera real.'},
            ]
          },
          {
            type: 'collapsible',
            title: 'Tu sistema de amenaza: entre el miedo y la percepción',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio3Ruta2Sesion2.mp3',
            content: [{type: 'paragraph', text: 'Nuestro sistema nervioso tiene una función adaptativa: protegernos ante lo que percibimos como peligroso. Pero el problema es que no distingue bien entre peligro real —algo que está sucediendo— y mental —algo que podría pasar—.   Cuando anticipas algo negativo, tu cuerpo entra en modo defensa:   Se activa una zona del cerebro llamada amígdala, que funciona como una alarma interna.   Esta activación acelera el corazón, tensa los músculos y prepara al cuerpo para reaccionar rápido.   Al mismo tiempo, se apaga o bloquea parcialmente la zona del cerebro que te ayuda a pensar con claridad (la corteza prefrontal), porque el cuerpo prioriza la supervivencia, no la reflexión.   Es decir: tu cuerpo reacciona al “¿y si…?” como si ya estuviera ocurriendo. Te sientes inquieto/a, alerta, con dificultad para concentrarte o calmarte. Todo esto nace de un pensamiento como, por ejemplo: “¿Y si no puedo con esto?”'}]
          },
          {
            type: 'collapsible',
            title: '¿Qué activa mi sistema de amenaza?',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio4Ruta2Sesion2.mp3',
            content: [
              { type: 'paragraph', text: 'Cuando te sientes ansioso o en alerta sin un peligro real delante, es porque tu mente o tu sistema nervioso han interpretado algo como una posible amenaza. Esto puede ocurrir por varios motivos:'},
              { type: 'collapsible', title: 'Errores de pensamiento', content: [{type: 'paragraph', text: 'A veces, sin darte cuenta, caes en formas de pensar que distorsionan la realidad y aumentan el miedo. Por ejemplo:   Sobredimensionar el riesgo: Imaginas que algo es más peligroso de lo que realmente es. Ej.: “Si me equivoco, será un desastre”.   Imaginar consecuencias extremas: Das por hecho que el peor escenario va a suceder. Ej.: “Seguro que me rechazan y no podré con esto”.   Sentirte incapaz: Crees que no tienes recursos para afrontarlo. Ej.: “No voy a poder gestionarlo si algo sale mal”.'}]},
              { type: 'collapsible', title: 'Creencias aprendidas', content: [{type: 'paragraph', text: 'Detrás de esos pensamientos, a veces hay creencias más profundas que aprendiste con el tiempo (de tu entorno, de la infancia o de experiencias difíciles). Estas creencias te hacen interpretar muchas situaciones como peligrosas, aunque no lo sean realmente.   Algunas creencias comunes son:   “No debo fallar nunca” → convierte cualquier error en un drama.   “El mundo es peligroso” → te hace vivir en estado de alerta.   “No puedo equivocarme” → te paraliza ante lo incierto.' }]},
              { type: 'collapsible', title: 'Neurocepción inconsciente', content: [{type: 'paragraph', text: 'Este es un concepto de la neurociencia muy importante: tu sistema nervioso evalúa todo lo que ocurre a tu alrededor sin que tú lo decidas de forma consciente. Percibe detalles como:   El tono de voz de alguien   Una mirada o gesto   Un recuerdo doloroso   O simplemente un cambio en tu entorno   Y si interpreta alguna de esas señales como insegura, activa la alarma automáticamente. No es culpa tuya, es un sistema diseñado para protegerte. Pero muchas veces actúa por error.'}]}
            ]
          },
          {
            type: 'collapsible',
            title: 'Herramientas para regular el sistema de amenaza',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio5Ruta2Sesion2.mp3',
            content: [
              { type: 'paragraph', text: 'La buena noticia es que puedes reentrenar tu cuerpo y tu mente. Aquí tienes 3 herramientas fundamentales para ello:'},
              { type: 'collapsible', title: 'Exposición progresiva', content: [{type: 'paragraph', text: 'Significa acercarte poco a poco a lo que hoy temes o evitas. No de golpe ni forzándote, sino con pasos realistas y graduales. Así, tu cuerpo aprende que no está en peligro y que puede sostener esa experiencia sin consecuencias catastróficas.'}]},
              { type: 'collapsible', title: 'Reestructuración cognitiva', content: [{type: 'paragraph', text: 'Es una técnica que te ayuda a cuestionar lo que piensas cuando estás ansioso/a. Muchas veces, esos pensamientos anticipatorios no son tan ciertos ni tan útiles como parecen. Aprenderás a hacerte preguntas como:   “¿Esto que estoy pensando es un hecho o solo una posibilidad?”   “¿Qué otras formas hay de interpretar esta situación?”   “¿Cómo la vería alguien que me quiere?”'}]},
              { type: 'collapsible', title: 'Mindfulness y ACT', content: [{type: 'paragraph', text: 'Estas herramientas no buscan eliminar la ansiedad, sino aprender a estar con ella sin que te domine. Te enseñan a:   Observar tus pensamientos sin creer todo lo que dicen.   Hacer espacio a lo que sientes, sin luchar ni forzarte a cambiarlo de inmediato.   Volver al cuerpo y al momento presente.'}]}
            ]
          },
          { type: 'title', text: 'Técnicas Específicas' },
          { 
            type: 'exercise', 
            title: 'Ejercicio 1: Calmar tu Cuerpo para Calmar tu Mente', 
            objective: 'Encuentra técnicas validadas por la ciencia para calmar tu sistema nervioso y elige las que más te ayuden.',
            audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion2audio6tecnica1.mp3',
            content: [
              { type: 'paragraph', text: '¿Sientes que tu cuerpo se acelera cuando estás en tensión? Respirar más lento, mover el cuerpo o sentir el contacto con tu entorno puede ayudarte más de lo que imaginas. Aquí encontrarás técnicas validadas por la ciencia para calmar tu sistema nervioso. Elige la que más te ayude y practica durante unos minutos. Puedes usarlas cuando notes ansiedad o como parte de tu rutina diaria.' },
              { type: 'collapsible', title: '¿Por qué estas técnicas funcionan?', content: [{ type: 'paragraph', text: 'Cuando estás en modo alerta —con el corazón acelerado, el cuerpo tenso y la mente agitada— tu sistema nervioso está intentando protegerte. Pero si esa activación se mantiene, tu bienestar se resiente.\nEstas técnicas ayudan a activar el sistema parasimpático, el encargado de enviarle al cuerpo el mensaje de que ya no hay peligro. Al practicar con regularidad, no solo te calmas en el momento, sino que estás enseñándole a tu cuerpo a recuperar el equilibrio con más facilidad.\nEstudios científicos muestran que 8 semanas de práctica de respiración o mindfulness pueden reducir el volumen de la amígdala, el centro del miedo en el cerebro. Es decir: estás entrenando tu cuerpo y tu mente para vivir con más calma.' }] },
              { type: 'collapsible', title: '¿Qué cambia cuando las practicas?', content: [
                  { type: 'paragraph', text: 'En tu cuerpo:\n• Respiración más profunda y regular\n• Regulación del CO₂ (menos mareos o ahogo)\n• Reducción de tensión muscular\n• Sensaciones de alivio, calor o calma\n\nEn tu mente:\n• Recuperas el control y vuelves al presente\n• Se interrumpe el bucle de pensamientos ansiosos\n• Refuerzas el autocuidado y la conexión contigo\n\nEstas herramientas usan el cuerpo como puerta de entrada al bienestar. Respiración, movimiento, atención plena o contacto sensorial... Todas comparten un mismo propósito: ayudarte a regularte y conectar contigo desde un lugar seguro.' }
              ]},
              {
                type: 'collapsible',
                title: '¿Cuándo puedes usarlas?',
                content: [
                    { type: 'list', items: ['En el momento: si sientes ansiedad o bloqueo', 'Antes de una situación desafiante', 'Como rutina diaria para entrenar tu equilibrio'] }
                ]
              },
              { type: 'title', text: 'Selección de técnicas' },
              { type: 'paragraph', text: 'Explora todas y guarda tus favoritas. Puedes repetirlas cuando lo necesites.'},
              { type: 'collapsible', title: 'Respiración 4–2–6 con gesto de autocuidado', content: [{ type: 'paragraph', text: 'Ideal antes de dormir o al comenzar el día.' }] },
              { type: 'collapsible', title: 'Respiración diafragmática (guiada paso a paso)', content: [{ type: 'paragraph', text: 'Perfecta para reducir tensión acumulada o centrarte al empezar la jornada.' }] },
              { type: 'collapsible', title: 'Anclaje sensorial inmediato (Técnica 5-4-3-2-1)', content: [{ type: 'paragraph', text: 'Úsala cuando tu mente se inunde de pensamientos anticipatorios.' }] },
              { type: 'collapsible', title: 'Escaneo corporal sin juicio (body scan)', content: [{ type: 'paragraph', text: 'Útil para relajarte al final del día o facilitar el descanso.' }] },
              { type: 'collapsible', title: 'Relajación muscular progresiva (Jacobson)', content: [{ type: 'paragraph', text: 'Si sientes ansiedad física o mucha tensión corporal.' }] },
              { type: 'collapsible', title: 'Técnicas de presión profunda y balanceo corporal', content: [{ type: 'paragraph', text: 'Especialmente útiles en momentos de desregulación intensa.' }] },
              { type: 'collapsible', title: 'Contacto frío breve (reset inmediato)', content: [{ type: 'paragraph', text: 'Interrumpe la activación emocional de forma rápida y directa.' }] },
              { type: 'therapeuticNotebookReflection', title: 'Registro de experiencia personal', prompts: ['¿Cómo te sentiste después de practicar alguna de estas técnicas? Escribe aquí tus palabras clave, sensaciones o una breve reflexión que quieras recordar:'] },
            ]
          },
          {
            type: 'exercise',
            title: 'Ejercicio 2: Pequeños Actos de Exposición a lo Incierto',
            objective: 'Entrénate para vivir con más calma, incluso cuando no tienes todas las respuestas, mediante la exposición segura y consciente a lo que no puedes controlar.',
            audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion2audio7tecnica2.mp3',
            content: [
              { type: 'paragraph', text: 'Cuando anticipas lo peor, tu cuerpo reacciona como si ya estuvieras en peligro. Pero esa percepción no siempre es real: muchas veces es solo una interpretación que tu mente hace ante la incertidumbre. Para entrenarte a vivir con más calma, incluso cuando no tienes todas las respuestas, necesitas practicar algo clave: exponerte, en dosis pequeñas, a lo que no puedes controlar. Este ejercicio te invita a hacerlo de forma segura y consciente.'},
              { type: 'paragraph', text: 'Elige una situación cotidiana que suelas controlar en exceso o evitar por miedo a que algo salga mal. No anticipes el resultado. Haz la acción con conciencia.'}
            ]
          },
           { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', 
           audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio8Ruta2Sesion2.mp3',
           prompts: [
              '¿Qué he aprendido sobre mi forma de reaccionar ante lo incierto?',
              '¿Qué me ha ayudado más: calmarme antes, enfrentarme directamente o ambas cosas?',
              '¿Qué tipo de pensamientos suelen aumentar mi ansiedad?',
              '¿He notado algún cambio en cómo me siento al no tener el control total?',
              '¿Qué me gustaría seguir practicando para fortalecer mi confianza ante lo incierto?',
           ]},
          { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio9Ruta2Sesion2.mp3' },
          { type: 'list', items: [
              'El cuerpo reacciona a la incertidumbre como si fuera una amenaza real, pero podemos enseñarle que no lo es.',
              'Técnicas como la respiración consciente, el escaneo corporal o el anclaje sensorial ayudan a activar el sistema de calma.',
              'Exponerse de forma gradual a situaciones no controladas es una forma segura de construir confianza.',
              'No necesitamos eliminar la ansiedad: podemos aprender a sostenerla sin que nos domine.',
              'La práctica constante transforma la reacción automática en una respuesta más consciente y flexible.',
              'Cada experiencia que enfrentamos con apertura debilita el miedo anticipatorio y refuerza nuestra seguridad interior.'
          ]},
          { type: 'quote', text: 'No tengo que controlarlo todo para estar a salvo. Estoy aprendiendo a confiar, incluso en medio de lo incierto.'}
      ]
    },
    {
        id: 'incertidumbre_sem3',
        title: 'Semana 3: Entrena tu Flexibilidad Mental',
        type: 'skill_practice',
        estimatedTime: '15-20 min',
        content: [
          { 
            type: 'paragraphWithAudio', 
            text: 'A veces, cuando algo te preocupa o no sabes qué va a ocurrir, tu mente se aferra a una sola forma de ver las cosas. Imagina lo peor. Cree que solo hay un camino posible. Esa rigidez mental puede darte una falsa sensación de control… pero también te impide adaptarte con libertad.Esta semana vas a entrenar tu flexibilidad cognitiva: la capacidad de cambiar de perspectiva, abrirte a nuevas opciones y responder con más calma y claridad cuando lo incierto te descoloca. No se trata de forzarte a pensar en positivo, sino de recordar que hay más de una manera de interpretar lo que ocurre… y más de una forma de seguir adelante.Adaptarte no es rendirte. Es crecer desde dentro.', 
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2Sesion3.mp3',
          },
          { type: 'title', text: 'Psicoeducación' },
          { 
            type: 'collapsible',
            title: '¿Qué es la rigidez cognitiva?',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion3.mp3',
            content: [{ type: 'paragraph', text: '¿Te ha pasado que sientes que solo hay una manera de ver las cosas? Como si tu mente se cerrara y te costara encontrar otras formas de entender lo que pasa.  Eso es rigidez cognitiva: cuando te cuesta adaptarte, cambiar de perspectiva o imaginar más de una posibilidad.   Es como tener una mente que solo acepta un camino, incluso cuando hay otros más seguros o adecuados. Todo parece blanco o negro, y cualquier cambio de plan genera incomodidad.' }]
          },
          {
            type: 'collapsible',
            title: '¿Cómo lo explica la neurociencia?',
            content: [
              { type: 'paragraph', text: 'Tu cerebro tiene dos formas principales de procesar lo que ocurre: una rápida y automática, y otra más pausada y reflexiva. Ambas son útiles, pero cumplen funciones distintas.\nSistema 1: es la vía rápida. Funciona en piloto automático, sin que lo pienses demasiado. Es el que actúa cuando reaccionas de forma automática, por instinto, te anticipas al peligro o interpretas las cosas de forma inmediata. Es emocional, veloz, y está muy influido por tus hábitos, experiencias pasadas y miedos. Te protege, pero a veces… se adelanta demasiado.\nSistema 2: es la vía lenta. Entra en juego cuando paras, piensas, analizas y te das un momento para valorar diferentes opciones. Es más lógico, deliberado y consciente. Te permite tomar distancia del primer impulso y ver con más claridad lo que está pasando realmente.'}
            ]
          },
          {
            type: 'collapsible',
            title: '¿Cómo se manifiesta en tu vida diaria la rigidez cognitiva?',
            content: [
              { type: 'list', items: [
                'Pensamientos de “todo o nada”: “Si no lo hago perfecto, es un fracaso.”',
                'Necesidad constante de certezas',
                'Perfeccionismo y duda que paraliza',
                'Apego a formas de actuar y pensar que ya no funcionan'
              ]}
            ]
          },
          {
            type: 'collapsible',
            title: '¿Qué es la flexibilidad cognitiva?',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio3Ruta2Sesion3.mp3',
            content: [
              { type: 'paragraph', text: 'La flexibilidad mental es la capacidad de ver las cosas desde más de un ángulo, sin quedarte atrapado/a en una única forma de pensar o actuar.\nEs poder cambiar de opinión o de estrategia cuando el contexto lo necesita, sin sentir que por eso fallas o pierdes el control.\nLa flexibilidad no es debilidad ni indecisión. Es una fuerza interna que te permite ajustarte a lo inesperado sin perder tu esencia. Y como cualquier habilidad mental y emocional, se puede entrenar.'}
            ]
          },
          {
            type: 'collapsible',
            title: '¿Qué entrenas cuando desarrollas tu flexibilidad mental?',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio4Ruta2Sesion3.mp3',
            content: [
              { type: 'list', items: [
                'Soltar el bucle de pensamientos rumiativos',
                'Tolerar mejor la ambigüedad e incertidumbre',
                'Recuperar perspectiva en momentos intensos',
                'Ser más creativo/a, abierto/a y adaptativo/a'
              ]}
            ]
          },
          {
            type: 'collapsible',
            title: 'Metáfora del junco y el viento',
            content: [
              { type: 'paragraph', text: 'Un árbol rígido puede quebrarse en una tormenta.\nUn junco, en cambio, se dobla con el viento… y luego vuelve a levantarse.\nLa flexibilidad es eso: permitirte doblarte un poco ante lo incierto, en lugar de romperte.\nAdaptarte sin dejar de ser tú.'}
            ]
          },
          { type: 'title', text: 'Técnicas Específicas'},
          {
            type: 'alternativeStoriesExercise',
            title: 'Ejercicio 1: Historias Alternativas',
            objective: 'Entrena tu flexibilidad mental imaginando más de un posible desenlace. No se trata de forzarte a pensar en positivo, sino de recordarte que lo que temes no siempre ocurre.',
            duration: '5–10 minutos',
            audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion3audio5tecnica1.mp3'
          },
          {
            type: 'mantraExercise',
            title: 'Ejercicio 2: ¿Y si…? pero también…',
            objective: 'Esta técnica no busca eliminar los pensamientos de duda, sino equilibrarlos con otra posibilidad más amable y realista que reconozca tu capacidad.',
            duration: '5–7 minutos',
            audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion3audio6tecnica2.mp3'
          },
           { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', 
           audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio7Ruta2Sesion3.mp3',
           prompts: [
              '¿Qué historia rígida me he contado esta semana que no se cumplió tal como la imaginaba?',
              '¿Qué descubrí al permitirme ver la situación desde más de un ángulo?',
              '¿Cuál de las frases “pero también…” sentí más mía o quiero recordarme más a menudo?',
              '¿En qué momento me sorprendí reaccionando con más flexibilidad de lo habitual?',
            ]},
          { type: 'title', text: 'Resumen Clave de la Semana', audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio8Ruta2Sesion3.mp3' },
          { type: 'list', items: [
              'La rigidez cognitiva aparece cuando tu mente quiere protegerte… pero puede atraparte en un único guión.',
              'La flexibilidad mental se puede entrenar: se trata de abrir espacio a otras formas de ver, sentir y responder.',
              'Imaginar más de un desenlace te ayuda a salir del modo “todo o nada” y a recuperar perspectiva.',
              "Aunque no puedas evitar pensar “¿Y si…?”, sí puedes equilibrar esa voz con una más compasiva y realista, utilizando el 'pero también'.",
              'Adaptarte no significa rendirte, sino moverte con inteligencia emocional ante lo incierto.'
          ]},
          { type: 'quote', text: 'No necesitas certezas para avanzar. Necesito confianza en mi capacidad de adaptarme.'}
        ]
    },
    {
        id: 'incertidumbre_sem4',
        title: 'Semana 4: Vivir desde la Confianza, no desde el Control',
        type: 'summary',
        estimatedTime: '15-20 min',
        content: [
          { 
            type: 'paragraphWithAudio', 
            text: 'A veces, cuanto más intentas tenerlo todo bajo control, más te desgastas. Tu mente planea, prevé, se anticipa… creyendo que así estarás a salvo. Pero el exceso de control no siempre protege: muchas veces te encierra, te tensa y te aleja del presente.Esta semana vas a entrenar una forma distinta de sostenerte en lo incierto: desde la confianza, no desde el control. Aprenderás a aceptar lo que no puedes prever, a soltar el esfuerzo inútil por dominarlo todo y a conectar con tu capacidad de responder paso a paso, aunque no tengas todas las respuestas.Confiar no es rendirte. Es estar contigo, incluso cuando no sabes lo que va a pasar.', 
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2Sesion4.mp3'
          },
          { type: 'title', text: 'Psicoeducación' },
          {
            type: 'collapsible',
            title: '¿Controlarlo todo te da paz… o te agota?',
            content: [{ type: 'paragraph', text: '¿Alguna vez has notado que cuanto más intentas tenerlo todo bajo control, más se te escapa?\nControlar cada detalle parece una estrategia segura, pero muchas veces es una trampa. Aumenta la ansiedad, la frustración y el cansancio emocional.\nEsta semana vas a explorar una forma distinta de vivir: confiar más en ti, en tu capacidad de adaptación y en la vida, incluso cuando no tienes todas las respuestas.'}]
          },
          {
            type: 'collapsible',
            title: 'Aceptar no es rendirse: es liberarte',
            content: [
                { type: 'paragraph', text: 'Aceptar no significa resignarse ni dejar de luchar. Significa dejar de gastar energía en lo que no puedes cambiar y redirigirla hacia lo que sí puedes cuidar: cómo lo vives, cómo lo afrontas y cómo te tratas mientras tanto.\nDesde la Terapia de Aceptación y Compromiso (ACT), esto se llama apertura experiencial: permitir que pensamientos y emociones estén presentes, sin pelearte con ellos.\nAceptar el dolor no es estar bien con él. Es dejar de negarlo para empezar a reconstruirte desde ahí.'}
            ]
          },
          {
            type: 'collapsible',
            title: 'Confiar no es saber cómo saldrá, es saber que puedes con ello',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion4.mp3',
            content: [
                { type: 'paragraph', text: 'A veces creemos que solo estaremos bien si lo tenemos todo claro. Pero en realidad, lo que genera estabilidad no es la certeza, sino la confianza:\n• Confianza en que sabrás responder\n• Confianza en que podrás adaptarte, incluso con miedo\n• Confianza en que no necesitas hacerlo perfecto para estar bien\nTu confianza no crece cuando todo es fácil. Crece cuando te atreves, incluso sin garantías.'}
            ]
          },
          {
            type: 'collapsible',
            title: 'Caminar paso a paso: la alternativa a planearlo todo',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio3Ruta2Sesion4.mp3',
            content: [
                { type: 'paragraph', text: 'Cuando intentas prever cada detalle y tener todo controlado desde el inicio, te vuelves rígido/a. Y eso, en un mundo cambiante, es agotador.\nLa alternativa es desarrollar flexibilidad estratégica:\n• Avanzar con intención, aunque no esté todo resuelto\n• Dar un paso desde donde estás, con lo que tienes\nLa confianza se construye caminando, no planificando eternamente. Y cuando algo no sale como esperabas, no es un fallo: es parte del proceso.'}
            ]
          },
          {
            type: 'collapsible',
            title: 'Aceptar, confiar y avanzar',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio4Ruta2Sesion4.mp3',
            content: [
              { type: 'paragraph', text: 'Esta semana vas a entrenar una nueva forma de relacionarte con la incertidumbre:' },
              { type: 'list', items: [
                  'Dejar de intentar controlar lo incontrolable',
                  'Aceptar lo que sientes, sin juzgarte',
                  'Confiar en que puedes sostenerte, incluso sin certezas',
                  'Avanzar paso a paso, sin perder de vista lo que te importa'
              ]}
            ]
          },
          { type: 'title', text: 'Técnicas Específicas'},
          {
            type: 'mantraExercise',
            title: 'Ejercicio 1: Mi mantra de confianza',
            objective: 'Crea una frase breve, realista y significativa que funcione como una brújula interna para recordarte que puedes sostenerte aunque no tengas todo resuelto.',
            duration: '7–10 minutos'
          },
          {
            type: 'ritualDeEntregaConscienteExercise',
            title: 'Ejercicio 2: Mi ritual de entrega consciente',
            objective: 'Aprende a soltar la tensión mental o física cuando el control se vuelve agotador, a través de la escritura, la respiración o la gratitud.',
            duration: '5–10 minutos por opción',
            audioUrl: 'https://workwellfut.com/audios/ruta2/tecnicas/Ruta2sesion4audio6tecnica2.mp3',
          },
           { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', 
           audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio7Ruta2Sesion4.mp3',
           prompts: [
             '¿Qué parte de ti se suaviza cuando dejas de intentar controlarlo todo?',
             '¿Cómo se siente tu cuerpo cuando te permites no saberlo todo?',
             '¿Qué cambia en tu mente cuando aceptas que no necesitas prever cada paso?',
             '¿Qué te gustaría recordarte la próxima vez que intentes tenerlo todo bajo control?'
          ]},
          { 
            type: 'title', 
            text: 'Resumen Clave de la Semana',
            audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio8Ruta2Sesion4.mp3'
          },
          { type: 'list', items: [
            'Controlarlo todo puede parecer seguro… pero suele alimentar tu ansiedad.',
            'Aceptar lo que no puedes cambiar es un acto de fuerza, no de rendición.',
            'Confiar no es tener certezas, es saber que puedes acompañarte en lo incierto.',
            'El control no te protege como crees… tu capacidad de adaptarte, sí.',
            'La confianza se entrena paso a paso, con cada gesto en el que eliges avanzar sin garantías.',
            'Soltar el control te libera para vivir con más presencia, serenidad y flexibilidad.'
          ]},
          { type: 'quote', text: 'Cuando dejo de controlar, abro espacio para estar presente… y responder con lo que tengo, no con lo que imagino.'}
        ]
    },
    {
        id: 'incertidumbre_cierre',
        title: 'Cierre de la Ruta',
        type: 'summary',
        estimatedTime: '10 min',
        content: [
            {
                type: 'therapeuticNotebookReflection',
                title: 'Reflexión final de la Ruta',
                prompts: [
                    'Te proponemos cerrar este proceso con algunas preguntas clave:',
                    '¿Qué he aprendido sobre mí al observar cómo vivo la incertidumbre?',
                    '¿Qué recursos internos he descubierto o fortalecido?',
                    '¿Qué nuevas formas de pensar o actuar quiero seguir practicando?',
                    '¿Qué quiero recordarme la próxima vez que el miedo al no saber aparezca?',
                ]
            },
            {
                type: 'title',
                text: 'Resumen final de la Ruta'
            },
            {
                type: 'list',
                items: [
                    'La incertidumbre puede activar tu sistema de alerta, pero no tienes que vivir desde el miedo.',
                    'Comprender cómo funciona tu mente te ayuda a ganar claridad y no reaccionar de forma automática.',
                    'Tu cuerpo puede ser una brújula: calmarlo es una forma de recuperar el centro.',
                    'La rigidez mental intenta protegerte, pero limita tu capacidad de adaptación.',
                    'Entrenar la flexibilidad cognitiva te permite imaginar más de una historia y abrir nuevas posibilidades.',
                    'Confiar no es tener certezas, es avanzar con lo que tienes, desde donde estás.',
                    'Soltar el control no es rendirse, es un acto consciente de presencia y confianza.'
                ]
            },
            {
                type: 'quote',
                text: '“No necesito saber qué pasará mañana. Necesito recordar que hoy… puedo sostenerme.”'
            }
        ]
    }
  ],
};



    

    