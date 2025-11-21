
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import type { AssessmentItem, AssessmentDimension } from '@/data/paths/pathTypes';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { Loader2, ArrowRight, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const FrownIcon = require('lucide-react').Frown;
const AnnoyedIcon = require('lucide-react').Annoyed;
const MehIcon = require('lucide-react').Meh;
const SmileIcon = require('lucide-react').Smile;
const LaughIcon = require('lucide-react').Laugh;

const iconMap: Record<string, React.ElementType> = {
  Frown: FrownIcon,
  Annoyed: AnnoyedIcon,
  Meh: MehIcon,
  Smile: SmileIcon,
  Laugh: LaughIcon,
};

// DATOS INCRUSTADOS PARA ELIMINAR CUALQUIER DEPENDENCIA EXTERNA
const likertOptions = [
  { value: 1, label: 'Frown', description: 'Nunca o Casi Nunca / Muy Mal' },
  { value: 2, label: 'Annoyed', description: 'A Veces / Mal' },
  { value: 3, label: 'Meh', description: 'Regularmente / Regular' },
  { value: 4, label: 'Smile', description: 'Frecuentemente / Bien' },
  { value: 5, label: 'Laugh', description: 'Siempre o Casi Siempre / Muy Bien' },
];

const assessmentDimensions: AssessmentDimension[] = [
    {
      "id": "dim1",
      "name": "Regulación Emocional y Estrés",
      "definition": "Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.",
      "recommendedPathId": "gestion-estres",
      "items": [
        { "id": "dim1_item1", "text": "Suelo mantener la calma cuando las cosas se complican.", "weight": 1 },
        { "id": "dim1_item2", "text": "Me desbordo fácilmente ante el estrés o la presión.", "weight": 1, "isInverse": true },
        { "id": "dim1_item3", "text": "Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.", "weight": 1 },
        { "id": "dim1_item4", "text": "Me recupero con rapidez después de una situación emocionalmente intensa.", "weight": 1 }
      ]
    },
    {
      "id": "dim2",
      "name": "Flexibilidad Mental y Adaptabilidad",
      "definition": "Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.",
      "recommendedPathId": "tolerar-incertidumbre",
      "items": [
        { "id": "dim2_item1", "text": "Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.", "weight": 1 },
        { "id": "dim2_item2", "text": "Suelo encontrar soluciones creativas cuando algo no sale como esperaba.", "weight": 1 },
        { "id": "dim2_item3", "text": "A menudo cuestiono mis propias creencias o formas de pensar.", "weight": 1 },
        { "id": "dim2_item4", "text": "Me adapto con rapidez cuando las circunstancias cambian.", "weight": 1 }
      ]
    },
    {
      "id": "dim3",
      "name": "Autorregulación personal y constancia",
      "definition": "Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.",
      "recommendedPathId": "superar-procrastinacion",
      "items": [
        { "id": "dim3_item1", "text": "Suelo cumplir mis objetivos, aunque me cuesten.", "weight": 1 },
        { "id": "dim3_item2", "text": "Soy constante con mis compromisos personales y profesionales.", "weight": 1 },
        { "id": "dim3_item3", "text": "Planifico mis días para aprovechar bien el tiempo.", "weight": 1 },
        { "id": "dim3_item4", "text": "Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.", "weight": 1, "isInverse": true }
      ]
    },
    {
      "id": "dim4",
      "name": "Autoafirmación y Expresión Personal",
      "definition": "Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.",
      "recommendedPathId": "poner-limites",
      "items": [
        { "id": "dim4_item1", "text": "Me siento con derecho a expresar lo que necesito, aunque sea incómodo.", "weight": 1 },
        { "id": "dim4_item2", "text": "Soy capaz de defender mi opinión sin imponerla.", "weight": 1 },
        { "id": "dim4_item3", "text": "Me cuesta decir \"no\", incluso cuando lo deseo.", "weight": 1, "isInverse": true },
        { "id": "dim4_item4", "text": "En situaciones difíciles, puedo mantener mi postura con respeto.", "weight": 1 }
      ]
    },
    {
      "id": "dim5",
      "name": "Empatía y Conexión Interpersonal",
      "definition": "Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.",
      "recommendedPathId": "relaciones-autenticas",
      "items": [
        { "id": "dim5_item1", "text": "Me interesa entender cómo se sienten las personas que me rodean.", "weight": 1 },
        { "id": "dim5_item2", "text": "A veces actúo sin considerar el impacto emocional que puede tener en otros.", "weight": 1, "isInverse": true },
        { "id": "dim5_item3", "text": "Suelo conectar fácilmente con las emociones de los demás.", "weight": 1 },
        { "id": "dim5_item4", "text": "Tengo sensibilidad para detectar cuándo alguien necesita apoyo.", "weight": 1 }
      ]
    },
    {
      "id": "dim6",
      "name": "Insight y Autoconciencia",
      "definition": "Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.",
      "recommendedPathId": "comprender-mejor-cada-dia",
      "items": [
        { "id": "dim6_item1", "text": "Reflexiono con frecuencia sobre lo que siento y por qué.", "weight": 1 },
        { "id": "dim6_item2", "text": "Se con claridad quién soy porque conozco mis puntos fuertes y también mis áreas a mejorar.", "weight": 1 },
        { "id": "dim6_item3", "text": "Soy consciente de cómo influyen mis emociones en mis decisiones.", "weight": 1 },
        { "id": "dim6_item4", "text": "Reconozco cuándo repito patrones que no me benefician y trato de cambiarlos.", "weight": 1 }
      ]
    },
    {
      "id": "dim7",
      "name": "Propósito Vital y Dirección Personal",
      "definition": "Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim7_item1", "text": "Tengo claro qué es importante para mí en la vida.", "weight": 1 },
        { "id": "dim7_item2", "text": "Tomo decisiones alineadas con mis prioridades y valores personales.", "weight": 1 },
        { "id": "dim7_item3", "text": "Siento que lo que hago tiene sentido y propósito.", "weight": 1 },
        { "id": "dim7_item4", "text": "Estoy construyendo un camino de vida que me representa.", "weight": 1 }
      ]
    },
    {
      "id": "dim8",
      "name": "Estilo de Afrontamiento",
      "definition": "Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.",
      "recommendedPathId": "resiliencia-en-accion",
      "items": [
        { "id": "dim8_item1", "text": "Cuando tengo un problema, rápidamente busco cómo solucionarlo sin quedarme estancado/a.", "weight": 1 },
        { "id": "dim8_item2", "text": "Trato de sacar un aprendizaje personal incluso en los momentos más difíciles.", "weight": 1 },
        { "id": "dim8_item3", "text": "Frente a la dificultad, trato de mantener la mente abierta y flexible.", "weight": 1 },
        { "id": "dim8_item4", "text": "Me adapto sin perder de vista lo que quiero conseguir.", "weight": 1 }
      ]
    },
    {
      "id": "dim9",
      "name": "Integridad y Coherencia Ética",
      "definition": "Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.",
      "recommendedPathId": "vivir-con-coherencia",
      "items": [
        { "id": "dim9_item1", "text": "Intento actuar con integridad, incluso cuando no es lo mejor o más fácil.", "weight": 1 },
        { "id": "dim9_item2", "text": "Me importa mucho el impacto de mis acciones en otras personas.", "weight": 1 },
        { "id": "dim9_item3", "text": "La honestidad guía mis decisiones, también en lo pequeño.", "weight": 1 },
        { "id": "dim9_item4", "text": "Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.", "weight": 1 }
      ]
    },
    {
      "id": "dim10",
      "name": "Responsabilidad Personal y Aceptación Consciente",
      "definition": "Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.",
      "recommendedPathId": "ni-culpa-ni-queja",
      "items": [
        { "id": "dim10_item1", "text": "Reflexiono y se reconocer cuándo he contribuido a que algo no salga como esperaba.", "weight": 1 },
        { "id": "dim10_item2", "text": "Cuando afronto dificultades, pienso y me pregunto qué puedo hacer diferente.", "weight": 1 },
        { "id": "dim10_item3", "text": "Asumo la responsabilidad de mis actos incluso cuando es incómodo.", "weight": 1 },
        { "id": "dim10_item4", "text": "Soy consciente del papel que tengo en las situaciones que vivo y eso me permite aprender y crecer.", "weight": 1 }
      ]
    },
    {
      "id": "dim11",
      "name": "Apoyo Social Percibido",
      "definition": "Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.",
      "recommendedPathId": "confiar-en-mi-red",
      "items": [
        { "id": "dim11_item1", "text": "Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.", "weight": 1 },
        { "id": "dim11_item2", "text": "En mi entorno laboral, me siento respaldado/a por compañeros y superiores.", "weight": 1 },
        { "id": "dim11_item3", "text": "Me cuesta pedir ayuda, incluso cuando la necesito.", "weight": 1, "isInverse": true },
        { "id": "dim11_item4", "text": "Me siento parte de una red de apoyo y sostén emocional sólida y accesible.", "weight": 1 }
      ]
    },
    {
      "id": "dim12",
      "name": "Estado de Ánimo",
      "definition": "Evaluación del estado de ánimo general y la presencia de síntomas relacionados con el desánimo o la anhedonia en las últimas semanas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim12_item1", "text": "Me siento triste o desanimado/a.", "weight": 1 },
        { "id": "dim12_item2", "text": "Tengo dificultad para disfrutar de las actividades que solían gustarme.", "weight": 1 },
        { "id": "dim12_item3", "text": "Me siento inútil o inferior a los demás.", "weight": 1 },
        { "id": "dim12_item4", "text": "Me siento culpable por cosas que hago o no hago.", "weight": 1 },
        { "id": "dim12_item5", "text": "Me siento agotado/a física o mentalmente.", "weight": 1 },
        { "id": "dim12_item6", "text": "Tengo dificultad para mantener la concentración en tareas.", "weight": 1 },
        { "id": "dim12_item7", "text": "Me falta motivación para realizar actividades cotidianas.", "weight": 1 },
        { "id": "dim12_item8", "text": "Siento que mi vida carece de sentido o dirección.", "weight": 1 },
        { "id": "dim12_item9", "text": "Me aíslo o evito el contacto con otras personas.", "weight": 1 },
        { "id": "dim12_item10", "text": "Siento que nada va a cambiar, aunque me esfuerce.", "weight": 1 },
        { "id": "dim12_item11", "text": "Siento que he perdido interés por cuidar de mí mismo/a (higiene, salud, descanso...).", "weight": 1 },
        { "id": "dim12_item12", "text": "Últimamente me cuesta identificar o expresar lo que siento.", "weight": 1 }
      ]
    },
    {
      "id": "dim13",
      "name": "Ansiedad Estado",
      "definition": "Evaluación del nivel de ansiedad y tensión experimentado en el momento presente o en los últimos días.",
      "recommendedPathId": "regular-ansiedad-paso-a-paso",
      "items": [
        { "id": "dim13_item1", "text": "Me siento tenso/a o nervioso/a actualmente.", "weight": 1 },
        { "id": "dim13_item2", "text": "Me preocupo por cosas que normalmente no me afectan.", "weight": 1 },
        { "id": "dim13_item3", "text": "Siento una inquietud interna difícil de controlar.", "weight": 1 },
        { "id": "dim13_item4", "text": "Me cuesta relajarme incluso en situaciones tranquilas.", "weight": 1 },
        { "id": "dim13_item5", "text": "Reacciono con irritabilidad ante pequeñas molestias.", "weight": 1 },
        { "id": "dim13_item6", "text": "Siento que pierdo el control fácilmente sobre mis emociones.", "weight": 1 }
      ]
    }
  ];

const IN_PROGRESS_ANSWERS_KEY = 'workwell-assessment-in-progress';

interface InProgressData {
  answers: Record<string, { score: number; weight: number }>;
  position: {
    dimension: number;
    item: number;
  };
}

interface QuestionnaireFormProps {
  onSubmit: (answers: Record<string, { score: number; weight: number }>) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting }: QuestionnaireFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentItemIndexInDimension, setCurrentItemIndexInDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { score: number; weight: number }>>({});
  const [showDimensionCompletedDialog, setShowDimensionCompletedDialog] = useState(false);

  useEffect(() => {
    if (assessmentDimensions.length === 0) return;
    try {
      const savedProgress = localStorage.getItem(IN_PROGRESS_ANSWERS_KEY);
      if (savedProgress) {
        const parsedData = JSON.parse(savedProgress) as InProgressData;
        if (parsedData.answers && parsedData.position) {
            setAnswers(parsedData.answers);
            const isLastDimension = parsedData.position.dimension >= assessmentDimensions.length - 1;
            const isLastItem = isLastDimension && parsedData.position.item >= assessmentDimensions[assessmentDimensions.length - 1].items.length - 1;

            if (!isLastItem) {
              setCurrentDimensionIndex(parsedData.position.dimension);
              setCurrentItemIndexInDimension(parsedData.position.item);
            } else {
              setCurrentDimensionIndex(assessmentDimensions.length - 1);
              setCurrentItemIndexInDimension(assessmentDimensions[assessmentDimensions.length - 1].items.length - 1);
            }
            toast({
              title: "Evaluación Reanudada",
              description: "Hemos cargado tu progreso anterior.",
            });
        }
      }
    } catch (error) {
      console.error("Error loading in-progress assessment:", error);
    }
  }, [toast]);
  
  const saveProgress = (dimIndex: number, itemIndex: number, currentAnswers: Record<string, { score: number; weight: number }>) => {
    try {
      const dataToSave: InProgressData = {
        answers: currentAnswers,
        position: { dimension: dimIndex, item: itemIndex }
      };
      localStorage.setItem(IN_PROGRESS_ANSWERS_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving partial progress:", error);
    }
  };

  const currentDimension = assessmentDimensions[currentDimensionIndex];
  const currentItem = currentDimension?.items[currentItemIndexInDimension];

  const overallProgress = assessmentDimensions.length > 0 ? Math.round(((currentDimensionIndex) / assessmentDimensions.length) * 100) : 0;
  const itemsInCurrentDimensionProgress = currentDimension ? Math.round(((currentItemIndexInDimension + 1) / currentDimension.items.length) * 100) : 0;

  const handleNextStep = () => {
    if (!currentItem || !answers[currentItem.id]) return; // Prevent advancing if no answer is selected
    const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
    if (isLastItemInDimension) {
      if (!isSubmitting) { 
        setShowDimensionCompletedDialog(true);
      }
    } else {
      setCurrentItemIndexInDimension(prev => prev + 1);
    }
  };

  const handleAnswerChange = (item: AssessmentItem, value: string) => {
    const newAnswers = { ...answers, [item.id]: { score: parseInt(value), weight: item.weight } };
    setAnswers(newAnswers);
    setTimeout(() => {
        // Auto-advance
        if (!item) return;
        const isLastItemInDimension = currentItemIndexInDimension === currentDimension.items.length - 1;
        if (isLastItemInDimension) {
          if (!isSubmitting) { 
            setShowDimensionCompletedDialog(true);
          }
        } else {
          setCurrentItemIndexInDimension(prev => prev + 1);
        }
    }, 250);
  };

  const handleDialogContinue = () => {
    setShowDimensionCompletedDialog(false);
    if (currentDimensionIndex < assessmentDimensions.length - 1) {
      const nextDimIndex = currentDimensionIndex + 1;
      setCurrentDimensionIndex(nextDimIndex);
      setCurrentItemIndexInDimension(0);
      saveProgress(nextDimIndex, 0, answers);
    } else {
      submitFullAssessment();
    }
  };
  
  const handleGoBack = () => {
    if (showDimensionCompletedDialog) {
        setShowDimensionCompletedDialog(false);
        return;
    }
    if (currentItemIndexInDimension > 0) {
      setCurrentItemIndexInDimension(prev => prev - 1);
    } else if (currentDimensionIndex > 0) {
      const prevDimensionIndex = currentDimensionIndex - 1;
      const prevDimension = assessmentDimensions[prevDimensionIndex];
      setCurrentDimensionIndex(prevDimensionIndex);
      setCurrentItemIndexInDimension(prevDimension.items.length - 1);
    }
  };

  const handleSaveForLater = () => {
    if (!currentDimension) return;
    const isLastDimension = currentDimensionIndex === assessmentDimensions.length - 1;
    let dimToSave = currentDimensionIndex;
    let itemToSave = currentItemIndexInDimension;
    if (currentItemIndexInDimension === currentDimension.items.length - 1 && !isLastDimension) {
      dimToSave = currentDimensionIndex + 1;
      itemToSave = 0;
    }
    saveProgress(dimToSave, itemToSave, answers);
    toast({ title: "Progreso Guardado", description: "Puedes continuar tu evaluación más tarde desde 'Mis Evaluaciones'." });
    setShowDimensionCompletedDialog(false);
    router.push('/my-assessments');
  };
  
  const submitFullAssessment = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const allAnswered = assessmentDimensions.every(dim => dim.items.every(item => answers.hasOwnProperty(item.id) && answers[item.id].score >= 1 && answers[item.id].score <= 5));
    if (!allAnswered) {
       toast({ title: "Cuestionario Incompleto", description: "Por favor, responde a todas las preguntas antes de finalizar.", variant: "destructive" });
       return;
    }
    localStorage.removeItem(IN_PROGRESS_ANSWERS_KEY);
    await onSubmit(answers);
  };

  // Esta comprobación es clave para evitar el error.
  if (!currentItem) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const isLastItemOfLastDimension = currentDimensionIndex === assessmentDimensions.length - 1 && currentItemIndexInDimension === currentDimension.items.length - 1;
  const allItemsAnswered = assessmentDimensions.every(dim => dim.items.every(item => answers.hasOwnProperty(item.id)));
  const isFirstQuestion = currentDimensionIndex === 0 && currentItemIndexInDimension === 0;
  const isNextButtonActive = answers[currentItem.id] !== undefined;

  const itemProgressText = t.itemProgress
    .replace('{currentItem}', (currentItemIndexInDimension + 1).toString())
    .replace('{totalItems}', currentDimension.items.length.toString())
    .replace('{currentDim}', (currentDimensionIndex + 1).toString())
    .replace('{totalDims}', assessmentDimensions.length.toString());

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden">
        <CardHeader>
          <Progress value={overallProgress} className="w-full mb-4" aria-label={`Progreso general: ${overallProgress}%`} />
          <CardTitle className="text-lg font-semibold text-center text-primary">
            Cuestionario de Evaluación App: Personalidad, Estado de Ánimo y Ansiedad
          </CardTitle>
          
        </CardHeader>
        {!showDimensionCompletedDialog && (
          <CardContent className="pt-2 px-2 sm:px-6">
            <div key={currentItem.id} className={cn("py-4", "animate-in fade-in-0 slide-in-from-bottom-5 duration-500")}>
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">{itemProgressText}</p>
              <Progress value={itemsInCurrentDimensionProgress} className="w-3/4 mx-auto mb-4 h-2" aria-label={`Progreso en dimensión actual: ${itemsInCurrentDimensionProgress}%`} />
              <p className="text-md sm:text-lg font-semibold text-primary mb-4 min-h-[3em] text-center px-2">{currentItem.text}</p>
              <RadioGroup value={answers[currentItem.id]?.score.toString() || ""} onValueChange={(value) => handleAnswerChange(currentItem, value)} className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 pt-2" aria-label={currentItem.text}>
                {likertOptions.map(option => {
                  const IconComponent = iconMap[option.label];
                  return (
                    <Label key={option.value} htmlFor={`${currentItem.id}-${option.value}`} className={cn("flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out", "hover:border-primary hover:shadow-md", "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16", answers[currentItem.id]?.score === option.value ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105" : "bg-background border-input")} title={option.description}>
                      <RadioGroupItem value={option.value.toString()} id={`${currentItem.id}-${option.value}`} className="sr-only" />
                      {IconComponent ? <IconComponent className="h-6 w-6 sm:h-7 sm:h-7 md:h-8 md:h-8 text-foreground/80" /> : option.label}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          </CardContent>
        )}
        {showDimensionCompletedDialog && (
             <CardContent>
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-500 my-4">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-medium text-center">
                         {t.dimensionCompletedMessage.replace("{dimensionNumber}", (currentDimensionIndex + 1).toString()).replace("{totalDimensions}", assessmentDimensions.length.toString())}
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 border-t">
          <Button variant="outline" onClick={handleGoBack} disabled={isFirstQuestion && !showDimensionCompletedDialog}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          {!isLastItemOfLastDimension && (
            <Button onClick={handleNextStep} disabled={!isNextButtonActive} className="w-full sm:w-auto mt-2 sm:mt-0" variant={isNextButtonActive ? "default" : "secondary"}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {isLastItemOfLastDimension && (
            <Button onClick={submitFullAssessment} disabled={isSubmitting || !allItemsAnswered} className="w-full sm:w-auto mt-2 sm:mt-0">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {t.finishAssessment}
            </Button>
          )}
        </CardFooter>
      </Card>
      <AlertDialog open={showDimensionCompletedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary flex items-center gap-2 justify-center"><CheckCircle className="h-7 w-7" /> {t.dimensionCompletedTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-base py-2 text-center">{t.dimensionCompletedMessage.replace("{dimensionNumber}", (currentDimensionIndex + 1).toString()).replace("{totalDimensions}", assessmentDimensions.length.toString())}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSaveForLater} disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> {t.saveForLaterButton}
            </Button>
            <Button onClick={handleDialogContinue} disabled={isSubmitting} className="w-full sm:w-auto" autoFocus>
              {currentDimensionIndex === assessmentDimensions.length - 1 ? (isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.finishAssessment) : t.continueButton} 
              {currentDimensionIndex < assessmentDimensions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              {currentDimensionIndex === assessmentDimensions.length - 1 && !isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    