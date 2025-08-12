
export type Resource = {
  id: string;
  title: string; // Spanish
  type: 'article' | 'audio' | 'exercise';
  category: string; // Spanish e.g., 'Estrés', 'Autoestima'
  summary: string; // Short summary of the resource
  content?: string; // Full text for article, or description/URL for audio/exercise
  estimatedTime?: string;
  imageUrl?: string; // URL for a relevant image
  dataAiHint?: string;
};

export const resourcesData: Resource[] = [
  {
    id: 'res1',
    title: 'Cómo manejar la autocrítica desde la compasión',
    type: 'article',
    category: 'Autoestima',
    summary: 'Aprende a transformar tu diálogo interno crítico en uno más amable y compasivo.',
    content: 'La autocrítica excesiva puede ser un gran obstáculo para nuestro bienestar emocional. En lugar de motivarnos, a menudo nos paraliza y nos hace sentir peor. Este artículo explora cómo la autocompasión puede ser una herramienta poderosa para cambiar esta dinámica. Hablaremos sobre reconocer los patrones de autocrítica, entender su origen y practicar activamente la amabilidad hacia uno mismo, especialmente en momentos difíciles. Incluye ejercicios prácticos para fomentar un diálogo interno más saludable.',
    estimatedTime: '10 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'self compassion journal'
  },
  {
    id: 'res2',
    title: 'Ejercicio de Respiración para Calmar la Ansiedad',
    type: 'exercise',
    category: 'Estrés',
    summary: 'Una técnica de respiración simple y efectiva para reducir la ansiedad en momentos de tensión.',
    content: 'Este ejercicio de respiración diafragmática te ayudará a activar la respuesta de relajación de tu cuerpo. Sigue estos pasos:\n1. Siéntate o acuéstate en una posición cómoda.\n2. Coloca una mano sobre tu pecho y la otra sobre tu abdomen.\n3. Inhala lentamente por la nariz, sintiendo cómo tu abdomen se expande. El pecho debe moverse mínimamente.\n4. Exhala lentamente por la boca, sintiendo cómo tu abdomen se contrae.\n5. Repite durante 5-10 minutos.',
    estimatedTime: '5 min',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'breathing exercise calm'
  },
  {
    id: 'res3',
    title: 'Audio: Visualización Guiada para el Descanso',
    type: 'audio',
    category: 'Sueño y descanso',
    summary: 'Un audio para ayudarte a relajar cuerpo y mente antes de dormir.',
    content: 'https://placehold.co/128x128.png/B39DDB/FFFFFF?text=Audio', // Placeholder image for audio
    estimatedTime: '15 min',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'sleep meditation audio'
  },
  {
    id: 'res4',
    title: 'La Importancia de Establecer Límites Saludables',
    type: 'article',
    category: 'Relaciones Sociales',
    summary: 'Descubre por qué establecer límites es crucial para tu bienestar y cómo hacerlo de manera efectiva.',
    content: 'Establecer límites saludables es esencial para mantener relaciones equilibradas y proteger tu energía emocional. Este artículo explora los diferentes tipos de límites (físicos, emocionales, mentales), las señales de que podrías necesitar establecerlos y estrategias prácticas para comunicarlos de forma asertiva y respetuosa. Aprender a decir "no" cuando es necesario es un acto de autocuidado.',
    estimatedTime: '12 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'healthy boundaries communication'
  },
  {
    id: 'res5',
    title: 'No estás rota, solo cansada de fingir que puedes con todo',
    type: 'article',
    category: 'Bienestar Emocional',
    summary: 'Autoexigencia, perfeccionismo y desconexión emocional: las cicatrices invisibles del cansancio que no se nota, pero pesa.',
    content: `A veces no es tristeza, ni apatía, ni depresión. Es fatiga emocional acumulada. Es ese tipo de cansancio profundo que aparece cuando has sostenido demasiado sin darte el permiso de soltar. Cuando has sido fuerte por fuera... pero te has ido desgastando por dentro.\n\nY no, no es flojera, ni falta de actitud. Es el resultado de vivir en modo alerta, de dar mucho y recibir poco, de intentar hacerlo todo bien. De exigirte incluso cuando no puedes más. Si te suena familiar, esto también es para ti.\n\n**La fatiga emocional no es debilidad. Es saturación.**\n\nEs un estado de agotamiento físico y mental producido por el esfuerzo prolongado de sostener emociones intensas: las propias… o las de los demás. Escuchar, cuidar, contener, resolver… día tras día. Esa sobrecarga silenciosa, muchas veces invisible, puede llevar al cuerpo y al cerebro a funcionar en modo supervivencia. Se activa el sistema límbico (emoción), y la corteza prefrontal (razón) se agota. El resultado: irritabilidad, desconexión, confusión mental, hipersensibilidad… o bloqueo.\n\nEn estudios recientes sobre burnout emocional (Figley, 2002; Maslach & Leiter, 2016), se ha demostrado que el impacto del estrés empático sostenido puede ser tan debilitante como el estrés físico crónico. Es lo que también se conoce como fatiga por compasión.\n\n**¿Y si no es que no puedes más… sino que llevas demasiado solo/a?**\n\nMuchos de estos patrones no nacen de la nada. Se forman con el tiempo, con historias personales que enseñaron que ser valiente es no pedir ayuda, que ser responsable es no fallar, que ser buena persona es no poner límites. Y así, muchas personas terminan atrapadas en un ciclo de autoexigencia crónica, sin margen para la ternura hacia sí mismas.\nQuienes viven con estos niveles de exigencia suelen tener pensamientos como:\n\n- “Todo depende de mí”\n- “No puedo equivocarme”\n- “Si no lo hago perfecto, no vale”\n\nEste estilo de pensamiento activa de forma constante el sistema de estrés, genera una vigilancia permanente, disminuye el descanso y erosiona la autoestima (Beck, 2005; Young et al., 2003).\n\n**El perfeccionismo no te protege: te drena.**\n\nContrario a lo que muchas veces creemos, el perfeccionismo no es una virtud elevada, sino una forma de miedo muy bien disfrazada. Miedo al juicio, al error, a no ser suficiente.\nMantenerse en ese estado de evaluación constante, sin pausas ni refuerzos positivos, produce una tensión interna que a la larga se traduce en agotamiento psicológico. Un tipo de malestar que impacta en la salud, las relaciones y la capacidad de disfrutar.\n\n**¿Y la desconexión emocional? Es una defensa... que se vuelve prisión.**\n\nCuando llevas mucho tiempo conteniendo el dolor, es probable que empieces a desconectarte de lo que sientes. No porque no te importe, sino porque te ha dolido demasiado. Es un mecanismo de supervivencia: el cuerpo aprende a protegerse cerrando el acceso a emociones que duelen. Pero al hacerlo, también cierra el acceso a la ternura, al disfrute, al deseo.\nEsto se conoce como desconexión emocional funcional: se evita el contacto con las sensaciones internas por miedo a lo que puedan despertar. Pero evitar lo que sentimos no lo elimina: lo cronifica. A largo plazo, esta evitación está relacionada con mayor ansiedad, somatización y patrones de evitación interpersonal (Hayes et al., 1996; Linehan, 1993).\n\n**CIERRE:**\n\nSi todo esto te suena… no estás sola, ni solo. No estás rota ni roto.\nSolo estás agotado o agotada de aguantar tanto en silencio. Y eso también merece compasión.\nRevisar tu exigencia, recuperar tu ternura y darte el permiso de sentir, sin juicio, no es rendirse.\nEs el primer paso para cuidarte desde un lugar más sano, humano y sostenible.`,
    estimatedTime: '8 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'emotional fatigue burnout'
  },
  {
    id: 'res6',
    title: 'ANSIEDAD: CUANDO LA MENTE SE ADELANTA Y EL CUERPO GRITA',
    type: 'article',
    category: 'Estrés',
    summary: 'Por qué aparece, qué intenta decirte… y cómo recuperar el control sin luchar contra ti',
    content: `**¿Qué es exactamente la ansiedad?**
La ansiedad es una respuesta automática del cuerpo y la mente ante algo que interpretamos como una amenaza.
No siempre tiene forma concreta. A veces es un “¿y si…?”, un pensamiento fugaz o una sensación corporal que se intensifica sin previo aviso.
Es una mezcla de pensamientos intensos, sensaciones físicas y conductas aprendidas.
Y, aunque molesta, tiene un propósito: ayudarte a sobrevivir, anticiparte, protegerte.
La clave no está en eliminarla… sino en comprenderla, regularla y cambiar tu diálogo con ella.

**¿Cómo se manifiesta la ansiedad?**
La ansiedad no vive solo en tu mente. Se expresa en tres niveles interconectados:
1. **Fisiológico:**
- Tensión muscular constante (cuello, espalda, mandíbula).
- Taquicardia, sudoración, insomnio, cambios de temperatura.
- Irritabilidad sin motivo claro.
2. **Cognitivo:**
- Pensamientos catastróficos (“y si pasa lo peor…”).
- Dificultad para concentrarte, hablar o recordar.
- Rumiaciones y bucles mentales interminables.
3. **Conductual:**
- Evitación de situaciones.
- Compulsiones (comer, revisar el móvil, trabajar de más).
- Aislamiento, autoexigencia, sensación de desbordamiento.

**¿De dónde viene todo esto?**
La ansiedad no aparece por capricho. Es el resultado de una compleja interacción entre factores:
**Biológicos y genéticos:**
Tu sistema nervioso puede ser más reactivo. Es como tener un “detector de amenazas” hipersensible.
**Aprendidos:**
Lo que viste, lo que viviste, cómo te hablaron… enseñaron a tu cerebro a protegerte, a veces con excesiva precaución.
- Si creciste entre críticas o sobreprotección, es probable que tu sistema de alerta se activara más rápido.
- Aprendemos a tener miedo… y también podemos aprender a desaprenderlo.
**Cognitivos:**
Tus creencias automáticas (no soy suficiente, algo malo va a pasar, debo controlar todo) alimentan la ansiedad.
No es el mundo el que te ataca. Es tu interpretación del mundo la que puede volverse amenazante.

**¿Cómo se regula?**
Desde Emotiva, abordamos la ansiedad desde el enfoque cognitivo-conductual y la neurociencia afectiva.
No con frases vacías, sino con herramientas reales y entrenables.
Aquí algunas de nuestras favoritas:

1. **Auto-observación consciente**
Aprende a notar qué te dispara la ansiedad. Usa el formato:
SITUACIÓN – PIENSO – SIENTO – ACTÚO
Ejemplo:
- SITUACIÓN: Alguien no contesta tu mensaje.
- PIENSO: “Ya no le importo”.
- SIENTO: Inquietud, tristeza.
- ACTÚO: Lo evito o le escribo compulsivamente.

2. **Reestructuración Cognitiva**
No se trata de pensar en positivo, sino de pensar con más realismo y compasión.
- ¿Qué evidencia tengo de esto?
- ¿Estoy generalizando o dramatizando?
- ¿Qué pensaría una persona neutral?
La ansiedad se reduce cuando cuestionas tus pensamientos, no tus emociones.

3. **Relajación y Respiración**
Activar tu sistema parasimpático te ayuda a recuperar el control físico.
Prueba la técnica 5-5-5:
Inhala 5 segundos, sostén 5, exhala 5.
Hazlo por 3 minutos… y vuelve a ti.

4. **Planificación + Microplaceres**
La ansiedad necesita estructura y disfrute. Combina organización con placer.
Organiza tu día y añade momentos pequeños de conexión:
Una canción. Un paseo corto. Una conversación sin juicio.

5. **Mindfulness y aceptación activa**
No luches contra la ansiedad. Escúchala.
Observa tus pensamientos como nubes que pasan.
Recuerda: Tú no eres tu ansiedad. Tú eres quien la observa.

6. **Comunicación asertiva**
Expresar lo que sientes sin miedo al rechazo reduce la presión interna.
Usa frases como:
“Me gustaría…”, “Me siento así cuando…”, “Prefiero que…”
Estás permitiendo que tu ansiedad hable… sin que grite.

7. **Prevención de recaídas: no es debilidad, es aprendizaje**
Sentir ansiedad de nuevo no es “fracasar”.
Es una oportunidad para aplicar lo aprendido.
Cada “desliz” es un ensayo general para tu versión más libre y serena.

**En resumen…**
La ansiedad no es el enemigo.
Es un sistema de alerta antiguo, que solo necesita ser escuchado, reentrenado y acompañado.
Cuando aprendes a vivir con ella, sin miedo, se convierte en una señal, no una condena.

“No tienes que dejar de sentir. Solo aprender a sentir sin que te destruya.”`,
    estimatedTime: '8 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'anxiety stress brain'
  },
  {
    id: 'res7',
    title: 'LO QUE LA CIENCIA SABE DEL CORAZÓN ROTO (Y CÓMO PUEDES EMPEZAR A SANAR)',
    type: 'article',
    category: 'Relaciones Sociales',
    summary: 'El rechazo sentimental activa las mismas zonas cerebrales que el dolor físico. Pero también existen herramientas reales y comprobadas que pueden ayudarte a recuperar tu equilibrio y reconstruirte desde dentro.',
    content: `**El duelo que no siempre se ve, pero que duele de verdad**

Una ruptura sentimental no es solo una tristeza pasajera. Es una experiencia de pérdida real que puede sacudir los cimientos de tu identidad, tu seguridad emocional y tu visión del futuro.
Y no es una exageración: múltiples estudios han demostrado que el cerebro reacciona al rechazo amoroso activando las mismas áreas implicadas en el dolor físico —como si el corazón roto fuera, también, un cuerpo herido.
Lo más complejo es que este tipo de dolor va acompañado de una montaña rusa emocional difícil de gestionar: tristeza profunda, ansiedad, orgullo herido, pensamientos obsesivos, culpa o una soledad que parece no acabar nunca. A veces incluso aparece el insomnio, la apatía o una sensación de pérdida de sentido vital.
Sentirse así no significa que estés “mal” ni que seas débil. Significa simplemente que estás atravesando un proceso humano… que, con apoyo y herramientas, también se puede transformar.

**¿Por qué duele tanto? Lo que ocurre en tu mente (y tu cuerpo)**

Tras una ruptura, tu sistema nervioso entra en modo alarma: se activan los circuitos del miedo al abandono, de la autocrítica, de la búsqueda compulsiva de respuestas. Este estado puede generar desregulación emocional, agotamiento mental e incluso síntomas físicos como presión en el pecho, nudos en el estómago o dificultad para concentrarte.
Además, la mente suele entrar en un patrón de rumiación: pensamientos repetitivos sobre lo que pasó, lo que no hiciste, lo que deberías haber dicho. Este bucle no ayuda a sanar: alimenta la angustia, refuerza creencias disfuncionales como “no merezco ser amada/o”, y te aleja del presente.
Pero no estás atrapada o atrapado ahí. Hay formas de intervenir, de comprenderte mejor y de reconstruir desde dentro.

**¿Y ahora qué? Estrategias reales para reconstruirte**

La ciencia del bienestar emocional ha identificado varias herramientas que pueden ayudarte en este proceso. Aquí te compartimos algunas:
**Reestructura tus pensamientos**
No creas todo lo que piensas cuando estás dolida/o. Algunas ideas que aparecen en este momento (“Nunca más voy a sentirme así”, “Estoy rota/o para siempre”) son distorsiones cognitivas fruto del dolor.
Puedes aprender a detectarlas y darles forma más realista. Pregúntate, por ejemplo:
- ¿Hay otra forma de interpretar lo que pasó?
- ¿Qué creencias mías se han activado con esta experiencia?
- ¿Realmente esta situación define todo mi valor como persona?

**Regula tus emociones sin invalidarlas**
Aceptar que duele… también es parte de sanar. No necesitas apresurarte a “superarlo”.
Date espacio para sentir, sin juzgar lo que surge: tristeza, enojo, miedo, nostalgia. Todo tiene un lugar.
Técnicas como la acción opuesta (hacer lo contrario de lo que la emoción destructiva te pide), la validación emocional o el uso del cuerpo como ancla (respirar, caminar, mover el cuerpo) pueden ayudarte a recuperar la calma.

**Conecta con el presente**
El mindfulness es una herramienta poderosa para romper la rumiación. Volver al cuerpo, a la respiración, a lo que sí está ocurriendo aquí y ahora, ayuda a que tu mente deje de habitar exclusivamente el pasado o las suposiciones del futuro.
Recuerda: todo pasa. Esta emoción también.

**Cultiva la autocompasión**
No necesitas ser dura/o contigo. Necesitas tratarte como lo harías con alguien a quien amas profundamente.
Practicar frases compasivas, escribirte desde el cuidado, recordarte tus esfuerzos… son pequeños gestos que, repetidos, tienen un efecto enorme.

**Lo que viene después del dolor: una nueva versión de ti**

Una ruptura puede desestabilizarte, sí… pero también puede convertirse en un momento de autodescubrimiento.
Muchas personas, al mirar atrás, reconocen que ese desgarro fue el inicio de un proceso profundo: aprendieron a poner límites, a reconocer sus necesidades, a elegir distinto.
Sanar no es olvidar. Es aprender a mirar el pasado con más comprensión y menos carga. Y darte la oportunidad de construir una relación distinta, empezando por la que tienes contigo.

**Recuerda**
Aunque ahora sientas que todo se ha roto, hay dentro de ti una fuerza que permanece intacta: tu capacidad de reconstruirte con dignidad, sensibilidad y coraje.`,
    estimatedTime: '9 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'heartbreak healing relationship'
  },
  {
    id: 'res8',
    title: 'EL ESTRÉS NO ES EL ENEMIGO. ES UN MENSAJERO.',
    type: 'article',
    category: 'Estrés',
    summary: 'Descubre cómo escucharlo, regularlo y convertirlo en tu aliado',
    content: `**¿Y si el estrés no fuera el problema?**
¿Y si lo que nos desestabiliza no es tener estrés… sino no saber qué hacer con él?
Vivimos intentando escapar del estrés.
Pero el estrés no se escapa. Se transforma.
Y cuando aprendes a entenderlo, regularlo y canalizarlo, ya no es una amenaza.
Es tu señal interna de que algo necesita atención, cambio, acción o cuidado.

**¿Qué es exactamente el estrés?**
El estrés es la respuesta natural de tu cuerpo y tu mente cuando sientes que una situación exige más de lo que crees poder dar.
Es tu sistema de alerta evolutivo. Te prepara para actuar cuando algo se vuelve desafiante o potencialmente amenazante.
Tu corazón late más rápido. Tu cuerpo libera cortisol y adrenalina. Tus sentidos se agudizan.
En esencia: tu sistema nervioso se activa para protegerte o impulsarte.
Según Lazarus y Folkman (1984), no todo depende del estímulo. Lo que define si algo te estresa es cómo lo interpretas:
- ¿Esto es manejable?
- ¿Tengo recursos?
- ¿Puedo con esto?
Tu percepción moldea tu reacción. Y por eso, dos personas pueden vivir el mismo evento con emociones completamente distintas.

**No todo el estrés es malo: Eustrés vs. Distrés**
Hay dos formas fundamentales en que tu cuerpo y tu mente viven el estrés:
**Eustrés**
Es el estrés positivo. El que te impulsa a actuar, a superarte, a sacar lo mejor de ti.
Cuando lo que enfrentas es retador pero crees que puedes con ello, tu organismo se activa… y tú rindes al máximo.
Mejora tu foco, creatividad, rendimiento y hasta fortalece vínculos.
Ejemplo: esa adrenalina antes de hablar en público que te hace brillar.
**Distrés**
Es el estrés negativo. El que te abruma, bloquea o desborda.
Aparece cuando la situación se percibe como incontrolable y te sientes solo, incapaz o agotado.
Aquí el estrés se cronifica y empieza a doler: insomnio, tensión muscular, irritabilidad, dificultad para pensar con claridad.
Ejemplo: cuando cada notificación del trabajo te hace apretar los dientes.

**¿Qué pasa en tu cuerpo cuando te estresas?**
Cuando detectas un peligro (real o simbólico), se activa el sistema nervioso simpático y el eje HHA (hipotálamo-hipófisis-adrenal).
Esto desencadena tres fases:
1. Alarma: Aumenta la frecuencia cardíaca, la respiración, la tensión. Tu cuerpo se prepara para luchar o huir.
2. Resistencia: Si el estrés continúa, entras en modo “aguante”. Pero aquí empieza el desgaste.
3. Agotamiento: Si no hay pausa ni regulación, tus recursos se agotan. Aparecen problemas físicos, emocionales y cognitivos.
Un estudio de McGonigal (2012) mostró que la forma en que percibes el estrés puede cambiar su impacto en tu salud:
Verlo como una señal de crecimiento, y no como una amenaza, reduce el riesgo cardiovascular y mejora la resiliencia.

**¿Qué te estresa a ti?**
Los estresores pueden ser externos o internos, y no siempre son evidentes:
- Cambios vitales: mudanzas, separaciones, nuevas responsabilidades.
- Conflictos internos: autoexigencia, miedo al rechazo, sensación de no llegar.
- Estímulos físicos: ruido, calor, falta de sueño.
- Sociales: críticas, aislamiento, exceso de demandas.
Pero no solo importa qué ocurre. Importa también cómo lo interpretas y qué haces con ello.

**¿Y entonces, cómo gestionarlo?**
En Emotiva no te prometemos eliminar el estrés (porque es imposible).
Te enseñamos a optimizarlo.
Eso significa:
- Reconocerlo a tiempo (¿cómo reacciona tu cuerpo y tu mente?).
- Distinguir entre lo urgente y lo importante.
- Validar tus emociones sin juzgarte.
- Cuestionar tus pensamientos automáticos (“tengo que poder con todo”, “esto es un desastre”).
- Activar tu sistema de calma con técnicas de respiración, visualización, pausa consciente o escritura emocional.
- Redefinir tu relación con el estrés como una oportunidad de reconexión contigo.
Porque cuando el estrés se vuelve crónico y silencioso, se vuelve peligroso.
Pero cuando lo miras de frente, lo entiendes y lo regulas… te devuelve tu fuerza.

**En resumen...**
El estrés no es el problema.
Es la brújula que señala que algo necesita atención.
Si lo escuchas, lo regulas y lo integras, te vuelve más fuerte.
Más consciente.
Más tú.`,
    estimatedTime: '8 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'stress brain science'
  },
  {
    id: 'res9',
    title: '¿POR QUÉ ALGUNAS PERSONAS SIMPLEMENTE… CAEN BIEN?',
    type: 'article',
    category: 'Relaciones Sociales',
    summary: 'No es magia. No es suerte. Es una combinación de habilidades sociales que podemos aprender, entrenar y potenciar.',
    content: `Desde que nacemos, venimos programados para conectar.
La evolución nos hizo animales sociales porque sobrevivimos mejor cuando colaboramos, sentimos y nos entendemos. Lo que antes nos salvaba del peligro, hoy es lo que nos sostiene emocionalmente.
- La calidad de nuestras relaciones predice más nuestra salud que la dieta o el ejercicio.
- El aislamiento social tiene más riesgo para el corazón que fumar 15 cigarrillos al día.
- Y sí: las relaciones tóxicas literalmente nos “enferman”.
Pero vamos a lo práctico…

**¿Qué son las habilidades sociales?**
Son ese conjunto de comportamientos, emociones y pensamientos que usamos para interactuar con los demás de forma respetuosa, auténtica y eficaz.
No nacemos con ellas: las aprendemos. Y lo mejor es que se pueden entrenar a cualquier edad.
Las vamos adquiriendo:
- Por observación (modelos).
- Por ensayo y error (refuerzo).
- Por la retroalimentación de los demás.
- Y por nuestra forma de interpretar lo que ocurre (esquemas cognitivos).

**Las 7 habilidades que te hacen socialmente atractivo o atractiva (sí, de verdad)**
1. **Comunicación clara y coherente**
- Hablas desde el “yo”, con emoción, sin rodeos ni ataques.
- Tu tono, tu postura, tu mirada... acompañan lo que dices.
- Eres capaz de decir lo que sientes sin herir.
- Y lo más importante: sabes escuchar (de verdad).
2. **Empatía auténtica**
- Captas lo que no se dice.
- Percibes emociones, gestos, silencios.
- Te importa lo que le pasa al otro, y se nota.
- La empatía es el lubricante natural de toda interacción humana.
3. **Asertividad**
- Dices lo que necesitas sin pisar a nadie.
- Sabes poner límites, expresar desacuerdo y también pedir perdón.
- Ser asertivo no es ser duro: es ser claro, firme y respetuoso.
4. **Conciencia emocional y autocontrol**
- Te conoces.
- Sabes qué te molesta y por qué.
- Y en lugar de estallar… gestionas.
- Ser consciente de tus emociones mejora la conexión con los demás.
5. **Sincronía y adaptabilidad**
- Te “sintonizas” con el otro.
- Te adaptas al ritmo de la conversación, al tono emocional, al contexto.
- Esto crea rapport: ese “sentirnos en la misma onda”.
6. **Refuerzo social positivo**
- Sabes elogiar sin adular.
- Reconoces lo bueno en los demás y lo expresas.
- Sabes recibir cumplidos sin minimizarlos.
- Eres esa persona que los demás recuerdan con una sonrisa.
7. **Cuidado del vínculo**
- No acumulas conflictos.
- Buscas entender y reparar.
- Valorás la calidad por encima de la cantidad de relaciones.
- Aportas seguridad y apoyo emocional.

**¿Y si no tengo estas habilidades?**
La buena noticia es esta: TODAS se pueden entrenar.
Desde Emotiva te enseñamos cómo. Paso a paso, con prácticas reales, psicoeducación basada en evidencia, y herramientas para que las relaciones de tu vida dejen de ser fuente de estrés… y se conviertan en fuente de bienestar.
Porque conectar no es un lujo. Es una necesidad.
Y las habilidades sociales no solo mejoran tu entorno… mejoran tu salud, tu rendimiento, tu autoestima y tu felicidad.

Emotiva. Porque sentir es el comienzo.
Y conectar, la clave`,
    estimatedTime: '7 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'social skills connection'
  }
];
