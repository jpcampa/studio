
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';

const DAILY_CHECKIN_KEY = 'workwell-daily-checkin-completed';

interface DailyCheckInContextType {
  showPopup: boolean;
  forceOpen: () => void;
  closePopup: () => void;
}

const DailyCheckInContext = createContext<DailyCheckInContextType | undefined>(undefined);

export const DailyCheckInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  const getTodayKey = useCallback(() => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }, []);

  useEffect(() => {
    try {
      const todayKey = getTodayKey();
      const lastCompleted = localStorage.getItem(DAILY_CHECKIN_KEY);
      if (lastCompleted !== todayKey) {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 2000); 
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error checking daily check-in status:", error);
    }
  }, [getTodayKey]);

  const forceOpen = useCallback(() => {
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    try {
        localStorage.setItem(DAILY_CHECKIN_KEY, getTodayKey());
    } catch (error) {
        console.error("Error setting daily check-in as completed:", error);
    }
  }, [getTodayKey]);

  const value = { showPopup, forceOpen, closePopup };

  return (
    <DailyCheckInContext.Provider value={value}>
      {children}
    </DailyCheckInContext.Provider>
  );
};

export function useDailyCheckIn(): DailyCheckInContextType {
  const context = useContext(DailyCheckInContext);
  if (context === undefined) {
    throw new Error('useDailyCheckIn must be used within a DailyCheckInProvider');
  }
  return context;
}
