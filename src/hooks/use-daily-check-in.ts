
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const DAILY_CHECKIN_KEY = 'workwell-daily-checkin-completed';

interface DailyCheckInContextType {
  showPopup: boolean;
  forceOpen: () => void;
  closePopup: () => void;
}

const DailyCheckInContext = createContext<DailyCheckInContextType | undefined>(undefined);

export function DailyCheckInProvider({ children }: { children: ReactNode }) {
  const [showPopup, setShowPopup] = useState(false);

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  };

  useEffect(() => {
    try {
      const todayKey = getTodayKey();
      const lastCompleted = localStorage.getItem(DAILY_CHECKIN_KEY);
      if (lastCompleted !== todayKey) {
        // Automatically open if not completed today.
        // Use a timeout to avoid showing it immediately on app load, which can be jarring.
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 2000); // 2-second delay
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error checking daily check-in status:", error);
    }
  }, []);

  const forceOpen = useCallback(() => {
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    try {
        // Mark as completed for today when closed after submission
        localStorage.setItem(DAILY_CHECKIN_KEY, getTodayKey());
    } catch (error) {
        console.error("Error setting daily check-in as completed:", error);
    }
  }, []);

  const value = { showPopup, forceOpen, closePopup };

  return (
    <DailyCheckInContext.Provider value={value}>
      {children}
    </DailyCheckInContext.Provider>
  );
}

export function useDailyCheckIn() {
  const context = useContext(DailyCheckInContext);
  if (context === undefined) {
    throw new Error('useDailyCheckIn must be used within a DailyCheckInProvider');
  }
  return context;
}
