
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getDailyQuestion } from '@/data/dailyQuestion';
import type { DailyQuestion } from '@/types/daily-question';

const LAST_CHECK_IN_KEY = 'workwell-last-daily-checkin';

export function useDailyCheckIn() {
  const [showPopup, setShowPopup] = useState(false);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAndFetch = useCallback(async (forceShow = false) => {
    setIsLoading(true);
    try {
      const lastCheckIn = localStorage.getItem(LAST_CHECK_IN_KEY);
      const today = new Date().toDateString();

      if (forceShow || lastCheckIn !== today) {
        const fetchedQuestion = await getDailyQuestion();
        if (fetchedQuestion) {
          setQuestion(fetchedQuestion);
          setShowPopup(true); // <-- CORRECCIÓN: Solo se muestra si la pregunta existe
        } else {
          console.warn("useDailyCheckIn: No daily question fetched, popup will not be shown.");
          setShowPopup(false); // Asegurarse de que no se muestre si falla la carga
        }
      } else {
        console.log("useDailyCheckIn: Daily check-in already completed today.");
      }
    } catch (error) {
      console.error("useDailyCheckIn: Error during check and fetch:", error);
      setShowPopup(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // We only run the automatic check on mount. Forcing is handled by `forceOpen`.
    checkAndFetch();
  }, [checkAndFetch]);

  const markAsDone = useCallback(() => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem(LAST_CHECK_IN_KEY, today);
      setShowPopup(false);
    } catch (error) {
      console.error("useDailyCheckIn: Error marking check-in as done:", error);
    }
  }, []);
  
  // This function is called by the button. It calls checkAndFetch with `forceShow = true`.
  const forceOpen = useCallback(() => {
    checkAndFetch(true);
  }, [checkAndFetch]);


  return { showPopup, question, isLoading, markAsDone, forceOpen };
}
