export type Question = {
  id: string;
  dimension: string;
  text: string; // Spanish text
};

export const assessmentQuestions: Question[] = [
  { id: 'q1', dimension: 'Autoestima', text: '¿Con qué frecuencia te sientes satisfecho/a contigo mismo/a?' },
  { id: 'q2', dimension: 'Estrés', text: '¿Cómo calificarías tu nivel de estrés general en las últimas semanas?' },
  { id: 'q3', dimension: 'Sueño y descanso', text: '¿Sientes que tu descanso nocturno es reparador?' },
  { id: 'q4', dimension: 'Energía', text: '¿Cómo describirías tus niveles de energía diarios?' },
  { id: 'q5', dimension: 'Relaciones Sociales', text: '¿Te sientes conectado/a y apoyado/a por las personas en tu vida?' },
  { id: 'q6', dimension: 'Estado de Ánimo', text: '¿Con qué frecuencia experimentas emociones positivas (alegría, gratitud, etc.)?' },
  { id: 'q7', dimension: 'Manejo Emocional', text: '¿Sientes que puedes manejar tus emociones de manera efectiva?' },
  { id: 'q8', dimension: 'Concentración', text: '¿Te resulta fácil concentrarte en tus tareas diarias?' },
  { id: 'q9', dimension: 'Motivación', text: '¿Cómo calificarías tu nivel de motivación para alcanzar tus metas?' },
  { id: 'q10', dimension: 'Resiliencia', text: '¿Sientes que puedes recuperarte rápidamente de las dificultades?' },
  { id: 'q11', dimension: 'Bienestar Físico', text: '¿Estás satisfecho/a con tu nivel de actividad física?' },
  { id: 'q12', dimension: 'Propósito Vital', text: '¿Sientes que tu vida tiene un propósito claro y significativo?' },
];

// Emojis represent "Nunca o Casi Nunca" (más negativo) a "Siempre o Casi Siempre" (más positivo)
export const likertOptions = [
  { value: 1, label: '😩' }, // Muy Mal / Nunca
  { value: 2, label: '🙁' }, // Mal / A Veces
  { value: 3, label: '😐' }, // Regular / Regularmente
  { value: 4, label: '🙂' }, // Bien / Frecuentemente
  { value: 5, label: '😄' }, // Muy Bien / Siempre
];
