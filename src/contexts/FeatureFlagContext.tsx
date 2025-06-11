
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY = 'workwell-feature-emotionalDashboardEnabled'; // No longer needed for enabling

interface FeatureFlagContextType {
  isEmotionalDashboardEnabled: boolean;
  toggleEmotionalDashboard: () => void; // Kept for interface consistency, but won't change the always-true state
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  // isEmotionalDashboardEnabled is now always true.
  const [isEmotionalDashboardEnabled, setIsEmotionalDashboardEnabled] = useState(true);

  // useEffect to load from localStorage is removed as the feature is now always enabled.
  // If you ever need to make it configurable again via localStorage, you can re-add that logic.

  const toggleEmotionalDashboard = useCallback(() => {
    // This function no longer changes the state as the feature is always enabled.
    // It's kept for interface consistency if other parts of the app might still call it,
    // though its effect is now nullified.
    // setIsEmotionalDashboardEnabled(prev => {
    //   const newState = !prev;
    //   try {
    //     localStorage.setItem(FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY, JSON.stringify(newState));
    //   } catch (error) {
    //     console.error("Error saving emotional dashboard feature flag to localStorage:", error);
    //   }
    //   return newState;
    // });
    console.log("toggleEmotionalDashboard called, but isEmotionalDashboardEnabled is fixed to true.");
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ isEmotionalDashboardEnabled, toggleEmotionalDashboard }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return context;
}
