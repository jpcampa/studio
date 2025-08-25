
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

// RUTA 10
export type ComplaintTransformationExerciseContent = {
    type: 'complaintTransformationExercise';
    title: 'EJERCICIO 1: TABLA “ME QUEJO DE… / LO QUE SÍ PUEDO HACER ES…”';
    objective: string;
    duration: string;
};

export type GuiltRadarExerciseContent = {
    type: 'guiltRadarExercise';
    title: 'EJERCICIO 2: MI RADAR DE CULPA';
    objective: string;
    duration: string;
};

export type AcceptanceWritingExerciseContent = {
    type: 'acceptanceWritingExercise';
    title: 'EJERCICIO 1: ESO PASÓ. ¿Y AHORA QUÉ?';
    objective: string;
    duration: string;
};

export type SelfAcceptanceAudioExerciseContent = {
    type: 'selfAcceptanceAudioExercise';
    title: 'EJERCICIO 2: PRÁCTICA DE AUTOACEPTACIÓN GUIADA';
    objective: string;
    duration: string;
};

export type CompassionateResponsibilityContractExerciseContent = {
    type: 'compassionateResponsibilityContractExercise';
    title: 'EJERCICIO 1: MI CONTRATO DE AUTORRESPONSABILIDAD COMPASIVA';
    objective: string;
    duration: string;
};

export type CriticismToGuideExerciseContent = {
    type: 'criticismToGuideExercise';
    title: 'EJERCICIO 2: TRANSFORMA TU CRÍTICA EN GUÍA';
    objective: string;
    duration: string;
};

export type InfluenceWheelExerciseContent = {
    type: 'influenceWheelExercise';
    title: 'EJERCICIO 1: RUEDA DE MI ZONA DE INFLUENCIA';
    objective: string;
    duration: string;
};

export type PersonalCommitmentDeclarationExerciseContent = {
    type: 'personalCommitmentDeclarationExercise';
    title: 'Técnica 2 — Mi declaración de compromiso personal';
    objective: string;
    duration: string;
};

// RUTA 11
export type SupportMapExerciseContent = {
    type: 'supportMapExercise';
    title: 'EJERCICIO1: MAPA DE RELACIONES Y APOYO';
    objective?: string;
    duration?: string;
};

export type BlockingThoughtsExerciseContent = {
    type: 'blockingThoughtsExercise';
    title: 'EJERCICIO 2: REGISTRO DE PENSAMIENTOS BLOQUEANTES AL PEDIR AYUDA';
    objective?: string;
    duration?: string;
};

export type NutritiveDrainingSupportMapExerciseContent = {
    type: 'nutritiveDrainingSupportMapExercise';
    title: 'EJERCICIO 1: MAPA DE APOYOS NUTRITIVOS Y DRENANTES';
    objective?: string;
    duration?: string;
};

export type NourishingConversationExerciseContent = {
    type: 'nourishingConversationExercise';
    title: 'EJERCICIO 2: LA CONVERSACIÓN QUE NUTRE';
    objective?: string;
    duration?: string;
};

export type ClearRequestMapExerciseContent = {
    type: 'clearRequestMapExercise';
    title: 'EJERCICIO 1: EL MAPA DE PETICIONES CLARAS';
    objective?: string;
    duration?: string;
};

export type SupportBankExerciseContent = {
    type: 'supportBankExercise';
    title: 'EJERCICIO 2: EL BANCO DE APOYOS';
    objective?: string;
    duration?: string;
};

export type MutualCareCommitmentExerciseContent = {
    type: 'mutualCareCommitmentExercise';
    title: 'EJERCICIO 1: MI COMPROMISO CON EL CUIDADO MUTUO';
    objective?: string;
    duration?: string;
};

export type SymbolicSupportCircleExerciseContent = {
    type: 'symbolicSupportCircleExercise';
    title: 'EJERCICIO 2: CÍRCULO DE SOSTÉN SIMBÓLICO';
    objective?: string;
    duration?: string;
};

// RUTA 12
export type EmotionalGratificationMapExerciseContent = {
  type: 'emotionalGratificationMapExercise';
  title: 'EJERCICIO 1: MAPA DE GRATIFICACIÓN EMOCIONAL';
  objective?: string;
  duration?: string;
};

export type DailyEnergyCheckExerciseContent = {
  type: 'dailyEnergyCheckExercise';
  title: 'EJERCICIO 2: MINI-CHECK DE ENERGÍA DIARIA';
  objective?: string;
  duration?: string;
};

export type DailyWellbeingPlanExerciseContent = {
  type: 'dailyWellbeingPlanExercise';
  title: 'EJERCICIO 1: MI PLAN DIARIO DE BIENESTAR: 3 MICROHÁBITOS CLAVE';
  objective?: string;
  duration?: string;
};

export type MorningRitualExerciseContent = {
  type: 'morningRitualExercise';
  title: 'EJERCICIO 2: MI RITUAL DE INICIO: UNA MAÑANA AMABLE Y CONSCIENTE';
  objective?: string;
  duration?: string;
};

export type MotivationIn3LayersExerciseContent = {
  type: 'motivationIn3LayersExercise';
  title: 'EJERCICIO 1: MOTIVACIÓN EN 3 CAPAS';
  objective?: string;
  duration?: string;
};

export type VisualizeDayExerciseContent = {
  type: 'visualizeDayExercise';
  title: 'EJERCICIO 2: VISUALIZACIÓN DEL DÍA QUE QUIERO VIVIR';
  objective?: string;
  duration?: string;
};

export type IlluminatingMemoriesAlbumExerciseContent = {
  type: 'illuminatingMemoriesAlbumExercise';
  title: 'EJERCICIO 1: MI ÁLBUM DE RECUERDOS QUE ILUMINAN';
  objective?: string;
  duration?: string;
};

export type PositiveEmotionalFirstAidKitExerciseContent = {
  type: 'positiveEmotionalFirstAidKitExercise';
  title: 'EJERCICIO 2: MI BOTIQUÍN EMOCIONAL POSITIVO';
  objective?: string;
  duration?: string;
};

// RUTA 13 (NUEVA)
export type AnsiedadTieneSentidoExerciseContent = {
    type: 'ansiedadTieneSentidoExercise';
    title: 'MI ANSIEDAD TIENE SENTIDO CUANDO…';
    objective: string;
    duration: string;
};

export type VisualizacionGuiadaCuerpoAnsiedadExerciseContent = {
    type: 'visualizacionGuiadaCuerpoAnsiedadExercise';
    title: 'VISUALIZACIÓN GUIADA DEL CUERPO EN ANSIEDAD';
    objective: string;
    duration: string;
};

export type StopExerciseContent = {
    type: 'stopExercise';
    title: 'EJERCICIO 1: STOP - Ponle un alto al piloto automático';
    objective: string;
    duration: string;
};

export type QuestionYourIfsExerciseContent = {
    type: 'questionYourIfsExercise';
    title: 'EJERCICIO 2: Cuestiona tus “¿Y si…?” con la lupa de la realidad';
    objective: string;
    duration: string;
};

export type ExposureLadderExerciseContent = {
    type: 'exposureLadderExercise';
    title: 'EJERCICIO 1: ESCALERA DE EXPOSICIÓN PERSONAL';
    objective: string;
    duration: string;
};

export type CalmVisualizationExerciseContent = {
    type: 'calmVisualizationExercise';
    title: 'EJERCICIO 2: “ME VEO HACIÉNDOLO CON CALMA”';
    objective: string;
    duration: string;
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
  | PersonalManifestoExerciseContent
  // RUTA 10
  | ComplaintTransformationExerciseContent
  | GuiltRadarExerciseContent
  | AcceptanceWritingExerciseContent
  | SelfAcceptanceAudioExerciseContent
  | CompassionateResponsibilityContractExerciseContent
  | CriticismToGuideExerciseContent
  | InfluenceWheelExerciseContent
  | PersonalCommitmentDeclarationExerciseContent
  // RUTA 11
  | SupportMapExerciseContent
  | BlockingThoughtsExerciseContent
  | NutritiveDrainingSupportMapExerciseContent
  | NourishingConversationExerciseContent
  | ClearRequestMapExerciseContent
  | SupportBankExerciseContent
  | MutualCareCommitmentExerciseContent
  | SymbolicSupportCircleExerciseContent
  // RUTA 12
  | EmotionalGratificationMapExerciseContent
  | DailyEnergyCheckExerciseContent
  | DailyWellbeingPlanExerciseContent
  | MorningRitualExerciseContent
  | MotivationIn3LayersExerciseContent
  | VisualizeDayExerciseContent
  | IlluminatingMemoriesAlbumExerciseContent
  | PositiveEmotionalFirstAidKitExerciseContent
  // RUTA 13 (NUEVA)
  | AnsiedadTieneSentidoExerciseContent
  | VisualizacionGuiadaCuerpoAnsiedadExerciseContent
  | StopExerciseContent
  | QuestionYourIfsExerciseContent
  | ExposureLadderExerciseContent
  | CalmVisualizationExerciseContent;

// Defines a single module within a guided path
export type PathModule = {
  id: string;
  title: string; // Spanish
  type: 'introduction' | 'skill_practice' | 'summary'; // Categorizes the module's role in the path
  content: ModuleContent[]; // An array of different content blocks that make up the module
  estimatedTime?: string; // e.g., "20-30 min"
  dataAiHint?: string; // For images if any
};

    
    