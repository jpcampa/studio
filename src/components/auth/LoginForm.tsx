
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

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';
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

  // Effect to handle server action state
  useEffect(() => {
    console.log("LoginForm ACTION_EFFECT: state received from server action:", JSON.stringify(state, null, 2).substring(0, 1000) + (JSON.stringify(state, null, 2).length > 1000 ? "..." : ""));
    
    if (state.debugLoginApiUrl) {
      console.log("LoginForm ACTION_EFFECT: Saving debugLoginApiUrl to sessionStorage:", state.debugLoginApiUrl);
      sessionStorage.setItem('workwell-debug-login-url', state.debugLoginApiUrl);
    }

    // Use translated success message for comparison
    const loginSuccessMessageKey = "loginSuccessMessage" as keyof typeof t;
    const expectedSuccessMessage = t[loginSuccessMessageKey] || "Inicio de sesión exitoso.";


    const isLoginSuccessMessage = state.message === expectedSuccessMessage;
    const isUserValid = state.user && typeof state.user.id === 'string' && state.user.id.trim() !== '';

    console.log(`LoginForm ACTION_EFFECT: Checking conditions - isLoginSuccessMessage: ${isLoginSuccessMessage} (Expected: "${expectedSuccessMessage}", Actual: "${state.message}"), isUserValid: ${isUserValid}, User from state:`, state.user);

    if (isLoginSuccessMessage && isUserValid) {
      console.log("LoginForm ACTION_EFFECT: Login success conditions met. Calling loginContext with user:", state.user, "and entries:", state.fetchedEmotionalEntries);
      loginContext({ 
        user: state.user as ContextUser, 
        entries: state.fetchedEmotionalEntries ?? null 
      });
      toast({
        title: t.login,
        description: state.message!, // state.message is confirmed to be success message here
      });
      console.log("LoginForm ACTION_EFFECT: loginContext called and success toast shown.");
      // Redirection is handled by the other useEffect listening to contextUser and userLoading
    } else if (state.message) { 
      console.warn("LoginForm ACTION_EFFECT: Login success conditions NOT met or other message/error. Message:", state.message, "Errors:", state.errors, "User from state:", state.user);
      // Display toast for errors or non-success messages
      if (state.message !== expectedSuccessMessage || !isUserValid) { // If not a true success or user is invalid
        if (!state.errors || Object.keys(state.errors).length === 0 || (state.errors._form && state.errors._form.length > 0)) {
          toast({
            title: t.loginFailed,
            description: state.errors?._form ? state.errors._form[0] : state.message,
            variant: "destructive",
          });
        }
      }
    }

    if (state.errors && (!state.errors._form || state.errors._form.length === 0)) {
      console.warn("LoginForm ACTION_EFFECT: Server action reported specific field validation errors:", state.errors);
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
  }, [state, toast, t, loginContext]); // router removed as it's not used for this effect's logic

  // Effect to handle redirection based on UserContext
   useEffect(() => {
    console.log(
      "LoginForm REDIRECT_EFFECT: Checking redirect. contextUser:", contextUser, 
      "userLoading:", userLoading
    );
    if (!userLoading && contextUser && typeof contextUser.id === 'string' && contextUser.id.trim() !== '') {
      console.log("LoginForm REDIRECT_EFFECT: User context updated. Checking welcome screen status.");
      const welcomeSeen = typeof window !== 'undefined' && localStorage.getItem(WELCOME_SEEN_KEY);
      if (welcomeSeen === 'true') {
        console.log("LoginForm REDIRECT_EFFECT: Welcome screen seen. Redirecting to /dashboard. User ID:", contextUser.id);
        router.push("/dashboard");
      } else {
        console.log("LoginForm REDIRECT_EFFECT: Welcome screen NOT seen. Redirecting to /welcome. User ID:", contextUser.id);
        router.push("/welcome");
      }
    } else {
      console.log("LoginForm REDIRECT_EFFECT: Conditions NOT MET for redirect. No redirect.");
      if (userLoading) console.log("LoginForm REDIRECT_EFFECT: Reason -> userLoading is true.");
      if (!contextUser) console.log("LoginForm REDIRECT_EFFECT: Reason -> contextUser is null or undefined.");
      else if (!contextUser.id || typeof contextUser.id !== 'string' || contextUser.id.trim() === '') {
        console.log("LoginForm REDIRECT_EFFECT: Reason -> contextUser.id is missing, not a string, or empty.");
      }
    }
  }, [contextUser, userLoading, router]);


  if (userLoading && !contextUser) {
    console.log("LoginForm RENDER: UserContext is loading and no user is yet available. Rendering loader.");
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // This condition should ideally prevent the form from rendering if already logged in,
  // as the redirect effect should have already fired.
  if (!userLoading && contextUser) {
    console.log("LoginForm RENDER: User is already loaded and present. Redirect should be happening. Rendering null to avoid form flash.");
    return null;
  }

  console.log("LoginForm RENDER: Rendering login form.");
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

          {state.message && state.message !== (t.loginSuccessMessage || "Inicio de sesión exitoso.") && !state.user && (!state.errors || Object.keys(state.errors).length === 0) && (
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

    