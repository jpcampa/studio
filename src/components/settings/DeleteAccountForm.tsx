
"use client";

import { useActionState, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { deleteUserAccount, type DeleteAccountState } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
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

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, logout, loading: userLoading } = useUser();
  const router = useRouter();

  const deleteUserAccountWithEmail = deleteUserAccount.bind(null, user?.email || "");
  
  const [state, formAction] = useActionState(deleteUserAccountWithEmail, initialState);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    if (!state) return;
    setIsSubmittingAction(false); 

    console.log("DeleteAccountForm: Received state from server action:", JSON.stringify(state, null, 2));
    
    if (state.debugDeleteApiUrl) {
      sessionStorage.setItem('workwell-debug-delete-url', state.debugDeleteApiUrl);
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
  
  const handleDialogTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    setIsAlertDialogOpen(true); 
  };

  const handleConfirmDeleteAction = async () => {
    if (!user?.email) {
        toast({
            title: "Error",
            description: "No se pudo obtener el email del usuario.",
            variant: "destructive",
        });
        setIsAlertDialogOpen(false);
        return;
    }
    setIsSubmittingAction(true);
    await formAction(new FormData()); 
    // No necesitamos setIsSubmittingAction(false) aquí, el useEffect lo hará.
    // setIsAlertDialogOpen(false); // Mantener abierto hasta que la acción termine y el useEffect reaccione
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
      {/* El formAction se llama programáticamente */}
      
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={handleDialogTriggerClick}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.deleteAccountButtonLabel} 
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteAccountPageTitle}</AlertDialogTitle>
            <AlertDialogDescription className="w-full max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 break-words">
              {t.deleteAccountWarningMessage}
              <br/><br/>
              <strong>{t.deleteAccountConfirmationPrompt}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)} disabled={isSubmittingAction}>{t.cancelDeleteAccountButton}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeleteAction} 
              disabled={isSubmittingAction}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isSubmittingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t.confirmDeleteAccountButton}
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
    </>
  );
}
