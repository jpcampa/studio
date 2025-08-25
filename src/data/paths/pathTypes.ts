
export type ParagraphContent = {
  type: 'paragraph';
  text: string;
};

export type TitleContent = {
  type: 'title';
  text: string;
};

export type ListContent = {
  type: 'list';
  items: string[];
};

export type QuoteContent = {
  type: 'quote';
  text: string;
};

export type CollapsibleContent = {
  type: 'collapsible';
  title: string;
  content: ModuleContent[];
};

export type ExerciseContent = {
    type: 'exercise';
    title: string;
    objective?: string;
    duration?: string;
    content: ModuleContent[];
};

export type StressMapExerciseContent = {
    type: 'stressMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    // No 'content' needed as it's a self-contained interactive component
};

export type TriggerExerciseContent = {
    type: 'triggerExercise';
    title: string;
    objective?: string;
    duration?: string;
    // No 'content' needed as it's a self-contained interactive component
};

export type TherapeuticNotebookReflection = {
    type: 'therapeuticNotebookReflection';
    title: string;
    prompts: string[];
}

export type DetectiveExerciseContent = {
    type: 'detectiveExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type DemandsExerciseContent = {
    type: 'demandsExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type WellbeingPlanExerciseContent = {
    type: 'wellbeingPlanExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type UncertaintyMapExerciseContent = {
    type: 'uncertaintyMapExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type ControlTrafficLightExerciseContent = {
    type: 'controlTrafficLightExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type AlternativeStoriesExerciseContent = {
    type: 'alternativeStoriesExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type MantraExerciseContent = {
    type: 'mantraExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type DelSabotajeALaAccionExerciseContent = {
    type: 'delSabotajeALaAccionExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type MapOfUnsaidThingsExerciseContent = {
    type: 'mapOfUnsaidThingsExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type DiscomfortCompassExerciseContent = {
    type: 'discomfortCompassExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type AssertivePhraseExerciseContent = {
    type: 'assertivePhraseExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type NoGuiltTechniquesExerciseContent = {
    type: 'noGuiltTechniquesExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type PostBoundaryEmotionsExerciseContent = {
    type: 'postBoundaryEmotionsExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type CompassionateFirmnessExerciseContent = {
    type: 'compassionateFirmnessExercise';
    title: string;
    objective?: string;
    duration?: string;
};

export type SelfCareContractExerciseContent = {
    type: 'selfCareContractExercise';
    title: string;
    objective?: string;
    duration?: string;
};

// RUTA 5
export type AuthenticityThermometerExerciseContent = {
    type: 'authenticityThermometerExercise';
    title: 'EJERCICIO 1 – MI TERMÓMETRO DE AUTENTICIDAD';
    objective?: string;
    duration?: string;
};

export type EmpatheticDialogueExerciseContent = {
    type: 'empatheticDialogueExercise';
    title: 'Ejercicio 2: DIÁLOGO INTERNO EMPÁTICO';
    objective?: string;
    duration?: string;
};

export type EmpathicMirrorExerciseContent = {
    type: 'empathicMirrorExercise';
    title: 'EJERCICIO 1: EL ESPEJO EMPÁTICO';
    objective?: string;
    duration?: string;
};

export type ValidationIn3StepsExerciseContent = {
    type: 'validationIn3StepsExercise';
    title: 'EJERCICIO 2: VALIDACIÓN EN 3 PASOS';
    objective?: string;
    duration?: string;
};

export type EmpathicShieldVisualizationExerciseContent = {
    type: 'empathicShieldVisualizationExercise';
    title: 'EJERCICIO 1: VISUALIZACIÓN GUIADA: EL ESCUDO EMPÁTICO';
    objective?: string;
    duration?: string;
    content?: { type: 'paragraph', text: string }[]; // Para la versión escrita
};

export type EmotionalInvolvementTrafficLightExerciseContent = {
    type: 'emotionalInvolvementTrafficLightExercise';
    title: 'Ejercicio 2: Semáforo de implicación emocional';
    objective?: string;
    duration?: string;
};

export type SignificantRelationshipsInventoryExerciseContent = {
    type: 'significantRelationshipsInventoryExercise';
    title: 'EJERCICIO1: INVENTARIO DE RELACIONES SIGNIFICATIVAS';
    objective?: string;
    duration?: string;
};

export type RelationalCommitmentExerciseContent = {
    type: 'relationalCommitmentExercise';
    title: 'EJERCICIO 2: MI COMPROMISO RELACIONAL';
    objective?: string;
    duration?: string;
};

// RUTA 6
export type DetectiveDeEmocionesExerciseContent = {
    type: 'detectiveDeEmocionesExercise';
    title: 'EJERCICIO 1: “DETECTIVE DE EMOCIONES”';
    objective?: string;
    duration?: string;
};

export type UnaPalabraCadaDiaExerciseContent = {
    type: 'unaPalabraCadaDiaExercise';
    title: 'EJERCICIO 2: “UNA PALABRA CADA DÍA”';
    objective?: string;
    duration?: string;
};

export type MapaEmocionNecesidadCuidadoExerciseContent = {
    type: 'mapaEmocionNecesidadCuidadoExercise';
    title: 'EJERCICIO 1: MAPA EMOCIÓN – NECESIDAD – CUIDADO';
    objective?: string;
    duration?: string;
};

export type CartaDesdeLaEmocionExerciseContent = {
    type: 'cartaDesdeLaEmocionExercise';
    title: 'EJERCICIO 2: CARTA DESDE LA EMOCIÓN';
    objective?: string;
    duration?: string;
};

export type MapaEmocionalRepetidoExerciseContent = {
    type: 'mapaEmocionalRepetidoExercise';
    title: 'EJERCICIO 1: MAPA EMOCIONAL REPETIDO';
    objective?: string;
    duration?: string;
};

export type SemaforoEmocionalExerciseContent = {
    type: 'semaforoEmocionalExercise';
    title: 'EJERCICIO 2: SEMÁFORO EMOCIONAL INTERACTIVO';
    objective?: string;
    duration?: string;
};

export type MeditacionGuiadaSinJuicioExerciseContent = {
    type: 'meditacionGuiadaSinJuicioExercise';
    title: 'EJERCICIO 1: MEDITACIÓN GUIADA SIN JUICIO';
    objective?: string;
    duration?: string;
};

export type DiarioMeDiCuentaExerciseContent = {
    type: 'diarioMeDiCuentaExercise';
    title: 'EJERCICIO 2: DIARIO DEL “ME DI CUENTA”';
    objective?: string;
    duration?: string;
};

// RUTA 7
export type ValuesCompassExerciseContent = {
    type: 'valuesCompassExercise';
    title: 'EJERCICIO 1: MI BRÚJULA DE VALORES';
    objective?: string;
    duration?: string;
};

export type EnergySenseMapExerciseContent = {
    type: 'energySenseMapExercise';
    title: 'EJERCICIO 2: MAPA DE ENERGÍA VS. SENTIDO';
    objective?: string;
    duration?: string;
};

export type DetoursInventoryExerciseContent = {
    type: 'detoursInventoryExercise';
    title: 'EJERCICIO 1: INVENTARIO DE DESVÍOS';
    objective?: string;
    duration?: string;
};

export type PresentVsEssentialSelfExerciseContent = {
    type: 'presentVsEssentialSelfExercise';
    title: 'EJERCICIO 2: VISUALIZACIÓN DEL YO PRESENTE VS. YO ESENCIAL';
    objective?: string;
    duration?: string;
};

export type MentalNoiseTrafficLightExerciseContent = {
    type: 'mentalNoiseTrafficLightExercise';
    title: 'MICROPRÁCTICA OPCIONAL: SEMÁFORO DEL RUIDO MENTAL';
    objective?: string;
    duration?: string;
};

export type DirectedDecisionsExerciseContent = {
    type: 'directedDecisionsExercise';
    title: 'EJERCICIO 1: DECISIONES CON DIRECCIÓN';
    objective?: string;
    duration?: string;
};

export type SenseChecklistExerciseContent = {
    type: 'senseChecklistExercise';
    title: 'EJERCICIO 2: CHECKLIST DEL SENTIDO';
    objective?: string;
    duration?: string;
};

export type UnfulfilledNeedsExerciseContent = {
    type: 'unfulfilledNeedsExercise';
    title: 'MICROPRÁCTICA OPCIONAL: LO QUE NO HICE… Y SÍ ME NUTRÍA';
    objective?: string;
    duration?: string;
};

export type BraveRoadmapExerciseContent = {
    type: 'braveRoadmapExercise';
    title: 'EJERCICIO 1: MI HOJA DE RUTA VALIENTE';
    objective?: string;
    duration?: string;
};

export type EssentialReminderExerciseContent = {
    type: 'essentialReminderExercise';
    title: 'EJERCICIO 2: MI RECORDATORIO ESENCIAL';
    objective?: string;
    duration?: string;
};

export type ThoughtsThatBlockPurposeExerciseContent = {
    type: 'thoughtsThatBlockPurposeExercise';
    title: 'MICROPRÁCTICA OPCIONAL: ¿QUÉ PENSAMIENTOS ME ALEJAN DE MI PROPÓSITO?';
    objective?: string;
    duration?: string;
};

// RUTA 8
export type ResilienceTimelineExerciseContent = {
    type: 'resilienceTimelineExercise';
    title: 'EJERCICIO 1: LÍNEA DEL TIEMPO RESILIENTE';
    objective: string;
    duration: string;
};

export type PersonalDefinitionExerciseContent = {
    type: 'personalDefinitionExercise';
    title: 'Técnica 2: Mi definición personal de resiliencia';
    objective: string;
    duration: string;
};

export type AnchorInStormExerciseContent = {
    type: 'anchorInStormExercise';
    title: 'EJERCICIO 1: MI ANCLA EN LA TORMENTA';
    objective: string;
    duration: string;
};

export type IntensityScaleExerciseContent = {
    type: 'intensityScaleExercise';
    title: 'EJERCICIO 2: MI ESCALA DE INTENSIDAD Y PLAN DE AUTORREGULACIÓN';
    objective: string;
    duration: string;
};

export type BraveDecisionsWheelExerciseContent = {
    type: 'braveDecisionsWheelExercise';
    title: 'EJERCICIO 1: RUEDA DE DECISIONES VALIENTES';
    objective: string;
    duration: string;
};

export type PlanABExerciseContent = {
    type: 'planABExercise';
    title: 'EJERCICIO 2: Plan A / Plan B emocional (versión ampliada)';
    objective: string;
    duration: string;
};

export type ChangeTimelineExerciseContent = {
    type: 'changeTimelineExercise';
    title: 'EJERCICIO 1: MI LÍNEA DEL CAMBIO';
    objective: string;
    duration: string;
};

export type MyPactExerciseContent = {
    type: 'myPactExercise';
    title: 'EJERCICIO 2: MI PACTO CONMIGO';
    objective: string;
    duration: string;
};

// RUTA 9
export type CoherenceCompassExerciseContent = {
    type: 'coherenceCompassExercise';
    title: 'EJERCICIO 1: MI BRÚJULA DE COHERENCIA';
    objective?: string;
    duration?: string;
};

export type SmallDecisionsLogExerciseContent = {
    type: 'smallDecisionsLogExercise';
    title: 'EJERCICIO 2: REGISTRO DE DECISIONES PEQUEÑAS';
    objective?: string;
    duration?: string;
};

export type InternalTensionsMapExerciseContent = {
    type: 'internalTensionsMapExercise';
    title: 'EJERCICIO 1: MAPA DE TENSIONES INTERNAS';
    objective?: string;
    duration?: string;
};

export type EthicalMirrorExerciseContent = {
    type: 'ethicalMirrorExercise';
    title: 'EJERCICIO 2: EL ESPEJO ÉTICO';
    objective?: string;
    duration?: string;
};

export type IntegrityDecisionsExerciseContent = {
    type: 'integrityDecisionsExercise';
    title: 'EJERCICIO 1: DECISIONES CON INTEGRIDAD';
    objective?: string;
    duration?: string;
};

export type NonNegotiablesExerciseContent = {
    type: 'nonNegotiablesExercise';
    title: 'EJERCICIO 2: LISTA DE NO NEGOCIABLES PERSONALES';
    objective?: string;
    duration?: string;
};

export type EnvironmentEvaluationExerciseContent = {
    type: 'environmentEvaluationExercise';
    title: 'EJERCICIO 1: EVALUACIÓN DE ENTORNOS CLAVE';
    objective?: string;
    duration?: string;
};

export type PersonalManifestoExerciseContent = {
    type: 'personalManifestoExercise';
    title: 'EJERCICIO 2: TU MANIFIESTO DE COHERENCIA';
    objective?: string;
    duration?: string;
};


// A union type for all possible content block types within a module
export type ModuleContent =
  | ParagraphContent
  | TitleContent
  | ListContent
  | QuoteContent
  | CollapsibleContent
  | ExerciseContent
  | StressMapExerciseContent
  | TriggerExerciseContent
  | TherapeuticNotebookReflection
  | DetectiveExerciseContent
  | DemandsExerciseContent
  | WellbeingPlanExerciseContent
  | UncertaintyMapExerciseContent
  | ControlTrafficLightExerciseContent
  | AlternativeStoriesExerciseContent
  | MantraExerciseContent
  | DelSabotajeALaAccionExerciseContent
  | MapOfUnsaidThingsExerciseContent
  | DiscomfortCompassExerciseContent
  | AssertivePhraseExerciseContent
  | NoGuiltTechniquesExerciseContent
  | PostBoundaryEmotionsExerciseContent
  | CompassionateFirmnessExerciseContent
  | SelfCareContractExerciseContent
  // RUTA 5
  | AuthenticityThermometerExerciseContent
  | EmpatheticDialogueExerciseContent
  | EmpathicMirrorExerciseContent
  | ValidationIn3StepsExerciseContent
  | EmpathicShieldVisualizationExerciseContent
  | EmotionalInvolvementTrafficLightExerciseContent
  | SignificantRelationshipsInventoryExerciseContent
  | RelationalCommitmentExerciseContent
  // RUTA 6
  | DetectiveDeEmocionesExerciseContent
  | UnaPalabraCadaDiaExerciseContent
  | MapaEmocionNecesidadCuidadoExerciseContent
  | CartaDesdeLaEmocionExerciseContent
  | MapaEmocionalRepetidoExerciseContent
  | SemaforoEmocionalExerciseContent
  | MeditacionGuiadaSinJuicioExerciseContent
  | DiarioMeDiCuentaExerciseContent
  // RUTA 7
  | ValuesCompassExerciseContent
  | EnergySenseMapExerciseContent
  | DetoursInventoryExerciseContent
  | PresentVsEssentialSelfExerciseContent
  | MentalNoiseTrafficLightExerciseContent
  | DirectedDecisionsExerciseContent
  | SenseChecklistExerciseContent
  | UnfulfilledNeedsExerciseContent
  | BraveRoadmapExerciseContent
  | EssentialReminderExerciseContent
  | ThoughtsThatBlockPurposeExerciseContent
  // RUTA 8
  | ResilienceTimelineExerciseContent
  | PersonalDefinitionExerciseContent
  | AnchorInStormExerciseContent
  | IntensityScaleExerciseContent
  | BraveDecisionsWheelExerciseContent
  | PlanABExerciseContent
  | ChangeTimelineExerciseContent
  | MyPactExerciseContent
  // RUTA 9
  | CoherenceCompassExerciseContent
  | SmallDecisionsLogExerciseContent
  | InternalTensionsMapExerciseContent
  | EthicalMirrorExerciseContent
  | IntegrityDecisionsExerciseContent
  | NonNegotiablesExerciseContent
  | EnvironmentEvaluationExerciseContent
  | PersonalManifestoExerciseContent;

// Defines a single module within a guided path
export type PathModule = {
  id: string;
  title: string; // Spanish
  type: 'introduction' | 'skill_practice' | 'summary'; // Categorizes the module's role in the path
  content: ModuleContent[]; // An array of different content blocks that make up the module
  estimatedTime?: string; // e.g., "20-30 min"
  dataAiHint?: string; // For images if any
};

    