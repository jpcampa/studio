
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, Activity, AlertTriangle, Info, RotateCcw, Sparkles, CalendarDays, TrendingUp, Star, Zap, Milestone, ExternalLink, Lightbulb, HeartHandshake, FileJson } from 'lucide-react'; 
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
import { pathsData } from '@/data/pathsData';

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput | null;
  rawAnswers?: Record<string, { score: number, weight: number }> | null;
  userId?: string | null;
  onRetake: () => void;
  assessmentTimestamp?: string;
}

interface CategorizedDimension extends AssessmentDimension {
  score: number;
  interpretationText: string;
  scoreLevel: string;
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

export function AssessmentResultsDisplay({ results, rawAnswers, userId, onRetake, assessmentTimestamp }: AssessmentResultsDisplayProps) {
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
  
  const payloadForDebug = rawAnswers && userId && results ? {
    assessmentId: "current-session-id", // Placeholder for current session
    userId: userId,
    rawAnswers: rawAnswers,
    aiInterpretation: results,
    assessmentTimestamp: assessmentTimestamp || new Date().toISOString(),
  } : null;

  const radarData = assessmentDimensions.map(dim => {
    const scoreFromProfile = results.emotionalProfile[dim.name];
    const scoreValue = scoreFromProfile !== undefined && typeof scoreFromProfile === 'number' ? scoreFromProfile : 0;
    const finalScore = Math.max(0, Math.min(5, scoreValue));
    // console.log(`AssessmentResultsDisplay - Mapping dimension: '${dim.name}', Score found in profile: ${scoreFromProfile}, Final score for radar: ${finalScore}`);
    return {
      dimensionId: dim.id,
      dimension: dim.name,
      score: finalScore,
      fullMark: 5,
    };
  });
  // console.log("AssessmentResultsDisplay: Generated radarData for chart:", radarData);


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
                                   " Los puntos en el gráfico se colorean según la puntuación: Rojo (1.0-2.49), Naranja (2.5-3.99), Verde (4.0-5.0), Azul (< 1.0 o no evaluado).";
  
  const CustomRadarDot = (props: DotProps & { payload?: any, value?: number }) => {
    const { cx, cy, payload, value: valueFromProps } = props;

    // Use value from payload as the primary source of truth for the score.
    const value = payload?.score;

    if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) {
      console.error(`CustomRadarDot: cx (${cx}) or cy (${cy}) is not a valid number for dimension ${payload?.dimension || 'Unknown'}. Cannot render dot.`);
      return null;
    }

    const scoreValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(5, value)) : 0;
    if (typeof value !== 'number' || isNaN(value)) {
        // This might still be useful to log if the payload itself is missing the score
        // console.warn(`CustomRadarDot: Invalid 'value' (${value}) for dimension ${payload?.dimension || 'Unknown'}. Defaulting to 0 for color logic.`);
    }

    let dotColor = "hsl(var(--chart-2))"; // Default Blue (for 0 or < 1.0 or not evaluated)
    
    if (scoreValue >= 4.0) {
      dotColor = "hsl(var(--primary))"; // Green
    } else if (scoreValue >= 2.5) {
      dotColor = "hsl(var(--chart-5))"; // Orange/Yellow
    } else if (scoreValue >= 1.0) {
      dotColor = "hsl(var(--destructive))"; // Red
    }
        
    return <circle cx={cx} cy={cy} r={5} fill={dotColor} stroke="hsl(var(--background))" strokeWidth={1.5} />;
  };

  const highStrengthDimensions: CategorizedDimension[] = [];
  const functionalDimensions: CategorizedDimension[] = [];
  const priorityImprovementDimensions: CategorizedDimension[] = [];

  assessmentDimensions.forEach(dim => {
    const score = results.emotionalProfile[dim.name];
    const interpretationKey = dim.id as keyof typeof assessmentInterpretations;
    const interpretationsForDim = assessmentInterpretations[interpretationKey];

    if (typeof score === 'number' && interpretationsForDim) {
      const interpretationText = getInterpretationText(score, interpretationsForDim);
      const scoreLevel = getInterpretationLevel(score, interpretationsForDim, t);
      const categorizedDim = { ...dim, score, interpretationText, scoreLevel };

      if (score >= 4.0) {
        highStrengthDimensions.push(categorizedDim);
      } else if (score >= 2.5) {
        functionalDimensions.push(categorizedDim);
      } else if (score < 2.5) { 
        priorityImprovementDimensions.push(categorizedDim);
      }
    }
  });

  const renderDimensionGroup = (title: string, dimensions: CategorizedDimension[], icon: React.ElementType) => {
    if (dimensions.length === 0) return null;
    const IconComponent = icon;
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
          <IconComponent className="mr-2 h-6 w-6" />
          {title}
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {dimensions.map((dim) => (
            <AccordionItem value={dim.id} key={dim.id}>
              <AccordionTrigger className="text-base hover:no-underline">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                  <span className="font-semibold text-foreground">{dim.name}</span>
                  <span className="text-sm text-muted-foreground sm:ml-4">Puntuación: {dim.score.toFixed(1)}/5 ({dim.scoreLevel})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/90 px-2">
                <p className="whitespace-pre-line leading-relaxed">{dim.interpretationText}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };
  
  const recommendedPaths = results.priorityAreas.map(areaName => {
    const dimension = assessmentDimensions.find(d => d.name === areaName);
    if (dimension && dimension.recommendedPathId) {
        const path = pathsData.find(p => p.id === dimension.recommendedPathId);
        if (path) {
            return path;
        }
    }
    return null;
  }).filter((path): path is NonNullable<typeof path> => path !== null);

  const uniqueRecommendedPaths = Array.from(new Map(recommendedPaths.map(p => [p.id, p])).values());

  const startCarePath = uniqueRecommendedPaths.length > 0
    ? `/paths/${uniqueRecommendedPaths[0].id}`
    : "/paths";

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
            {results.priorityAreas.length > 0 ? (
                <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                {results.priorityAreas.map((area, index) => (
                    <li key={index} className="flex items-center p-2 bg-muted/50 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    {area}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm text-muted-foreground italic text-center">No se identificaron áreas prioritarias específicas en esta evaluación o no se pudieron cargar.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>{t.detailedAnalysisTitle || "Análisis Detallado por Dimensión"}</CardTitle>
          <CardDescription>Explora tus resultados en cada área. Las dimensiones se agrupan según tu puntuación.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderDimensionGroup("Fortalezas Consolidadas (Puntuación >= 4.0)", highStrengthDimensions, Star)}
          {renderDimensionGroup("Ámbitos Funcionales con Potencial de Mejora (Puntuación 2.5 - 3.9)", functionalDimensions, TrendingUp)}
          {renderDimensionGroup("Áreas de Mejora Prioritaria (Puntuación < 2.5)", priorityImprovementDimensions, Zap)}
          
          {(highStrengthDimensions.length === 0 && functionalDimensions.length === 0 && priorityImprovementDimensions.length === 0) && (
             <p className="text-muted-foreground text-center py-4">No se pudieron categorizar las dimensiones para el análisis detallado. Verifica los datos de entrada.</p>
          )}
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
      
      {payloadForDebug && (
        <Card className="shadow-lg mt-8">
           <CardHeader>
              <CardTitle className="flex items-center"><FileJson className="mr-2 h-5 w-5 text-muted-foreground" /> Payload de Guardado (Depuración)</CardTitle>
           </CardHeader>
           <CardContent>
              <pre className="mt-2 w-full whitespace-pre-wrap break-all rounded-md bg-slate-950 p-4 text-xs text-white">
                <code>{JSON.stringify(payloadForDebug, null, 2)}</code>
              </pre>
           </CardContent>
        </Card>
      )}

      <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-3 h-7 w-7 text-primary" />
            Próximos Pasos: Rutas de Desarrollo Sugeridas
          </CardTitle>
          <CardDescription>
            Basado en tus resultados, te recomendamos explorar las siguientes rutas para continuar tu crecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
          {uniqueRecommendedPaths.length > 0 ? (
            uniqueRecommendedPaths.map((path, index) => (
              <Button
                key={index}
                asChild
                variant="default"
                size="lg"
                className="w-full max-w-sm sm:w-auto justify-center"
              >
                <Link href={`/paths/${path.id}`}>
                  Comenzar Ruta: {path.title}
                </Link>
              </Button>
            ))
          ) : (
            <>
              <p className="text-muted-foreground">
                No se han identificado rutas específicas para tus áreas prioritarias. Te invitamos a explorar todas nuestras rutas de desarrollo disponibles.
              </p>
              <Button asChild variant="outline" size="lg" className="w-full max-w-sm sm:w-auto justify-center">
                <Link href="/paths">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explorar Todas las Rutas
                </Link>
              </Button>
            </>
          )}
          <p className="text-base text-muted-foreground italic pt-4">
            Este perfil no es un veredicto. Es una invitación a cuidarte con más consciencia y compasión. No tienes que hacerlo todo a la vez. Basta con empezar.
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button asChild variant="default" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={startCarePath}>
            <HeartHandshake className="mr-2 h-5 w-5" />
            Empezar a cuidarme
          </Link>
        </Button>
        <Button onClick={onRetake} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Realizar Evaluación de Nuevo
        </Button>
      </div>
    </div>
  );
}
