
"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
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
  const { user, loading: userLoading, logout } = useUser(); 
  const router = useRouter(); 

  const changePasswordWithEmail = changePassword.bind(null, user?.email || "");
  const [state, formAction] = useActionState(changePasswordWithEmail, initialState);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (!state) {
        console.warn("ChangePasswordForm: state from useActionState is null or undefined.");
        return; 
    }
    console.log("ChangePasswordForm: Received state from server action:", JSON.stringify(state, null, 2));

    if (state.debugChangePasswordApiUrl) {
      sessionStorage.setItem(SESSION_STORAGE_CHANGE_PASSWORD_URL_KEY, state.debugChangePasswordApiUrl);
    }

    if (state.success && state.message) {
      toast({
        title: t.passwordChangedSuccessTitle,
        description: state.message,
      });
      setTimeout(() => {
        logout(); 
        router.push('/login'); 
      }, 2000); 
    } else if (state.message) {
        let errorTitle = t.passwordChangeErrorTitle;
        let errorMessage = state.message;
        let errorVariant: "destructive" | "default" = "destructive";

        if (state.errors?._form?.length) {
            errorMessage = state.errors._form[0];
        } else if (state.errors?.newPassword?.length) {
            errorTitle = t.errorOccurred; 
            errorMessage = state.errors.newPassword[0];
        } else if (state.errors?.confirmNewPassword?.length) {
            errorTitle = t.errorOccurred; 
            errorMessage = state.errors.confirmNewPassword[0];
        }
        
        if (!state.success) { 
            toast({
                title: errorTitle,
                description: errorMessage,
                variant: errorVariant,
            });
        }
    } else if (!state.success && state.errors && Object.keys(state.errors).length > 0) {
        if (state.errors?.newPassword?.length) {
            toast({ title: t.errorOccurred, description: state.errors.newPassword[0], variant: "destructive" });
        }
        if (state.errors?.confirmNewPassword?.length) {
            toast({ title: t.errorOccurred, description: state.errors.confirmNewPassword[0], variant: "destructive" });
        }
    }
  }, [state, toast, t, router, logout]);

  if (userLoading && !user) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) { 
    router.push('/login');
    return null;
  }

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
            aria-describedby={state?.errors?.newPassword ? "newPassword-error" : undefined}
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
        {state?.errors?.newPassword && <p id="newPassword-error" className="text-sm text-destructive pt-1">{state.errors.newPassword[0]}</p>}
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
            aria-describedby={state?.errors?.confirmNewPassword ? "confirmNewPassword-error" : undefined}
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
        {state?.errors?.confirmNewPassword && <p id="confirmNewPassword-error" className="text-sm text-destructive pt-1">{state.errors.confirmNewPassword[0]}</p>}
      </div>
      
      {state?.errors?._form && (
        <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.errors._form[0]}</p>
      )}

       {state?.message && !state.success && !state.errors?._form?.length && state.message !== t.validationError && 
        (!state.errors?.newPassword?.length && !state.errors?.confirmNewPassword?.length) && (
        <p className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}

    