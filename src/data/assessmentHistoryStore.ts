
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface AssessmentRecord {
  id: string;
  timestamp: string; // ISO string
  data: InitialAssessmentOutput;
}

const ASSESSMENT_HISTORY_KEY = "workwell-assessment-history";
const MAX_HISTORY_ENTRIES = 20; // Limit for localStorage

export function getAssessmentHistory(): AssessmentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(ASSESSMENT_HISTORY_KEY);
    const records = item ? (JSON.parse(item) as AssessmentRecord[]) : [];
    // Sort by timestamp descending (newest first)
    return records.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  } catch (error) {
    console.error("Error reading assessment history from localStorage:", error);
    return [];
  }
}

export function saveAssessmentToHistory(assessmentData: InitialAssessmentOutput): AssessmentRecord {
  if (typeof window === "undefined") {
    const placeholderRecord: AssessmentRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data: assessmentData,
    };
    console.warn("Attempted to save assessment to history in non-browser environment. Returning placeholder:", placeholderRecord);
    return placeholderRecord;
  }

  const newRecord: AssessmentRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    data: assessmentData,
  };

  try {
    const currentHistory = getAssessmentHistory();
    const updatedHistory = [newRecord, ...currentHistory].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log("AssessmentHistoryStore: Saved new assessment record. Total records:", updatedHistory.length);
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
    return format(parseISO(isoTimestamp), "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting assessment timestamp:", error);
    return "Fecha inválida";
  }
}

export function clearAssessmentHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ASSESSMENT_HISTORY_KEY);
    console.log("Assessment history cleared from localStorage.");
  } catch (error) {
    console.error("Error clearing assessment history from localStorage:", error);
  }
}
