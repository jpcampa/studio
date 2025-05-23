"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
  user: null,
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
  const { login: contextLogin, user: contextUser } = useUser();
  const router = useRouter();
  const [state, formAction] = useFormState(loginUser, initialState);

  useEffect(() => {
    if (contextUser) {
      router.push("/dashboard");
    }
  }, [contextUser, router]);

  useEffect(() => {
    if (state.message) {
      if (state.user) {
        toast({
          title: t.login,
          description: state.message,
        });
        contextLogin(state.user); // Update context
        router.push("/dashboard");
      } else {
        toast({
          title: t.loginFailed,
          description: state.message,
          variant: "destructive",
        });
      }
    }
     if (state.errors) {
       Object.values(state.errors).flat().forEach(error => {
        toast({
          title: "Error de validación",
          description: error as string,
          variant: "destructive",
        });
      });
    }
  }, [state, toast, contextLogin, router, t]);

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
