
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY = 'workwell-feature-emotionalDashboardEnabled';

interface FeatureFlagContextType {
  isEmotionalDashboardEnabled: boolean;
  toggleEmotionalDashboard: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [isEmotionalDashboardEnabled, setIsEmotionalDashboardEnabled] = useState(false);

  useEffect(() => {
    // Load feature flag state from localStorage on initial mount
    try {
      const storedFlag = localStorage.getItem(FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY);
      if (storedFlag !== null) {
        setIsEmotionalDashboardEnabled(JSON.parse(storedFlag));
      } else {
        // Default to false if not found and save it
        setIsEmotionalDashboardEnabled(false);
        localStorage.setItem(FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY, JSON.stringify(false));
      }
    } catch (error) {
      console.error("Error loading emotional dashboard feature flag from localStorage:", error);
      // Default to false in case of error
      setIsEmotionalDashboardEnabled(false);
    }
  }, []);

  const toggleEmotionalDashboard = useCallback(() => {
    setIsEmotionalDashboardEnabled(prev => {
      const newState = !prev;
      try {
        localStorage.setItem(FEATURE_FLAG_EMOTIONAL_DASHBOARD_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error("Error saving emotional dashboard feature flag to localStorage:", error);
      }
      return newState;
    });
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
