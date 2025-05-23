
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { 
  BarChart, 
  PieChart, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Pie, 
  Cell,
} from "recharts"

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82Ca9D"];

export function AssessmentResultsDisplay({ results }: AssessmentResultsDisplayProps) {
  const t = useTranslations();

  const barChartData = Object.entries(results.emotionalProfile).map(([name, value]) => {
    const match = value.match(/\((\d)\/\d\)/);
    const numericValue = match ? parseInt(match[1], 10) : Math.floor(Math.random() * 5) + 1; 
    return { name, value: numericValue, fullValue: value };
  });
  
  const emotionalProfileBarConfig: ChartConfig = {
    value: { // Corresponds to dataKey="value" in <Bar />
      label: "Nivel", // You might want to translate this or make it dynamic
      color: "hsl(var(--primary))",
    },
  };

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
            <BarChartIcon className="mr-3 h-8 w-8" /> {t.assessmentResultsTitle}
          </CardTitle>
          <CardDescription className="text-lg">{t.summaryAndRecommendations}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
            <ChartContainer config={emotionalProfileBarConfig} className="w-full h-full">
                <BarChart data={barChartData} layout="vertical" margin={{ left: 20, right:20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="value" domain={[0,5]} ticks={[1,2,3,4,5]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => ( // name is dataKey here
                            <div className="text-sm">
                              <div className="font-medium">{item.payload.name}</div>
                              <div className="text-muted-foreground">{item.payload.fullValue}</div>
                            </div>
                          )}
                          className="bg-background border rounded-md p-2 shadow-lg"
                        />
                      }
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ChartContainer>
            </div>
            <ul className="mt-4 space-y-2">
              {Object.entries(results.emotionalProfile).map(([key, value]) => (
                <li key={key} className="text-sm p-2 bg-muted/50 rounded-md">
                  <span className="font-semibold">{key}:</span> {value}
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
             <div className="h-[300px] w-full">
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

