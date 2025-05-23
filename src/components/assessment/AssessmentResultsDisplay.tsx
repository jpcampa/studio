
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, BarChart as BarChartIcon, PieChart as PieChartIcon, Activity } from 'lucide-react'; // Added Activity as a potential radar icon
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82Ca9D"]; // For Pie Chart

export function AssessmentResultsDisplay({ results }: AssessmentResultsDisplayProps) {
  const t = useTranslations();

  // Data preparation for Radar Chart (Emotional Profile)
  const radarData = Object.entries(results.emotionalProfile).map(([name, valueString]) => {
    const match = valueString.match(/\((\d)\/\d\)/); // Extracts '3' from "(3/5)"
    let numericValue;
    if (match && match[1]) {
      numericValue = parseInt(match[1], 10);
    } else {
      // Fallback for values like "Alto", "Bajo", "Medio".
      const lowerValueString = valueString.toLowerCase();
      if (lowerValueString.includes("muy bajo") || lowerValueString.includes("muy mal")) numericValue = 1;
      else if (lowerValueString.includes("bajo") || lowerValueString.includes("mal")) numericValue = 2;
      else if (lowerValueString.includes("medio") || lowerValueString.includes("regular") || lowerValueString.includes("normal")) numericValue = 3;
      else if (lowerValueString.includes("alto") || lowerValueString.includes("bien")) numericValue = 4;
      else if (lowerValueString.includes("muy alto") || lowerValueString.includes("muy bien")) numericValue = 5;
      else numericValue = 3; // Default if no specific pattern matches
    }
    return {
      dimension: name, // e.g., "Autoestima"
      score: numericValue, // e.g., 3
      fullMark: 5, // Assuming all are out of 5 for the scale
      fullLabel: valueString // e.g., "Nivel medio (3/5)" for tooltip
    };
  });
  
  // ChartConfig for the Radar Chart series
  const emotionalProfileRadarConfig: ChartConfig = {
    score: { // This key matches the dataKey of the <Radar /> component
      label: t.emotionalProfile, // Used in legend if enabled
      color: "hsl(var(--primary))",
    },
  };

  // Data and Config for Pie Chart (Priority Areas)
  const pieChartData = results.priorityAreas.map((area) => ({
    name: area,
    value: 1, // Equal weight for priority areas
  }));

  const priorityAreasPieConfig: ChartConfig = {};
  results.priorityAreas.forEach((area, index) => {
    priorityAreasPieConfig[area] = {
      label: area,
      color: COLORS[index % COLORS.length],
    };
  });


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Activity className="mr-3 h-8 w-8" /> {/* Changed icon for results title */}
             {t.assessmentResultsTitle}
          </CardTitle>
          <CardDescription className="text-lg">{t.summaryAndRecommendations}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><BarChartIcon className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle> {/* Kept BarChartIcon or could use Activity */}
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
            <ChartContainer config={emotionalProfileRadarConfig} className="w-full h-full">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
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
                            className="!bg-background !border !border-border !shadow-lg !rounded-md"
                            formatter={(value, name, itemProps) => {
                            // value is the score (e.g., 3)
                            // name is the dataKey of the Radar (e.g., "score")
                            // itemProps.payload is the data object for this point
                            if (itemProps.payload) {
                                return (
                                <div className="text-sm p-1">
                                    <div className="font-medium text-foreground">{itemProps.payload.dimension}</div>
                                    <div className="text-muted-foreground">{itemProps.payload.fullLabel}</div>
                                    {/* <div className="text-primary font-semibold">Score: {itemProps.payload.score}</div> */}
                                </div>
                                );
                            }
                            return null;
                            }}
                        />
                        }
                    />
                    {/* Optional: Legend can be added if desired for a single series */}
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                </RadarChart>
            </ChartContainer>
            </div>
            <ul className="mt-4 space-y-2">
              {radarData.map((item) => (
                <li key={item.dimension} className="text-sm p-2 bg-muted/50 rounded-md">
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
             <div className="h-[350px] w-full"> {/* Increased height slightly */}
               <ChartContainer config={priorityAreasPieConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                </PieChart>
              </ChartContainer>
            </div>
            <ul className="mt-4 space-y-2">
              {results.priorityAreas.map((area, index) => (
                <li key={index} className="flex items-center text-sm p-2 bg-muted/50 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
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
              {t.startPathFor.replace("{area}", results.priorityAreas[0])}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
