
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
    if (state.debugDeleteApiUrl) {
      sessionStorage.setItem(SESSION_STORAGE_DELETE_URL_KEY, state.debugDeleteApiUrl);
      setPersistedDebugUrl(state.debugDeleteApiUrl); 
    }

    if (state.success && state.message) {
      toast({
        title: t.deleteAccountSuccessTitle,
        description: state.message,
      });
      logout(); 
      router.push('/login'); 
    } else if (state.message) { 
      const title = state.errors && Object.keys(state.errors).length > 0 && state.errors._form
                    ? t.deleteAccountErrorTitle
                    : (state.success === false ? t.deleteAccountErrorTitle : "Información"); 

      toast({
        title: title,
        description: state.errors?._form ? state.errors._form[0] : state.message,
        variant: state.success === false ? "destructive" : "default",
      });
    }
  }, [state, logout, router, toast, t]);

  const handleFormTrigger = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setIsAlertDialogOpen(true); 
  };

  const handleActualFormSubmit = () => {
    const form = document.getElementById("actual-delete-form") as HTMLFormElement | null;
    if (form) {
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
    router.push('/login');
    return null;
  }
  
  const displayDebugUrl = state.debugDeleteApiUrl || persistedDebugUrl;

  return (
    <>
      <form id="actual-delete-form" action={formAction} onSubmit={handleFormTrigger}>
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="submit" 
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
              <AlertDialogAction onClick={handleActualFormSubmit} asChild>
                 <Button variant="destructive" className="w-full" disabled={useFormStatus().pending}>
                    {useFormStatus().pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    {t.confirmDeleteAccountButton}
                 </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>

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
    