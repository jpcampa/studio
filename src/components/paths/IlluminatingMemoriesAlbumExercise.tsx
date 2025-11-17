
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IlluminatingMemoriesAlbumExerciseContent } from '@/data/paths/pathTypes';

interface IlluminatingMemoriesAlbumExerciseProps {
  content: IlluminatingMemoriesAlbumExerciseContent;
  pathId: string;
}

export function IlluminatingMemoriesAlbumExercise({ content, pathId }: IlluminatingMemoriesAlbumExerciseProps) {
  const { toast } = useToast();
  const [moment1, setMoment1] = useState('');
  const [moment2, setMoment2] = useState('');
  const [moment3, setMoment3] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Recuerdo 1:** ${moment1}
**Recuerdo 2:** ${moment2}
**Recuerdo 3:** ${moment3}
    `;
    addNotebookEntry({ title: 'Mi Álbum de Recuerdos que Iluminan', content: notebookContent, pathId: pathId });
    toast({ title: 'Álbum Guardado', description: 'Tus recuerdos han sido guardados.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">Elige 3 momentos que te hicieron sentir bien. Pueden ser sencillos o significativos. Añade detalles sensoriales para que el recuerdo cobre vida.</p>
          <div className="space-y-2">
            <Label htmlFor="moment1">Momento 1</Label>
            <Textarea id="moment1" value={moment1} onChange={e => setMoment1(e.target.value)} placeholder="Ej: Llamada con mi amiga Marta, nos reímos mucho. Olía a café." disabled={isSaved}/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="moment2">Momento 2</Label>
            <Textarea id="moment2" value={moment2} onChange={e => setMoment2(e.target.value)} placeholder="Ej: Terminé el informe que me costaba. Sentí alivio." disabled={isSaved}/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="moment3">Momento 3</Label>
            <Textarea id="moment3" value={moment3} onChange={e => setMoment3(e.target.value)} placeholder="Ej: Paseo corto con sol en la cara. Noté el calorcito." disabled={isSaved}/>
          </div>
           {!isSaved ? (
            <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi álbum</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Álbum guardado.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
