
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
      audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/INTROSEMANA1.mp3',
      content: [
        { type: 'paragraph', text: 'Esta semana vas a descubrir qué es realmente el estrés, por qué no es tu enemigo y cómo se manifiesta en ti. El objetivo es que empieces a escucharlo sin miedo y comprendas que es una señal valiosa: algo en tu vida necesita atención, cuidado o un cambio.' },
        { type: 'title', text: 'Psicoeducación', audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Queeselestresyporquenoestuenemigo.mp3' },
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
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Comovivestuelestres.mp3',
            content: [
              { type: 'paragraph', text: 'Lo que para una persona puede ser un reto motivador, para otra puede ser una amenaza angustiante. Esto depende de nuestras experiencias, nuestra forma de pensar y nuestra manera de ver el mundo. Si llevas unas “gafas” mentales teñidas por la autoexigencia, la anticipación del fracaso o el miedo a decepcionar, es más probable que sientas muchas situaciones como amenazantes.\nPor eso es tan importante empezar por entender cómo funciona el estrés en ti.' },
            ],
        },
        {
            type: 'collapsible',
            title: 'Tipos de estrés',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Tiposdeestres.mp3',
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
            title: '¿Por qué sentimos estrés?',
            content: [
              { type: 'paragraph', text: 'El estrés no depende solo de lo que pasa fuera, sino de cómo lo interpretas y con qué recursos cuentas para enfrentarlo.\nAlgunos factores que influyen:' },
              { type: 'list', items: [
                  'Tu estilo de pensamiento: Si sueles exigirte mucho, anticipar lo peor o pensar que todo depende de ti, es más fácil que actives la respuesta de estrés.',
                  'Tu historia personal: Si creciste con mucha inseguridad, crítica o miedo, es posible que tu sistema nervioso sea más sensible.',
                  'Tu tolerancia a la incertidumbre: Las personas que necesitan tenerlo todo bajo control suelen sufrir más ante lo imprevisible.',
                  'Tus recursos y límites: Si sueles decir que sí a todo, cargas con más de lo que puedes sostener o te olvidas de ti para cuidar a los demás, es normal que tu cuerpo acabe agotado.'
              ]}
            ]
        },
        {
            type: 'collapsible',
            title: '¿Qué pasa si no lo gestionamos?',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Quepasasinologestionamos.mp3',
            content: [
              { type: 'paragraph', text: 'El estrés mantenido afecta a todos los niveles:' },
              { type: 'list', items: [
                'Físico: dolores musculares, problemas digestivos, alteraciones hormonales, insomnio.',
                'Emocional: ansiedad, tristeza, irritabilidad, desconexión emocional.',
                'Mental: dificultad para concentrarte, rumiaciones constantes, visión negativa de ti o del futuro.',
                'Relacional y conductual: conflictos, aislamiento, impulsividad, pérdida de hábitos saludables.'
              ]}
            ]
        },
        {
            type: 'collapsible',
            title: 'Tus “mínimos no negociables”',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Tusminimosnonegociables.mp3',
            content: [
              { type: 'paragraph', text: 'Cuando el estrés aparece, lo primero que solemos dejar de lado son las cosas que más nos sostienen: dormir bien, comer con calma, mover el cuerpo, hablar con alguien que nos escucha.\nEstas pequeñas acciones no son lujos, son necesidades básicas. Las llamamos “mínimos no negociables” porque son el suelo emocional sobre el que puedes caminar cada día. Si los abandonas, el estrés encuentra terreno fértil para crecer.\nDormir entre 7 y 8 horas, moverte al menos 15 minutos al día, comer con conciencia, tener pausas reales de desconexión y mantener vínculos afectivos de calidad… son tu mejor red de protección.' },
            ],
        },
        {
            type: 'collapsible',
            title: '¿Cómo saber si el estrés te está sobrepasando?',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/LoQueocurreentuCerebroyntucuerpo.mp3',
            content: [
              { type: 'paragraph', text: 'A veces el cuerpo lo sabe antes que tú:' },
              { type: 'list', items: [
                '¿Te cuesta dormir o te despiertas cansado/a?',
                '¿Tienes tensión constante en el cuello, la espalda o la mandíbula?',
                '¿Te irritas con facilidad o sientes que “todo te da igual”?',
                '¿Comes, trabajas o ves pantallas de forma compulsiva para desconectarte?'
              ]},
              { type: 'paragraph', text: 'La buena noticia es que el primer paso no es hacer nada, sino darte cuenta. Observar. Ponerle nombre. Escucharte sin juicio. Eso ya empieza a transformarte.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'El estrés como brújula',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/Elestrescomobrujulaycierredelapsicoeducacion.mp3',
            content: [
              { type: 'paragraph', text: 'El estrés no es una señal de que estés rota o roto. Es una brújula que te está mostrando que algo en tu vida necesita atención, cambio o cuidado.\nIgnorarlo o luchar contra él solo lo hace más fuerte. Aprender a escucharlo con curiosidad y compasión es el verdadero camino hacia la calma.\nVer el estrés con conciencia no significa eliminarlo, sino recuperar el poder sobre tu vida. Y ese poder empieza aquí, ahora, con tu decisión de mirar hacia dentro con valentía.' }
            ]
        },
        { type: 'quote', text: 'Tu cuerpo no está en tu contra. Te está hablando. La clave está en aprender a escucharlo con compasión.' },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
          type: 'stressMapExercise',
          title: 'Ejercicio 1: Mapa del Estrés Personal',
          objective: 'Con este ejercicio empezarás a reconocer cómo se manifiesta el estrés en ti. Al explorar tus pensamientos, emociones, sensaciones físicas y comportamientos cuando te sientes bajo presión, podrás comprender mejor lo que te ocurre y dar los primeros pasos para recuperar el equilibrio y sentirte más en calma.',
          duration: '5 a 10 minutos',
        },
        {
            type: 'triggerExercise',
            title: 'Ejercicio 2: Identifica tu disparador',
            objective: 'Aprender a diferenciar si lo que te está generando estrés viene del entorno (externo) o de ti mismo/a (interno), para empezar a responder con conciencia en lugar de reaccionar en automático.',
            duration: '5 a 8 minutos',
        },
        {
            type: 'title',
            text: 'Resumen Clave de la Semana 1',
            audioUrl: 'https://workwellfut.com/audios/ruta1/semana1/RESUMENYCIERRE.mp3'
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
    {
        id: 'estres_sem2',
        title: 'Semana 2: Activa tu Regulación Fisiológica',
        type: 'skill_practice',
        estimatedTime: '15-20 min',
        audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/INTROSEMANA2.mp3',
        content: [
            { type: 'title', text: 'Psicoeducación', audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/Tucuerpotambienregulatusemociones.mp3' },
            { type: 'paragraph', text: '¿Te ha pasado alguna vez que estás nervioso/a, con la cabeza llena de cosas, y de pronto respiras más lento o te estiras… y sientes que algo empieza a aflojarse por dentro?\nEso no es casualidad: es tu cuerpo haciendo su parte para ayudarte a recuperar la calma.\nY es que no solo la mente participa en la gestión del estrés. Tu cuerpo tiene un papel clave. Muchas veces, aunque tú quieras estar tranquilo/a, tu cuerpo reacciona como si estuvieras en medio de una emergencia.' },
            {
                type: 'collapsible',
                title: '¿Por qué ocurre esto?',
                content: [
                    { type: 'paragraphWithAudio', text: 'Porque dentro de ti hay un sistema que trabaja sin que tú lo controles, llamado Sistema Nervioso Autónomo. Es como un piloto automático que regula tu respiración, el ritmo del corazón, la tensión de tus músculos… y lo hace todo sin que tengas que pensarlo.\nEste sistema tiene dos ramas principales:\n•\tUna te activa cuando hay peligro.\n•\tLa otra te ayuda a calmarte y recuperarte.\nCuando estas dos partes están en equilibrio, te sientes presente, tranquilo/a y con energía. Pero si la balanza se inclina demasiado hacia el lado de la activación… empiezas a vivir en modo alerta constante.', audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/Ramasimpatica.mp3'},
                    { type: 'paragraphWithAudio', text: 'Rama parasimpática: tu sistema de descanso y seguridad\nEsta es la parte que le dice al cuerpo: “Ya estás a salvo, puedes bajar la guardia”.\nCuando se activa:\n•\tTu respiración se vuelve más lenta.\n•\tTus músculos se relajan.\n•\tSe reduce la tensión.\n•\tTu cuerpo recupera energía.\n•\tSe activa un estado de bienestar profundo.\nY lo más importante: tu mente también se aclara. Puedes pensar con más calma, decidir mejor y sentirte más conectado/a contigo.', audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/Ramaparasimpatica.mp3' },
                ]
            },
            {
                type: 'collapsible',
                title: 'No es solo una cuestión de pensar en positivo…',
                content: [
                    { type: 'paragraph', text: 'Desde la neurociencia, sabemos que muchas respuestas del cuerpo al estrés no pasan por tu mente consciente. Es decir, no decides sentir ansiedad: tu cuerpo la genera porque interpreta que hay una amenaza, aunque no sea evidente.\nPor eso, técnicas como la respiración profunda, los ejercicios de anclaje sensorial o el movimiento suave no son trucos para relajarte: son formas reales de enseñarle a tu cuerpo que puede volver a un estado de calma.' },
                ]
            },
            {
                type: 'collapsible',
                title: 'Tu detector interno de seguridad',
                audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/TudetectorinternodeseguridadylaTeoriaPolivagal.mp3',
                content: [
                    { type: 'paragraph', text: 'Tu cuerpo tiene un sistema que está constantemente vigilando si estás en un entorno seguro o si hay algún riesgo. Se llama neurocepción, y funciona sin que tú te des cuenta.\nEste sistema se activa por cosas muy sutiles, como:\n•\tUna mirada que percibes como crítica.\n•\tUn tono de voz tenso.\n•\tUn ambiente impredecible.\n•\tUn recuerdo que se activa sin querer.\nY cuando detecta algo que “no cuadra”, activa el modo defensa: ansiedad, tensión, malestar.' },
                    { type: 'paragraph', text: 'Aquí entra en juego la Teoría Polivagal, desarrollada por el neurocientífico Stephen Porges. Esta teoría nos dice que no hay solo “estrés” o “calma”. El cuerpo tiene tres estados principales, como una escalera:\n1.\tConexión y calma: puedes pensar con claridad, estar presente, sentirte a gusto.\n2.\tLucha o huida: tu cuerpo se activa para defenderse.\n3.\tColapso o desconexión: si el peligro se siente abrumador, el cuerpo se apaga. Aparece la sensación de bloqueo, vacío, desconexión o “no estar aquí”.\nMuchos síntomas de ansiedad, tristeza o confusión no son fallos tuyos: son respuestas de un cuerpo que intenta protegerte, a su manera.' },
                ]
            },
            {
                type: 'collapsible',
                title: '¿Qué genera seguridad?',
                audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/Quegeneraseguridad.mp3',
                content: [
                    { type: 'paragraph', text: 'La seguridad no es solo un pensamiento. Es un estado que se siente en el cuerpo. Cuando te sientes en confianza:\n•\tTu respiración se regula sola.\n•\tTu expresión facial se relaja.\n•\tTu cuerpo se afloja.\n•\tTu mente se siente más presente.\nY eso puede pasar por estar con alguien que te escucha, envolverte en una manta suave o simplemente sentir que respiras sin tensión. Son pequeños gestos que le dicen a tu cuerpo: “Estás bien, puedes soltar”.' }
                ]
            },
            {
                type: 'collapsible',
                title: '¿Por qué es importante todo esto?',
                content: [
                    { type: 'paragraph', text: 'Porque entender cómo funciona tu cuerpo te ayuda a dejar de luchar contra él. Si sientes ansiedad, no es que estés “exagerando” o que no sepas controlarte. Es tu sistema de defensa intentando protegerte. Lo que necesitas no es pelear con él, sino enseñarle que ya no hay peligro.\nY eso se hace desde lo corporal: con respiraciones, con movimientos suaves, con contacto reconfortante.\nEn esta semana, vas a practicar técnicas que activan tu sistema de calma:\n•\tRespiraciones que calman el sistema nervioso.\n•\tTécnicas para volver al presente con los sentidos.\n•\tGestos que le recuerdan a tu cuerpo que está a salvo.\nNo se trata de “calmarte a la fuerza”. Se trata de crear las condiciones para que tu cuerpo pueda hacerlo por sí mismo. Y eso, aunque parezca pequeño, es un acto profundo de cuidado.' }
                ]
            },
            { type: 'title', text: 'Técnicas Específicas' },
            { type: 'paragraph', text: 'A continuación, te presentamos una serie de técnicas físicas de regulación emocional, validadas por la ciencia, que puedes practicar a diario y también en momentos puntuales de ansiedad. Explora las que te proponemos y elige las que más se ajusten a ti. Practícalas a tu ritmo, sin prisa pero sin pausa.' },
            {
                type: 'collapsible',
                title: '¿Por qué estas técnicas funcionan?',
                content: [
                    { type: 'paragraph', text: 'Cuando estás en modo alerta —con el corazón acelerado, el cuerpo tenso y la mente agitada— tu sistema nervioso está intentando protegerte. Pero si esa activación se mantiene, tu bienestar se resiente.\nEstas técnicas ayudan a activar tu sistema parasimpático, el encargado de enviarle al cuerpo el mensaje de que ya no hay peligro. Al practicar con regularidad, no solo te calmas en el momento, sino que estás enseñándole a tu cuerpo a recuperar el equilibrio con más facilidad.\nEstudios han demostrado que practicar respiración consciente o mindfulness durante al menos 8 semanas puede producir cambios reales en el cerebro, como la reducción del volumen de la amígdala (centro de alerta y miedo). Es decir: te entrenas para vivir con más calma.' },
                ]
            },
            {
                type: 'collapsible',
                title: '¿Qué cambia cuando las practicas?',
                content: [
                    { type: 'paragraph', text: 'En tu cuerpo:' },
                    { type: 'list', items: ['La respiración se vuelve más profunda y regular.', 'Se regula el CO₂ en sangre, reduciendo mareos y sensaciones de ahogo.', 'Se libera tensión muscular acumulada.', 'Aparece una sensación de alivio, calor o tranquilidad.'] },
                    { type: 'paragraph', text: 'En tu mente:' },
                    { type: 'list', items: ['Recuperas el control y vuelves al presente.', 'Se interrumpe el bucle de pensamientos ansiosos.', 'Refuerzas el autocuidado y la conexión contigo.'] },
                    { type: 'paragraph', text: 'Estas herramientas usan el cuerpo como puerta de entrada al bienestar. Algunas se basan en la respiración, otras en el movimiento, la atención plena o el contacto sensorial. Todas comparten un mismo propósito: ayudarte a regular tu sistema y conectar contigo desde un lugar de seguridad.\nPuedes usarlas:\n•\tEn el momento, si sientes ansiedad o bloqueo.\n•\tAntes de una situación desafiante.\n•\tComo rutina diaria para cultivar equilibrio.\n•\tPara conocerte mejor: observa cuáles te funcionan más.' },
                ]
            },
            { type: 'exercise', title: 'Respiración 4–2–6 con gesto de autocuidado', objective: 'Salir del modo estrés y activar el modo calma.', content: [
                { type: 'paragraph', text: '1.\tInhala por la nariz durante 4 segundos.\n2.\tMantén el aire 2 segundos.\n3.\tExhala lentamente por la boca durante 6 segundos.\n4.\tMientras respiras, coloca una mano sobre el pecho o el abdomen, como gesto de cuidado hacia ti.\nPractica esta respiración durante 1 o 2 minutos, varias veces al día o en momentos de tensión.\n' }
            ], audioUrl: 'https://workwellfut.com/audios/rm/R1_respiracion_4-2-6.mp3'},
            { type: 'exercise', title: 'Anclaje sensorial inmediato (Técnica 5-4-3-2-1)', objective: 'Salir del bucle mental ansioso y volver al momento presente.', content: [
                { type: 'paragraph', text: 'Instrucciones (con respiración 6-2-4 previa):\n1.\tInhala 6 s – mantén 2 s – exhala 4 s (2 veces).\n2.\tNombra mentalmente:\no\t5 cosas que ves.\no\t4 cosas que puedes tocar.\no\t3 sonidos que escuchas.\no\t2 olores que detectas o recuerdas.\no\t1 sabor presente en tu boca.\nAl terminar, haz una respiración profunda y siente cómo has interrumpido el piloto automático.' }
            ], audioUrl: 'https://workwellfut.com/audios/R1_anclaje_sensorial_inmediato.m4a'},
            { type: 'exercise', title: 'Escaneo corporal sin juicio (body scan)', objective: 'Observar tu cuerpo con amabilidad y disminuir la tensión acumulada. En esta técnica guiada, recorrerás mentalmente tu cuerpo de pies a cabeza sin intentar cambiar nada. Solo observarás y acompañarás las sensaciones físicas con una actitud amable.', content: [], audioUrl: 'https://workwellfut.com/audios/rm/R_body_scan_breve.mp3'},
            { type: 'exercise', title: 'Relajación muscular progresiva (Jacobson)', objective: 'Liberar la tensión física generada por el estrés.', content: [
                { type: 'paragraph', text: 'Este ejercicio te ayudará a sentir alivio físico y a reconocer cómo tu cuerpo acumula tensión.' }
            ], audioUrl: 'https://workwellfut.com/audios/rm/R1-parte-1-respiracion-muscular-progresiva.mp3'},
            { type: 'exercise', title: 'Técnicas de presión profunda y balanceo corporal', objective: 'Generar una sensación de seguridad y arraigo desde el cuerpo.', content: [
                { type: 'paragraph', text: 'Opciones que puedes probar:\n•\tAutoabrazo firme: Cruza los brazos sobre tu pecho y mantén la presión mientras respiras.\n•\tBalanceo suave: Sentado/a o de pie, realiza un vaivén rítmico con el cuerpo.\n•\tManta con peso (o varias mantas dobladas): Cúbrete durante unos minutos para activar el sistema de regulación interna.\nEstas prácticas envían señales de seguridad al cerebro. Úsalas tras situaciones exigentes o como parte de tu rutina diaria.' }
            ]},
            { type: 'exercise', title: 'Contacto frío breve (reset inmediato)', objective: 'Interrumpir una activación emocional intensa.', content: [
                { type: 'paragraph', text: 'Cómo aplicarlo:\n1.\tHumedece una toalla o paño con agua fría.\n2.\tAplícalo entre 10 y 20 segundos en:\no\tLa nuca\no\tLas muñecas\no\tLa parte interna de los brazos o las mejillas\n3.\tRespira mientras sientes el contacto del frío.\nSi estás fuera de casa, puedes usar agua del grifo o un cubito envuelto en tela.\nEste pequeño “shock” activa una respuesta calmante en tu cuerpo y te ayuda a pausar el bucle de ansiedad.' }
            ]},
            { type: 'title', text: 'Resumen Clave', audioUrl: 'https://workwellfut.com/audios/ruta1/semana2/RESUMENYCIERRE.mp3' },
            { type: 'list', items: ['Tu cuerpo también forma parte de tu sistema de regulación emocional.', 'El sistema nervioso reacciona con alarma incluso ante estímulos cotidianos.', 'Puedes activar el sistema de calma mediante técnicas sencillas y efectivas.', 'La respiración, el movimiento suave o el contacto físico envían señales de seguridad al cerebro.', 'Cuanto más entrenas estas técnicas, más fácil te resulta acceder a la calma cuando la necesitas.'] },
            { type: 'quote', text: 'Respirar con conciencia es el gesto más pequeño y poderoso que puedes hacer por ti.'}
        ]
    },
    {
        id: 'estres_sem3',
        title: 'Semana 3: Reestructura tus Pensamientos de Sobrecarga',
        type: 'skill_practice',
        estimatedTime: '20-25 min',
        content: [
            { type: 'paragraph', text: 'Esta semana vas a entrenar una habilidad fundamental para reducir el estrés: identificar y transformar los pensamientos que te sobrecargan. El objetivo es que aprendas a detectar cuándo tu mente se activa en modo exigencia, catastrofismo o rigidez, y puedas responder con mayor flexibilidad, realismo y amabilidad hacia ti.'},
            { type: 'title', text: 'Psicoeducación' },
            { type: 'paragraph', text: 'Lo que piensas puede calmarte… o estresarte aún más.\n¿Te has dicho alguna vez cosas como “no voy a poder”, “todo depende de mí” o “si no lo hago perfecto, es un fracaso”? Estos pensamientos no son solo frases: son como unas gafas que se colocan solas y tiñen todo lo que vives. Muchas veces el estrés no viene solo de lo que ocurre, sino de lo que te dices cuando eso ocurre.'},
            {
                type: 'collapsible',
                title: '¿Qué son los pensamientos automáticos?',
                content: [{ type: 'paragraph', text: 'Son ideas breves y espontáneas que aparecen en tu mente casi sin darte cuenta. Aunque parecen simples, influyen mucho en cómo te sientes y en cómo actúas. Por ejemplo, si alguien dice “tenemos que hablar”, puedes sentir ansiedad solo porque aparece el pensamiento “algo va mal”.\nEstos pensamientos no siempre son racionales, pero sí muy poderosos. Por eso, aprender a identificarlos y cuestionarlos puede ayudarte a transformar tu forma de sentir y actuar.'}]
            },
            {
                type: 'collapsible',
                title: 'Las creencias exigentes: una fuente silenciosa de tensión',
                content: [
                    { type: 'paragraph', text: 'Muchas personas viven con un diálogo interno muy exigente:'},
                    { type: 'list', items: ['“Tengo que poder con todo.”', '“No puedo permitirme fallar.”', '“Los demás lo hacen mejor que yo.”']},
                    { type: 'paragraph', text: 'Estas creencias generan tensión constante, te ponen en deuda contigo y con los demás, y te hacen vivir como si nunca fuera suficiente.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'El modelo ABC: cómo se conectan pensamiento, emoción y acción',
                content: [
                    { type: 'paragraph', text: 'Desde la Terapia Cognitivo-Conductual usamos el modelo A-B-C:'},
                    { type: 'list', items: ['A (Acontecimiento): Lo que pasa. Ej: Tu jefe te encarga algo urgente.', 'B (Creencia o pensamiento): Lo que piensas. Ej: “No voy a dar la talla”.', 'C (Consecuencia): Cómo te sientes y actúas. Ej: Ansiedad + bloqueo + trabajar con angustia.']},
                    { type: 'paragraph', text: 'Solemos creer que A causa directamente C, pero en realidad, lo que te estresa no es solo lo que pasa, sino cómo lo interpretas.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'Un mismo hecho, dos emociones distintas',
                content: [
                    { type: 'paragraph', text: 'Situación: Tu pareja no contesta a tu mensaje en horas.'},
                    { type: 'list', items: ['Pensamiento 1: “Está enfadado/a conmigo” → Ansiedad, inseguridad.', 'Pensamiento 2: “Estará ocupado/a” → Calma, paciencia.']},
                    { type: 'paragraph', text: 'La misma situación puede vivirse con emociones muy diferentes según el pensamiento que la acompaña.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'Las distorsiones cognitivas: filtros mentales que aumentan tu estrés',
                content: [
                    { type: 'paragraph', text: 'Nuestro cerebro tiende a interpretar la realidad con atajos que a veces fallan. Estas distorsiones son formas automáticas y poco realistas de pensar que exageran lo negativo, minimizan lo positivo o interpretan las cosas de forma rígida. Aprender a identificarlas te permite ganar claridad y aliviar tu carga emocional.'},
                    { 
                        type: 'collapsible',
                        title: 'Aquí tienes una descripción breve de las más frecuentes, con ejemplos:',
                        content: [
                            { type: 'list', items: [
                                'Catastrofismo: Imaginar el peor escenario como inevitable. Ejemplo: “Si fallo esta presentación, arruinaré mi carrera.”',
                                'Pensamiento dicotómico (todo o nada): Ver todo en extremos, sin matices. Ejemplo: “Si no lo hago perfecto, es un fracaso.”',
                                'Sobregeneralización: Extraer una conclusión general a partir de un solo hecho negativo. Ejemplo: “Me equivoqué una vez, siempre lo hago mal.”',
                                'Personalización: Creer que todo lo que pasa tiene que ver contigo. Ejemplo: “Están serios, seguro hice algo mal.”',
                                'Adivinación del pensamiento o del futuro: Suponer sin evidencia qué piensan los demás o lo que ocurrirá. Ejemplo: “No respondió el mensaje, seguro está molesto conmigo.”',
                                'Abstracción selectiva: Fijarse solo en lo negativo y pasar por alto lo positivo. Ejemplo: “Me equivoqué en una palabra, así que todo salió mal.”',
                                'Razonamiento emocional: Creer que algo es verdad solo porque lo sientes intensamente. Ejemplo: “Me siento inútil, así que debo serlo.”',
                                '“Deberías” rígidos: Imponerse normas estrictas que generan culpa o presión. Ejemplo: “Debería poder con todo sin quejarme.”',
                                'Minimizar lo positivo / Maximizar lo negativo: Restar valor a los logros y agrandar los errores. Ejemplo: “Sí, me felicitaron, pero seguro fue por compromiso.”',
                                'Perfeccionismo: Necesidad de cumplir con estándares imposibles. Ejemplo: “Si no es perfecto, no vale la pena.”',
                                'Comparación negativa: Compararte solo con lo que te falta respecto a otros. Ejemplo: “Ella gana más que yo, así que soy un fracaso.”',
                                'Falacia del control: Creer que todo depende de ti o que no tienes control en absoluto. Ejemplo: “Si mi hijo no está bien, es culpa mía.”',
                                'Exageración de la responsabilidad: Sentirse culpable de todo lo que ocurre, incluso sin pruebas. Ejemplo: “Si algo sale mal, será por mi culpa.”',
                'Distorsión del tiempo: Creer que lo que vives ahora será así para siempre. Ejemplo: “Nunca voy a salir de esto.”',
                                'Túnel atencional negativo: Solo ver lo que falta o lo que está mal. Ejemplo: “Hoy ha sido horrible porque tuve una discusión”, ignorando que el resto del día fue positivo.'
                            ]},
                            { type: 'paragraph', text: 'Detectarlas no significa eliminarlas de golpe, pero sí abrir un espacio para mirar con más claridad y cuidarte mejor.'}
                        ]
                    }
                ]
            },
            {
                type: 'collapsible',
                title: '¿Qué hacer cuando detectas un pensamiento negativo?',
                content: [
                    { type: 'paragraph', text: 'No se trata de forzarte a “pensar en positivo”, sino de pensar de forma más realista y compasiva. Puedes preguntarte:'},
                    { type: 'list', items: ['¿Qué evidencia tengo de que esto sea cierto?', '¿Estoy exagerando o anticipando?', '¿Qué le diría a alguien que quiero si pensara esto?', '¿Este pensamiento me ayuda o me hace daño?']},
                    { type: 'paragraph', text: 'Este proceso se llama reestructuración cognitiva: es como entrenar tu mente para dejar de castigarte y empezar a hablarte de otra forma.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'Desde la neurociencia: por qué funciona',
                content: [
                    { type: 'paragraph', text: 'Cuando reinterpretas una situación, activas nuevas redes neuronales. Tu corteza prefrontal (la parte que decide) toma protagonismo frente al sistema límbico (la parte reactiva). Así, pasas de reaccionar por impulso a responder con claridad.\nTus pensamientos no siempre son verdad. Son interpretaciones. Y puedes aprender a elegir las que te cuidan.'}
                ]
            },
            { type: 'quote', text: 'No puedes parar las olas, pero puedes aprender a surfear tus pensamientos.' },
            { type: 'title', text: 'Técnicas Específicas'},
            { 
              type: 'detectiveExercise', 
              title: 'Ejercicio 1: Detective de Pensamientos Estresantes', 
              objective: 'En este ejercicio vas a convertirte en un detective de tu propia mente. Aprenderás a observar esos pensamientos automáticos que te sobrecargan, detectar los filtros que distorsionan tu percepción y reformularlos con una mirada más realista, flexible y amable. Esto fortalecerá tu conciencia emocional y te ayudará a regular ese diálogo interno que, a veces, se vuelve demasiado exigente.',
            },
            { 
              type: 'demandsExercise', 
              title: 'Ejercicio 2: Tabla de Exigencias vs. Deseos Reales', 
              objective: 'En este ejercicio vas a observar con honestidad tus propias exigencias internas y diferenciarlas de tus verdaderos deseos y necesidades. Aprenderás a soltar los "debería" que te presionan y a reformularlos con una mirada más compasiva. Este proceso te ayudará a liberar tu mente del exceso de autoexigencia y a reconectar con una forma de cuidarte más humana, realista y sostenible.',
            },
            { type: 'title', text: 'Resumen Clave' },
            { type: 'list', items: ['El estrés no solo viene de fuera, sino de cómo interpretas lo que ocurre.', 'Tus pensamientos automáticos pueden aumentar o aliviar tu malestar.', 'Las distorsiones cognitivas son filtros mentales que puedes aprender a detectar.', 'Reestructurar es entrenar la mente para pensar con más claridad, flexibilidad y compasión.', 'No eres lo que piensas: eres quien decide cómo responder a lo que piensa.'] },
            { type: 'quote', text: 'No eres lo que piensas. Eres quien decide cómo responder a esos pensamientos.' }
        ]
    },
    {
        id: 'estres_sem4',
        title: 'Semana 4: Plan de Acción y Prevención de Recaídas',
        type: 'summary',
        estimatedTime: '15-20 min',
        content: [
            { type: 'paragraph', text: 'Esta semana vas a consolidar todo lo aprendido creando tu propio plan de bienestar emocional. El objetivo es que desarrolles una herramienta personalizada para prevenir recaídas, cuidarte en los momentos difíciles y responder con más conciencia cuando el estrés reaparezca. Tener un plan no significa eliminar el estrés, sino recordarte que tienes recursos para afrontarlo con calma, flexibilidad y autocompasión.'},
            { type: 'title', text: 'Psicoeducación' },
            { type: 'paragraph', text: 'De la teoría a la práctica: tu plan personal para sostenerte\nEl estrés no desaparece para siempre. Vuelve en forma de tareas acumuladas, expectativas, interrupciones o pensamientos exigentes. Por eso, el objetivo de esta semana es ayudarte a crear tu propio plan de acción: un mapa de recursos, señales de alerta y estrategias que te ayuden a cuidarte cuando lo necesites.\nMás adelante, en la Técnica 1, empezarás a diseñar tu plan personalizado.\nPero antes, necesitas entender para qué sirve, cuáles son sus partes y cómo te ayuda a sostenerte en los momentos difíciles. Este contexto será tu base para crear algo realmente útil y tuyo.\nEste plan no es un protocolo rígido. Es una herramienta viva, ajustada a tu realidad y fortalecida por todo lo que has aprendido. Aquí no buscamos perfección, sino continuidad. Porque prevenir recaídas no es evitar el estrés, sino prepararte para responder con mayor conciencia cuando vuelva a aparecer.'},
            {
                type: 'collapsible',
                title: 'Etapa 1: Evaluación y conciencia',
                content: [
                    { type: 'paragraph', text: 'Todo buen plan empieza por observarte.\nDurante estas semanas, has aprendido a identificar cómo se activa el estrés en ti: qué lo dispara, cómo reacciona tu cuerpo, qué pensamientos se repiten y qué emociones se intensifican. Ahora es momento de consolidar esa información para que se convierta en una alerta temprana que te ayude a actuar antes de desbordarte.\n¿Cómo saber que el estrés está empezando a subir?'},
                    { type: 'list', items: ['Me cuesta dormir o me despierto cansado/a', 'Tensión muscular (cuello, mandíbula, pecho)', 'Me irrito o me siento desconectada/o sin saber por qué', 'Me aíslo o aumento conductas evasivas (pantallas, comida, control excesivo)', 'Vuelvo a pensar “no puedo con esto” o “tengo que hacerlo todo perfecto”']},
                    { type: 'paragraph', text: 'Detectar estas señales no es debilidad. Es autoconocimiento.'}
                ]
            },
            {
                type: 'collapsible',
                title: 'Etapa 2: Objetivos y estrategias',
                content: [
                    { type: 'paragraph', text: 'Tu plan de acción se construye sobre lo que ya has practicado. No necesitas hacerlo perfecto, sino contar con algunas herramientas bien integradas que puedas activar cuando lo necesites.\nEstrategias cognitivas:'},
                    { type: 'list', items: ['Reestructuración cognitiva: detectar pensamientos automáticos y transformarlos en versiones más amables', 'Autoinstrucciones positivas: Ej. “Estoy haciendo lo que puedo con lo que tengo”', 'Identificación de pensamientos exigentes (Semana 3)']},
                    { type: 'paragraph', text: 'Estrategias conductuales:'},
                    { type: 'list', items: ['Respiración diafragmática, 4-2-6', 'Anclaje sensorial 5-4-3-2-1', 'Escaneo corporal breve', 'Registro emocional y frases ancla compasivas']},
                    { type: 'paragraph', text: 'Contenido extra disponible en la app: (otras rutas o recursos)'},
                    { type: 'list', items: ['Resolución de problemas', 'Planificación del placer y tiempo', 'Asertividad y habilidades sociales', 'Otros recursos (Gestión del estrés y ansiedad)']}
                ]
            },
            {
                type: 'collapsible',
                title: 'Etapa 3: Prevención de recaídas',
                content: [
                    { type: 'paragraph', text: 'Recaer no es fracasar. Es aplicar lo aprendido en un nuevo ciclo.\nSeñales tempranas de recaída:'},
                    { type: 'list', items: ['Autoexigencia creciente', 'Abandono de rutinas de autocuidado', 'Pensamientos rígidos o catastrofistas']},
                    { type: 'paragraph', text: 'Qué hacer si te sientes desbordada/o:'},
                    { type: 'list', items: ['Pausa y observa: “¿Qué me está activando? ¿Qué parte de mí necesita cuidado?”', 'Evita la catastrofización: Un mal día no borra tus avances', 'Vuelve a lo básico: respiración, frase ancla, conectar contigo', 'Activa tu red de apoyo: no tienes que sostenerte sola/o']}
                ]
            },
            { type: 'title', text: 'Técnicas Específicas'},
            {
                type: 'wellbeingPlanExercise',
                title: 'Ejercicio 1: Diseña tu Plan de Bienestar Emocional',
                objective: 'Esta técnica te ayuda a crear un plan práctico y realista para prevenir recaídas. Vas a identificar tus señales personales de sobrecarga, elegir las estrategias que mejor te funcionan y definir rutinas mínimas de cuidado diario. El objetivo es que salgas de esta ruta sabiendo cómo cuidarte mejor en los momentos difíciles, aumentando así tu sensación de control, seguridad y confianza personal.',
            },
            {
              type: 'imaginedCrisisRehearsalExercise',
              title: 'Ejercicio 2: Ensayo de Crisis Imaginaria',
              objective: 'Este ejercicio te permite imaginar una situación de alto estrés desde el yo que eres hoy, con más herramientas, conciencia y autocompasión. Visualizar cómo te cuidarías ante una crisis fortalece tu confianza y refuerza la sensación de que tienes un plan posible cuando todo se vuelve difícil.',
              duration: '10-15 min',
              audioUrl: "https://workwellfut.com/audios/r1_desc/Sesion-4-tecnica-2-ensayo-de-crisis-imaginaria.mp3",
            },
            { type: 'title', text: 'Resumen Clave de la Semana'},
            { type: 'list', items: ['El estrés no desaparece, pero puedes prepararte para atravesarlo con más conciencia.', 'Tener un plan personal te permite actuar antes de desbordarte.', 'Reconocer tus señales tempranas es una forma de autocuidado.', 'Recaer no es fracasar: es una oportunidad de aplicar lo aprendido.']},
            { type: 'quote', text: 'Tener un plan no evita el estrés, pero te recuerda que sabes cómo cuidarte cuando aparezca.'}
        ]
    }
  ],
};

    

