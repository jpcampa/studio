
"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { loginUser } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


const initialState = {
  message: null,
  errors: {},
  // user field is no longer needed here as Firebase handles auth state
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t.loading : t.login}
    </Button>
  );
}

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user: contextUser, loading: userLoading } = useUser(); // Use contextUser and userLoading
  const router = useRouter();
  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    console.log("LoginForm useEffect: contextUser:", contextUser, "userLoading:", userLoading);
    // Redirect if user is already logged in and not loading
    if (!userLoading && contextUser) {
      console.log("LoginForm: Redirecting to /dashboard");
      router.push("/dashboard");
    } else {
      console.log("LoginForm: Not redirecting. Conditions: !userLoading =", !userLoading, "contextUser =", !!contextUser);
    }
  }, [contextUser, userLoading, router]);

  useEffect(() => {
    if (state.message) {
      if (state.message === "Inicio de sesión exitoso.") { // Check for success message
        toast({
          title: t.login,
          description: state.message,
        });
        // No need to call contextLogin, onAuthStateChanged will handle it
        // Router push will also be handled by onAuthStateChanged redirecting or MainAppLayout
      } else {
        toast({
          title: t.loginFailed,
          description: state.message,
          variant: "destructive",
        });
      }
    }
     if (state.errors && Object.keys(state.errors).length > 0) {
       Object.values(state.errors).flat().forEach(error => {
        if (typeof error === 'string') { // Ensure error is a string
          toast({
            title: "Error de validación",
            description: error,
            variant: "destructive",
          });
        }
      });
    }
  }, [state, toast, t]);

  // Prevent rendering form if user is already logged in (or loading)
  // but allow rendering if loading is true BUT user is null (initial load state)
  if (userLoading && contextUser) { // Only hide if loading AND we already have a user (meaning it's not initial load)
      console.log("LoginForm: Rendering null because userLoading is true and contextUser exists.");
      return null; 
  }

  return (
     <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{t.login}</CardTitle>
         <CardDescription>{t.welcomeToWorkWell}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" placeholder="tu@ejemplo.com" required />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.password}</Label>
              <Link href="#" className="text-sm text-primary hover:underline">
                {t.forgotPassword}
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
         <p className="text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t.register}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
