
"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts"
import { getAssessmentDimensions, type AssessmentDimension } from '@/data/assessmentDimensions';
import { Activity } from 'lucide-react';

interface EmotionalProfileChartProps {
  results: {
    emotionalProfile: Record<string, number>;
  };
  className?: string;
}

export function EmotionalProfileChart({ results, className }: EmotionalProfileChartProps) {
  const t = useTranslations();
  const [assessmentDimensions, setAssessmentDimensions] = useState<AssessmentDimension[]>([]);

  useEffect(() => {
    getAssessmentDimensions().then(setAssessmentDimensions);
  }, []);

  if (!results || !results.emotionalProfile || Object.keys(results.emotionalProfile).length === 0 || assessmentDimensions.length === 0) {
    return null; // O un placeholder si se prefiere
  }
  
  const radarData = assessmentDimensions.map(dim => {
    const scoreFromProfile = results.emotionalProfile[dim.name];
    const scoreValue = scoreFromProfile !== undefined && typeof scoreFromProfile === 'number' ? scoreFromProfile : 0;
    const finalScore = Math.max(0, Math.min(5, scoreValue));
    return {
      dimensionId: dim.id,
      dimension: dim.name,
      score: finalScore,
      fullMark: 5,
    };
  });

  const chartConfig = {
    score: {
      label: t.emotionalProfile,
      color: "hsl(var(--primary))", 
    },
  };

  return (
    <Card className={`shadow-lg ${className}`}>
        <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.myEmotionalProfile}</CardTitle>
            <CardDescription>{t.myEmotionalProfileDescription}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={({ x, y, payload }) => (
                          <text x={x} y={y} dy={4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={9}>
                            {payload.value.split('(')[0].trim().substring(0,12)}
                          </text>
                        )}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <Radar 
                        name={t.emotionalProfile} 
                        dataKey="score" 
                        stroke="hsl(var(--primary))"  
                        fill="hsl(var(--primary))"  
                        fillOpacity={0.6} 
                    />
                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--border))", strokeDasharray: '3 3' }} 
                        content={
                        <ChartTooltipContent
                            className="!bg-background !border !border-border !shadow-lg !rounded-md max-w-xs"
                            formatter={(value, name, itemProps) => (
                                <div className="text-sm p-1">
                                    <div className="font-medium text-foreground">{itemProps.payload.dimension}</div>
                                    <div className="text-muted-foreground">Puntuación: {Number(itemProps.payload.score).toFixed(1)}/5</div>
                                </div>
                            )}
                        />
                        }
                    />
                </RadarChart>
            </ChartContainer>
            </div>
        </CardContent>
    </Card>
  );
}


    