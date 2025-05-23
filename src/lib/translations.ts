// For V1, directly use Spanish. This structure allows easy replacement with a full i18n solution.
// All text literals should be sourced from here.

export const t = {
  appName: "WorkWell",
  // General
  welcome: "Hola!", 
  loading: "Cargando...",
  submit: "Enviar",
  save: "Guardar",
  errorOccurred: "Ocurrió un error. Por favor, inténtalo de nuevo.",
  // Auth
  login: "Inicia Sesión",
  register: "Registrarse",
  logout: "Cerrar Sesión",
  email: "Correo Electrónico",
  password: "Contraseña",
  name: "Nombre",
  ageRange: "Rango de Edad",
  ageRangePlaceholder: "Selecciona tu rango de edad",
  gender: "Género (opcional)",
  genderPlaceholder: "Selecciona tu género",
  initialEmotionalState: "Estado emocional inicial (1-5)",
  forgotPassword: "¿Olvidaste tu contraseña?",
  noAccount: "¿No tienes cuenta? Regístrate",
  alreadyHaveAccount: "¿Ya tienes cuenta? Inicia Sesión",
  agreeToTerms: "Acepto la política de privacidad y aviso legal.",
  registrationSuccessTitle: "¡Registro Exitoso!",
  registrationSuccessMessage: "Revisa tu correo para activar tu cuenta.",
  loginFailed: "Error al iniciar sesión. Verifica tus credenciales.",
  registrationFailed: "Error al registrar. Inténtalo de nuevo.",
  // Sidebar Navigation
  navDashboard: "Panel",
  navAssessment: "Evaluación",
  navPaths: "Rutas",
  navChatbot: "Mentor AI",
  navResources: "Recursos",
  navSettings: "Configuración",
  // Welcome Page / Dashboard
  welcomeToWorkWell: "Te damos la bienvenida a WorkWell, un espacio para reconectar contigo. Este viaje es personal.", // Changed from feminine specific
  startYourJourney: "Comienza tu viaje hacia el bienestar",
  takeInitialAssessment: "Realizar Evaluación Inicial",
  continueYourPath: "Continúa tu Ruta",
  // Assessment
  assessmentTitle: "Evaluación Psicológica Inicial",
  assessmentIntro: "Conocer cómo estás hoy es el primer paso para cuidarte. Tómate unos minutos, este espacio es solo para ti.",
  startAssessment: "Comenzar Evaluación",
  questionProgress: "Pregunta {current} de {total}",
  nextQuestion: "Siguiente",
  previousQuestion: "Anterior",
  finishAssessment: "Finalizar Evaluación",
  assessmentResultsTitle: "Resultados de tu Evaluación",
  emotionalProfile: "Perfil Emocional",
  priorityAreas: "Tus Áreas Prioritarias",
  summaryAndRecommendations: "Resumen y Recomendaciones",
  startPathFor: "Comenzar ruta para {area}",
  // Paths
  pathsTitle: "Rutas de Desarrollo",
  selectPathPrompt: "Elige una ruta para trabajar en tu bienestar.",
  module: "Módulo",
  startModule: "Comenzar Módulo",
  markAsCompleted: "Marcar como completado",
  // Chatbot
  chatbotTitle: "Mentor Emocional AI",
  chatbotWelcome: "Hola, estoy aquí para escucharte y acompañarte. ¿En qué quieres trabajar hoy?",
  chatbotInputPlaceholder: "Escribe tu mensaje aquí...",
  // Resources
  resourcesTitle: "Biblioteca de Recursos",
  resourcesIntro: "Aquí encontrarás herramientas que nutren tu bienestar emocional. Explora a tu ritmo.",
  resourceTypeArticle: "Artículo",
  resourceTypeAudio: "Audio",
  resourceTypeExercise: "Ejercicio",
  // Settings
  settingsTitle: "Configuración de Cuenta",
  personalInformation: "Información Personal",
  objectives: "Objetivos Personales",
  notificationPreferences: "Preferencias de Notificación",
  privacyAndSecurity: "Privacidad y Seguridad",
  language: "Idioma",
  saveChanges: "Guardar Cambios",
  // Age Ranges
  age_under_18: "Menor de 18",
  age_18_24: "18-24",
  age_25_34: "25-34",
  age_35_44: "35-44",
  age_45_54: "45-54",
  age_55_64: "55-64",
  age_65_plus: "65 o más",
  // Genders
  gender_male: "Masculino",
  gender_female: "Femenino",
  gender_non_binary: "No binario",
  gender_other: "Otro",
  gender_prefer_not_to_say: "Prefiero no decirlo",
};

export type Translations = typeof t;

// A simple hook to access translations for V1. Can be replaced with a full i18n library.
export function useTranslations(): Translations {
  return t;
}
