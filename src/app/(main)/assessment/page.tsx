
"use client";

import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';

// El contenido del JSON de preguntas ahora está incrustado directamente en el código.
const assessmentQuestions: AssessmentDimension[] = [
    {
      "id": "dim1",
      "name": "Regulación Emocional y Estrés",
      "definition": "Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.",
      "recommendedPathId": "gestion-estres",
      "items": [
        {
          "id": "dim1_item1",
          "text": "Suelo mantener la calma cuando las cosas se complican.",
          "weight": 1
        },
        {
          "id": "dim1_item2",
          "text": "Me desbordo fácilmente ante el estrés o la presión.",
          "weight": 1,
          "isInverse": true
        },
        {
          "id": "dim1_item3",
          "text": "Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.",
          "weight": 1
        },
        {
          "id": "dim1_item4",
          "text": "Me recupero con rapidez después de una situación emocionalmente intensa.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim2",
      "name": "Flexibilidad Mental y Adaptabilidad",
      "definition": "Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.",
      "recommendedPathId": "tolerar-incertidumbre",
      "items": [
        {
          "id": "dim2_item1",
          "text": "Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.",
          "weight": 1
        },
        {
          "id": "dim2_item2",
          "text": "Suelo encontrar soluciones creativas cuando algo no sale como esperaba.",
          "weight": 1
        },
        {
          "id": "dim2_item3",
          "text": "A menudo cuestiono mis propias creencias o formas de pensar.",
          "weight": 1
        },
        {
          "id": "dim2_item4",
          "text": "Me adapto con rapidez cuando las circunstancias cambian.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim3",
      "name": "Autorregulación personal y constancia",
      "definition": "Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.",
      "recommendedPathId": "superar-procrastinacion",
      "items": [
        {
          "id": "dim3_item1",
          "text": "Suelo cumplir mis objetivos, aunque me cuesten.",
          "weight": 1
        },
        {
          "id": "dim3_item2",
          "text": "Soy constante con mis compromisos personales y profesionales.",
          "weight": 1
        },
        {
          "id": "dim3_item3",
          "text": "Planifico mis días para aprovechar bien el tiempo.",
          "weight": 1
        },
        {
          "id": "dim3_item4",
          "text": "Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.",
          "weight": 1,
          "isInverse": true
        }
      ]
    },
    {
      "id": "dim4",
      "name": "Autoafirmación y Expresión Personal",
      "definition": "Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.",
      "recommendedPathId": "poner-limites",
      "items": [
        {
          "id": "dim4_item1",
          "text": "Me siento con derecho a expresar lo que necesito, aunque sea incómodo.",
          "weight": 1
        },
        {
          "id": "dim4_item2",
          "text": "Soy capaz de defender mi opinión sin imponerla.",
          "weight": 1
        },
        {
          "id": "dim4_item3",
          "text": "Me cuesta decir \"no\", incluso cuando lo deseo.",
          "weight": 1,
          "isInverse": true
        },
        {
          "id": "dim4_item4",
          "text": "En situaciones difíciles, puedo mantener mi postura con respeto.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim5",
      "name": "Empatía y Conexión Interpersonal",
      "definition": "Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.",
      "recommendedPathId": "relaciones-autenticas",
      "items": [
        {
          "id": "dim5_item1",
          "text": "Me interesa entender cómo se sienten las personas que me rodean.",
          "weight": 1
        },
        {
          "id": "dim5_item2",
          "text": "A veces actúo sin considerar el impacto emocional que puede tener en otros.",
          "weight": 1,
          "isInverse": true
        },
        {
          "id": "dim5_item3",
          "text": "Suelo conectar fácilmente con las emociones de los demás.",
          "weight": 1
        },
        {
          "id": "dim5_item4",
          "text": "Tengo sensibilidad para detectar cuándo alguien necesita apoyo.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim6",
      "name": "Insight y Autoconciencia",
      "definition": "Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.",
      "recommendedPathId": "comprender-mejor-cada-dia",
      "items": [
        {
          "id": "dim6_item1",
          "text": "Reflexiono con frecuencia sobre lo que siento y por qué.",
          "weight": 1
        },
        {
          "id": "dim6_item2",
          "text": "Se con claridad quién soy porque conozco mis puntos fuertes y también mis áreas a mejorar.",
          "weight": 1
        },
        {
          "id": "dim6_item3",
          "text": "Soy consciente de cómo influyen mis emociones en mis decisiones.",
          "weight": 1
        },
        {
          "id": "dim6_item4",
          "text": "Reconozco cuándo repito patrones que no me benefician y trato de cambiarlos.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim7",
      "name": "Propósito Vital y Dirección Personal",
      "definition": "Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        {
          "id": "dim7_item1",
          "text": "Tengo claro qué es importante para mí en la vida.",
          "weight": 1
        },
        {
          "id": "dim7_item2",
          "text": "Tomo decisiones alineadas con mis prioridades y valores personales.",
          "weight": 1
        },
        {
          "id": "dim7_item3",
          "text": "Siento que lo que hago tiene sentido y propósito.",
          "weight": 1
        },
        {
          "id": "dim7_item4",
          "text": "Estoy construyendo un camino de vida que me representa.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim8",
      "name": "Estilo de Afrontamiento",
      "definition": "Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.",
      "recommendedPathId": "resiliencia-en-accion",
      "items": [
        {
          "id": "dim8_item1",
          "text": "Cuando tengo un problema, rápidamente busco cómo solucionarlo sin quedarme estancado/a.",
          "weight": 1
        },
        {
          "id": "dim8_item2",
          "text": "Trato de sacar un aprendizaje personal incluso en los momentos más difíciles.",
          "weight": 1
        },
        {
          "id": "dim8_item3",
          "text": "Frente a la dificultad, trato de mantener la mente abierta y flexible.",
          "weight": 1
        },
        {
          "id": "dim8_item4",
          "text": "Me adapto sin perder de vista lo que quiero conseguir.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim9",
      "name": "Integridad y Coherencia Ética",
      "definition": "Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.",
      "recommendedPathId": "vivir-con-coherencia",
      "items": [
        {
          "id": "dim9_item1",
          "text": "Intento actuar con integridad, incluso cuando no es lo mejor o más fácil.",
          "weight": 1
        },
        {
          "id": "dim9_item2",
          "text": "Me importa mucho el impacto de mis acciones en otras personas.",
          "weight": 1
        },
        {
          "id": "dim9_item3",
          "text": "La honestidad guía mis decisiones, también en lo pequeño.",
          "weight": 1
        },
        {
          "id": "dim9_item4",
          "text": "Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim10",
      "name": "Responsabilidad Personal y Aceptación Consciente",
      "definition": "Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.",
      "recommendedPathId": "ni-culpa-ni-queja",
      "items": [
        {
          "id": "dim10_item1",
          "text": "Reflexiono y se reconocer cuándo he contribuido a que algo no salga como esperaba.",
          "weight": 1
        },
        {
          "id": "dim10_item2",
          "text": "Cuando afronto dificultades, pienso y me pregunto qué puedo hacer diferente.",
          "weight": 1
        },
        {
          "id": "dim10_item3",
          "text": "Asumo la responsabilidad de mis actos incluso cuando es incómodo.",
          "weight": 1
        },
        {
          "id": "dim10_item4",
          "text": "Soy consciente del papel que tengo en las situaciones que vivo y eso me permite aprender y crecer.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim11",
      "name": "Apoyo Social Percibido",
      "definition": "Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.",
      "recommendedPathId": "confiar-en-mi-red",
      "items": [
        {
          "id": "dim11_item1",
          "text": "Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.",
          "weight": 1
        },
        {
          "id": "dim11_item2",
          "text": "En mi entorno laboral, me siento respaldado/a por compañeros y superiores.",
          "weight": 1
        },
        {
          "id": "dim11_item3",
          "text": "Me cuesta pedir ayuda, incluso cuando la necesito.",
          "weight": 1,
          "isInverse": true
        },
        {
          "id": "dim11_item4",
          "text": "Me siento parte de una red de apoyo y sostén emocional sólida y accesible.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim12",
      "name": "Estado de Ánimo",
      "definition": "Evaluación del estado de ánimo general y la presencia de síntomas relacionados con el desánimo o la anhedonia en las últimas semanas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        {
          "id": "dim12_item1",
          "text": "Me siento triste o desanimado/a.",
          "weight": 1
        },
        {
          "id": "dim12_item2",
          "text": "Tengo dificultad para disfrutar de las actividades que solían gustarme.",
          "weight": 1
        },
        {
          "id": "dim12_item3",
          "text": "Me siento inútil o inferior a los demás.",
          "weight": 1
        },
        {
          "id": "dim12_item4",
          "text": "Me siento culpable por cosas que hago o no hago.",
          "weight": 1
        },
        {
          "id": "dim12_item5",
          "text": "Me siento agotado/a física o mentalmente.",
          "weight": 1
        },
        {
          "id": "dim12_item6",
          "text": "Tengo dificultad para mantener la concentración en tareas.",
          "weight": 1
        },
        {
          "id": "dim12_item7",
          "text": "Me falta motivación para realizar actividades cotidianas.",
          "weight": 1
        },
        {
          "id": "dim12_item8",
          "text": "Siento que mi vida carece de sentido o dirección.",
          "weight": 1
        },
        {
          "id": "dim12_item9",
          "text": "Me aíslo o evito el contacto con otras personas.",
          "weight": 1
        },
        {
          "id": "dim12_item10",
          "text": "Siento que nada va a cambiar, aunque me esfuerce.",
          "weight": 1
        },
        {
          "id": "dim12_item11",
          "text": "Siento que he perdido interés por cuidar de mí mismo/a (higiene, salud, descanso...).",
          "weight": 1
        },
        {
          "id": "dim12_item12",
          "text": "Últimamente me cuesta identificar o expresar lo que siento.",
          "weight": 1
        }
      ]
    },
    {
      "id": "dim13",
      "name": "Ansiedad Estado",
      "definition": "Evaluación del nivel de ansiedad y tensión experimentado en el momento presente o en los últimos días.",
      "recommendedPathId": "regular-ansiedad-paso-a-paso",
      "items": [
        {
          "id": "dim13_item1",
          "text": "Me siento tenso/a o nervioso/a actualmente.",
          "weight": 1
        },
        {
          "id": "dim13_item2",
          "text": "Me preocupo por cosas que normalmente no me afectan.",
          "weight": 1
        },
        {
          "id": "dim13_item3",
          "text": "Siento una inquietud interna difícil de controlar.",
          "weight": 1
        },
        {
          "id": "dim13_item4",
          "text": "Me cuesta relajarme incluso en situaciones tranquilas.",
          "weight": 1
        },
        {
          "id": "dim13_item5",
          "text": "Reacciono con irritabilidad ante pequeñas molestias.",
          "weight": 1
        },
        {
          "id": "dim13_item6",
          "text": "Siento que pierdo el control fácilmente sobre mis emociones.",
          "weight": 1
        }
      ]
    }
  ];

export default function AssessmentPage() {
  // Las dimensiones ahora se cargan estáticamente desde la constante.
  const dimensions: AssessmentDimension[] = assessmentQuestions;

  // Pasamos las dimensiones directamente al componente cliente.
  // Ya no necesitamos estados de carga o error para esta parte.
  return (
    <AssessmentPageClient
      assessmentDimensions={dimensions}
    />
  );
}
