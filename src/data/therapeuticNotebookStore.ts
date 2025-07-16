
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
const MAX_NOTEBOOK_ENTRIES = 100;

/**
 * Retrieves all notebook entries from localStorage, sorted by newest first.
 */
export function getNotebookEntries(): NotebookEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(NOTEBOOK_ENTRIES_KEY);
    const entries = item ? (JSON.parse(item) as NotebookEntry[]) : [];
    // Sort by timestamp descending (newest first) before returning
    return entries.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  } catch (error) {
    console.error("Error reading notebook entries from localStorage:", error);
    return [];
  }
}

/**
 * Adds a new entry to the therapeutic notebook.
 */
export function addNotebookEntry(newEntryData: Omit<NotebookEntry, 'id' | 'timestamp'>): NotebookEntry {
  if (typeof window === "undefined") {
    const placeholderEntry: NotebookEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...newEntryData
    };
    console.warn("Attempted to add notebook entry in non-browser environment. Returning placeholder:", placeholderEntry);
    return placeholderEntry;
  }

  const newEntry: NotebookEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...newEntryData,
  };

  try {
    const currentEntries = getNotebookEntries();
    const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_NOTEBOOK_ENTRIES);
    localStorage.setItem(NOTEBOOK_ENTRIES_KEY, JSON.stringify(updatedEntries));
    console.log("TherapeuticNotebookStore: Saved new entry. Total entries now:", updatedEntries.length);
    return newEntry;
  } catch (error) {
    console.error("Error saving notebook entry to localStorage:", error);
    return newEntry; // Return the new entry even if saving fails
  }
}

/**
 * Formats an ISO timestamp for display.
 */
export function formatEntryTimestamp(isoTimestamp: string): string {
  try {
    return format(parseISO(isoTimestamp), "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Fecha inválida";
  }
}

/**
 * Clears all entries from the therapeutic notebook.
 */
export function clearAllNotebookEntries(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(NOTEBOOK_ENTRIES_KEY);
    console.log("Therapeutic notebook entries cleared from localStorage.");
  } catch (error) {
    console.error("Error clearing notebook entries from localStorage:", error);
  }
}
