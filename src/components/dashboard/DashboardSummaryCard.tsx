
"use client";
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardSummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  ctaLink?: string;
  ctaLabel?: string;
  cardColorClass?: string; 
  iconColorClass?: string; 
}

export function DashboardSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  ctaLink,
  ctaLabel,
  cardColorClass = 'bg-card',
  iconColorClass = 'text-primary',
}: DashboardSummaryCardProps) {
  
  // Specifically update the ctaLink for "Realizar Evaluación Inicial"
  let finalCtaLink = ctaLink;
  if (ctaLabel === "Realizar Evaluación Inicial" && ctaLink === "/assessment") {
    finalCtaLink = "/assessment/intro";
  }
  if (ctaLabel === "Ver detalles" && title === "Tu Bienestar Hoy" && ctaLink === "/assessment"){
    finalCtaLink = "/assessment/intro";
  }
   if (ctaLabel === "Ver detalles" && title === "Tu Progreso" && ctaLink === "/assessment"){
    finalCtaLink = "/assessment/intro";
  }


  return (
    <Card className={cn('shadow-lg hover:shadow-xl transition-shadow duration-300', cardColorClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm md:text-base font-medium">{title}</CardTitle>
        <Icon className={cn('h-5 w-5', iconColorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold break-words">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {finalCtaLink && ctaLabel && (
          <Button asChild variant="link" className="px-0 pt-3 text-sm h-auto leading-tight">
            <Link href={finalCtaLink}>{ctaLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
