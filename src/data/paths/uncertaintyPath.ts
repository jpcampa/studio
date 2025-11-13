
import type { Path } from '../pathsData';

export const uncertaintyPath: Path = {
  id: 'tolerar-incertidumbre',
  title: 'Tolerar la Incertidumbre con Confianza',
  description: 'Aprende a convivir con lo incierto sin perder el equilibrio, transformando el control en confianza y la ansiedad en calma consciente.',
  dataAiHint: 'uncertainty trust mindfulness',
  audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2.mp3',
  modules: [
    {
      id: 'incertidumbre_sem1',
      title: 'Semana 1: Entiende qué es la Incertidumbre y cómo la vivo',
      type: 'introduction',
      estimatedTime: '20-25 min',
      audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion1.mp3',
      content: [
        { type: 'paragraph', text: '¿Te ha pasado que cuanto menos sabes sobre algo, más te preocupas? Esta semana te acompaño a comprender qué es la incertidumbre, por qué tu cuerpo y tu mente reaccionan con incomodidad cuando no tienes el control, y cómo puedes empezar a relacionarte con lo incierto desde un lugar más flexible y sereno.\nNo se trata de eliminar la incertidumbre, sino de aprender a sostenerla sin que dirija tu vida.' },
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
          audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio3Ruta2Sesion1.mp3',
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
          audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio5Ruta2Sesion1.mp3',
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
          duration: '5 a 8 minutos'
        },
        {
          type: 'controlTrafficLightExercise',
          title: 'Ejercicio 2: El Semáforo del Control',
          objective: 'Diferencia entre lo que depende de ti, lo que puedes influir y lo que está fuera de tu control para enfocar tu energía en lo que sí puedes transformar.',
          duration: '6 a 9 minutos'
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
          '¿Qué intenté controlar esta semana que no estaba en mis manos?',
          '¿Cómo me sentí al soltarlo?',
          '¿Qué ideas me llevo sobre mi forma de vivir lo incierto?',
        ]},
        { type: 'title', text: 'Resumen Clave de la Semana' },
        { type: 'list', items: [
            'La incertidumbre activa el sistema de amenaza cerebral.',
            'Nuestro cuerpo reacciona incluso ante la falta de información, no solo ante el peligro real.',
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
      estimatedTime: '15-20 min',
      audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio1Ruta2Sesion2.mp3',
      content: [
          { type: 'paragraph', text: '¿Te ha pasado que, cuando estás esperando algo importante o no sabes qué va a ocurrir, tu mente empieza a imaginar mil escenarios negativos? Esta semana quiero ayudarte a entender por qué ocurre eso y cómo puedes dejar de anticipar lo peor. No se trata de controlar todo, sino de descubrir que puedes vivir con más calma incluso cuando hay cosas que no puedes prever.' },
          { type: 'title', text: 'Psicoeducación', audioUrl: 'https://workwellfut.com/audios/ruta2/descripciones/Audio2Ruta2Sesion2.mp3' },
          { type: 'paragraph', text: 'A veces, tu cuerpo reacciona con ansiedad sin que haya pasado nada realmente peligroso. Solo hace falta un pensamiento como “¿Y si me equivoco?” o “¿Y si esto sale mal?” para que tu mente entre en bucle y tu cuerpo se ponga en alerta.\nEsto es lo que llamamos anticipación ansiosa: una forma de preocupación centrada en lo que podría pasar. Aunque sea solo imaginación, activa emociones, sensaciones y comportamientos como si el peligro fuera real.' },
          {
            type: 'collapsible',
            title: '¿Qué activa mi sistema de amenaza?',
            content: [
              { type: 'paragraph', text: 'Cuando te sientes ansioso o en alerta sin un peligro real delante, es porque tu mente o tu sistema nervioso han interpretado algo como una posible amenaza. Esto puede ocurrir por varios motivos:'},
              { type: 'collapsible', title: 'Errores de pensamiento', content: [{type: 'list', items: ['Sobredimensionar el riesgo: Imaginas que algo es más peligroso de lo que realmente es. Ej.: “Si me equivoco, será un desastre”.', 'Imaginar consecuencias extremas: Das por hecho que el peor escenario va a suceder. Ej.: “Seguro que me rechazan y no podré con esto”.', 'Sentirte incapaz: Crees que no tienes recursos para afrontarlo. Ej.: “No voy a poder gestionarlo si algo sale mal”.']}]},
              { type: 'collapsible', title: 'Creencias aprendidas', content: [{type: 'list', items: ['“No debo fallar nunca” → convierte cualquier error en un drama.', '“El mundo es peligroso” → te hace vivir en estado de alerta.', '“No puedo equivocarme” → te paraliza ante lo incierto.']}]},
              { type: 'collapsible', title: 'Neurocepción inconsciente', content: [{type: 'paragraph', text: 'Este es un concepto de la neurociencia muy importante: tu sistema nervioso evalúa todo lo que ocurre a tu alrededor sin que tú lo decidas de forma consciente. Percibe detalles como el tono de voz de alguien, una mirada o gesto, un recuerdo doloroso o simplemente un cambio en tu entorno. Y si interpreta alguna de esas señales como insegura, activa la alarma automáticamente. No es culpa tuya, es un sistema diseñado para protegerte. Pero muchas veces actúa por error.'}]}
            ]
          },
          {
            type: 'collapsible',
            title: 'Herramientas para regular el sistema de amenaza',
            content: [
              { type: 'paragraph', text: 'La buena noticia es que puedes reentrenar tu cuerpo y tu mente. Aquí tienes 3 herramientas fundamentales para ello:'},
              { type: 'collapsible', title: 'Exposición progresiva', content: [{type: 'paragraph', text: 'Significa acercarte poco a poco a lo que hoy temes o evitas. No de golpe ni forzándote, sino con pasos realistas y graduales. Así, tu cuerpo aprende que no está en peligro y que puede sostener esa experiencia sin consecuencias catastróficas.'}]},
              { type: 'collapsible', title: 'Reestructuración cognitiva', content: [{type: 'paragraph', text: 'Es una técnica que te ayuda a cuestionar lo que piensas cuando estás ansioso/a. Muchas veces, esos pensamientos anticipatorios no son tan ciertos ni tan útiles como parecen. Aprenderás a hacerte preguntas como: “¿Esto que estoy pensando es un hecho o solo una posibilidad?”, “¿Qué otras formas hay de interpretar esta situación?”, “¿Cómo la vería alguien que me quiere?”'}]},
              { type: 'collapsible', title: 'Mindfulness y ACT', content: [{type: 'paragraph', text: 'Estas herramientas no buscan eliminar la ansiedad, sino aprender a estar con ella sin que te domine. Te enseñan a observar tus pensamientos sin creer todo lo que dicen, hacer espacio a lo que sientes, sin luchar ni forzarte a cambiarlo de inmediato y volver al cuerpo y al momento presente.'}]}
            ]
          },
          { type: 'title', text: 'Técnicas Específicas' },
          { type: 'exercise', title: 'Ejercicio 1: Calmar tu Cuerpo para Calmar tu Mente', objective: 'Encuentra técnicas validadas por la ciencia para calmar tu sistema nervioso y elige las que más te ayuden.', content: [
              { type: 'paragraph', text: 'Puedes usarlas cuando notes ansiedad o como parte de tu rutina diaria.'}
          ]},
          { type: 'exercise', title: 'Ejercicio 2: Pequeños Actos de Exposición a lo Incierto', objective: 'Entrénate para vivir con más calma, incluso cuando no tienes todas las respuestas, mediante la exposición segura y consciente a lo que no puedes controlar.', content: [
              { type: 'paragraph', text: 'Elige una situación cotidiana que suelas controlar en exceso o evitar por miedo a que algo salga mal. No anticipes el resultado. Haz la acción con conciencia.'}
          ]},
           { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
              '¿Qué he aprendido sobre mi forma de reaccionar ante lo incierto?',
              '¿Qué me ha ayudado más: calmarme antes, enfrentarme directamente o ambas cosas?',
              '¿Qué tipo de pensamientos suelen aumentar mi ansiedad? ¿Puedo verlos como historias, no como verdades?',
              '¿He notado algún cambio en cómo me siento al no tener el control total?',
              '¿Qué me gustaría seguir practicando para fortalecer mi confianza ante lo incierto?',
           ]},
          { type: 'title', text: 'Resumen Clave de la Semana' },
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
        estimatedTime: '20-25 min',
        content: [
          { type: 'paragraph', text: 'A veces, cuando algo te preocupa o no sabes qué va a ocurrir, tu mente se aferra a una sola forma de ver las cosas. Imagina lo peor. Cree que solo hay un camino posible. Esa rigidez mental puede darte una falsa sensación de control… pero también te impide adaptarte con libertad.\nEsta semana vas a entrenar tu flexibilidad cognitiva: la capacidad de cambiar de perspectiva, abrirte a nuevas opciones y responder con más calma y claridad cuando lo incierto te descoloca. No se trata de forzarte a pensar en positivo, sino de recordar que hay más de una manera de interpretar lo que ocurre… y más de una forma de seguir adelante.\nAdaptarte no es rendirte. Es crecer desde dentro.'},
          { type: 'title', text: 'Psicoeducación' },
          { type: 'paragraph', text: '¿Te ha pasado que sientes que solo hay una manera de ver las cosas? Como si tu mente se cerrara y te costara encontrar otras formas de entender lo que pasa.\nEso es rigidez cognitiva: cuando te cuesta adaptarte, cambiar de perspectiva o imaginar más de una posibilidad.'},
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
            content: [
              { type: 'paragraph', text: 'La flexibilidad mental es la capacidad de ver las cosas desde más de un ángulo, sin quedarte atrapado/a en una única forma de pensar o actuar.\nEs poder cambiar de opinión o de estrategia cuando el contexto lo necesita, sin sentir que por eso fallas o pierdes el control.\nLa flexibilidad no es debilidad ni indecisión. Es una fuerza interna que te permite ajustarte a lo inesperado sin perder tu esencia. Y como cualquier habilidad mental y emocional, se puede entrenar.'}
            ]
          },
          {
            type: 'collapsible',
            title: '¿Qué entrenas cuando desarrollas tu flexibilidad mental?',
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
            duration: '5–10 minutos'
          },
          {
            type: 'mantraExercise',
            title: 'Ejercicio 2: ¿Y si…? pero también…',
            objective: 'Esta técnica no busca eliminar los pensamientos de duda, sino equilibrarlos con otra posibilidad más amable y realista que reconozca tu capacidad.',
            duration: '5–7 minutos'
          },
           { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
              '¿Qué historia rígida me he contado esta semana que no se cumplió tal como la imaginaba?',
              '¿Qué descubrí al permitirme ver la situación desde más de un ángulo?',
              '¿Cuál de las frases “pero también…” sentí más mía o quiero recordarme más a menudo?',
              '¿En qué momento me sorprendí reaccionando con más flexibilidad de lo habitual?',
            ]},
          { type: 'title', text: 'Resumen Clave de la Semana'},
          { type: 'list', items: [
            'La rigidez cognitiva aparece cuando tu mente quiere protegerte… pero puede atraparte en un único guion.',
            'La flexibilidad mental se puede entrenar: se trata de abrir espacio a otras formas de ver, sentir y responder.',
            'Imaginar más de un desenlace te ayuda a salir del modo “todo o nada” y a recuperar perspectiva.',
            'Aunque no puedas evitar pensar “¿Y si…?”, sí puedes equilibrar esa voz con una más compasiva y realista.',
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
          { type: 'paragraph', text: 'A veces, cuanto más intentas tenerlo todo bajo control, más te desgastas. Tu mente planea, prevé, se anticipa… creyendo que así estarás a salvo. Pero el exceso de control no siempre protege: muchas veces te encierra, te tensa y te aleja del presente.\nEsta semana vas a entrenar una forma distinta de sostenerte en lo incierto: desde la confianza, no desde el control. Aprenderás a aceptar lo que no puedes prever, a soltar el esfuerzo inútil por dominarlo todo y a conectar con tu capacidad de responder paso a paso, aunque no tengas todas las respuestas.\nConfiar no es rendirte. Es estar contigo, incluso cuando no sabes lo que va a pasar.'},
          { type: 'title', text: 'Psicoeducación' },
          { type: 'paragraph', text: '¿Alguna vez has notado que cuanto más intentas tenerlo todo bajo control, más se te escapa?\nControlar cada detalle parece una estrategia segura, pero muchas veces es una trampa. Aumenta la ansiedad, la frustración y el cansancio emocional.\nEsta semana vas a explorar una forma distinta de vivir: confiar más en ti, en tu capacidad de adaptación y en la vida, incluso cuando no tienes todas las respuestas.'},
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
            content: [
                { type: 'paragraph', text: 'A veces creemos que solo estaremos bien si lo tenemos todo claro. Pero en realidad, lo que genera estabilidad no es la certeza, sino la confianza:\n✔️ Confianza en que sabrás responder\n✔️ Confianza en que podrás adaptarte, incluso con miedo\n✔️ Confianza en que no necesitas hacerlo perfecto para estar bien\nTu confianza no crece cuando todo es fácil. Crece cuando te atreves, incluso sin garantías.'}
            ]
          },
          {
            type: 'collapsible',
            title: 'Caminar paso a paso: la alternativa a planearlo todo',
            content: [
                { type: 'paragraph', text: 'Cuando intentas prever cada detalle y tener todo controlado desde el inicio, te vuelves rígido/a. Y eso, en un mundo cambiante, es agotador.\nLa alternativa es desarrollar flexibilidad estratégica:\n✔️ Avanzar con intención, aunque no esté todo resuelto\n✔️ Dar un paso desde donde estás, con lo que tienes\nLa confianza se construye caminando, no planificando eternamente. Y cuando algo no sale como esperabas, no es un fallo: es parte del proceso.'}
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
            type: 'exercise',
            title: 'Ejercicio 2: Mi ritual de entrega consciente',
            objective: 'Aprende a soltar la tensión mental o física cuando el control se vuelve agotador, a través de la escritura, la respiración o la gratitud.',
            duration: '5–10 minutos por opción',
            content: [
                { type: 'paragraph', text: 'Cuando intentas controlarlo todo, tu mente se agota. Este ejercicio te propone soltar por un momento. Elige la forma que hoy más te ayude: Escribir y soltar, Respirar con intención o Cerrar el día con gratitud.'}
            ]
          },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
             '¿Qué parte de ti se suaviza cuando dejas de intentar controlarlo todo?',
             '¿Qué notas en tu cuerpo cuando sueltas la tensión de tener todas las respuestas?',
             '¿Qué cambia en tu mente cuando aceptas que no necesitas prever cada paso?',
             '¿Qué te gustaría recordarte la próxima vez que intentes tenerlo todo bajo control?'
          ]},
          { type: 'title', text: 'Resumen Clave de la Semana'},
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
    }
  ],
};

    