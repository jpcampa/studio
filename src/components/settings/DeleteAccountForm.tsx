
"use client";

import { useActionState, useState, useEffect, FormEvent } from "react"; // Added useEffect and FormEvent
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

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button
      type="submit" // Changed from "button" to "submit"
      variant="destructive"
      className="w-full"
      disabled={pending}
      // onClick is removed as form submission handles it
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
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
  const [lastGeneratedDeleteApiUrl, setLastGeneratedDeleteApiUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUrl = sessionStorage.getItem(SESSION_STORAGE_DELETE_URL_KEY);
    if (storedUrl) {
      setLastGeneratedDeleteApiUrl(storedUrl);
    }
  }, []);

  useEffect(() => {
    if (state.debugDeleteApiUrl) {
      sessionStorage.setItem(SESSION_STORAGE_DELETE_URL_KEY, state.debugDeleteApiUrl);
      setLastGeneratedDeleteApiUrl(state.debugDeleteApiUrl);
    }

    if (state.success && state.message) {
      toast({
        title: t.deleteAccountSuccessTitle,
        description: state.message,
      });
      logout(); 
      router.push('/login'); 
    } else if (!state.success && state.message && (!state.errors || Object.keys(state.errors).length === 0)) {
      toast({
        title: t.deleteAccountErrorTitle,
        description: state.message,
        variant: "destructive",
      });
      // Consider not clearing the message here to allow it to be shown with the debug URL
      // state.message = null; 
    } else if (state.errors?._form) {
       toast({
          title: t.deleteAccountErrorTitle,
          description: state.errors._form[0],
          variant: "destructive",
        });
        // state.errors._form = undefined; 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, logout, router, toast, t]); // Removed state.message, state.errors to avoid loop with toast resetting

  const handleFormSubmitWrapper = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsAlertDialogOpen(true); // Open the dialog for confirmation
  };

  const actualFormSubmit = () => {
    // Programmatically submit the form by its ID
    const form = document.getElementById("actual-delete-form") as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    }
    setIsAlertDialogOpen(false); // Close dialog after initiating submit
  };
  
  const handleClearDebugUrl = () => {
    sessionStorage.removeItem(SESSION_STORAGE_DELETE_URL_KEY);
    setLastGeneratedDeleteApiUrl(null);
    toast({ title: "URL de prueba eliminada", description: "La URL para la baja ha sido eliminada de sessionStorage." });
  };

  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <>
      {/* Form now wraps the AlertDialogTrigger and is submitted programmatically */}
      <form onSubmit={handleFormSubmitWrapper} id="actual-delete-form" action={formAction}>
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="submit" // This button now triggers the form's onSubmit, which opens the dialog
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t.confirmDeleteAccountButton} 
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
              {/* AlertDialogAction now calls actualFormSubmit */}
              <AlertDialogAction onClick={actualFormSubmit} asChild>
                 {/* The SubmitButton component is now directly used here */}
                 {/* We need to use a standard Button here, and the formAction will be handled by the form itself */}
                 <Button variant="destructive" className="w-full" disabled={useFormStatus().pending}>
                    {useFormStatus().pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    {t.confirmDeleteAccountButton}
                 </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form> {/* Form tag ends here */}

      {/* Debug URL display section */}
      {lastGeneratedDeleteApiUrl && (
        <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 flex items-center mb-2">
            <ShieldQuestion className="mr-2 h-5 w-5" />
            Debug: URL de API de Baja Generada
          </p>
          <pre className="text-xs text-yellow-600 dark:text-yellow-400 overflow-x-auto whitespace-pre-wrap break-all bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-md shadow-inner">
            <code>{lastGeneratedDeleteApiUrl}</code>
          </pre>
          <Button variant="outline" size="sm" onClick={handleClearDebugUrl} className="mt-3 border-yellow-500 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-800/50">
            <Trash2 className="mr-2 h-4 w-4" /> Limpiar URL de Baja
          </Button>
        </div>
      )}
    </>
  );
}
