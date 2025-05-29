
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, Activity, AlertTriangle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput;
}

const themedChartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--chart-1) / 0.7)",
  "hsl(var(--chart-2) / 0.7)",
  "hsl(var(--chart-3) / 0.7)",
  "hsl(var(--chart-4) / 0.7)",
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars except -

export function AssessmentResultsDisplay({ results }: AssessmentResultsDisplayProps) {
  const t = useTranslations();

  if (!results || !results.emotionalProfile || Object.keys(results.emotionalProfile).length === 0 || !results.priorityAreas) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold">{t.errorOccurred}</p>
        <p className="text-muted-foreground">No se pudieron cargar los resultados de la evaluación.</p>
        {/* Consider adding a button to retake assessment or go to dashboard */}
        <Button asChild className="mt-6">
          <Link href="/assessment">{t.takeInitialAssessment}</Link>
        </Button>
      </div>
    );
  }

  const radarData = Object.entries(results.emotionalProfile).map(([dimensionName, valueString]) => {
    let numericValue = 3;
    const lowerValueString = valueString.toLowerCase();
    const scoreMatch = valueString.match(/\((\d)\s*\/\s*5\)/);
    if (scoreMatch && scoreMatch[1]) {
      numericValue = parseInt(scoreMatch[1], 10);
    } else {
      if (lowerValueString.includes("muy bajo") || lowerValueString.includes("muy mal") || lowerValueString.includes("muy crítica")) numericValue = 1;
      else if (lowerValueString.includes("bajo") || lowerValueString.includes("mal") || lowerValueString.includes("crítica") || lowerValueString.includes("desafío claro")) numericValue = 2;
      else if (lowerValueString.includes("medio") || lowerValueString.includes("regular") || lowerValueString.includes("normal") || lowerValueString.includes("adecuado")) numericValue = 3;
      else if (lowerValueString.includes("alto") || lowerValueString.includes("bien") || lowerValueString.includes("buen") || lowerValueString.includes("fuerte") || lowerValueString.includes("potencial de crecimiento")) numericValue = 4;
      else if (lowerValueString.includes("muy alto") || lowerValueString.includes("muy bien") || lowerValueString.includes("excelente") || lowerValueString.includes("notable") || lowerValueString.includes("fortaleza clara")) numericValue = 5;
    }
    numericValue = Math.max(1, Math.min(5, numericValue));

    return {
      dimension: dimensionName,
      score: numericValue,
      fullMark: 5,
      fullLabel: valueString
    };
  });

  const emotionalProfileRadarConfig: ChartConfig = {
    score: {
      label: t.emotionalProfile,
      color: "hsl(var(--primary))",
    },
  };

  const pieChartData = results.priorityAreas.map((area) => ({
    name: area, // Full dimension name for display
    slug: slugify(area), // Slugified name for config keys and CSS vars
    value: 1, // Equal value for each slice
  }));

  const priorityAreasPieConfig: ChartConfig = {};
  pieChartData.forEach((item, index) => {
    priorityAreasPieConfig[item.slug] = { // Use slug as key
      label: item.name.split('(')[0].trim(), // Shortened label for legend
      color: themedChartColors[index % themedChartColors.length],
    };
  });


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Activity className="mr-3 h-8 w-8" />
             {t.assessmentResultsTitle}
          </CardTitle>
          <CardDescription className="text-lg">{t.summaryAndRecommendations}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
            <ChartContainer config={emotionalProfileRadarConfig} className="w-full h-full">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={({ x, y, payload }) => (
                          <text x={x} y={y} dy={4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={10}>
                            {payload.value.split('(')[0].trim().substring(0,15)}
                          </text>
                        )}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tickCount={6}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Radar
                        name={t.emotionalProfile}
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                    />
                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--primary))", strokeDasharray: '3 3' }}
                        content={
                        <ChartTooltipContent
                            className="!bg-background !border !border-border !shadow-lg !rounded-md max-w-xs"
                            formatter={(value, name, itemProps) => {
                            if (itemProps.payload) {
                                return (
                                <div className="text-sm p-1">
                                    <div className="font-medium text-foreground">{itemProps.payload.dimension}</div>
                                    <div className="text-muted-foreground">{itemProps.payload.fullLabel} (Puntuación: {itemProps.payload.score}/5)</div>
                                </div>
                                );
                            }
                            return null;
                            }}
                        />
                        }
                    />
                </RadarChart>
            </ChartContainer>
            </div>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm">
              {radarData.map((item) => (
                <li key={item.dimension} className="p-2 bg-muted/50 rounded-md">
                  <span className="font-semibold">{item.dimension}:</span> {item.fullLabel}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-accent" />{t.priorityAreas}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[400px] w-full">
               <ChartContainer config={priorityAreasPieConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => { // name here will be the slug
                          return (
                            <div className="text-sm p-1">
                              <div className="font-medium text-foreground">{props.payload.name}</div> {/* Display full name from payload */}
                              {/* Optionally display percentage or value if needed */}
                            </div>
                          );
                        }}
                        nameKey="slug" // Corresponds to Pie's nameKey
                        hideLabel // We are using formatter, so hide default label based on nameKey
                        className="!bg-background !border !border-border !shadow-lg !rounded-md"
                      />
                    }
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="slug" // Use slug for internal identification for colors
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    label={({ name, percent, ...entry }) => { // name here is the slug
                       const originalEntry = pieChartData.find(d => d.slug === name);
                       const displayName = originalEntry ? originalEntry.name.split('(')[0].trim().substring(0,15) : name.substring(0,15);
                       return `${displayName}... (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${entry.slug}`} fill={`var(--color-${entry.slug})`} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="slug" className="text-xs"/>} // Use slug to lookup labels in config
                  />
                </PieChart>
              </ChartContainer>
            </div>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm">
              {results.priorityAreas.map((area, index) => (
                <li key={index} className="flex items-center p-2 bg-muted/50 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>{t.summaryAndRecommendations}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-base leading-relaxed">{results.feedback}</p>
        </CardContent>
      </Card>

      {results.priorityAreas.length > 0 && (
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href={`/paths?start_with=${encodeURIComponent(results.priorityAreas[0])}`}>
              {t.startPathFor.replace("{area}", results.priorityAreas[0].split('(')[0].trim())}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
