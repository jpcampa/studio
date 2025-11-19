
"use client";

import { Compass, BrainCircuit, Users, Shuffle } from 'lucide-react';

interface StressCompassProps {
  sourceType: 'externo' | 'interno' | 'ambos' | '';
}

export function StressCompass({ sourceType }: StressCompassProps) {
  let text = "No has especificado el origen de tu estrés.";
  let Icon = Compass;
  let color = "text-muted-foreground";

  switch (sourceType) {
    case 'interno':
      text = "Tu estrés se origina principalmente en factores internos, como tus pensamientos, recuerdos o sensaciones.";
      Icon = BrainCircuit;
      color = "text-blue-500";
      break;
    case 'externo':
      text = "Tu estrés se origina principalmente en factores externos, como personas, tareas o el entorno.";
      Icon = Users;
      color = "text-orange-500";
      break;
    case 'ambos':
      text = "Tu estrés tiene un origen mixto, con una combinación de factores internos y externos.";
      Icon = Shuffle;
      color = "text-purple-500";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center space-y-4">
      <Icon className={`h-16 w-16 ${color}`} />
      <p className="text-lg font-semibold">{sourceType ? `Origen: ${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)}` : 'Origen no definido'}</p>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
