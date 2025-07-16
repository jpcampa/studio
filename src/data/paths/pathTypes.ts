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


// A union type for all possible content block types within a module
export type ModuleContent =
  | ParagraphContent
  | TitleContent
  | ListContent
  | QuoteContent
  | CollapsibleContent
  | ExerciseContent
  | StressMapExerciseContent;

// Defines a single module within a guided path
export type PathModule = {
  id: string;
  title: string; // e.g., "Semana 1: Comprende el Estrés"
  type: 'introduction' | 'skill_practice' | 'summary'; // Categorizes the module's role in the path
  content: ModuleContent[]; // An array of different content blocks that make up the module
  estimatedTime?: string; // e.g., "20-30 min"
  dataAiHint?: string; // For images if any
};
