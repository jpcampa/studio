
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Palette, Trash2, AlertTriangle, ShieldAlert, KeyRound, FastForward } from 'lucide-react'; 
import { useTheme } from 'next-themes';
import { clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import Link from 'next/link';

const SKIP_INTRO_SCREENS_KEY = 'workwell-skip-intro-screens';

export default function SettingsPage() {
  const t = useTranslations();
  const { user, updateUser, loading: userLoading } = useUser();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('es');

  const [dailyCheckIn, setDailyCheckIn] = useState(true);
  const [moduleReminders, setModuleReminders] = useState(true);
  const [motivationalQuotes, setMotivationalQuotes] = useState(false);
  const [skipIntroScreens, setSkipIntroScreens] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAgeRange(user.ageRange || '');
      setGender(user.gender || '');
    }
    if (typeof window !== 'undefined') {
      const storedSkipIntro = localStorage.getItem(SKIP_INTRO_SCREENS_KEY);
      setSkipIntroScreens(storedSkipIntro === 'true');
    }
  }, [user]);

  useEffect(() => {
    setAppVersion(`B-0.9-06-2025`);
  }, []);

  const ageRanges = [
    { value: "under_18", label: t.age_under_18 }, { value: "18_24", label: t.age_18_24 },
    { value: "25_34", label: t.age_25_34 }, { value: "35_44", label: t.age_35_44 },
    { value: "45_54", label: t.age_45_54 }, { value: "55_64", label: t.age_55_64 },
    { value: "65_plus", label: t.age_65_plus },
  ];

  const genders = [
    { value: "male", label: t.gender_male }, { value: "female", label: t.gender_female },
    { value: "non_binary", label: t.gender_non_binary }, { value: "other", label: t.gender_other },
    { value: "prefer_not_to_say", label: t.gender_prefer_not_to_say },
  ];

  const themeOptions = [
    { value: "light", label: t.themeLight },
    { value: "dark", label: t.themeDark },
    { value: "system", label: t.themeSystem },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ name, ageRange, gender });
      toast({
        title: "Configuración Guardada",
        description: "Tus cambios han sido guardados exitosamente.",
      });
    } catch (error) {
       toast({
        title: "Error al Guardar",
        description: (error as Error).message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearEntries = () => {
    clearAllEmotionalEntries();
    toast({
      title: t.clearEmotionalEntriesSuccessTitle,
      description: t.clearEmotionalEntriesSuccessMessage,
    });
  };

  const handleSkipIntroChange = (checked: boolean) => {
    setSkipIntroScreens(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SKIP_INTRO_SCREENS_KEY, JSON.stringify(checked));
    }
    toast({
      title: "Preferencia Guardada",
      description: checked ? "Ahora omitirás las pantallas introductorias." : "Ahora verás las pantallas introductorias.",
    });
  };

  if (userLoading && !user) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return <div className="container mx-auto py-8 text-center">{t.loading}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{t.settingsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.personalInformation}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="name">{t.name}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="emailStatic">{t.email}</Label>
                    <Input id="emailStatic" type="email" value={user.email || ''} disabled className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground mt-1">El correo electrónico no se puede cambiar desde aquí.</p>
                </div>
                <div>
                    <Label htmlFor="ageRange">{t.ageRange}</Label>
                    <Select value={ageRange || ''} onValueChange={setAgeRange}>
                    <SelectTrigger id="ageRange"><SelectValue placeholder={t.ageRangePlaceholder} /></SelectTrigger>
                    <SelectContent>
                        {ageRanges.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="gender">{t.gender}</Label>
                    <Select value={gender || ''} onValueChange={setGender}>
                    <SelectTrigger id="gender"><SelectValue placeholder={t.genderPlaceholder} /></SelectTrigger>
                    <SelectContent>
                        {genders.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving || userLoading} className="w-full md:w-auto">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {t.saveChanges}
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-5 w-5" />{t.themeSettingsTitle}</CardTitle>
                <CardDescription>{t.selectThemePrompt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="themeSelector">
                  <SelectValue placeholder={t.selectThemePrompt} />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.language}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={setLanguage} disabled>
                <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.notificationPreferences}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="dailyCheckIn" className="flex flex-col space-y-1">
                  <span>Check-in Emocional Diario</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Recibe recordatorios para tu check-in emocional.
                  </span>
                </Label>
                <Switch id="dailyCheckIn" checked={dailyCheckIn} onCheckedChange={setDailyCheckIn} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="moduleReminders" className="flex flex-col space-y-1">
                  <span>Recordatorios de Módulo</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Notificaciones sobre tu progreso en las rutas.
                  </span>
                </Label>
                <Switch id="moduleReminders" checked={moduleReminders} onCheckedChange={setModuleReminders} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="motivationalQuotes" className="flex flex-col space-y-1">
                  <span>Frases Motivadoras</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Recibe frases inspiradoras periódicamente.
                  </span>
                </Label>
                <Switch id="motivationalQuotes" checked={motivationalQuotes} onCheckedChange={setMotivationalQuotes} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="skipIntroScreens" className="flex flex-col space-y-1">
                  {/* Texto hardcodeado para asegurar visibilidad */}
                  <span>Omitir Pantallas Introductorias</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Accede directamente al contenido principal de secciones como la evaluación o los resultados, omitiendo las pantallas informativas previas.
                  </span>
                </Label>
                <Switch id="skipIntroScreens" checked={skipIntroScreens} onCheckedChange={handleSkipIntroChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><KeyRound className="mr-2 h-5 w-5" />{t.securitySettings}</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/settings/change-password">
                    {t.changePasswordButtonLabel}
                  </Link>
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {t.devUtilitiesTitle}
                </CardTitle>
                <CardDescription>
                    Estas opciones son para fines de desarrollo y pueden afectar tu experiencia. Úsalas con precaución.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={handleClearEntries} className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700">
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearEmotionalEntriesButton}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader className="bg-destructive/5 dark:bg-destructive/10">
                <CardTitle className="text-xl flex items-center text-destructive">
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    {t.deleteAccountSectionTitle}
                </CardTitle>
                <CardDescription className="text-destructive/90">
                {t.deleteAccountWarningMessage.split('.')[0]}.
                </CardDescription>
            </CardHeader>
            <CardContent className="bg-destructive/5 dark:bg-destructive/10">
                <Button variant="destructive" asChild>
                <Link href="/settings/delete-account">
                    {t.deleteAccountButtonLabel}
                </Link>
                </Button>
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground w-full text-right pt-4 mt-4 border-t">
            Versión: {appVersion}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
