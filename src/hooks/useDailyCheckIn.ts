
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getDailyQuestion } from '@/data/dailyQuestion';
import type { DailyQuestion } from '@/types/daily-question';

const LAST_CHECK_IN_KEY = 'workwell-last-daily-checkin';

export function useDailyCheckIn() {
  const [showPopup, setShowPopup] = useState(false);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This function fetches the question. It's now separate from the popup logic.
  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setQuestion(null); // Reset question on new fetch
    try {
      const fetchedQuestion = await getDailyQuestion();
      if (fetchedQuestion) {
        setQuestion(fetchedQuestion);
      } else {
        console.warn("useDailyCheckIn: No daily question fetched.");
      }
    } catch (error) {
      console.error("useDailyCheckIn: Error fetching daily question:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect triggers the fetch ONLY when the popup is opened.
    if (showPopup) {
      fetchQuestion();
    }
  }, [showPopup, fetchQuestion]);


  useEffect(() => {
    // This effect handles the initial, automatic check on mount.
    const autoCheck = async () => {
      const lastCheckIn = localStorage.getItem(LAST_CHECK_IN_KEY);
      const today = new Date().toDateString();
      if (lastCheckIn !== today) {
        // If it's time for the daily check-in, we just open the popup.
        // The effect above will handle fetching the data.
        setShowPopup(true);
      }
    };
    
    autoCheck();
    // We run this only once on mount for the automatic check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsDone = useCallback(() => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem(LAST_CHECK_IN_KEY, today);
      setShowPopup(false);
    } catch (error) {
      console.error("useDailyCheckIn: Error marking check-in as done:", error);
    }
  }, []);
  
  // This function, called by the button, now just opens the popup.
  const forceOpen = useCallback(() => {
    console.log("forceOpen called: Forcing popup to show for debugging.");
    setShowPopup(true);
  }, []);


  return { showPopup, question, isLoading, markAsDone, forceOpen };
}

