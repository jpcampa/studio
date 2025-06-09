
"use client";

import { useActionState, useState, useEffect, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { Eye, EyeOff, Loader2, Save, ShieldQuestion } from "lucide-react";
import { changePassword, type ChangePasswordState } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const initialState: ChangePasswordState = { 
  errors: {}, 
  message: null, 
  success: false,
  debugChangePasswordApiUrl: undefined,
};

const SESSION_STORAGE_CHANGE_PASSWORD_URL_KEY = 'workwell-debug-change-password-url';


function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {t.saveChanges}
    </Button>
  );
}

export function ChangePasswordForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  // Bind userEmail to the action
  const changePasswordWithEmail = changePassword.bind(null, user?.email || "");
  const [state, formAction] = useActionState(changePasswordWithEmail, initialState);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [persistedDebugUrl, setPersistedDebugUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUrl = sessionStorage.getItem(SESSION_STORAGE_CHANGE_PASSWORD_URL_KEY);
    if (storedUrl) {
      setPersistedDebugUrl(storedUrl);
    }
  }, []);

  useEffect(() => {
    if (state.debugChangePasswordApiUrl) {
      sessionStorage.setItem(SESSION_STORAGE_CHANGE_PASSWORD_URL_KEY, state.debugChangePasswordApiUrl);
      setPersistedDebugUrl(state.debugChangePasswordApiUrl);
    }

    if (state.message) {
      if (state.success) {
        toast({
          title: t.passwordChangedSuccessTitle,
          description: state.message,
        });
        // Optionally, redirect or clear form here
        // router.push("/settings"); 
      } else {
        // Show general form error if present
        if (state.errors?._form && state.errors._form.length > 0) {
          toast({
            title: t.passwordChangeErrorTitle,
            description: state.errors._form[0],
            variant: "destructive",
          });
        } 
        // Show field-specific errors (if not already covered by _form error toast)
        // This handles cases where Zod validation provides specific messages for fields.
        else if (!state.errors?._form || state.errors._form.length === 0) {
            let specificErrorShown = false;
            if (state.errors?.newPassword?.[0]) {
                 toast({ title: t.errorOccurred, description: state.errors.newPassword[0], variant: "destructive" });
                 specificErrorShown = true;
            }
            if (state.errors?.confirmNewPassword?.[0]) {
                 toast({ title: t.errorOccurred, description: state.errors.confirmNewPassword[0], variant: "destructive" });
                 specificErrorShown = true;
            }
            // If there's a general message and no specific field errors were shown by toast, show the general message.
            if (!specificErrorShown && state.message !== t.validationError ) { // t.validationError is a general Zod message
                 toast({ title: t.passwordChangeErrorTitle, description: state.message, variant: "destructive"});
            }
        }
      }
    }
  }, [state, toast, t, router]);


  if (userLoading && !user) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) { // Should be redirected by layout if not loading and no user, but as a safeguard
    router.push('/login');
    return null;
  }

  const displayDebugUrl = state.debugChangePasswordApiUrl || persistedDebugUrl;

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="newPassword">{t.newPasswordLabel}</Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword" 
            type={showNewPassword ? "text" : "password"}
            required
            minLength={6}
            className="pr-10"
            aria-describedby={state.errors?.newPassword ? "newPassword-error" : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-muted-foreground hover:text-primary"
            onClick={() => setShowNewPassword(!showNewPassword)}
            aria-label={showNewPassword ? t.hidePassword : t.showPassword}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        {state.errors?.newPassword && <p id="newPassword-error" className="text-sm text-destructive pt-1">{state.errors.newPassword[0]}</p>}
      </div>
      <div>
        <Label htmlFor="confirmNewPassword">{t.confirmNewPasswordLabel}</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword" 
            type={showConfirmNewPassword ? "text" : "password"}
            required
            minLength={6}
            className="pr-10"
            aria-describedby={state.errors?.confirmNewPassword ? "confirmNewPassword-error" : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-muted-foreground hover:text-primary"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            aria-label={showConfirmNewPassword ? t.hidePassword : t.showPassword}
          >
            {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        {state.errors?.confirmNewPassword && <p id="confirmNewPassword-error" className="text-sm text-destructive pt-1">{state.errors.confirmNewPassword[0]}</p>}
      </div>
      
      {state.errors?._form && (
        <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.errors._form[0]}</p>
      )}

      {/* Display general message if it's an error and not already handled by field errors */}
       {state.message && !state.success && (!state.errors || Object.keys(state.errors).length === 0 || (!state.errors._form && !state.errors.newPassword && !state.errors.confirmNewPassword)) && (
        <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.message}</p>
      )}

      {displayDebugUrl && (
        <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg shadow">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 flex items-center mb-1">
            <ShieldQuestion className="mr-2 h-4 w-4" />
            Debug: URL de API de Cambio de Contraseña Generada
            </p>
            <pre className="text-xs text-yellow-600 dark:text-yellow-400 overflow-x-auto whitespace-pre-wrap break-all bg-yellow-100 dark:bg-yellow-800/30 p-2 rounded-md shadow-inner">
            <code>{displayDebugUrl}</code>
            </pre>
        </div>
      )}
      <SubmitButton />
    </form>
  );
}
