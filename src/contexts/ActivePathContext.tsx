
"use client";

import type { ReactNode} from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getActivePathDetails, setActivePathDetails as storeActivePathDetails, getCompletedModules, saveCompletedModules as storeCompletedModules, type ActivePathDetails as StoredActivePathDetails } from '@/lib/progressStore';
import { usePathname } from 'next/navigation';

interface ActivePathContextType {
  activePath: StoredActivePathDetails | null;
  loadPath: (pathId: string, pathTitle: string, totalModules: number) => void;
  updateModuleCompletion: (pathId: string, moduleId: string, isCompleted: boolean) => void;
  clearActivePath: () => void; // Podría ser útil si se navega fuera de las rutas
}

const ActivePathContext = createContext<ActivePathContextType | undefined>(undefined);

export function ActivePathProvider({ children }: { children: ReactNode }) {
  const [activePath, setActivePath] = useState<StoredActivePathDetails | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Cargar la ruta activa desde localStorage al montar el provider
    const storedDetails = getActivePathDetails();
    if (storedDetails) {
      // Asegurarnos de que los completedModuleIds estén actualizados desde su propia store
      const completedIds = getCompletedModules(storedDetails.id);
      setActivePath({ ...storedDetails, completedModuleIds: Array.from(completedIds) });
    }
  }, []);

  useEffect(() => {
    // Si navegamos fuera de la sección de rutas, podríamos limpiar la ruta activa
    // Esto es opcional y depende del comportamiento deseado
    if (!pathname.startsWith('/paths/')) {
      // clearActivePath(); // Descomentar si se desea este comportamiento
    }
  }, [pathname]);

  const loadPath = useCallback((pathId: string, pathTitle: string, totalModules: number) => {
    const completedIdsSet = getCompletedModules(pathId);
    const newActivePath: StoredActivePathDetails = {
      id: pathId,
      title: pathTitle,
      totalModules,
      completedModuleIds: Array.from(completedIdsSet),
    };
    setActivePath(newActivePath);
    storeActivePathDetails(newActivePath);
  }, []);

  const updateModuleCompletion = useCallback((pathId: string, moduleId: string, isCompleted: boolean) => {
    setActivePath(prev => {
      if (!prev || prev.id !== pathId) return prev; // Solo actualizar si es la ruta activa

      const currentCompletedSet = new Set(prev.completedModuleIds);
      if (isCompleted) {
        if (moduleId) currentCompletedSet.add(moduleId); // Add moduleId only if it's not empty
      } else {
        if (moduleId) currentCompletedSet.delete(moduleId); // Delete moduleId only if it's not empty
      }
      
      const newCompletedModuleIds = Array.from(currentCompletedSet);

      // Optimization: if the effective list of completed IDs hasn't changed, return the previous state
      // to prevent unnecessary re-renders of consumers.
      if (prev.completedModuleIds.length === newCompletedModuleIds.length &&
          newCompletedModuleIds.every(id => prev.completedModuleIds.includes(id)) &&
          prev.completedModuleIds.every(id => newCompletedModuleIds.includes(id))
         ) {
        return prev;
      }
      
      const updatedPath = { ...prev, completedModuleIds: newCompletedModuleIds };
      // Persist active path details whenever completion changes as well
      storeActivePathDetails(updatedPath);
      return updatedPath;
    });
  }, []);
  
  const clearActivePath = useCallback(() => {
    setActivePath(null);
    // No limpiamos localStorage.clearActivePathDetails() aquí para que el badge persista
    // si el usuario vuelve a la sección de rutas. Se podría añadir lógica para limpiarlo
    // bajo ciertas condiciones (ej. logout).
  }, []);


  return (
    <ActivePathContext.Provider value={{ activePath, loadPath, updateModuleCompletion, clearActivePath }}>
      {children}
    </ActivePathContext.Provider>
  );
}

export function useActivePath() {
  const context = useContext(ActivePathContext);
  if (context === undefined) {
    throw new Error('useActivePath must be used within an ActivePathProvider');
  }
  return context;
}
