
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface AssessmentRecord {
  id: string;
  timestamp: string; // ISO string
  data: { // This nested data object matches the AI output and API expectations
    emotionalProfile: Record<string, number>;
    priorityAreas: string[];
    feedback: string;
    // The raw answers are now stored here as well, nullable
    respuestas?: Record<string, number> | null; 
  };
}

const ASSESSMENT_HISTORY_KEY = "workwell-assessment-history";
const MAX_HISTORY_ENTRIES = 20; // Limit for localStorage

export function getAssessmentHistory(): AssessmentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(ASSESSMENT_HISTORY_KEY);
    const records = item ? (JSON.parse(item) as AssessmentRecord[]) : [];
    // Sort by timestamp descending (newest first)
    return records.sort((a, b) => {
        try {
            return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()
        } catch(e) {
            return 0; // if dates are invalid, don't sort
        }
    });
  } catch (error) {
    console.error("Error reading assessment history from localStorage:", error);
    return [];
  }
}

export function saveAssessmentToHistory(assessmentData: InitialAssessmentOutput, rawAnswers: Record<string, number>): AssessmentRecord {
  if (typeof window === "undefined") {
    const placeholderRecord: AssessmentRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data: {
        ...assessmentData,
        respuestas: rawAnswers,
      },
    };
    console.warn("Attempted to save assessment to history in non-browser environment. Returning placeholder:", placeholderRecord);
    return placeholderRecord;
  }

  const newRecord: AssessmentRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    data: {
      ...assessmentData,
      respuestas: rawAnswers,
    },
  };

  try {
    const currentHistory = getAssessmentHistory();
    const updatedHistory = [newRecord, ...currentHistory].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log("AssessmentHistoryStore: Saved new assessment record. Total records:", updatedHistory.length);
    window.dispatchEvent(new CustomEvent('assessment-history-updated'));
    return newRecord;
  } catch (error) {
    console.error("Error saving assessment record to localStorage:", error);
    return newRecord; 
  }
}

export function getAssessmentById(id: string): AssessmentRecord | undefined {
  if (typeof window === "undefined") return undefined;
  const history = getAssessmentHistory();
  return history.find(record => record.id === id);
}

export function formatAssessmentTimestamp(isoTimestamp: string): string {
  try {
    // Attempt to parse, ensuring it's a valid date object before formatting
    const dateObj = parseISO(isoTimestamp);
    if (isNaN(dateObj.getTime())) {
        // If parseISO results in an invalid date, try new Date() as a fallback for "YYYY-MM-DD HH:MM:SS"
        const fallbackDateObj = new Date(isoTimestamp.replace(' ', 'T') + (isoTimestamp.includes('Z') ? '' : 'Z')); // Try to make it more ISO-like for broader compatibility
        if (isNaN(fallbackDateObj.getTime())) {
            console.error("Error formatting assessment timestamp: Invalid date string provided -", isoTimestamp);
            return "Fecha inválida";
        }
        return format(fallbackDateObj, "dd MMM yyyy, HH:mm", { locale: es });
    }
    return format(dateObj, "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting assessment timestamp for input:", isoTimestamp, error);
    return "Fecha inválida";
  }
}

export function clearAssessmentHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ASSESSMENT_HISTORY_KEY);
    console.log("Assessment history cleared from localStorage.");
    window.dispatchEvent(new CustomEvent('assessment-history-updated'));
  } catch (error) {
    console.error("Error clearing assessment history from localStorage:", error);
  }
}

export function overwriteAssessmentHistory(records: AssessmentRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    // Ensure records are sorted by timestamp descending (newest first) before saving
    const sortedRecords = [...records].sort((a, b) => {
        try {
            return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
        } catch (e) {
             // Fallback for potentially non-ISO timestamps from API before they are normalized
             try {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
             } catch (e2) {
                console.warn("overwriteAssessmentHistory: Could not parse timestamps for sorting", b.timestamp, a.timestamp);
                return 0;
             }
        }
    });
    const recordsToStore = sortedRecords.slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify(recordsToStore));
    console.log("AssessmentHistoryStore: Overwritten local assessment history with API data. Total records:", recordsToStore.length);
    window.dispatchEvent(new CustomEvent('assessment-history-updated'));
  } catch (error) {
    console.error("Error overwriting assessment history in localStorage:", error);
  }
}
