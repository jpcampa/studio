
"use client";

import { useEffect, useState } from "react"; 
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { loginUser, type LoginState } from "@/actions/auth";
import { useUser, type User as ContextUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, ShieldQuestion } from "lucide-react"; 

const initialState: LoginState = {
  message: null,
  errors: {},
  user: null,
  debugLoginApiUrl: undefined,
  fetchedEmotionalEntries: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.login}
    </Button>
  );
}

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user: contextUser, loading: userLoading, login: loginContext } = useUser();
  const router = useRouter();
  const [state, formAction] = useActionState(loginUser, initialState);
  const [showPassword, setShowPassword] = useState(false); 

  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    console.log("LoginForm useEffect (Mount/UserUpdate): contextUser:", contextUser, "userLoading:", userLoading);
    if (!userLoading && contextUser) {
      console.log("LoginForm: User detected (from UserContext), redirecting to /dashboard");
      router.push("/dashboard");
    }
  }, [contextUser, userLoading, router]);

  useEffect(() => {
    console.log("LoginForm useEffect (ActionState Update): state received from server action:", JSON.stringify(state, null, 2).substring(0, 500) + (JSON.stringify(state, null, 2).length > 500 ? "..." : ""));
    
    if (state.debugLoginApiUrl) {
      console.log("LoginForm: Saving debugLoginApiUrl to sessionStorage:", state.debugLoginApiUrl);
      sessionStorage.setItem('workwell-debug-login-url', state.debugLoginApiUrl);
    }

    if (state.message) {
      if (state.message === "Inicio de sesión exitoso." && state.user) {
        loginContext({ 
          user: state.user as ContextUser, 
          entries: state.fetchedEmotionalEntries ?? null 
        });
        toast({
          title: t.login,
          description: state.message,
        });
        console.log("LoginForm: Server action reported successful login. User and emotional entries (if any) set in context.");
      } else if (state.message !== "Inicio de sesión exitoso.") {
        if (!state.errors || Object.keys(state.errors).length === 0 || (state.errors._form && state.errors._form.length > 0)) {
          toast({
            title: t.loginFailed,
            description: state.errors?._form ? state.errors._form[0] : state.message,
            variant: "destructive",
          });
        }
        console.warn("LoginForm: Server action reported login failure or other message. Message:", state.message, "Errors:", state.errors);
      }
    }

    if (state.errors && (!state.errors._form || state.errors._form.length === 0)) {
      console.warn("LoginForm: Server action reported validation errors:", state.errors);
      Object.entries(state.errors).forEach(([key, fieldErrors]) => {
        if (key !== '_form' && Array.isArray(fieldErrors)) {
          fieldErrors.forEach(error => {
            if (typeof error === 'string') {
              toast({
                title: `Error en ${t[key as keyof typeof t] || key}`,
                description: error,
                variant: "destructive",
              });
            }
          });
        }
      });
    }
  }, [state, toast, t, loginContext, router]);


  if (userLoading && !contextUser) {
    console.log("LoginForm: Rendering loader because UserContext is loading and no user is yet available.");
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userLoading && contextUser) {
    console.log("LoginForm: Rendering null because user is already loaded and present (should have been/be redirecting).");
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
            {state.errors?.email && <p className="text-sm text-destructive pt-1">{state.errors.email[0]}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.password}</Label>
              <Link href="#" className="text-sm text-primary hover:underline">
                {t.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10" 
              />
              <Button
                type="button"
                variant="ghost"
                size="sm" 
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-muted-foreground hover:text-primary"
                onClick={toggleShowPassword}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            {state.errors?.password && <p className="text-sm text-destructive pt-1">{state.errors.password[0]}</p>}
          </div>

          {state.errors?._form && (
            <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.errors._form[0]}</p>
          )}

          {state.message && state.message !== "Inicio de sesión exitoso." && !state.user && (!state.errors || Object.keys(state.errors).length === 0) && (
            <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.message}</p>
          )}

          {state.debugLoginApiUrl && (
            <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg shadow">
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 flex items-center mb-1">
                <ShieldQuestion className="mr-2 h-4 w-4" />
                Debug: URL de API de Login Generada
              </p>
              <pre className="text-xs text-yellow-600 dark:text-yellow-400 overflow-x-auto whitespace-pre-wrap break-all bg-yellow-100 dark:bg-yellow-800/30 p-2 rounded-md shadow-inner">
                <code>{state.debugLoginApiUrl}</code>
              </pre>
            </div>
          )}
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

