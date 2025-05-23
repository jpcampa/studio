"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations();
  const { user, updateUser, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('es'); // Default to Spanish for V1
  
  // Mock notification preferences
  const [dailyCheckIn, setDailyCheckIn] = useState(true);
  const [moduleReminders, setModuleReminders] = useState(true);
  const [motivationalQuotes, setMotivationalQuotes] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAgeRange(user.ageRange || '');
      setGender(user.gender || '');
    }
  }, [user]);
  
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


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateUser({ name, email, ageRange, gender });
    // In a real app, also save notification preferences and language.
    setIsSaving(false);
    toast({
      title: "Configuración Guardada",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  if (userLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{t.settingsTitle}</CardTitle>
          <CardDescription>{t.personalInformation}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ageRange">{t.ageRange}</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger id="ageRange"><SelectValue placeholder={t.ageRangePlaceholder} /></SelectTrigger>
                  <SelectContent>
                    {ageRanges.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender">{t.gender}</Label>
                 <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender"><SelectValue placeholder={t.genderPlaceholder} /></SelectTrigger>
                  <SelectContent>
                    {genders.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 border-t pt-8">
              <h3 className="text-xl font-semibold text-accent">{t.language}</h3>
              <Select value={language} onValueChange={setLanguage} disabled> {/* Language change not implemented for V1 */}
                <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  {/* Add other languages here when supported */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 border-t pt-8">
              <h3 className="text-xl font-semibold text-accent">{t.notificationPreferences}</h3>
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
            </div>

            <div className="border-t pt-8">
                <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t.saveChanges}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
