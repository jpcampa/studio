
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useTranslations } from '@/lib/translations';
import { LineChart as LineChartIcon } from 'lucide-react'; // Icon for placeholder

interface ProcessedChartDataPoint {
  date: string; // Formatted for X-axis label (e.g., "dd MMM")
  moodScore: number;
  emotionLabel: string;
  fullDate: string; // Full date for tooltip
}

interface MoodEvolutionChartProps {
  data: ProcessedChartDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

export function MoodEvolutionChart({ data, title, description, className }: MoodEvolutionChartProps) {
  const t = useTranslations();
  // console.log("MoodEvolutionChart: Rendering. Received data for chart props:", data);

  if (!data || data.length < 2) {
    console.log("MoodEvolutionChart: Not enough data (less than 2 points). Showing placeholder. Data received:", data);
    return (
        <Card className={`shadow-lg flex flex-col ${className}`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                <LineChartIcon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{title}</CardTitle>
                </div>
                {description && <CardDescription className="pt-1">{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center p-6">
                <div className="text-center text-muted-foreground p-6 sm:p-8 border-2 border-dashed border-border rounded-lg w-full min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center bg-muted/20">
                    <LineChartIcon className="h-12 w-12 sm:h-16 sm:w-16 mb-4 text-muted-foreground/40" />
                    <p className="text-sm sm:text-base">{t.notEnoughDataForChart}</p>
                </div>
            </CardContent>
       </Card>
    );
  }

  console.log("MoodEvolutionChart: Preparing to render chart with sufficient data:", data);
  const chartConfig = {
    moodScore: {
      label: t.moodScoreLabel, // Add this to translations.ts
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
         <div className="flex items-center gap-3">
            <LineChartIcon className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {description && <CardDescription className="pt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2 pr-6 pb-6"> 
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10, 
              left: -20, // Adjust left margin to make Y-axis labels visible
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={[0, 5]} // Assuming moodScore is 0-5
              tickCount={6}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => Math.round(value).toString()} // Ensure integer labels
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1.5, strokeDasharray: '3 3'}}
              content={
                <ChartTooltipContent 
                  className="!bg-background !border !border-border !shadow-lg !rounded-md"
                  formatter={(value, name, props) => {
                    if (props.payload) {
                      return (
                        <div className="text-sm p-1">
                          <div className="font-medium text-foreground">{props.payload.emotionLabel} ({value})</div>
                          <div className="text-xs text-muted-foreground">{props.payload.fullDate}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  labelFormatter={() => ''} // Hide default label
                />
              }
            />
            <Line
              type="monotone"
              dataKey="moodScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              activeDot={{
                 r: 6,
                 fill: "hsl(var(--primary))",
                 stroke: "hsl(var(--background))",
                 strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    
