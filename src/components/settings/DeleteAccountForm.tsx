
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

// const SESSION_STORAGE_DELETE_URL_KEY = 'workwell-debug-delete-url'; // No longer needed for display

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
  // const [persistedDebugUrl, setPersistedDebugUrl] = useState<string | null>(null); // No longer needed for display

  // useEffect(() => { // No longer needed for display
  //   const storedUrl = sessionStorage.getItem(SESSION_STORAGE_DELETE_URL_KEY);
  //   if (storedUrl) {
  //     setPersistedDebugUrl(storedUrl);
  //   }
  // }, []);

  useEffect(() => {
    if (!state) return;

    console.log("DeleteAccountForm: Received state from server action:", JSON.stringify(state, null, 2));
    
    if (state.debugDeleteApiUrl) {
      // Still save to session storage for potential debugging, but don't display it.
      sessionStorage.setItem('workwell-debug-delete-url', state.debugDeleteApiUrl);
      // setPersistedDebugUrl(state.debugDeleteApiUrl); // No longer needed for display
    }

    if (state.success && state.message) {
      toast({
        title: t.deleteAccountSuccessTitle,
        description: state.message,
      });
      setTimeout(() => {
        logout(); 
        router.push('/login'); 
      }, 2000);
    } else if (state.message && !state.success) { 
      let errorTitle = t.deleteAccountErrorTitle;
      let errorMessage = state.message;
      if (state.errors?._form?.length) {
        errorMessage = state.errors._form[0];
      } else if (state.errors?.email?.length) { 
         errorTitle = t.errorOccurred;
         errorMessage = state.errors.email[0];
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } else if (!state.success && state.errors && Object.keys(state.errors).length > 0 && !state.errors._form?.length) {
      if (state.errors.email?.length) {
          toast({ title: t.errorOccurred, description: state.errors.email[0], variant: "destructive" });
      }
    }
  }, [state, logout, router, toast, t]);
  
  const handleDialogTrigger = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    setIsAlertDialogOpen(true); 
  };

  const handleConfirmDelete = () => {
    const form = document.getElementById("actual-delete-form") as HTMLFormElement | null;
    if (form) {
        form.requestSubmit();
    }
    setIsAlertDialogOpen(false);
  };
  
  // const handleClearDebugUrl = () => { // No longer needed for display
  //   sessionStorage.removeItem(SESSION_STORAGE_DELETE_URL_KEY);
  //   setPersistedDebugUrl(null); 
  //   toast({ title: "URL de prueba eliminada", description: "La URL para la baja ha sido eliminada de sessionStorage." });
  // };

  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/login'); 
    return null;
  }
  
  // const displayDebugUrl = state.debugDeleteApiUrl || persistedDebugUrl; // No longer displayed

  return (
    <>
      <form id="actual-delete-form" action={formAction} className="hidden">
      </form>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={handleDialogTrigger}
            variant="destructive"
            className="w-full"
            disabled={useFormStatus().pending} 
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
            <AlertDialogAction onClick={handleConfirmDelete} asChild>
              <form action={formAction}> 
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

      {/* REMOVED DEBUG URL DISPLAY SECTION 
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
      */}
    </>
  );
}
