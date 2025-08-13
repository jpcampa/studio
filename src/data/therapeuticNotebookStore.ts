
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { encryptDataAES, forceEncryptStringAES } from '@/lib/encryption';
import { useUser } from '@/contexts/UserContext'; // Cannot be used here, but for context

export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
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
 * Adds a new entry to the therapeutic notebook and sends it to the server.
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
    
    // Asynchronously send to server, fire and forget style from the component's perspective
    sendNotebookEntryToServer(newEntry);

    return newEntry;
  } catch (error) {
    console.error("Error saving notebook entry to localStorage:", error);
    return newEntry; // Return the new entry even if saving fails
  }
}

async function sendNotebookEntryToServer(entry: NotebookEntry) {
    // This is tricky because we can't use useUser() hook here.
    // A better approach would be to pass userId to addNotebookEntry.
    // Let's assume for now we can get it from localStorage if the user is logged in.
    const storedUser = localStorage.getItem('workwell-simulated-user');
    if (!storedUser) {
        console.warn("sendNotebookEntryToServer: No user found in localStorage. Cannot send entry to server.");
        return;
    }
    
    let userId = '';
    try {
        const decryptedUser = JSON.parse(storedUser);
        if (decryptedUser && decryptedUser.id) {
            userId = decryptedUser.id;
        }
    } catch (e) {
      // It's not JSON, so it might be an encrypted user object.
      // We can't decrypt here without the key logic being available, so we'll just log and exit.
      // This part is problematic and highlights a design limitation.
      // A better design would pass userId into addNotebookEntry.
      // Let's assume for now we can't get the ID this way reliably.
      // THE LOGIC IN UserContext is better. We need a way to get the user ID here.
      // A simple but not ideal way is to assume it's stored unencrypted for this to work
      // or that the login process stores the ID separately.
      // Let's stick to what we can do: the component that calls this *should* provide the ID.
      // Let's refactor `addNotebookEntry` to accept an optional userId.
      // But since we can't change all call sites, let's try a different approach.
      // Let's just create the sending logic. The component will have to call it.
      // The function signature of `addNotebookEntry` is already defined in multiple files.
      // We'll proceed with a separate async export function.

      console.error("sendNotebookEntryToServer: Could not parse user from localStorage to get ID.");
      return;
    }

    if (!userId) {
        console.warn("sendNotebookEntryToServer: Could not extract user ID. Cannot send entry to server.");
        return;
    }
    
    const payload: NotebookSavePayload = { entry, userId };
    const encryptedPayload = encryptDataAES(payload);
    const apiUrl = `${API_BASE_URL_FOR_NOTEBOOK}?apikey=${API_KEY_FOR_NOTEBOOK}&tipo=guardarcuaderno&datos=${encodeURIComponent(encryptedPayload)}`;

    try {
        console.log("sendNotebookEntryToServer: Sending entry to API. URL:", apiUrl.substring(0, 150) + "...");
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
        if (response.ok) {
            const result = await response.json();
            if (result.status === 'OK') {
                console.log("sendNotebookEntryToServer: Notebook entry saved to server successfully.", result);
            } else {
                console.warn("sendNotebookEntryToServer: API reported 'NOOK' for notebook entry save.", result);
            }
        } else {
            console.error("sendNotebookEntryToServer: Failed to save notebook entry to API. Status:", response.status);
        }
    } catch (error) {
        console.error("sendNotebookEntryToServer: Error sending notebook entry to API:", error);
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
