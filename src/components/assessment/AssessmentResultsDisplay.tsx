"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { BarChart, CheckCircle, ListChecks, PieChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, Cell, Tooltip as RechartsTooltip } from "recharts"

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82Ca9D"];

export function AssessmentResultsDisplay({ results }: AssessmentResultsDisplayProps) {
  const t = useTranslations();

  const chartData = Object.entries(results.emotionalProfile).map(([name, value]) => {
    // Attempt to parse a numeric value from strings like "Nivel medio-bajo (2/5)"
    const match = value.match(/\((\d)\/\d\)/);
    const numericValue = match ? parseInt(match[1], 10) : Math.floor(Math.random() * 5) + 1; // fallback for non-standard values
    return { name, value: numericValue, fullValue: value };
  });
  
  const pieChartData = results.priorityAreas.map((area, index) => ({
    name: area,
    value: 1, // Equal weight for priority areas
    fill: COLORS[index % COLORS.length],
  }));


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <BarChart className="mr-3 h-8 w-8" /> {t.assessmentResultsTitle}
          </CardTitle>
          <CardDescription className="text-lg">{t.summaryAndRecommendations}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right:20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0,5]} ticks={[1,2,3,4,5]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} formatter={(value, name, props) => [props.payload.fullValue, name]}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
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
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
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
