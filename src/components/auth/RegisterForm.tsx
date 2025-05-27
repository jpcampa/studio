
"use client";

import { useEffect, useState } from "react"; 
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { registerUser, type RegisterState } from "@/actions/auth"; 
import { useRouter } from "next/navigation";
import { useUser, type User as ContextUser } from "@/contexts/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";


const initialState: RegisterState = { 
  message: null,
  errors: {},
  user: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.register}
    </Button>
  );
}

export function RegisterForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const { user: contextUser, loading: userLoading, login: loginContext } = useUser();
  const [state, formAction] = useActionState(registerUser, initialState);

  const [localInitialEmotionalState, setLocalInitialEmotionalState] = useState(3);
  const [localAgreeTerms, setLocalAgreeTerms] = useState(false);


  useEffect(() => {
    if (!userLoading && contextUser) {
      console.log("RegisterForm: User detected in UserContext, redirecting to /dashboard");
      router.push("/dashboard");
    } else {
      console.log("RegisterForm: No user in UserContext or still loading. Conditions: !userLoading =", !userLoading, "contextUser =", !!contextUser);
    }
  }, [contextUser, userLoading, router]);

  useEffect(() => {
    console.log("RegisterForm useEffect (ActionState Update): state received from server action:", JSON.stringify(state, null, 2));
    if (state.message) {
      if (state.user && state.message === "Registro exitoso. Serás redirigido.") { 
        loginContext(state.user as ContextUser); 
        toast({
          title: t.registrationSuccessTitle,
          description: state.message,
        });
        console.log("RegisterForm: Server action reported successful registration. User set in context via loginContext.");
        // Redirection to dashboard will be handled by the other useEffect watching contextUser
      } else if (state.message === "Registro simulado exitoso. Por favor, inicia sesión.") { 
         toast({
          title: t.registrationSuccessTitle,
          description: state.message,
        });
        console.log("RegisterForm: Server action reported successful SIMULATED registration (old flow, should be less common now).");
      } else if (state.errors && Object.keys(state.errors).length > 0) {
        toast({
          title: t.errorOccurred,
          description: state.message || "Error de validación.", // Use state.message if available
          variant: "destructive",
        });
        console.error("RegisterForm: Server action reported general error message with field errors. Message:", state.message, "Errors:", state.errors);
      } else if (!state.user && state.message !== "Registro simulado exitoso. Por favor, inicia sesión.") {
        toast({
          title: t.errorOccurred,
          description: state.message,
          variant: "destructive",
        });
        console.error("RegisterForm: Server action reported general error message. Message:", state.message);
      }
    }
    
    if (state.errors && Object.keys(state.errors).length > 0) {
      console.error("RegisterForm: Server action reported validation errors:", state.errors);
      Object.entries(state.errors).forEach(([key, fieldErrors]) => {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(error => {
            if (typeof error === 'string') { 
              toast({
                title: `Error en ${key === '_form' ? 'formulario' : t[key as keyof typeof t] || key}`,
                description: error,
                variant: "destructive",
              });
            }
          });
        }
      });
    }
  }, [state, toast, router, t, loginContext]);

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

  if (userLoading && !contextUser) {
    console.log("RegisterForm: Rendering loader because UserContext is loading and no user is yet available.");
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userLoading && contextUser) {
    console.log("RegisterForm: Rendering null because user is already loaded and present (should have been/be redirecting).");
    return null; 
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
            <Select name="ageRange" >
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
            <Select name="gender">
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
            <Label htmlFor="initialEmotionalStateSlider">{t.initialEmotionalState}: {localInitialEmotionalState}</Label>
            <input type="hidden" name="initialEmotionalState" value={localInitialEmotionalState} />
            <Slider
              id="initialEmotionalStateSlider"
              min={1} max={5} step={1}
              defaultValue={[localInitialEmotionalState]}
              onValueChange={(value) => setLocalInitialEmotionalState(value[0])}
              className="mt-2"
            />
            {state.errors?.initialEmotionalState && <p className="text-sm text-destructive">{state.errors.initialEmotionalState[0]}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              name="agreeTerms"
              checked={localAgreeTerms}
              onCheckedChange={(checked) => setLocalAgreeTerms(checked as boolean)}
            />
            <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground">{t.agreeToTerms}</Label>
          </div>
           {state.errors?.agreeTerms && <p className="text-sm text-destructive">{state.errors.agreeTerms[0]}</p>}
           {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form[0]}</p>}
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
