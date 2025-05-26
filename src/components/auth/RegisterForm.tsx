
"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es requerido."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  initialEmotionalState: z.number().min(1).max(5).optional().default(3),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const initialState = {
  message: null,
  errors: {},
  // user field is no longer needed here
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t.loading : t.register}
    </Button>
  );
}

export function RegisterForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const { user: contextUser, loading: userLoading } = useUser();
  const [state, formAction] = useActionState(registerUser, initialState);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      initialEmotionalState: 3,
      agreeTerms: false,
    },
  });

  useEffect(() => {
    // Redirect if user is already logged in and not loading
    if (!userLoading && contextUser) {
      router.push("/dashboard");
    }
  }, [contextUser, userLoading, router]);

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith("Registro exitoso")) {
        toast({
          title: t.registrationSuccessTitle,
          description: state.message,
        });
        // User will be redirected by onAuthStateChanged or if they manually go to login
        // router.push("/login"); // Or directly to dashboard if auto-login is desired and handled by Firebase
      } else {
        toast({
          title: t.errorOccurred,
          description: state.message,
          variant: "destructive",
        });
      }
    }
    if (state.errors && Object.keys(state.errors).length > 0) {
       Object.values(state.errors).flat().forEach(error => {
         if (typeof error === 'string') {
            toast({
              title: "Error de validación",
              description: error,
              variant: "destructive",
            });
          }
      });
    }
  }, [state, toast, router, t]);
  
  const ageRanges = [
    { value: "under_18", label: t.age_under_18 },
    { value: "18_24", label: t.age_18_24 },
    { value: "25_34", label: t.age_25_34 },
    { value: "35_44", label: t.age_35_44 },
    { value: "45_54", label: t.age_45_54 },
    { value: "55_64", label: t.age_55_64 },
    { value: "65_plus", label: t.age_65_plus },
  ];

  const genders = [
    { value: "male", label: t.gender_male },
    { value: "female", label: t.gender_female },
    { value: "non_binary", label: t.gender_non_binary },
    { value: "other", label: t.gender_other },
    { value: "prefer_not_to_say", label: t.gender_prefer_not_to_say },
  ];

  // Prevent rendering form if user is already logged in (or loading)
  if (userLoading || (!userLoading && contextUser)) {
      return null; // Or a loader
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{t.register}</CardTitle>
        <CardDescription>{t.welcomeToWorkWell}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div>
            <Label htmlFor="name">{t.name}</Label>
            <Input id="name" name="name" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" required />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div>
            <Label htmlFor="password">{t.password}</Label>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
          </div>
          <div>
            <Label htmlFor="ageRange">{t.ageRange}</Label>
            <Select name="ageRange" onValueChange={(value) => form.setValue('ageRange', value)}>
              <SelectTrigger id="ageRange">
                <SelectValue placeholder={t.ageRangePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map(range => <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>)}
              </SelectContent>
            </Select>
             {state.errors?.ageRange && <p className="text-sm text-destructive">{state.errors.ageRange[0]}</p>}
          </div>
          <div>
            <Label htmlFor="gender">{t.gender}</Label>
            <Select name="gender" onValueChange={(value) => form.setValue('gender', value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder={t.genderPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {genders.map(gender => <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {state.errors?.gender && <p className="text-sm text-destructive">{state.errors.gender[0]}</p>}
          </div>
          <div>
            <Label htmlFor="initialEmotionalState">{t.initialEmotionalState}: {form.watch('initialEmotionalState')}</Label>
            <Input type="hidden" name="initialEmotionalState" value={form.watch('initialEmotionalState')} />
            <Slider
              id="initialEmotionalStateSlider" // Changed id to avoid conflict with hidden input
              min={1} max={5} step={1}
              defaultValue={[form.getValues('initialEmotionalState') || 3]}
              onValueChange={(value) => form.setValue('initialEmotionalState', value[0])}
            />
            {state.errors?.initialEmotionalState && <p className="text-sm text-destructive">{state.errors.initialEmotionalState[0]}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agreeTerms" 
              name="agreeTerms" 
              onCheckedChange={(checked) => form.setValue('agreeTerms', checked as boolean)}
              checked={form.watch('agreeTerms')}
            />
            <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground">{t.agreeToTerms}</Label>
          </div>
           {state.errors?.agreeTerms && <p className="text-sm text-destructive">{state.errors.agreeTerms[0]}</p>}
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.login}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
