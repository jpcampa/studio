"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PersonalManifestoExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save } from 'lucide-react';

interface PersonalManifestoExerciseProps {
  content: PersonalManifestoExerciseContent;
  pathId: string;
}

export function PersonalManifestoExercise({ content, pathId }: PersonalManifestoExerciseProps) {
    const [manifesto, setManifesto] = useState('');

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Label>Escribe tu manifiesto:</Label>
                    <Textarea value={manifesto} onChange={e => setManifesto(e.target.value)} rows={10} />
                    <Button className="w-full"><Save className="mr-2 h-4 w-4" />Guardar mi manifiesto</Button>
                </div>
            </CardContent>
        </Card>
    );
}

    