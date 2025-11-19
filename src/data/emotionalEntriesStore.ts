
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface EmotionalEntry {
  id: string;
  situation: string;
  thought: string;
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
    console.log("emotionalEntriesStore (getEmotionalEntries): Item from localStorage:", item ? item.substring(0, 200) + "..." : "null");
    const entries = item ? (JSON.parse(item) as EmotionalEntry[]) : [];
    // Sort by timestamp descending (newest first) before returning
    const sortedEntries = entries.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    console.log("emotionalEntriesStore (getEmotionalEntries): Parsed and sorted entries (first 5):", JSON.stringify(sortedEntries.slice(0,5)));
    return sortedEntries;
  } catch (error) {
    console.error("Error reading emotional entries from localStorage:", error);
    return [];
  }
}

export function addEmotionalEntry(newEntryData: { situation: string; thought: string; emotion: string }): EmotionalEntry {
  if (typeof window === "undefined") {
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
    thought: newEntryData.thought,
    emotion: newEntryData.emotion,
    timestamp: new Date().toISOString(),
  };

  try {
    const currentEntries = getEmotionalEntries();
    const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_ENTRIES_TO_STORE);
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
    console.log("emotionalEntriesStore (addEmotionalEntry): Saved new entry. Total entries now:", updatedEntries.length);
    return newEntry;
  } catch (error) {
    console.error("Error saving emotional entry to localStorage:", error);
    return newEntry;
  }
}

export function overwriteEmotionalEntries(entries: EmotionalEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    console.log("emotionalEntriesStore (overwriteEmotionalEntries): Attempting to overwrite with entries (first 5):", JSON.stringify(entries.slice(0,5)));
    // Sort by timestamp descending (newest first) before storing
    const sortedEntries = [...entries].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    const entriesToStore = sortedEntries.slice(0, MAX_ENTRIES_TO_STORE);
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(entriesToStore));
    console.log("emotionalEntriesStore (overwriteEmotionalEntries): Emotional entries overwritten in localStorage with", entriesToStore.length, "entries. Data (first 5):", JSON.stringify(entriesToStore.slice(0,5)));
  } catch (error) {
    console.error("Error overwriting emotional entries in localStorage:", error);
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
