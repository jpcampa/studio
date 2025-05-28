
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface EmotionalEntry {
  id: string;
  situation: string;
  emotion: string; // e.g., "alegria"
  timestamp: string; // ISO string
}

const EMOTIONAL_ENTRIES_KEY = "workwell-emotional-entries";
const MAX_ENTRIES_TO_STORE = 50; // Limit to avoid localStorage bloat
const MAX_ENTRIES_TO_DISPLAY = 5;


export function getEmotionalEntries(): EmotionalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(EMOTIONAL_ENTRIES_KEY);
    const entries = item ? (JSON.parse(item) as EmotionalEntry[]) : [];
    // Sort by timestamp descending (newest first) before returning
    return entries.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  } catch (error) {
    console.error("Error reading emotional entries from localStorage:", error);
    return [];
  }
}

export function addEmotionalEntry(newEntryData: { situation: string; emotion: string }): EmotionalEntry {
  if (typeof window === "undefined") {
    // Should not happen if called from client component, but good for safety
    const placeholderEntry: EmotionalEntry = {
        id: crypto.randomUUID(),
        ...newEntryData,
        timestamp: new Date().toISOString()
    };
    console.warn("Attempted to add emotional entry in non-browser environment. Returning placeholder:", placeholderEntry);
    return placeholderEntry;
  }

  const newEntry: EmotionalEntry = {
    id: crypto.randomUUID(),
    situation: newEntryData.situation,
    emotion: newEntryData.emotion,
    timestamp: new Date().toISOString(),
  };

  try {
    const currentEntries = getEmotionalEntries(); // Already sorted newest first
    const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_ENTRIES_TO_STORE);
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
    return newEntry;
  } catch (error) {
    console.error("Error saving emotional entry to localStorage:", error);
    return newEntry; // Return the new entry even if save failed, so UI can update
  }
}

export function getRecentEmotionalEntries(count: number = MAX_ENTRIES_TO_DISPLAY): EmotionalEntry[] {
    return getEmotionalEntries().slice(0, count);
}

export function formatEntryTimestamp(isoTimestamp: string): string {
  try {
    return format(parseISO(isoTimestamp), "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Fecha inválida";
  }
}

export function clearAllEmotionalEntries(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(EMOTIONAL_ENTRIES_KEY);
    console.log("Emotional entries cleared from localStorage.");
  } catch (error) {
    console.error("Error clearing emotional entries from localStorage:", error);
  }
}
