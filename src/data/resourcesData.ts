
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
    content: `¿Alguna vez has sentido que tu corazón se acelera sin razón aparente?
¿Que tus pensamientos van más rápido que tú, y tu cuerpo responde como si algo estuviera en juego… aunque estés solo o sola, sentada frente al ordenador?
Eso es ansiedad.
Y aunque a veces parezca tu enemiga, en realidad, es una aliada mal entendida.

**¿Qué es exactamente la ansiedad?**
La ansiedad es una respuesta automática del cuerpo y la mente ante algo que interpretamos como una amenaza.
No siempre tiene forma concreta. A veces es un “¿y si…?”, un pensamiento fugaz o una sensación corporal que se intensifica sin previo aviso.
Es una mezcla de pensamientos intensos, sensaciones físicas y conductas aprendidas.
Y, aunque molesta, tiene un propósito: ayudarte a sobrevivir, anticiparte, protegerte.
📍La clave no está en eliminarla… sino en comprenderla, regularla y cambiar tu diálogo con ella.

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
➡️ La ansiedad se reduce cuando cuestionas tus pensamientos, no tus emociones.

3. **Relajación y Respiración**
Activar tu sistema parasimpático te ayuda a recuperar el control físico.
Prueba la técnica 5-5-5:
Inhala 5 segundos, sostén 5, exhala 5.
Hazlo por 3 minutos… y vuelve a ti.

4. **Planificación + Microplaceres**
La ansiedad necesita estructura y disfrute. Combina organización con placer.
🗓 Organiza tu día y añade momentos pequeños de conexión:
Una canción. Un paseo corto. Una conversación sin juicio.

5. **Mindfulness y aceptación activa**
No luches contra la ansiedad. Escúchala.
Observa tus pensamientos como nubes que pasan.
Recuerda: Tú no eres tu ansiedad. Tú eres quien la observa.

6. **Comunicación asertiva**
Expresar lo que sientes sin miedo al rechazo reduce la presión interna.
✨ Usa frases como:
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
    content: `**El duelo que no siempre se ve, pero que duele de verdad**\n\nUna ruptura sentimental no es solo una tristeza pasajera. Es una experiencia de pérdida real que puede sacudir los cimientos de tu identidad, tu seguridad emocional y tu visión del futuro.\nY no es una exageración: múltiples estudios han demostrado que el cerebro reacciona al rechazo amoroso activando las mismas áreas implicadas en el dolor físico —como si el corazón roto fuera, también, un cuerpo herido.\nLo más complejo es que este tipo de dolor va acompañado de una montaña rusa emocional difícil de gestionar: tristeza profunda, ansiedad, orgullo herido, pensamientos obsesivos, culpa o una soledad que parece no acabar nunca. A veces incluso aparece el insomnio, la apatía o una sensación de pérdida de sentido vital.\nSentirse así no significa que estés “mal” ni que seas débil. Significa simplemente que estás atravesando un proceso humano… que, con apoyo y herramientas, también se puede transformar.\n\n**¿Por qué duele tanto? Lo que ocurre en tu mente (y tu cuerpo)**\n\nTras una ruptura, tu sistema nervioso entra en modo alarma: se activan los circuitos del miedo al abandono, de la autocrítica, de la búsqueda compulsiva de respuestas. Este estado puede generar desregulación emocional, agotamiento mental e incluso síntomas físicos como presión en el pecho, nudos en el estómago o dificultad para concentrarte.\nAdemás, la mente suele entrar en un patrón de rumiación: pensamientos repetitivos sobre lo que pasó, lo que no hiciste, lo que deberías haber dicho. Este bucle no ayuda a sanar: alimenta la angustia, refuerza creencias disfuncionales como “no merezco ser amada/o”, y te aleja del presente.\nPero no estás atrapada o atrapado ahí. Hay formas de intervenir, de comprenderte mejor y de reconstruir desde dentro.\n\n**¿Y ahora qué? Estrategias reales para reconstruirte**\n\nLa ciencia del bienestar emocional ha identificado varias herramientas que pueden ayudarte en este proceso. Aquí te compartimos algunas:\n**Reestructura tus pensamientos**\nNo creas todo lo que piensas cuando estás dolida/o. Algunas ideas que aparecen en este momento (“Nunca más voy a sentirme así”, “Estoy rota/o para siempre”) son distorsiones cognitivas fruto del dolor.\nPuedes aprender a detectarlas y darles forma más realista. Pregúntate, por ejemplo:\n- ¿Hay otra forma de interpretar lo que pasó?\n- ¿Qué creencias mías se han activado con esta experiencia?\n- ¿Realmente esta situación define todo mi valor como persona?\n\n**Regula tus emociones sin invalidarlas**\nAceptar que duele… también es parte de sanar. No necesitas apresurarte a “superarlo”.\nDate espacio para sentir, sin juzgar lo que surge: tristeza, enojo, miedo, nostalgia. Todo tiene un lugar.\nTécnicas como la acción opuesta (hacer lo contrario de lo que la emoción destructiva te pide), la validación emocional o el uso del cuerpo como ancla (respirar, caminar, mover el cuerpo) pueden ayudarte a recuperar la calma.\n\n**Conecta con el presente**\nEl mindfulness es una herramienta poderosa para romper la rumiación. Volver al cuerpo, a la respiración, a lo que sí está ocurriendo aquí y ahora, ayuda a que tu mente deje de habitar exclusivamente el pasado o las suposiciones del futuro.\nRecuerda: todo pasa. Esta emoción también.\n\n**Cultiva la autocompasión**\nNo necesitas ser dura/o contigo. Necesitas tratarte como lo harías con alguien a quien amas profundamente.\nPracticar frases compasivas, escribirte desde el cuidado, recordarte tus esfuerzos… son pequeños gestos que, repetidos, tienen un efecto enorme.\n\n**Lo que viene después del dolor: una nueva versión de ti**\n\nUna ruptura puede desestabilizarte, sí… pero también puede convertirse en un momento de autodescubrimiento.\nMuchas personas, al mirar atrás, reconocen que ese desgarro fue el inicio de un proceso profundo: aprendieron a poner límites, a reconocer sus necesidades, a elegir distinto.\nSanar no es olvidar. Es aprender a mirar el pasado con más comprensión y menos carga. Y darte la oportunidad de construir una relación distinta, empezando por la que tienes contigo.\n\n**Recuerda**\nAunque ahora sientas que todo se ha roto, hay dentro de ti una fuerza que permanece intacta: tu capacidad de reconstruirte con dignidad, sensibilidad y coraje.`,
    estimatedTime: '9 min lectura',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'heartbreak healing relationship'
  }
];
