import type { PathModule, CollapsibleContent, ExerciseContent, ModuleContent } from './paths/pathTypes';
import { stressManagementPath } from './paths/stressManagementPath';
import { uncertaintyPath } from './paths/uncertaintyPath';
import { procrastinationPath } from './paths/procrastinationPath';
import { settingBoundariesPath } from './paths/settingBoundariesPath';

// Re-export types for easy access in other parts of the application
export type { PathModule, CollapsibleContent, ExerciseContent, ModuleContent };

export type Path = {
  id: string;
  title: string; // Spanish
  description: string; // Spanish
  modules: PathModule[];
  dataAiHint?: string;
};

// Now, the pathsData array will be built from imported path definitions.
// This makes the file cleaner and scales better as more paths are added.
export const pathsData: Path[] = [
  stressManagementPath,
  uncertaintyPath,
  procrastinationPath,
  settingBoundariesPath,
];
