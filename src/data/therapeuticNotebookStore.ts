
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { decryptDataAES, encryptDataAES, forceEncryptStringAES } from '@/lib/encryption';
import type { User } from '@/contexts/UserContext';


export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
const DEBUG_NOTEBOOK_API_URL_KEY = "workwell-debug-notebook-url"; // Key for sessionStorage
const DEBUG_NOTEBOOK_PAYLOAD_KEY = "workwell-debug-notebook-payload"; // Key for sessionStorage
const MAX_NOTEBOOK_ENTRIES = 100;
const API_BASE_URL_FOR_NOTEBOOK = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY_FOR_NOTEBOOK = "4463";
const API_TIMEOUT_MS = 15000;

interface NotebookSavePayload {
    entry: NotebookEntry;
    userId: string;
}

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
 * Adds a new entry to the therapeutic notebook and triggers the server save.
 * It now accepts the current user object to reliably get the user ID.
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
    console.log("TherapeuticNotebookStore: Saved new entry to localStorage. Total entries now:", updatedEntries.length);
    
    // Send to server
    sendNotebookEntryToServer(newEntry);

    return newEntry;
  } catch (error) {
    console.error("Error saving notebook entry to localStorage:", error);
    return newEntry;
  }
}

async function sendNotebookEntryToServer(entry: NotebookEntry) {
    const storedUserStr = localStorage.getItem('workwell-simulated-user');
    if (!storedUserStr) {
        console.warn("sendNotebookEntryToServer: No user found in localStorage. Cannot send entry to server.");
        return;
    }

    let user: User | null = null;
    try {
        const decryptedUser = decryptDataAES(storedUserStr);
        if (decryptedUser && typeof decryptedUser === 'object' && 'id' in decryptedUser) {
            user = decryptedUser as User;
        }
    } catch(e) {
        console.error("sendNotebookEntryToServer: Error decrypting user from localStorage", e);
    }
    
    if (!user || !user.id) {
        console.error("sendNotebookEntryToServer: Could not get user ID. Aborting server save.");
        return;
    }
    
    const payload: NotebookSavePayload = { entry, userId: user.id };
    
    // Store decrypted payload for debugging
    sessionStorage.setItem(DEBUG_NOTEBOOK_PAYLOAD_KEY, JSON.stringify(payload, null, 2));

    const encryptedPayload = encryptDataAES(payload);
    const apiUrl = `${API_BASE_URL_FOR_NOTEBOOK}?apikey=${API_KEY_FOR_NOTEBOOK}&tipo=guardarcuaderno&datos=${encodeURIComponent(encryptedPayload)}`;
    
    // Store URL for debugging
    sessionStorage.setItem(DEBUG_NOTEBOOK_API_URL_KEY, apiUrl);
    // Dispatch a custom event to notify components that a new URL is available for debugging
    window.dispatchEvent(new Event('notebook-url-updated'));

    try {
        console.log("sendNotebookEntryToServer: Sending entry to API. URL:", apiUrl.substring(0, 150) + "...");
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
        const responseText = await response.text();
        
        if (response.ok) {
            if (responseText && responseText.trim() !== '') {
                try {
                    const result = JSON.parse(responseText);
                    console.log("sendNotebookEntryToServer: API response:", result.status === 'OK' ? "Success" : "NOOK", result.message);
                } catch (jsonError) {
                    console.warn("sendNotebookEntryToServer: API responded with OK status, but failed to parse JSON. Raw text:", responseText, jsonError);
                }
            } else {
                 console.log("sendNotebookEntryToServer: API responded with OK status but an empty body. Assuming success.");
            }
        } else {
            console.error("sendNotebookEntryToServer: Failed to save to API. Status:", response.status, "Response Text:", responseText);
        }
    } catch (error) {
        console.error("sendNotebookEntryToServer: Error sending entry to API:", error);
    }
}


/**
 * Overwrites the local notebook with a new set of entries.
 */
export function overwriteNotebookEntries(entries: NotebookEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const sortedEntries = [...entries].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    const entriesToStore = sortedEntries.slice(0, MAX_NOTEBOOK_ENTRIES);
    localStorage.setItem(NOTEBOOK_ENTRIES_KEY, JSON.stringify(entriesToStore));
    console.log("TherapeuticNotebookStore: Overwritten local notebook with API data. Total records:", entriesToStore.length);
  } catch (error) {
    console.error("Error overwriting notebook entries in localStorage:", error);
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
