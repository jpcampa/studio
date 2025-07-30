import type { Path } from '../pathsData';

export const settingBoundariesPath: Path = {
  id: 'poner-limites',
  title: 'Poner Límites con Respeto y Firmeza',
  description: 'Aprende a decir “no” sin culpa y a proteger tu espacio emocional, construyendo relaciones más sanas y una conexión más auténtica contigo.',
  dataAiHint: 'boundaries respect communication',
  modules: [
    {
      id: 'limites_sem1',
      title: 'Semana 1: Entiende qué es un Límite y por qué Cuesta Tanto',
      type: 'introduction',
      estimatedTime: '25-30 min',
      content: [
        { type: 'paragraph', text: '¿Te ha pasado que dices que "sí" aunque querías decir "no"?\n¿O que sales de una conversación con una sensación de incomodidad por no haber expresado algo importante?\nEsta semana vamos a explorar el verdadero significado de los límites: no como un muro que separa, sino como un puente que te conecta contigo y con los demás desde el respeto. Aprenderás por qué nos cuesta tanto ponerlos, qué emociones aparecen y cuáles son tus patrones más comunes cuando no logras expresarte.\nVerás que poner un límite no es rechazar a nadie: es incluirte también a ti en la relación.\nCada vez que te eliges con respeto, estás entrenando tu autoestima.' },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Qué es un límite personal?',
          content: [
            { type: 'paragraph', text: 'Un límite no es un rechazo. Tampoco es egoísmo, ni frialdad, ni falta de empatía.\nUn límite es una forma de autocuidado. Es decirle al mundo: esto es lo que necesito para estar bien.\nEs marcar dónde termina lo que puedes sostener sin dañarte, y dónde empieza lo que ya no es negociable para ti.\nPoner límites es una forma de proteger lo que te importa: tu energía, tu tiempo, tu dignidad, tu espacio interno.\nUn límite no siempre se expresa con un “no” tajante. A veces es un silencio interrumpido por una frase honesta. A veces es una distancia, una aclaración, un cambio de ritmo.\nLo importante no es la forma, sino la intención: cuidar de ti sin dañar al otro.\nCuando te atreves a marcar un límite:\n• Te haces visible en la relación.\n• Enseñas a los demás cómo deseas ser tratada o tratado.\n• Previenes el desgaste emocional que viene de acumular malestar.\n• Ganas coherencia interna, porque empiezas a vivir en sintonía con lo que sientes y valoras.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Mitos y bloqueos más comunes',
          content: [
            { type: 'paragraph', text: 'Lo que más cuesta a la hora de poner un límite no es encontrar las palabras adecuadas…\nsino lidiar con lo que sentimos cuando lo intentamos.\nTal vez aparece el miedo al conflicto, el temor a decepcionar, la culpa por priorizarte o la sensación de que si hablas, algo se va a romper.\nOtras veces hay una vocecita dentro de ti que dice:\n“No quiero parecer exagerada/o”, “mejor no molesto”, “igual estoy siendo egoísta”...\nEstos pensamientos y emociones no te hacen débil. Te hacen humana, humano.\nTodos arrastramos creencias aprendidas sobre lo que “se espera de nosotros”: agradar, ceder, adaptarnos, no incomodar…\nPero también podemos revisarlas.\nY esta semana vas a empezar a hacerlo:\n• sin juicio,\n• con herramientas concretas,\n• y al ritmo que tú elijas.' }
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'mapOfUnsaidThingsExercise',
          title: 'Ejercicio 1: Mapa de Mis No Dichos',
          objective: 'A veces eliges callar para evitar conflictos o proteger un vínculo. Este ejercicio te ayudará a observar cuándo y por qué eliges no expresarte, para que esas decisiones sean más libres y menos automáticas.',
          duration: '15-20 min'
        },
        {
          type: 'discomfortCompassExercise',
          title: 'Ejercicio 2: La Brújula del Malestar',
          objective: 'Este ejercicio te ayuda a entrenar esa conciencia: escuchar tus sensaciones físicas y emocionales como señales que te indican cuándo necesitas poner un límite.',
          duration: '10-15 min'
        },
      ]
    },
    {
      id: 'limites_sem2',
      title: 'Semana 2: Aprende a Decir lo que Necesitas',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
         { type: 'paragraph', text: '¿Te cuesta decir lo que sientes o necesitas sin sentir culpa? ¿Te da miedo que el otro se aleje si dices “no”?\nEsta semana vas a entrenar una habilidad esencial para tu bienestar emocional y relacional: comunicarte desde el respeto, sin herir y sin herirte.\nAprenderás a identificar tu estilo de comunicación y a expresarte con mayor claridad, firmeza y cuidado mutuo.\nPorque decir lo que piensas, sientes y necesitas no es egoísmo: es respeto.\nRespeto hacia ti, hacia el otro… y hacia el vínculo que comparten.' },
         { type: 'title', text: 'Psicoeducación' },
         {
           type: 'collapsible',
           title: '¿Qué es un estilo de comunicación?',
           content: [
             { type: 'paragraph', text: 'Para poder mejorar la forma en que te expresas, primero necesitas entender cómo lo haces ahora.\nY aquí entra un concepto clave: tu estilo de comunicación.\nNo se trata solo de lo que dices, sino de cómo lo dices:\n• Cómo pides las cosas.\n• Cómo reaccionas ante un conflicto.\n• Cómo dices que no (o si lo haces).\nEste estilo no es algo fijo. Está influido por tu historia: lo que viste en casa, lo que viviste en relaciones pasadas, lo que aprendiste sobre lo que “se puede” y “no se puede” decir.\nLa buena noticia es que todo eso se puede revisar y transformar. Cuando tomas conciencia de tu estilo, ganas libertad para elegir nuevas formas de comunicarte más honestas, cuidadosas y coherentes contigo y con los demás.' }
           ]
         },
         { type: 'title', text: 'Técnicas Específicas' },
         {
           type: 'assertivePhraseExercise',
           title: 'Ejercicio 1: Tu Frase Asertiva en 4 Pasos',
           objective: 'A veces sabes que necesitas decir algo… pero no encuentras las palabras. Esta técnica te acompaña paso a paso para expresar lo que sientes, lo que necesitas y lo que pides, con claridad y respeto.',
           duration: '10-15 min'
         },
         {
           type: 'noGuiltTechniquesExercise',
           title: 'Ejercicio 2: Caja de herramientas extra: frases para decir "no" sin culpa',
           objective: 'Quiero ayudarte a sentir que tienes derecho a decir ‘no’ sin sentirte egoísta, brusco o culpable. Estas frases son como pequeñas llaves para cuidar tus límites sin romper el vínculo.',
           duration: '5-10 min por técnica'
         },
      ]
    },
    {
      id: 'limites_sem3',
      title: 'Semana 3: Sostén la Incomodidad sin Ceder',
      type: 'skill_practice',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Te ha pasado que después de poner un límite te invade una sensación rara?\nComo si, en lugar de sentir alivio, apareciera culpa, duda o miedo.\nEsa incomodidad no significa que te hayas equivocado. Muchas veces, sentirte mal justo después de cuidar tus propios límites es una señal de que estás creciendo.\nEsta semana no vamos a evitar esa incomodidad. Vamos a mirarla de frente, comprenderla y sostenerla sin ceder.' },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Por qué me siento mal si hice lo correcto?',
          content: [
            { type: 'paragraph', text: 'Poner límites no siempre te hace sentir “bien”.\nY esto puede desorientarte: hiciste algo que sabías que necesitabas, pero aun así... te sientes mal.\nEste malestar puede venir en forma de:\n• Miedo al rechazo: “¿Y si se enfada?”, “¿Y si se aleja?”\n• Culpa: “Quizá fui demasiado tajante”, “¿Y si le hice daño sin querer?”\n• Duda: “¿Lo dije bien?”, “¿Exageré?”\nEstas sensaciones son normales. Lo que está ocurriendo no es que hayas hecho algo malo, sino que tu sistema emocional está desprogramando años de hábitos aprendidos: ceder, agradar, adaptarte, callarte o imponerte.' }
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'postBoundaryEmotionsExercise',
          title: 'Ejercicio 1: Registro de Emociones Post-Límite',
          objective: 'Cuando te atreves a marcar un límite, puede aparecer culpa, duda o ansiedad. Este ejercicio te ayuda a identificar y validar lo que sientes después, y a responderte con comprensión, no con juicio.',
          duration: '10-15 min'
        },
        {
          type: 'exercise',
          title: 'Ejercicio 2: Visualización del Yo Firme y Tranquilo',
          objective: 'Conectar con esa parte tuya que puede sostener un límite sin romperse, sin gritar, sin justificarse. Una parte firme, clara y tranquila.',
          duration: '5-8 min',
          content: [
            { type: 'paragraph', text: 'Busca un lugar tranquilo. Si puedes, siéntate con la espalda recta. Cierra los ojos o suaviza tu mirada.\nRespira. Escucha. Imagina. Y permite que tu “yo firme” te acompañe.\n🔊 Reproducir visualización guiada (duración: 6 minutos)\n... (resto del texto de la visualización)' }
          ]
        },
      ]
    },
    {
      id: 'limites_sem4',
      title: 'Semana 4: Construye Relaciones más Honestas',
      type: 'summary',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Te ha pasado que al empezar a poner límites… algunas personas se alejan y otras se acercan más?\nEsta semana vas a dar un paso profundo: integrar que poner límites no solo te cuida a ti… también transforma tus relaciones.\nVerás que quienes te quieren bien se adaptan, incluso si al principio les cuesta. Y también descubrirás que algunas relaciones solo se sostenían si tú te callabas, cedías o desaparecías un poco.' },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: '¿Qué pasa cuando empiezo a poner límites?',
          content: [
            { type: 'paragraph', text: 'Al comenzar a poner límites, algo dentro de ti cambia… y eso también impacta en tus relaciones. No es un cambio pequeño: es como reordenar la forma en que te vinculas con los demás, te proteges y te haces visible.\nLas personas que te quieren bien agradecerán tu claridad, aunque al principio les sorprenda.\nLas relaciones basadas en el control, la culpa o el desequilibrio pueden resistirse, porque estaban sostenidas por tu silencio o tu disponibilidad constante.' }
          ]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        {
          type: 'compassionateFirmnessExercise',
          title: 'Ejercicio 1: Tu Frase de Firmeza Compasiva',
          objective: 'Entrenar tu capacidad para sostener una decisión sin retroceder, incluso cuando el otro muestre incomodidad o decepción. Aprenderás a validar la emoción ajena sin anular tu necesidad.',
          duration: '5-10 min'
        },
        {
          type: 'selfCareContractExercise',
          title: 'Ejercicio 2: Mi Contrato Interno de Autocuidado',
          objective: 'Crear un compromiso contigo misma o contigo mismo para honrar tus límites internos. Es un acuerdo simbólico que te recuerda que también mereces respeto, y que puedes cuidarte sin culpas ni exigencias.',
          duration: '10-15 min'
        },
      ]
    }
  ]
};
