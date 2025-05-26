
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
import { loginUser, type LoginState, type ActionUser } from "@/actions/auth"; // Import LoginState and ActionUser
import { useUser, type User as ContextUser } from "@/contexts/UserContext"; // Import User from context for type consistency
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const initialState: LoginState = { // Use LoginState type from actions
  message: null,
  errors: {},
  user: null,
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
  const { user: contextUser, loading: userLoading, login: loginContext } = useUser(); // Get login from context
  const router = useRouter();
  const [state, formAction] = useActionState(loginUser, initialState);

  useEffect(() => {
    console.log("LoginForm useEffect (Mount/UserUpdate): contextUser:", contextUser, "userLoading:", userLoading);
    if (!userLoading && contextUser) {
      console.log("LoginForm: User detected (from UserContext), redirecting to /dashboard");
      router.push("/dashboard");
    } else {
      console.log("LoginForm: No user in UserContext or still loading, not redirecting. Conditions: !userLoading =", !userLoading, "contextUser =", !!contextUser);
    }
  }, [contextUser, userLoading, router]);

  useEffect(() => {
    console.log("LoginForm useEffect (ActionState Update): state received from server action:", JSON.stringify(state, null, 2));
    if (state.message) {
      if (state.message === "Inicio de sesión exitoso." && state.user) {
        // Ensure the user object from action is compatible with UserContext's User type
        // This might require casting or ensuring ActionUser and ContextUser are structurally compatible
        loginContext(state.user as ContextUser); // Call context's login method
        toast({
          title: t.login,
          description: state.message,
        });
        console.log("LoginForm: Server action reported successful login. User set in context.");
        // Redirection is handled by the other useEffect monitoring contextUser
      } else if (state.message !== "Inicio de sesión exitoso.") {
        // Handle login failures or other messages
        toast({
          title: t.loginFailed,
          description: state.message,
          variant: "destructive",
        });
        console.error("LoginForm: Server action reported login failure or other message. Message:", state.message);
      }
    }
    if (state.errors && Object.keys(state.errors).length > 0) {
      console.error("LoginForm: Server action reported validation errors:", state.errors);
      Object.entries(state.errors).forEach(([key, fieldErrors]) => {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(error => {
            if (typeof error === 'string') {
              toast({
                title: `Error en ${key === '_form' ? 'formulario' : key}`,
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
          {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form[0]}</p>}
          {state.message && state.message !== "Inicio de sesión exitoso." && !state.errors?.password && !state.errors?.email && !state.errors?._form && (
            <p className="text-sm text-destructive">{state.message}</p>
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
