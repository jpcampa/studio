
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
    title: string;
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
  | RelationalCommitmentExerciseContent;

// Defines a single module within a guided path
export type PathModule = {
  id: string;
  title: string; // e.g., "Semana 1: Comprende el Estrés"
  type: 'introduction' | 'skill_practice' | 'summary'; // Categorizes the module's role in the path
  content: ModuleContent[]; // An array of different content blocks that make up the module
  estimatedTime?: string; // e.g., "20-30 min"
  dataAiHint?: string; // For images if any
};
