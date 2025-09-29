
import type { Path } from '../pathsData';

export const anxietyPath: Path = {
  id: 'regular-ansiedad-paso-a-paso',
  title: 'Regular la Ansiedad Paso a Paso',
  description: 'Aprende a entender tu ansiedad sin luchar contra ella, a calmar tu cuerpo para calmar tu mente y a dar pequeños pasos hacia aquello que hoy evitas.',
  dataAiHint: 'anxiety mindfulness calm',
  modules: [
    {
      id: 'ansiedad_sem1',
      title: 'Semana 1: Entiende tu Ansiedad, no la Pelees',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Te has dado cuenta de que muchas veces lo que más asusta no es la situación en sí, sino las sensaciones que aparecen en tu cuerpo? Esa taquicardia, ese nudo en el estómago, esa mente que corre sin parar.\nEsta primera semana aprenderás a mirar la ansiedad de frente, a entender cómo funciona y a descubrir que no es un enemigo, sino una señal que puedes aprender a interpretar.\nPiensa en ella como una alarma: no siempre indica fuego real, a veces solo está demasiado sensible.' },
        { type: 'title', text: 'Psicoeducación' },
        { 
            type: 'collapsible',
            title: 'La ansiedad: molesta, pero con sentido',
            content: [
                { type: 'paragraph', text: 'La ansiedad no es tu enemiga, aunque a veces lo parezca.\nEs esa compañera molesta e incómoda que aparece justo cuando menos la quieres: antes de una reunión importante, en la cama cuando intentas dormir, o de camino a un sitio que te importa. Te fastidia, y mucho. Nadie quiere vivir con el corazón acelerado, la mente disparada y esa sensación de no estar en control.\nPero, si la miramos desde otra perspectiva, la ansiedad tiene un propósito: tu cuerpo se activa para protegerte, como si se encendiera una alarma interna. El problema aparece cuando esa alarma salta demasiado fuerte o demasiado a menudo, incluso sin peligro real. Y ahí es cuando pasa de ser útil a ser un obstáculo.\nEn esta ruta no vamos a “eliminar la ansiedad”, sino a aprender a regularla. A bajarle el volumen para que deje de dirigir tu vida.' }
            ]
        },
        { 
            type: 'collapsible',
            title: 'Ansiedad adaptativa vs. ansiedad disfuncional',
            content: [
                { type: 'paragraph', text: 'No toda ansiedad es mala, aunque lo parezca.\n🔹 Ansiedad adaptativa\n•\tTe mantiene alerta y enfocado/a.\n•\tPor ejemplo, esos nervios antes de un examen que te ayudan a estudiar con más energía.\n🔹 Ansiedad disfuncional\n•\tSe enciende sin motivo claro o de forma desproporcionada.\n•\tEn lugar de ayudarte, te bloquea: no duermes, evitas situaciones, piensas sin parar en lo peor.\n•\tEs como una alarma que suena cada dos por tres, incluso sin fuego.\nLa clave no es luchar contra la ansiedad, sino distinguir cuándo te está ayudando y cuándo te está saboteando.\nPiensa en tu ansiedad como un detector de humo demasiado sensible: no distingue entre el vapor de la ducha y un incendio real. El problema no eres tú, es que tu sistema de alarma está calibrado demasiado alto.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'Tu sistema nervioso en acción',
            content: [
                { type: 'paragraph', text: 'La ansiedad vive en tu cuerpo, no solo en tu mente.\nTu sistema nervioso autónomo funciona como los pedales de un coche:\n•\tLa rama simpático pisa el acelerador 🚗💨 (sube la frecuencia cardíaca, la respiración, la tensión muscular).\n•\tLa rama parasimpático actúa como freno 🚦 (calma, ayuda a la digestión y al descanso).\nCuando la ansiedad aparece, es como si tu pedal del acelerador se quedara atascado, incluso en situaciones normales. Por eso sientes palpitaciones, respiración corta, mareo o tensión. No es que estés “loco/a”: es que tu cuerpo está reaccionando como si hubiera un peligro real.\nAdemás, tu cuerpo libera adrenalina y cortisol, las hormonas del estrés. A corto plazo te ponen en alerta, pero cuando se repiten demasiadas veces, te dejan agotado/a.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'Ansiedad, trastorno de ansiedad y ataque de pánico',
            content: [
                { type: 'paragraph', text: 'Si alguna vez te has preguntado: “¿Esto que me pasa es normal o es un trastorno?”, tranquilo/a: no eres el único. Aquí tienes una guía sencilla para ponerle nombre a lo que vives:\n🔹 Ansiedad normal o adaptativa\n•\tSurge ante un reto real (ej. entrevista, examen).\n•\tEs pasajera y baja sola cuando pasa la situación.\n🔹 Trastorno de ansiedad\n•\tLa activación es excesiva, frecuente o sin causa clara.\n•\tAfecta tu vida diaria: trabajo, descanso, relaciones.\n•\tPuede llevarte a evitar lugares o situaciones.\n•\tNecesita abordaje terapéutico para recuperar equilibrio.\n🔹 Ataque de pánico\n•\tIrrumpe de golpe, con síntomas intensos: taquicardia, falta de aire, mareo, sensación de “morirme” o “perder el control”.\n•\tAunque asusta mucho, no es peligroso: el cuerpo no puede sostener esa activación y termina bajando.\n•\tPuede aparecer dentro de un trastorno de pánico o de forma aislada.\nEjemplo sencillo:\n•\tAnsiedad → nervios antes de una charla.\n•\tTrastorno de ansiedad → semanas sin dormir porque temes no dar la charla.\n•\tAtaque de pánico → de repente tu cuerpo explota en síntomas, aunque estés tranquilo/a en casa.\nNo es para etiquetarte, sino para que sepas reconocer lo que vives y cómo trabajarlo. Y recuerda: incluso en los casos más intensos, la ansiedad se puede mejorar.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'La ansiedad tiene un lenguaje',
            content: [
                { type: 'paragraph', text: 'La ansiedad se comunica contigo a través de síntomas. Algunos son más físicos (palpitaciones, sudor, tensión muscular) y otros más mentales (preocupaciones, pensamientos de “y si…”).\nPiensa en ella como un mensajero pesado: insiste en llamar a tu puerta, aunque no siempre traiga noticias importantes.\n•\tSi le cierras de golpe, insiste más.\n•\tSi le escuchas con calma, puedes decidir qué hacer con el mensaje.\nEste proceso suele convertirse en un círculo de la ansiedad:\n1.\tAparece un síntoma (ej. taquicardia).\n2.\tTu mente lo interpreta como peligro (“me va a dar algo”).\n3.\tEsa interpretación dispara más síntomas.\n4. \tY así se forma la bola de nieve.\nLo que rompe el círculo no es evitar, sino aprender a interpretar de otra forma lo que ocurre.' }
            ]
        },
        {
            type: 'collapsible',
            title: 'No luches contra la ansiedad',
            content: [
                { type: 'paragraph', text: 'Cuando la ansiedad aparece, lo primero que solemos pensar es: “¡Quiero que se vaya ya!”. Pero aquí ocurre algo paradójico: cuanto más intentas forzarla a desaparecer, más se intensifica. Es como si tu cerebro interpretara: “Esto es tan peligroso que necesito luchar con todas mis fuerzas”.\nY entonces, en lugar de calmarse, tu sistema nervioso se activa aún más.\nLa ciencia —desde la psicología cognitivo-conductual hasta la neurociencia— nos muestra otra vía mucho más eficaz:\n•\tObservar sin juzgar → como si vieras pasar una nube en el cielo, que se desplaza sola sin que tengas que empujarla.\n•\tDarle un espacio controlado → dejar que esté ahí, pero sin que ocupe todo tu campo de visión.\n•\tUsar técnicas corporales y mentales → tu respiración, tu atención y tus recursos internos actúan como anclas que ayudan a que la ola de ansiedad suba… y después vuelva a bajar, como siempre lo hace.\nEjemplo: imagina un globo que intentas meter bajo el agua. Cuanto más lo fuerzas hacia abajo, más salta hacia arriba. Pero si lo sueltas, el globo se queda flotando. Lo mismo pasa con la ansiedad: si dejas de pelearte con ella, pierde fuerza y tú recuperas la capacidad de decidir cómo sostenerla.\nImportante: muchas veces recurrimos a la evitación para lidiar con la ansiedad (no ir a un sitio, no hacer algo). Eso da alivio inmediato, pero refuerza el miedo: tu cerebro aprende que “menos mal que lo esquivé, porque era peligroso”. Con el tiempo, la evitación se convierte en gasolina para la ansiedad.\nNo se trata de eliminar la ansiedad, sino de recuperar el mando. Tú puedes estar en el asiento del conductor, incluso cuando la ansiedad viaja de copiloto.' }
            ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { 
            type: 'ansiedadTieneSentidoExercise',
            title: 'MI ANSIEDAD TIENE SENTIDO CUANDO…',
            objective: 'Aprender a diferenciar cuándo tu ansiedad tiene un sentido adaptativo y a identificar cuándo se vuelve excesiva, reconociendo cómo el miedo a la ansiedad alimenta el círculo.',
            duration: '8-10 min',
        },
        {
            type: 'visualizacionGuiadaCuerpoAnsiedadExercise',
            title: 'VISUALIZACIÓN GUIADA DEL CUERPO EN ANSIEDAD',
            objective: 'Reconocer las sensaciones de la ansiedad sin luchar contra ellas, comprendiendo que aunque son incómodas, no son peligrosas.',
            duration: '10-12 min',
        },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Qué he descubierto sobre mi manera de interpretar la ansiedad?',
            '¿Qué sensaciones me resultan más difíciles de aceptar y qué pensamientos suelen acompañarlas?',
            '¿Qué diferencia noto entre luchar contra la ansiedad y observarla con curiosidad?'
        ]},
        { type: 'title', text: 'Resumen Clave' },
        { type: 'list', items: [
            'La ansiedad es molesta pero no es tu enemiga: es una señal de alarma que a veces se desajusta.',
            'Distinguir entre ansiedad adaptativa y disfuncional ayuda a no pelearte con ella.',
            'Tu sistema nervioso funciona como pedales: acelerador (simpático) y freno (parasimpático).',
            'No es lo mismo ansiedad, trastorno de ansiedad o ataque de pánico: conocer la diferencia te da claridad.',
            'Los síntomas físicos y mentales de la ansiedad son mensajes, no peligros en sí mismos.',
            'Luchar contra la ansiedad la intensifica; observarla y darle espacio la calma.',
            'Evitar situaciones da alivio momentáneo, pero alimenta el círculo del miedo.'
        ]},
        { type: 'quote', text: 'La ansiedad no es un monstruo a vencer, sino una alarma que puedes aprender a escuchar y regular con calma.' }
      ]
    },
    {
      id: 'ansiedad_sem2',
      title: 'Semana 2: Calma el Cuerpo para Calmar la Mente',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
          { type: 'paragraph', text: 'Cuando la ansiedad llega, parece que no hay botón de pausa. El cuerpo se acelera y la mente se llena de pensamientos catastróficos. Esta semana vas a descubrir que sí existe una forma de frenar: aprenderás técnicas sencillas para interrumpir la escalada, bajar la activación y recuperar el control. Como un piloto que activa el freno de emergencia para estabilizar el avión, tú también puedes activar tus recursos internos para volver a sentir seguridad.'},
          { type: 'title', text: 'Psicoeducación' },
          {
            type: 'collapsible',
            title: 'El cuerpo como regulador directo',
            content: [{ type: 'paragraph', text: 'Cuando la ansiedad aparece, lo que pasa es que el acelerador (sistema nervioso simpático) se queda pisado, aunque no haya peligro real. Lo que aprenderás aquí es a tocar el freno (sistema nervioso parasimpático) de forma intencional con técnicas sencillas de respiración, relajación y movimiento consciente.' }]
          },
          {
            type: 'collapsible',
            title: 'El freno vagal: tu sistema de calma natural',
            content: [{ type: 'paragraph', text: 'Hay un “cable maestro” que conecta tu cuerpo con tu cerebro: el nervio vago. Puedes imaginarlo como un freno interno que, cuando lo activas, manda el mensaje a tu cerebro de: “no hay peligro, puedes bajar la guardia”. Se activa con cosas muy sencillas: respirar lento y profundo o alargar la exhalación más que la inhalación.' }]
          },
          { type: 'title', text: 'Técnicas Específicas de Relajación' },
          { type: 'paragraph', text: 'A continuación, te presentamos una serie de técnicas físicas de regulación emocional, validadas por la ciencia, que puedes practicar a diario. Elige las que más te ayuden y repítelas con constancia.' },
         
          { type: 'collapsible', title: 'Exhalación Prolongada (1:2)', content: [{ type: 'paragraph', text: 'Alarga más la exhalación que la inhalación (ej: inhala 3, exhala 6). Este gesto activa el nervio vago y baja la frecuencia cardíaca de forma rápida.' }] },
          { type: 'collapsible', title: 'Relajación Muscular Progresiva (Jacobson)', content: [{ type: 'paragraph', text: 'Tensa y suelta diferentes grupos musculares (piernas, abdomen, cara...). Ayuda a liberar la tensión física acumulada y a reconocer cuándo estás tenso/a.' }] },
          { type: 'collapsible', title: 'Body Scan Breve (Escaneo Corporal)', content: [{ type: 'paragraph', text: 'Recorre mentalmente tu cuerpo de pies a cabeza, observando lo que sientes sin juzgar. Aumenta la tolerancia a los síntomas de ansiedad.' }] },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [ '¿Qué técnica me ha resultado más útil o fácil de practicar esta semana?', '¿Qué cambios he notado en mi cuerpo y en mi mente después de entrenarla?', '¿Qué situación concreta podría empezar a afrontar aplicando una de estas herramientas?'] },
          { type: 'quote', text: 'Tu cuerpo puede ser tu mejor aliado contra la ansiedad: cuando lo calmas, tu mente vuelve a encontrar claridad y equilibrio.'}
      ]
    },
    {
      id: 'ansiedad_sem3',
      title: 'Semana 3: Domina el Pensamiento Ansioso sin Evitarlo',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
          { type: 'paragraph', text: 'La ansiedad suele engañarnos con un truco: confunde lo posible con lo probable. “¿Y si…?” se convierte en un túnel sin salida. Esta semana aprenderás a dar un paso atrás, a mirar tus pensamientos sin creerlos al 100% y a abrir la puerta a alternativas más realistas. Se trata de entrenar tu mente para no quedar atrapada en el catastrofismo y encontrar nuevas formas de interpretar lo que pasa.' },
          { type: 'title', text: 'Psicoeducación' },
          { type: 'collapsible', title: 'El invitado pesado de tu mente: los pensamientos anticipatorios', content: [{ type: 'paragraph', text: 'Cuando la ansiedad aparece, tu mente suele adelantarse al futuro con preguntas como “¿Y si me pasa algo malo?”. Estos pensamientos no hablan de lo que ocurre ahora, sino de lo que podría pasar. El cerebro los crea para protegerte, pero a menudo exagera la amenaza.' }] },
          { type: 'collapsible', title: 'El secuestro emocional: cuando manda la amígdala', content: [{ type: 'paragraph', text: 'En un pico de ansiedad, ocurre el “secuestro emocional”: la amígdala, tu detector de humo interno, se enciende con tanta fuerza que casi apaga tu parte racional. Resultado: piensas en bucle y sientes que te bloqueas.' }] },
          { type: 'collapsible', title: 'No se trata de luchar, sino de observar', content: [{ type: 'paragraph', text: 'La clave es dejar de creer que todo lo que pasa por tu mente es cierto. Imagina que tus pensamientos son coches pasando por una carretera: puedes elegir quedarte en la acera y mirarlos, en lugar de subirte a cada uno y dejar que te lleve.' }] },
          { type: 'title', text: 'Técnicas Específicas' },
          { type: 'stopExercise', title: 'EJERCICIO 1: STOP - Ponle un alto al piloto automático', objective: 'Con esta técnica aprenderás un “botón de pausa mental” que interrumpe el bucle ansioso y te devuelve al presente en menos de un minuto.', duration: '2-3 min' },
          { type: 'questionYourIfsExercise', title: 'EJERCICIO 2: Cuestiona tus “¿Y si…?” con la lupa de la realidad', objective: 'Aprende a poner tus preguntas ansiosas bajo una lupa, en lugar de darlas por hechas. Así tu mente pasa de la catástrofe a un análisis más realista.', duration: '7-9 min' },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: ['¿Qué he descubierto sobre la manera en que mi mente anticipa y exagera escenarios?', '¿Qué me pasa cuando confundo posibilidad con probabilidad?', '¿Qué compromiso quiero llevarme para el futuro cuando aparezca la ansiedad?'] },
          { type: 'quote', text: 'No tienes que apagar cada pensamiento ansioso; basta con aprender a no dejar que te arrastre.'}
      ]
    },
    {
      id: 'ansiedad_sem4',
      title: 'Semana 4: Enfréntate sin Forzarte, Avanza con Cuidado',
      type: 'summary',
      estimatedTime: '20-25 min',
      content: [
          { type: 'paragraph', text: 'El gran reto de la ansiedad no es pensar menos, sino evitar menos. Cuanto más esquivamos lo que tememos, más fuerte se hace el miedo. Esta última semana vas a aprender a enfrentarte de manera progresiva y cuidada, paso a paso, sin forzarte. Será como subir una escalera: cada peldaño te acerca a la libertad, y no hace falta correr para llegar arriba. Lo importante es avanzar, aunque sea despacio, y comprobar con tus propios ojos que puedes sostener la ansiedad y seguir adelante.' },
          { type: 'title', text: 'Psicoeducación' },
          { type: 'collapsible', title: 'La trampa de la evitación', content: [{ type: 'paragraph', text: 'Cuando algo nos genera ansiedad, la reacción más natural es evitarlo. El problema es que ese alivio dura muy poco. La evitación es como echar gasolina al fuego: cuanto más evito, más confirmo a mi cerebro la idea de que “ese peligro es real”. La única manera de que la ansiedad se reduzca de verdad es atravesándola, no esquivándola.' }] },
          { type: 'collapsible', title: 'Exposición progresiva: avanzar sin forzarte', content: [{ type: 'paragraph', text: 'No consiste en lanzarse a lo más difícil de golpe, sino en entrenar el sistema nervioso con pasos pequeños y repetidos. Es como subir una escalera: no saltamos hasta arriba en un solo movimiento, vamos peldaño a peldaño.' }] },
          { type: 'collapsible', title: 'La confianza se entrena', content: [{ type: 'paragraph', text: 'Cada exposición que realizas es como añadir una ficha a tu “banco de confianza”. Con el tiempo, esa sensación de “no puedo” se transforma en “sí puedo, aunque me cueste”. No buscamos eliminar la ansiedad, sino aumentar la confianza en ti mismo o en ti misma.' }] },
          { type: 'title', text: 'Técnicas Específicas' },
          { type: 'exposureLadderExercise', title: 'EJERCICIO 1: ESCALERA DE EXPOSICIÓN PERSONAL', objective: 'Construye, peldaño a peldaño, un camino seguro hacia esas situaciones que hoy parecen demasiado grandes. Diseñarás tu propio plan progresivo para entrenar a tu cerebro y a tu cuerpo a confiar más en ti.', duration: '10-15 min' },
          {
            type: 'calmVisualizationExercise',
            title: 'EJERCICIO 2: “ME VEO HACIÉNDOLO CON CALMA”',
            objective: 'Usa tu imaginación como herramienta. Cuando visualizas que te enfrentas a una situación temida de forma calmada, entrenas a tu sistema nervioso para responder con menos alarma en la vida real.',
            duration: '8-10 min',
            audioUrl: 'https://workwellfut.com/audios/rm/R13_me_veo.mp3'
          },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Ruta', prompts: ['¿Qué descubriste sobre cómo funciona tu ansiedad y las señales que te da tu cuerpo?', '¿Qué estrategias has comprobado que te ayudan más a calmarte?', '¿Qué peldaños de tu escalera de exposición ya has subido y qué aprendizajes trajeron consigo?'] },
          { type: 'quote', text: '“La ansiedad no desaparece huyendo de ella, sino aprendiendo a caminar con ella hasta que deja de asustar.”' }
      ]
    }
  ]
};
    

    

    