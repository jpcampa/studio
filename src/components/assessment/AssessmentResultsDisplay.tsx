
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, Activity, AlertTriangle, Info, RotateCcw, Sparkles, CalendarDays } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  type DotProps,
} from "recharts"
import { assessmentDimensions, type AssessmentDimension } from '@/data/assessmentDimensions';
import { assessmentInterpretations, type InterpretationLevels } from '@/data/assessmentInterpretations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import { formatAssessmentTimestamp } from '@/data/assessmentHistoryStore';

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput | null; // Allow null for error handling
  onRetake: () => void;
  assessmentTimestamp?: string; // Optional: ISO string for the assessment date
}

const themedChartColors = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--primary))",
  "hsl(var(--accent))", "hsl(var(--secondary))",
  "hsl(var(--chart-1) / 0.7)", "hsl(var(--chart-2) / 0.7)",
  "hsl(var(--chart-3) / 0.7)", "hsl(var(--chart-4) / 0.7)",
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const getInterpretationText = (score: number, interpretations: InterpretationLevels): string => {
  if (score >= 4.8 && interpretations.veryHigh) {
    return interpretations.veryHigh;
  } else if (score >= 3.8) {
    return interpretations.high;
  } else if (score >= 2.3) {
    return interpretations.medium;
  } else {
    return interpretations.low;
  }
};

const getInterpretationLevel = (score: number, interpretations: InterpretationLevels, t: any): string => {
  if (score >= 4.8 && interpretations.veryHigh) return t.scoreLevelVeryHigh || "Muy Alto";
  if (score >= 3.8) return t.scoreLevelHigh || "Alto";
  if (score >= 2.3) return t.scoreLevelMedium || "Medio";
  return t.scoreLevelLow || "Bajo";
};

export function AssessmentResultsDisplay({ results, onRetake, assessmentTimestamp }: AssessmentResultsDisplayProps) {
  const t = useTranslations();
  const router = useRouter();

  console.log("AssessmentResultsDisplay: Received results.emotionalProfile:", results?.emotionalProfile);

  if (!results || !results.emotionalProfile || Object.keys(results.emotionalProfile).length === 0 ||
      Object.values(results.emotionalProfile).some(score => typeof score !== 'number') ||
      !results.priorityAreas) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold">{t.errorOccurred}</p>
        <p className="text-muted-foreground">No se pudieron cargar los resultados de la evaluación. Faltan datos o están malformados.</p>
        <Button asChild className="mt-6" onClick={() => router.push('/assessment/intro')}>
          <Link href="/assessment/intro">{t.takeInitialAssessment}</Link>
        </Button>
      </div>
    );
  }

  const radarData = assessmentDimensions.map(dim => {
    const scoreFromProfile = results.emotionalProfile[dim.name];
    const scoreValue = scoreFromProfile !== undefined && typeof scoreFromProfile === 'number' ? scoreFromProfile : 0;
    const finalScore = Math.max(0, Math.min(5, scoreValue));
    console.log(`AssessmentResultsDisplay - Mapping dimension: '${dim.name}', Score found in profile: ${scoreFromProfile}, Final score for radar: ${finalScore}`);
    return {
      dimensionId: dim.id,
      dimension: dim.name,
      score: finalScore,
      fullMark: 5,
    };
  });
  console.log("AssessmentResultsDisplay: Generated radarData for chart:", radarData);


  const emotionalProfileRadarConfig: ChartConfig = {
    score: {
      label: t.emotionalProfile,
      color: "hsl(var(--primary))", 
    },
  };

  const pieChartData = results.priorityAreas.map((areaName) => ({
    name: areaName,
    slug: slugify(areaName),
    value: 1, 
  }));

  const priorityAreasPieConfig: ChartConfig = {};
  pieChartData.forEach((item, index) => {
    priorityAreasPieConfig[item.slug] = {
      label: item.name.split('(')[0].trim(),
      color: themedChartColors[index % themedChartColors.length],
    };
  });
  
  const radarChartDescriptionText = (t.radarChartDescription || "Visualización de tu perfil en las diferentes dimensiones.") + 
                                   " Los puntos en el gráfico se colorean según la puntuación: Rojo (1.0-2.49), Naranja (2.5-3.99), Verde (4.0-5.0), Azul (0 o no evaluado).";

  const CustomRadarDot = (props: DotProps & { payload?: any, value?: number }) => {
    const { cx, cy, payload, value } = props;
    
    let dotColor = "hsl(var(--chart-2))"; // Default to Blue (unprocessed/error/zero score or <1)
    let scoreForLog: string | number = "N/A";
    const dimensionNameForLog = payload?.dimension || "Unknown Dimension";

    if (typeof value === 'number') {
        scoreForLog = value;
        if (value >= 4.0) {
          dotColor = "hsl(var(--primary))"; // Green
        } else if (value >= 2.5) {
          dotColor = "hsl(var(--chart-5))"; // Orange (assuming chart-5 is orange/yellow)
        } else if (value >= 1.0) {
          dotColor = "hsl(var(--destructive))"; // Red
        }
        // Scores 0 or < 1.0 remain Blue (default)
    } else {
        scoreForLog = `Invalid (${String(value)})`;
        console.warn(`CustomRadarDot: 'value' (score) is not a number or undefined. Value: ${value}, Type: ${typeof value}, For Dimension: ${dimensionNameForLog}, Payload: ${JSON.stringify(payload)}`);
    }
    
    console.log(`Radar Dot - Rendering - Dimension: ${dimensionNameForLog}, Score used: ${scoreForLog}, Final Dot Color: ${dotColor}, Props (cx,cy): ${cx},${cy}`);
    
    if (typeof cx !== 'number' || typeof cy !== 'number') {
      console.error(`CustomRadarDot: cx or cy is not a valid number for dimension ${dimensionNameForLog}. Cannot render dot. cx: ${cx}, cy: ${cy}`);
      return null; 
    }
    
    return <circle cx={cx} cy={cy} r={5} fill={dotColor} stroke="hsl(var(--background))" strokeWidth={1.5} />;
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardHeader className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
            Bienvenido/a a tu perfil emocional y personal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-foreground/90 space-y-3 px-6 md:px-10 pb-6">
          <p className="text-base md:text-lg">
            Este perfil no es un juicio ni una etiqueta.
          </p>
          <p className="text-base md:text-lg">
            Es un mapa claro y respetuoso sobre cómo sientes, piensas y afrontas tu vida en este momento.
          </p>
          <p className="text-base md:text-lg">
            Gracias a tu evaluación, ahora puedes ver con claridad tus fortalezas emocionales y los ámbitos que merecen más cuidado.
          </p>
          <p className="text-base md:text-lg font-semibold text-accent">
            Este es tu punto de partida para transformar tu bienestar.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <Activity className="mr-3 h-8 w-8" />
              {t.assessmentResultsTitle}
            </CardTitle>
            {assessmentTimestamp && (
              <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{formatAssessmentTimestamp(assessmentTimestamp)}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle>
            <CardDescription>{radarChartDescriptionText}</CardDescription>
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
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <Radar 
                        name={t.emotionalProfile} 
                        dataKey="score" 
                        stroke="hsl(var(--muted-foreground))" 
                        fill="hsl(var(--muted-foreground))"  
                        fillOpacity={0.1} 
                        dot={<CustomRadarDot />} 
                        activeDot={{ r: 7, strokeWidth: 2, fill: "hsl(var(--foreground))", stroke: "hsl(var(--background))" }}
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-accent" />{t.priorityAreas}</CardTitle>
            <CardDescription>{t.priorityAreasDescription || "Dimensiones clave para tu desarrollo actual."}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[400px] w-full">
               <ChartContainer config={priorityAreasPieConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => (
                            <div className="text-sm p-1">
                              <div className="font-medium text-foreground">{props.payload.name}</div>
                            </div>
                          )}
                        nameKey="slug"
                        hideLabel
                        className="!bg-background !border !border-border !shadow-lg !rounded-md"
                      />
                    }
                  />
                  <Pie data={pieChartData} dataKey="value" nameKey="slug" cx="50%" cy="50%" labelLine={false} outerRadius={120}
                    label={({ name, percent, ...entry }) => {
                       const originalEntry = pieChartData.find(d => d.slug === name);
                       const displayName = originalEntry ? originalEntry.name.split('(')[0].trim().substring(0,15) : name.substring(0,15);
                       return `${displayName}... (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={`cell-${entry.slug}`} fill={`var(--color-${entry.slug})`} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="slug" className="text-xs"/>} />
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
          <CardTitle>{t.detailedAnalysisTitle || "Análisis Detallado por Dimensión"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {assessmentDimensions.map((dim) => {
              const score = results.emotionalProfile[dim.name];
              const interpretationKey = dim.id as keyof typeof assessmentInterpretations;
              const interpretationsForDim = assessmentInterpretations[interpretationKey];

              if (score === undefined || !interpretationsForDim) {
                return (
                  <AccordionItem value={dim.id} key={dim.id}>
                    <AccordionTrigger className="text-base hover:no-underline">
                        <div className="flex items-center">
                            <Info className="mr-3 h-5 w-5 text-muted-foreground" />
                            {dim.name}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground px-2">
                        No se pudo obtener una interpretación para esta dimensión.
                    </AccordionContent>
                  </AccordionItem>
                );
              }
              const interpretationText = getInterpretationText(score, interpretationsForDim);
              const scoreLevel = getInterpretationLevel(score, interpretationsForDim, t);

              return (
                <AccordionItem value={dim.id} key={dim.id}>
                  <AccordionTrigger className="text-base hover:no-underline">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                        <span className="font-semibold text-primary">{dim.name}</span>
                        <span className="text-sm text-muted-foreground sm:ml-4">Puntuación: {score.toFixed(1)}/5 ({scoreLevel})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/90 px-2">
                    <p className="whitespace-pre-line leading-relaxed">{interpretationText}</p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>{t.summaryAndRecommendations}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-base leading-relaxed">{results.feedback}</p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        {results.priorityAreas.length > 0 && (
            <Button asChild size="lg">
                <Link href={`/paths?start_with=${encodeURIComponent(results.priorityAreas[0])}`}>
                {t.startPathFor.replace("{area}", results.priorityAreas[0].split('(')[0].trim())}
                </Link>
            </Button>
        )}
        <Button onClick={onRetake} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Realizar Evaluación de Nuevo
        </Button>
      </div>
    </div>
  );
}

