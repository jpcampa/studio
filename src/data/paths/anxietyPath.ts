
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
        { type: 'paragraph', text: '¿Has sentido alguna vez que la ansiedad se apodera de ti sin darte respiro? Ese nudo en el estómago, el corazón acelerado, la mente repitiendo “¿y si pasa lo peor?”.\nLa ansiedad es una respuesta natural del cuerpo y la mente ante posibles amenazas. Su función es protegerte, pero cuando se vuelve intensa, frecuente o difícil de manejar, puede convertirse en una trampa que limita tu vida.\nEn esta ruta vas a aprender, paso a paso, a entender tu ansiedad sin luchar contra ella, a calmar tu cuerpo para calmar tu mente, a observar los pensamientos sin quedarte atrapado/a en ellos y a dar pequeños pasos hacia aquello que hoy evitas. Todo con herramientas prácticas avaladas por la ciencia, fáciles de entrenar en tu día a día.\nAl final de estas 4 semanas, tendrás un mapa claro y personal de regulación para no dejar que la ansiedad te paralice, sino aprender a caminar junto a ella con confianza.' },
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
        {
            type: 'collapsible',
            title: 'Resumen clave de la semana',
            content: [
                { type: 'paragraph', text: 'Ahora que entiendes mejor cómo funcionan los pensamientos ansiosos (anticipatorios, catastrofistas, bucles) y cómo la amígdala puede secuestrar tu mente, pasamos a lo más importante: las técnicas que te ayudarán a no engancharte a esos pensamientos.\nRecuerda: no buscamos que dejen de aparecer, sino que aprendas a mirarlos de frente, sin miedo, hasta que dejen de arrastrarte.'}
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
    }
  ]
};

    