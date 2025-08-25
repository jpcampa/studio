import type { Path } from '../pathsData';

export const responsibilityPath: Path = {
  id: 'ni-culpa-ni-queja',
  title: 'Ni Culpa Ni Queja: Responsabilidad Activa',
  description: 'Aprende a distinguir lo que depende de ti, a transformar la queja en acción y a elegir la responsabilidad activa sin caer en el autoabandono.',
  dataAiHint: 'responsibility guilt action',
  modules: [
    {
      id: 'resp_sem1',
      title: 'Semana 1: Diferencia entre Culpa, Queja y Responsabilidad',
      type: 'introduction',
      estimatedTime: '20-25 min',
      content: [
        { type: 'paragraph', text: '¿Te has pillado quejándote una y otra vez de lo mismo, o castigándote mentalmente por algo que hiciste hace tiempo?\nEsta semana aprenderás a diferenciar la culpa que te impulsa a reparar de la que solo te paraliza, a entender qué papel juega la queja en tu vida y a descubrir que la responsabilidad activa es el camino para recuperar tu poder de acción.' },
        { type: 'title', text: 'Psicoeducación' },
        {
          type: 'collapsible',
          title: 'Tres caminos ante un mismo problema',
          content: [{ type: 'paragraph', text: 'Cuando nos enfrentamos a un problema, solemos reaccionar de forma casi automática. En psicología, observamos que esas reacciones suelen ser:\n• Culpa: me enfoco en que todo es mi culpa y me quedo atrapado o atrapada en el autocastigo.\n• Queja: señalo todo lo que está mal fuera de mí, pero no paso a la acción.\n• Responsabilidad activa: identifico qué parte depende de mí y actúo en consecuencia.\nLas dos primeras parecen distintas, pero nos dejan atascados. La tercera nos impulsa a avanzar.' }]
        },
        {
          type: 'collapsible',
          title: 'La culpa: cuando ayuda y cuando nos hunde',
          content: [{ type: 'paragraph', text: 'La culpa útil te motiva a reparar o aprender. La culpa improductiva te paraliza con autoataques. Es importante diferenciarla de la vergüenza: la culpa se centra en una acción ("he hecho algo mal"), mientras que la vergüenza se centra en la identidad ("soy malo/a").' }]
        },
        {
          type: 'collapsible',
          title: 'La queja: alivio rápido, bloqueo largo',
          content: [{ type: 'paragraph', text: 'Quejarse alivia momentáneamente, pero si no se acompaña de acción, no cambia nada. La queja nos coloca en un papel pasivo, esperando que otros cambien o que la situación se arregle sola. El objetivo es transformar la queja en un paso concreto.' }]
        },
        {
          type: 'collapsible',
          title: 'La responsabilidad activa: el punto medio que funciona',
          content: [{ type: 'paragraph', text: 'La responsabilidad activa es reconocer tu parte, distinguir lo que está bajo tu control y actuar. La pregunta clave es: “¿Qué parte de esta situación sí está bajo mi influencia y qué puedo hacer hoy con ella?”. Esto fortalece tu autoeficacia (Bandura, 1977), la confianza en que tus acciones pueden producir cambios.' }]
        },
        {
          type: 'collapsible',
          title: 'Las dos trampas: hiperexigencia e hiperresponsabilidad',
          content: [{ type: 'paragraph', text: 'Incluso practicando la responsabilidad activa, hay dos desvíos frecuentes:\n• Hiperexigencia: imponer reglas internas imposibles (“Debo hacerlo perfecto siempre”).\n• Hiperresponsabilidad: asumir como propia la culpa por todo, incluso por lo que sienten, piensan o hacen otras personas.\nSoltar lo que no te corresponde es tan importante como hacerte cargo de lo que sí.' }]
        },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'complaintTransformationExercise', title: 'EJERCICIO 1: TABLA “ME QUEJO DE… / LO QUE SÍ PUEDO HACER ES…”', objective: 'Quiero ayudarte a transformar tus quejas en pasos concretos que dependan de ti. Porque cuando cambias el “esto está mal” por un “esto es lo que haré”, recuperas tu poder y dejas de quedarte atascado o atascada en la frustración.', duration: '10 min' },
        { type: 'guiltRadarExercise', title: 'EJERCICIO 2: MI RADAR DE CULPA', objective: 'Quiero ayudarte a detectar cuándo la culpa que sientes es una señal útil y cuándo es una carga que no te corresponde. Con este ejercicio vas a calibrar tu radar interno para diferenciar entre una culpa que te guía y una que solo te pesa.', duration: '5–7 min' },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: [
          '¿Cuál fue el descubrimiento más importante para ti y por qué?',
          '¿En qué situación lograste pasar de la queja o la culpa a la acción?',
          '¿Qué culpa identificaste como “no mía” y pudiste soltar?',
          '¿Qué has descubierto sobre ti mismo/a al diferenciar culpa, queja y responsabilidad?'
        ]},
        { type: 'quote', text: 'Asumir tu parte no es cargar con todo. Es empezar a caminar con claridad.' }
      ]
    },
    {
      id: 'resp_sem2',
      title: 'Semana 2: Aceptar lo que Fue, Elegir lo que Sigue',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraph', text: '¿Notas que a veces, por más que pienses y repienses algo, no llegas a ninguna solución?\nEsta semana vas a practicar cómo cortar el circuito de la culpa improductiva, cómo cuestionar pensamientos rígidos y cómo abrir espacio para respuestas más constructivas.\nLa clave estará en pasar de rumiar a actuar con claridad y autocompasión.' },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'Del “¿por qué pasó?” al “¿qué hago ahora?”', content: [{ type: 'paragraph', text: 'Aceptar activamente no es resignarse, es reconocer los hechos para poder actuar con claridad. La resignación bloquea, la aceptación abre caminos.' }] },
        { type: 'collapsible', title: 'Separar pasado y presente', content: [{ type: 'paragraph', text: 'El pasado informa, pero no debe dirigir el presente. Al separar hechos de interpretaciones (modelo ABC de la TCC), frenas la rumiación y activas el modo solución.' }] },
        { type: 'collapsible', title: 'Soltar la culpa del pasado', content: [{ type: 'paragraph', text: 'Para transformar la culpa improductiva en aprendizaje: acepta el hecho, separa la conducta de tu identidad ("no eres tu error"), repara si es posible, define qué harás diferente y suelta lo que no depende de ti.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'acceptanceWritingExercise', title: 'EJERCICIO 1: ESO PASÓ. ¿Y AHORA QUÉ?', objective: 'Usar la escritura para poner en orden lo que pasó, soltar el juicio y convertir el pasado en un punto de partida, no en una condena.', duration: '10–12 min' },
        { type: 'selfAcceptanceAudioExercise', title: 'EJERCICIO 2: PRÁCTICA DE AUTOACEPTACIÓN GUIADA', objective: 'Entrenar la autoaceptación para reconocer lo que pasó sin castigo, tratándote con la misma amabilidad que tendrías con alguien querido.', duration: '7–10 min' },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: ['¿Qué culpa del pasado has soltado o disminuido?', '¿Qué has descubierto sobre ti al separar hechos de juicios?', '¿Qué situación de esta semana te permitió poner en práctica la aceptación activa?'] },
        { type: 'quote', text: 'Lo que pasó no define lo que harás ahora. Eso lo eliges tú.' }
      ]
    },
    {
      id: 'resp_sem3',
      title: 'Semana 3: Cultiva una Voz Interna que Impulsa',
      type: 'skill_practice',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraph', text: '¿Tu voz interna suele sonar más como un juez que como un entrenador?\nEsta semana aprenderás a escuchar lo que tu crítica interna intenta lograr y a traducirlo en un lenguaje responsable y empático. Descubrirás que la autorresponsabilidad compasiva no se trata de exigirte más, sino de motivarte mejor.' },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'El poder de tu voz interna', content: [{ type: 'paragraph', text: 'Tu diálogo interno influye directamente en tu motivación y en cómo gestionas los errores. Un lenguaje interno amenazante activa el sistema de estrés, mientras que una voz amable activa la autorregulación.' }] },
        { type: 'collapsible', title: 'Responsabilidad vs. Autoexigencia destructiva', content: [{ type: 'paragraph', text: 'La responsabilidad busca reparar y aprender. La autoexigencia destructiva se enfoca en el castigo y la autocrítica. La investigación de Kristin Neff demuestra que la autocompasión es más efectiva para la persistencia que la crítica severa.' }] },
        { type: 'collapsible', title: 'De juez a guía: el cambio que necesitas', content: [{ type: 'paragraph', text: 'Vamos a entrenar tu voz interna para que pase de juez severo a guía firme y alentador. No se trata de evitar la responsabilidad, sino de decir las cosas de forma que te ayuden a actuar.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'compassionateResponsibilityContractExercise', title: 'EJERCICIO 1: MI CONTRATO DE AUTORRESPONSABILIDAD COMPASIVA', objective: 'Crear un compromiso interno que combine la autorresponsabilidad con la autocompasión, dándote un marco claro para responder a tus errores.', duration: '10–15 min' },
        { type: 'criticismToGuideExercise', title: 'EJERCICIO 2: TRANSFORMA TU CRÍTICA EN GUÍA', objective: 'Convertir tu voz crítica en una guía útil que te ayude a mejorar sin hundirte, manteniendo la exigencia sana pero eliminando el castigo.', duration: '8–10 min' },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Semana', prompts: ['¿Qué descubrimiento ha tenido más impacto en ti?', '¿Cómo cambió tu forma de actuar al suavizar la crítica interna?', '¿En qué momento reciente aplicaste una respuesta más compasiva contigo?'] },
        { type: 'quote', text: 'Hablarme con respeto no me debilita, me prepara para avanzar con fuerza y claridad.' }
      ]
    },
    {
      id: 'resp_sem4',
      title: 'Semana 4: Hazte Cargo sin Perderte de Vista',
      type: 'summary',
      estimatedTime: '15-20 min',
      content: [
        { type: 'paragraph', text: '¿Sientes que a veces asumes demasiado y terminas agotado o agotada?\nEsta semana vas a aprender a comprometerte con lo que sí depende de ti, sin cargar con lo que no. Trabajarás en proteger tu energía, definir tu zona de influencia y mantener tu responsabilidad como una elección que te impulsa, no como una carga que te rompe.' },
        { type: 'title', text: 'Psicoeducación' },
        { type: 'collapsible', title: 'De cargar con todo a elegir con intención', content: [{ type: 'paragraph', text: 'Hacerse cargo sin perderse de vista significa actuar desde la responsabilidad activa sin absorber culpas o problemas ajenos. Se trata de elegir dónde pones tu energía.' }] },
        { type: 'collapsible', title: 'El mapa de la influencia real', content: [{ type: 'paragraph', text: 'Imagina tres círculos: tu zona de control directo (acciones, hábitos), tu zona de influencia (relaciones, equipo) y la zona fuera de tu control (pasado, decisiones ajenas). Enfocarte en los dos primeros protege tu energía y multiplica tu eficacia.' }] },
        { type: 'collapsible', title: 'Cuidarte también es tu responsabilidad', content: [{ type: 'paragraph', text: 'El autocuidado no es un lujo, es la base para responder con claridad y sostener tus compromisos. Cuando te cuidas, la responsabilidad se convierte en una elección que impulsa; cuando te abandonas, en una carga que agota.' }] },
        { type: 'title', text: 'Técnicas Específicas' },
        { type: 'influenceWheelExercise', title: 'EJERCICIO 1: RUEDA DE MI ZONA DE INFLUENCIA', objective: 'Diferenciar lo que depende de ti de lo que no, para que inviertas tu tiempo y fuerza en lo que realmente puedes transformar. Así reduces frustración y recuperas foco.', duration: '10–15 min' },
        { type: 'personalCommitmentDeclarationExercise', title: 'EJERCICIO 2: MI DECLARACIÓN DE COMPROMISO PERSONAL', objective: 'Definir en tres frases clave cómo quieres vivir desde la responsabilidad activa, con equilibrio y autocuidado. Serán tu ancla emocional y tu guía diaria.', duration: '5–10 min' },
        { type: 'therapeuticNotebookReflection', title: 'Reflexión Final de la Ruta', prompts: ['¿Qué cambio has notado en tu forma de responder ante un error o una situación injusta?', '¿Cuál ha sido tu mayor descubrimiento sobre ti en relación con la responsabilidad?', '¿Qué compromiso concreto quieres llevarte de aquí para tu vida diaria?'] },
        { type: 'quote', text: 'Cuando eliges responder con responsabilidad activa, dejas de ser espectador o espectadora de tu vida y te conviertes en su protagonista.' }
      ]
    }
  ]
};
