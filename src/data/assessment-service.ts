
"use client";

import type { AssessmentDimension } from './paths/pathTypes';

// This function is being deprecated in favor of embedding questions directly.
// It is kept for reference but should not be used in new components to avoid build/runtime errors.
export async function getAssessmentDimensions(): Promise<AssessmentDimension[]> {
  console.warn("getAssessmentDimensions is deprecated. Questions should be embedded directly in components.");
  return Promise.resolve([]);
}

    