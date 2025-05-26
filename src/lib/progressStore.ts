
"use client";

// Funciones para interactuar con localStorage para el progreso de las rutas

const PROGRESS_PREFIX = "workwell-progress-";
const ACTIVE_PATH_KEY = "workwell-active-path-details";

export interface ActivePathDetails {
  id: string;
  title: string;
  totalModules: number;
  completedModuleIds: string[]; // Almacenamos IDs
}

/**
 * Obtiene los IDs de los módulos completados para una ruta específica.
 */
export function getCompletedModules(pathId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const item = localStorage.getItem(`${PROGRESS_PREFIX}${pathId}`);
    return item ? new Set(JSON.parse(item) as string[]) : new Set();
  } catch (error) {
    console.error("Error reading completed modules from localStorage:", error);
    return new Set();
  }
}

/**
 * Guarda los IDs de los módulos completados para una ruta específica.
 */
export function saveCompletedModules(pathId: string, completedModules: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PROGRESS_PREFIX}${pathId}`, JSON.stringify(Array.from(completedModules)));
  } catch (error) {
    console.error("Error saving completed modules to localStorage:", error);
  }
}

/**
 * Obtiene los detalles de la ruta activa.
 */
export function getActivePathDetails(): ActivePathDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(ACTIVE_PATH_KEY);
    return item ? JSON.parse(item) as ActivePathDetails : null;
  } catch (error) {
    console.error("Error reading active path details from localStorage:", error);
    return null;
  }
}

/**
 * Establece los detalles de la ruta activa.
 */
export function setActivePathDetails(details: ActivePathDetails): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_PATH_KEY, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving active path details to localStorage:", error);
  }
}

/**
 * Limpia los detalles de la ruta activa.
 */
export function clearActivePathDetails(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_PATH_KEY);
  } catch (error) {
    console.error("Error clearing active path details from localStorage:", error);
  }
}
