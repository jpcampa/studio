
"use client";

import { useActionState, useState, useEffect, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { deleteUserAccount, type DeleteAccountState } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, ShieldQuestion } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialState: DeleteAccountState = {
  message: null,
  errors: {},
  success: false,
  debugDeleteApiUrl: undefined,
};

const SESSION_STORAGE_DELETE_URL_KEY = 'workwell-debug-delete-url';

function ActualSubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button variant="destructive" className="w-full" disabled={pending} type="submit">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
      {t.confirmDeleteAccountButton}
    </Button>
  );
}

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, logout, loading: userLoading } = useUser();
  const router = useRouter();

  const deleteUserAccountWithEmail = deleteUserAccount.bind(null, user?.email || "");
  
  const [state, formAction] = useActionState(deleteUserAccountWithEmail, initialState);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [persistedDebugUrl, setPersistedDebugUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUrl = sessionStorage.getItem(SESSION_STORAGE_DELETE_URL_KEY);
    if (storedUrl) {
      setPersistedDebugUrl(storedUrl);
    }
  }, []);

  useEffect(() => {
    if (!state) return;

    console.log("DeleteAccountForm: Received state from server action:", JSON.stringify(state, null, 2));
    
    if (state.debugDeleteApiUrl) {
      sessionStorage.setItem(SESSION_STORAGE_DELETE_URL_KEY, state.debugDeleteApiUrl);
      setPersistedDebugUrl(state.debugDeleteApiUrl); 
    }

    if (state.success && state.message) {
      toast({
        title: t.deleteAccountSuccessTitle,
        description: state.message,
      });
      // Wait a bit for the toast to be visible before logging out and redirecting
      setTimeout(() => {
        logout(); 
        router.push('/login'); 
      }, 1500);
    } else if (state.message && !state.success) { // Only show error toast if not successful
      let errorTitle = t.deleteAccountErrorTitle;
      let errorMessage = state.message;
      if (state.errors?._form?.length) {
        errorMessage = state.errors._form[0];
      } else if (state.errors?.email?.length) { // Though email error is less likely here
         errorTitle = t.errorOccurred;
         errorMessage = state.errors.email[0];
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } else if (!state.success && state.errors && Object.keys(state.errors).length > 0 && !state.errors._form?.length) {
      // Fallback for field errors if no state.message or _form error (less likely for this action)
      if (state.errors.email?.length) {
          toast({ title: t.errorOccurred, description: state.errors.email[0], variant: "destructive" });
      }
    }
  }, [state, logout, router, toast, t]);
  
  const handleDialogTrigger = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent any default form submission if this button were inside a form
    setIsAlertDialogOpen(true); 
  };

  // This is the function that will be called when the user confirms in the dialog
  const handleConfirmDelete = () => {
     // Programmatically submit the form
     // This will ensure useFormStatus().pending is true for ActualSubmitButton
    const form = document.getElementById("actual-delete-form") as HTMLFormElement | null;
    if (form) {
        // Instead of form.requestSubmit(), directly call formAction
        // This is because requestSubmit() might not work as expected with useActionState
        // if the button triggering it is not the direct submit button of THAT form.
        // However, since ActualSubmitButton IS the submit button, this should be fine.
        // Let's keep requestSubmit for now as it's more standard for triggering <form action>
        form.requestSubmit();
    }
    setIsAlertDialogOpen(false);
  };
  
  const handleClearDebugUrl = () => {
    sessionStorage.removeItem(SESSION_STORAGE_DELETE_URL_KEY);
    setPersistedDebugUrl(null); 
    toast({ title: "URL de prueba eliminada", description: "La URL para la baja ha sido eliminada de sessionStorage." });
  };

  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/login'); // Should not happen if layout protects page, but good fallback
    return null;
  }
  
  const displayDebugUrl = state.debugDeleteApiUrl || persistedDebugUrl;

  return (
    <>
      {/* This is the actual form that will be submitted by the dialog's confirm button */}
      <form id="actual-delete-form" action={formAction} className="hidden">
        {/* We can add a visually hidden submit button here if needed for some browsers,
            but requestSubmit() on the form itself should work.
            The ActualSubmitButton below will be used inside the dialog, but its
            formaction is effectively tied to this form via useActionState.
        */}
      </form>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={handleDialogTrigger}
            variant="destructive"
            className="w-full"
            disabled={useFormStatus().pending} // Disable if an action is already pending (outer form context)
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.deleteAccountButtonLabel} 
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteAccountPageTitle}</AlertDialogTitle>
            <AlertDialogDescription className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
              {t.deleteAccountWarningMessage}
              <br/><br/>
              <strong>{t.deleteAccountConfirmationPrompt}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancelDeleteAccountButton}</AlertDialogCancel>
            {/* This AlertDialogAction will now effectively submit the form through handleConfirmDelete */}
            <AlertDialogAction onClick={handleConfirmDelete} asChild>
               {/* ActualSubmitButton will pick up pending state from the formAction it's part of */}
              <form action={formAction}> {/* Wrap button in a form to correctly use useFormStatus */}
                <ActualSubmitButton />
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {state.errors?._form && (
        <p className="mt-4 text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md text-center">{state.errors._form[0]}</p>
      )}
      
      {state.message && !state.success && !state.errors?._form?.length && (
         <p className="mt-4 text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md text-center">{state.message}</p>
      )}

      {displayDebugUrl && (
        <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 flex items-center mb-2">
            <ShieldQuestion className="mr-2 h-5 w-5" />
            Debug: URL de API de Baja Generada
          </p>
          <pre className="text-xs text-yellow-600 dark:text-yellow-400 overflow-x-auto whitespace-pre-wrap break-all bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-md shadow-inner">
            <code>{displayDebugUrl}</code>
          </pre>
          <Button variant="outline" size="sm" onClick={handleClearDebugUrl} className="mt-3 border-yellow-500 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-800/50">
            <Trash2 className="mr-2 h-4 w-4" /> Limpiar URL de Depuración Persistente
          </Button>
        </div>
      )}
    </>
  );
}
