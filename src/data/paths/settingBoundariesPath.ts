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
            { type: 'paragraph', text: 'Un límite no es un rechazo. Tampoco es egoísmo, ni frialdad, ni falta de empatía.\nUn límite es una forma de autocuidado. Es decirle al mundo: esto es lo que necesito para estar bien.\nEs marcar dónde termina lo que puedes sostener sin dañarte, y dónde empieza lo que ya no es negociable para ti.\nPoner límites es una forma de proteger lo que te importa: tu energía, tu tiempo, tu dignidad, tu espacio interno.\nUn límite no siempre se expresa con un “no” tajante. A veces es un silencio interrumpido por una frase honesta. A veces es una distancia, una aclaración, un cambio de ritmo.\nLo importante no es la forma, sino la intención: cuidar de ti sin dañar al otro.\nCuando te atreves a marcar un límite:\n•	Te haces visible en la relación.\n•	Enseñas a los demás cómo deseas ser tratada o tratado.\n•	Previenes el desgaste emocional que viene de acumular malestar.\n•	Ganas coherencia interna, porque empiezas a vivir en sintonía con lo que sientes y valoras.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Mitos y bloqueos más comunes',
          content: [
            { type: 'paragraph', text: 'Lo que más cuesta a la hora de poner un límite no es encontrar las palabras adecuadas…\nsino lidiar con lo que sentimos cuando lo intentamos.\nTal vez aparece el miedo al conflicto, el temor a decepcionar, la culpa por priorizarte o la sensación de que si hablas, algo se va a romper.\nOtras veces hay una vocecita dentro de ti que dice:\n“No quiero parecer exagerada/o”, “mejor no molesto”, “igual estoy siendo egoísta”...\nEstos pensamientos y emociones no te hacen débil. Te hacen humana, humano.\nTodos arrastramos creencias aprendidas sobre lo que “se espera de nosotros”: agradar, ceder, adaptarnos, no incomodar…\nPero también podemos revisarlas.\nY esta semana vas a empezar a hacerlo:\n•	sin juicio,\n•	con herramientas concretas,\n•	y al ritmo que tú elijas.' }
          ]
        },
         {
          type: 'collapsible',
          title: '¿Qué pasa cuando callas lo que necesitas?',
          content: [
            { type: 'paragraph', text: 'A veces no decir nada parece lo más fácil: evitamos una discusión, una incomodidad, un momento tenso…\nPero con el tiempo, ese silencio se acumula. Y lo que empieza como una “pequeña concesión” termina convirtiéndose en frustración, cansancio, tristeza o incluso en una sensación de desconexión contigo misma o contigo mismo.\nCuando callas lo que necesitas:\n•	Puedes sentirte poco valorada/o o invisible.\n•	Empiezas a dudar de tus propias emociones.\n•	Te desconectas de tu autenticidad.\n•	Te agotas por dentro, aunque por fuera parezcas en calma.\nCallar para no incomodar a alguien puede parecer una forma de cuidar…\nPero si eso te hace traicionarte, el precio es demasiado alto.\nY a la larga, ese conflicto que intentaste evitar… termina estallando por dentro y, a veces, hacia fuera.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Enfoque terapéutico que vamos a usar',
          content: [
            { type: 'paragraph', text: 'Desde la Terapia Cognitivo-Conductual (TCC), la Terapia de Aceptación y Compromiso (ACT) y el mindfulness, te proponemos este camino:\n•	Aprenderás a identificar los pensamientos automáticos que te bloquean.\n•	Observarás tus emociones difíciles sin juzgarlas ni reprimirlas.\n•	Empezarás a actuar desde tus valores, no desde el miedo.\nNo necesitas sentirte 100 % segura o seguro para empezar a expresarte.\nDe hecho, muchas veces la seguridad no viene antes de actuar, sino después de haberte atrevido a hacerlo.\nAquí no buscamos perfección. Buscamos coherencia.\nY eso se entrena paso a paso, con amabilidad hacia ti.' }
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
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Qué has descubierto esta semana sobre ti y tu forma de relacionarte con los demás?',
            '¿Qué has comprendido sobre ti que antes no veías tan claro?',
            '¿Qué papel juega el silencio en tus relaciones? ¿Te protege o te desconecta?',
            '¿Cómo sería tu vida si te expresaras con más firmeza y respeto?',
            '¿Qué impacto tendría, en ti y en los demás, empezar a poner límites desde el cuidado?',
          ]
        },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'list', items: [
            'Un límite sano no separa: organiza, protege y cuida.',
            'Evitar el conflicto tiene un coste emocional si te obliga a traicionarte.',
            'Detectar tu malestar es el primer aviso de que algo importante no está siendo dicho.',
            'Poner límites no es egoísmo, es autorrespeto.',
            'Todos tenemos bloqueos, pero también podemos elegir responder de otra forma.',
            'Empezar a expresarte con claridad es empezar a vivir con coherencia.',
          ]
        },
        { type: 'quote', text: '“Cada vez que eliges expresarte con respeto, te eliges a ti sin dejar de cuidar el vínculo con el otro.”' },
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
        {
          type: 'collapsible',
          title: '¿Desde qué lugar te colocas cuando te comunicas?',
          content: [
            { type: 'paragraph', text: 'Una forma sencilla de observar tu estilo de comunicación es preguntarte: ¿Desde qué lugar me estoy comunicando?:\no	¿Desde abajo, callándome o cediendo para evitar conflictos?\no	¿Desde arriba, imponiendo o descalificando?\no	¿O desde un lugar de equilibrio, en el que me expreso con respeto mutuo?\nCada vez que hablas con alguien, consciente o no, te colocas en una posición relacional. Esa posición influye en cómo te sientes, cómo reacciona el otro y qué tipo de relación se construye entre ambos.\nAunque a veces usamos diferentes estilos según la situación, hay uno que ha demostrado ser el más saludable, tanto para ti como para tus vínculos: el estilo asertivo.\n¿Por qué?\nPorque te permite:\n✅ Defender lo que sientes, piensas y necesitas sin herir.\n✅ Comunicarte con claridad y firmeza, sin miedo ni culpa.\n✅ Cuidar el vínculo, sin dejarte a un lado.\n✅ Sostener tu autoestima y generar relaciones de confianza.\nEl estilo asertivo no es el más fácil al principio, pero sí el más transformador a largo plazo.\nPor eso, vamos a explorar los 4 estilos de comunicación más comunes. No para etiquetarte, sino para ayudarte a conocerte y empezar a entrenar una forma de expresarte más auténtica, libre y saludable.' }
          ]
        },
        {
          type: 'collapsible',
          title: 'Estilos de comunicación',
          content: [
              { type: 'collapsible', title: '1. Estilo Pasivo – “Tú importas más que yo”', content: [{ type: 'list', items: ['Jerarquía relacional: Te colocas por debajo del otro.','Conductas comunes:\no	Callar lo que piensas o sientes.\no	Aceptar cosas que no deseas hacer.\no	Pedir disculpas constantemente.\no	Ceder por miedo al conflicto.','Frases típicas:\n•	“No pasa nada.”\n•	“Como tú quieras…”\n•	“Da igual, lo que tú decidas.”','Lenguaje no verbal: Voz baja, mirada esquiva, postura encogida, manos inquietas.','💔 Impacto en ti: Frustración, agotamiento, pérdida de autoestima.','⚠️Impacto en el otro: Confusión, sobrecarga, posible abuso.'] }] },
              { type: 'collapsible', title: '2. Estilo Agresivo – “Yo importo más que tú”', content: [{ type: 'list', items: ['Jerarquía relacional: Te colocas por encima del otro.','Conductas comunes:\no	Imponer tus ideas o decisiones.\no	Interrumpir o desacreditar.\no	Usar tono irónico o autoritario.','Frases típicas:\n•	“Eso es una tontería.”\n•	“Hazlo como te digo.”\n•	“Ya te dije que no tenías razón.”','Lenguaje no verbal: Voz fuerte, gestos bruscos, mirada intimidante.','💔 Impacto en ti: Tensión, culpa, deterioro de vínculos.','⚠️Impacto en el otro: Rechazo, miedo, resentimiento.'] }] },
              { type: 'collapsible', title: '3. Estilo Pasivo-Agresivo – “No lo digo, pero lo dejo caer”', content: [{ type: 'list', items: ['Jerarquía relacional: Te colocas por debajo… pero castigas desde la sombra.','Conductas comunes:\no	Evitar el conflicto directo.\no	Usar sarcasmo o indirectas.\no	Retrasar o boicotear de forma encubierta.','Frases típicas:\n•	“Ay, claro… como tú siempre sabes más…”\n•	“Nada, tú haz lo que quieras.”\n•	“Lo decía en broma.”','Lenguaje no verbal: Sonrisa forzada, tono cortante, expresión cerrada.','💔 Impacto en ti: Resentimiento y frustración.','⚠️ Impacto en el otro: Inseguridad, desgaste emocional.'] }] },
              { type: 'collapsible', title: '4. Estilo Asertivo – “Tú y yo importamos por igual” ✅', content: [{ type: 'list', items: ['Jerarquía relacional: Te colocas a la misma altura.','Conductas comunes:\no	Expresas con claridad y respeto.\no	Escuchas sin dejar de comunicarte.\no	Dices “no” sin culpa y “sí” con conciencia.','Frases típicas:\n•	“Prefiero que lo hablemos más adelante.”\n•	“Esto no me resulta cómodo.”\n•	“Te entiendo, y al mismo tiempo necesito decir lo que siento.”','Lenguaje no verbal: Voz firme y calmada, mirada directa, postura abierta.','💚 Impacto en ti: Coherencia, autoestima, calma.','🤝 Impacto en el otro: Claridad, confianza, relaciones sanas.'] }] },
          ]
        },
        {
          type: 'collapsible',
          title: 'Cierre motivador',
          content: [
            { type: 'paragraph', text: 'Recuerda esto: tu estilo de comunicación es una forma aprendida de comunicarte, no un rasgo fijo.\nEs el modo en que sueles expresarte: cómo pides las cosas, cómo defiendes tus ideas, cómo respondes al conflicto, cómo marcas tus límites. Lo aprendiste a lo largo de tu vida, y eso significa que puedes revisarlo, transformarlo y elegir comunicarte de forma diferente.\nTu estilo no solo impacta en cómo te ven los demás, sino en cómo te ves tú. Aprender a expresarte con respeto te acerca a relaciones más sanas… y a una relación más amable contigo mismo o contigo misma.\nEl objetivo no es ser siempre “perfectamente asertivo”, sino desarrollar una asertividad consciente:\n➡️ Elegir cómo comunicarte desde un lugar de equilibrio, sin imponer ni ceder.\n➡️ Expresar lo que piensas, sientes y necesitas con claridad, cuidado y firmeza.\n➡️ Respetarte a ti y respetar al otro, incluso cuando haya desacuerdo.\nY sí, habrá momentos en los que usarás otro estilo. A veces la situación lo requiere. Lo importante es que no sea por costumbre, por miedo o por piloto automático, sino por decisión consciente.\nEsta semana estás dando un paso valiente:\n•	Escucharte.\n•	Nombrar lo que necesitas.\n•	Y atreverte a comunicarte desde tu centro, con respeto, verdad y seguridad emocional.' }
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
         { type: 'exercise', title: 'Ejercicio 2: Tu Frase de “Límite Seguro”', objective: 'Tener una frase clara y amable preparada te puede salvar en situaciones incómodas. Este ejercicio te da recursos simples para no bloquearte, y para empezar a poner límites de forma serena y respetuosa.',
            duration: '5 min', content: [
                {type: 'paragraph', text: 'Instrucciones: Elige una de las frases sugeridas o escribe la tuya. La idea es que la practiques varias veces, en voz alta o por escrito, hasta que te salga con naturalidad. Si lo deseas, también puedes usarla como entrenamiento emocional: imaginarte situaciones pasadas o futuras donde te hubiera gustado decir algo y ensayar tu frase.'}
            ]
         },
          { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Hubo alguna frase o situación que te haya resonado especialmente?',
            '¿Cómo te sentiste al practicar tus frases de límite?',
            '¿Notaste cambios en tu forma de expresarte o en tu sensación interna?',
            '¿Qué te llevas de esta semana que te gustaría conservar?',
          ]
        },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'list', items: [
            'Tu estilo de comunicación no es algo fijo: es aprendido, y puede transformarse.',
            'Existen cuatro estilos comunes: pasivo, agresivo, pasivo-agresivo y asertivo.',
            'Cada estilo refleja una posición relacional implícita: por debajo, por encima o a la misma altura.',
            'La asertividad consciente es la capacidad de expresar lo que sentimos, pensamos y necesitamos desde un lugar de respeto hacia uno mismo y hacia los demás.',
            'No se trata de ser perfecto, sino de ganar conciencia, entrenar nuevas formas y elegir cómo queremos comunicarnos.',
            'Aprender a comunicar lo que sientes y necesitas es una forma profunda de autocuidado y construcción de vínculos sanos.',
          ]
        },
        { type: 'quote', text: '“Cuando te comunicas desde el respeto, no solo cuidas el vínculo: también te eliges a ti.”' },
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
         {
          type: 'collapsible',
          title: '¿Qué tipo de malestar estás sintiendo?',
          content: [
            { type: 'paragraph', text: 'Esta es una de las claves de la semana: aprender a diferenciar el tipo de incomodidad que estás sintiendo.\nPorque no todo malestar es igual.\nMalestar sano:\n•	Es el que aparece cuando haces algo nuevo que te acerca a tu bienestar.\n•	Puede sentirse como tensión, duda o culpa… pero nace de haber actuado con coherencia contigo.\n•	A largo plazo, este malestar se transforma en claridad, tranquilidad y autoestima.\nEjemplo:\nDices “no puedo ayudarte esta vez” y sientes incomodidad, pero también paz. Es una emoción nueva, incómoda… pero alineada.\n Malestar por autoabandono:\n•	Es el que surge cuando te abandonas a ti mismo o a ti misma por miedo a molestar.\n•	Aparece cuando callas, cedes, aceptas… no porque quieras, sino por miedo.\n•	Puede parecer un alivio al principio, pero deja una sensación sutil de traición interna, cansancio o tristeza.\nEjemplo:\nDices “sí” cuando en realidad querías decir “no”. Evitas el conflicto, pero luego te sientes frustrado o frustrada contigo.\nAprender a notar esta diferencia te permitirá seguir avanzando, aunque lo incómodo esté presente.\nNo todo lo incómodo es dañino. A veces lo incómodo es justo lo que necesitas para crecer.' }
          ]
        },
        {
          type: 'collapsible',
          title: '¿Por qué cuesta tanto sostenerse?',
          content: [
            { type: 'paragraph', text: 'Cambiar no es fácil, y mucho menos cuando hablamos de romper patrones relacionales profundos.\nSostener un límite —aunque sea justo, necesario y sano— puede ser desafiante por varias razones:\n•	Porque aprendiste a evitar el conflicto: Tal vez desde pequeña/o te enseñaron que llevar la contraria era peligroso, maleducado o egoísta. Ahora estás practicando quedarte incluso cuando hay tensión.\n•	Porque estás empezando a confiar en ti, pero aún escuchas esas voces del pasado que dicen: “Estás exagerando”, “No deberías decir eso”, “Vas a decepcionar”.\n•	Porque tu entorno también se está reacomodando: Las personas a tu alrededor pueden estar acostumbradas a que siempre digas que sí, a que no pongas límites, y el cambio les sorprende, incomoda o incluso les molesta.\nTodo esto es normal. No significa que estés fallando.\nEstás reconstruyendo la relación contigo, y eso requiere práctica, conciencia… y mucha compasión.\nLo importante no es hacerlo perfecto.\nLo importante es no volver atrás solo para calmar la incomodidad momentánea.\nEsa incomodidad pasará. Pero tu coherencia… se quedará contigo.' }
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
         { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
            '¿Qué sensaciones aparecen en ti cuando mantienes un límite que antes habrías retirado?',
          ]
        },
        { type: 'title', text: 'Resumen Clave' },
        { type: 'list', items: [
            'Poner límites puede generar emociones incómodas, pero eso no significa que estés actuando mal.',
            'Diferenciar entre malestar sano (por crecer) y malestar por autoabandono (por no escucharte) es clave.',
            'Aprender a sostener la incomodidad sin retroceder te ayuda a fortalecer tu seguridad interna.',
            'Validar tus emociones y practicar autocompasión evita que cedas ante la culpa o el miedo.',
            'No necesitas hacerlo perfecto. Solo necesitas respetarte un poco más cada vez.',
          ]
        },
        { type: 'quote', text: '“No te juzgues por sentirte incómodo. Estás aprendiendo a priorizarte sin herir.”' },
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
        {
          type: 'collapsible',
          title: '¿Actúo desde mi verdad o para evitar el malestar del otro?',
          content: [
            { type: 'paragraph', text: 'Muchas veces, actuamos con buena intención… pero desde el miedo. Miedo a que el otro se enfade, se aleje o deje de querernos. Y ese miedo puede llevarte a silenciarte o a sostener más de lo que puedes. Esta pantalla te invita a hacer una pausa honesta: ¿te estás eligiendo, o estás eligiendo agradar?\nUna pregunta clave esta semana es:\n¿Estoy siendo yo… o estoy actuando para evitar el malestar del otro?\nLa complacencia a veces se disfraza de amabilidad, pero muchas veces nace del miedo:\n•	Miedo al enfado del otro.\n•	Miedo al conflicto.\n•	Miedo a que me dejen de querer.\nCuando actúas desde ese lugar, tus relaciones pierden autenticidad… y tú te desgastas.\nEn cambio, cuando te expresas con firmeza y cuidado, fortaleces la confianza en ti… y das al otro la oportunidad de responder desde la suya.' }
          ]
        },
        {
          type: 'collapsible',
          title: '¿Insistir, ceder o alejarme?',
          content: [
            { type: 'paragraph', text: 'Aquí no hay recetas exactas, pero sí puedes guiarte por algunas señales internas.\n✅ Insiste cuando:\n•	El vínculo es importante para ti y hay apertura al diálogo.\n•	Hay respeto mutuo, aunque existan diferencias.\n•	El otro también está dispuesto a crecer.\n✅ Cede cuando:\n•	Lo haces por elección, no por miedo.\n•	Entiendes que ceder no borra tu valor ni tu dignidad.\n•	Hay reciprocidad.\n✅ Aléjate cuando:\n•	Poner límites siempre genera castigo, conflicto o manipulación.\n•	Tus necesidades son ignoradas.\n•	Sientes que tienes que desaparecer para sostener la relación.\nA veces, alejarse no es rendirse. Es respetarte lo suficiente como para no quedarte donde no hay cuidado mutuo.' }
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
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Ruta', prompts: [
            '¿Qué he descubierto sobre mí a lo largo de esta ruta?',
            '¿Qué tipo de relaciones deseo seguir construyendo desde ahora?',
            '¿Qué necesito recordarme cuando vuelva a dudar de mi derecho a poner un límite?',
            '¿Cómo ha cambiado mi forma de cuidarme desde que empecé esta ruta?',
            '¿Qué frase quiero llevar conmigo como recordatorio de todo lo que he aprendido?',
          ]
        },
        { type: 'title', text: 'Resumen Clave de la Ruta' },
        { type: 'list', items: [
          'Un límite no es rechazo: es cuidado propio y claridad para el otro.',
          'No necesitas justificar cada decisión para que sea válida.',
          'Puedes sostener tu verdad aunque haya incomodidad.',
          'Validar la emoción del otro no implica ceder tu necesidad.',
          'Las relaciones sanas toleran los desacuerdos sin romperse.',
          'Tu disponibilidad constante no debe ser la base de ningún vínculo.',
          'Aprender a decir “no” es también aprender a decir “sí” a ti.',
          'El respeto empieza por casa: cuando te lo das tú, los demás lo aprenden.',
          ]
        },
        { type: 'quote', text: '“Cuando aprendo a tratarme con respeto, enseño al mundo cómo cuidarme.\nY cada vez que sostengo un ‘no’ con calma, afirmo mi derecho a vivir desde la verdad.”' },
      ]
    }
  ]
};
