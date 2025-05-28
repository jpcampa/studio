
"use client";
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  className?: string;
}

export function ChartPlaceholder({ title, description, icon: Icon, className }: ChartPlaceholderProps) {
  return (
    <Card className={`shadow-lg flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-7 w-7 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {description && <CardDescription className="pt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground p-6 sm:p-8 border-2 border-dashed border-border rounded-lg w-full min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center bg-muted/20">
          <Icon className="h-12 w-12 sm:h-16 sm:w-16 mb-4 text-muted-foreground/40" />
          <p className="text-sm sm:text-base">Visualización de {title.toLowerCase()} próximamente.</p>
        </div>
      </CardContent>
    </Card>
  );
}
