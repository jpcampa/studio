
"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
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
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button
      type="submit"
      variant="destructive"
      className="w-full"
      disabled={pending}
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

  // Wrapper for deleteUserAccount to pass the email
  const deleteUserAccountWithEmail = deleteUserAccount.bind(null, user?.email || "");
  
  const [state, formAction] = useActionState(deleteUserAccountWithEmail, initialState);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);


  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Open the alert dialog for final confirmation before calling the formAction
    setIsAlertDialogOpen(true);
  };

  const handleConfirmDeletion = () => {
    document.getElementById("actual-delete-form")?.requestSubmit();
  };


  if (state.success && state.message) {
    toast({
      title: t.deleteAccountSuccessTitle,
      description: state.message,
    });
    logout(); // Clear user from context and localStorage
    router.push('/login'); // Redirect to login
    // Reset state or prevent further rendering if needed
    return null; 
  }

  if (!state.success && state.message && (!state.errors || Object.keys(state.errors).length === 0)) {
    toast({
      title: t.deleteAccountErrorTitle,
      description: state.message,
      variant: "destructive",
    });
     // Reset message to prevent re-toasting on re-render
    state.message = null;
  }
  
  if (state.errors?._form) {
     toast({
        title: t.deleteAccountErrorTitle,
        description: state.errors._form[0],
        variant: "destructive",
      });
      state.errors._form = undefined; // Clear to prevent re-toast
  }


  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    // Should not happen if page is protected by layout, but good for safety
    router.push('/login');
    return null;
  }
  
  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <form action={formAction} id="actual-delete-form">
        <AlertDialogTrigger asChild>
          <Button
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
            <AlertDialogDescription className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2"> {/* Added max-h and overflow */}
              {t.deleteAccountWarningMessage}
              <br/><br/>
              <strong>{t.deleteAccountConfirmationPrompt}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancelDeleteAccountButton}</AlertDialogCancel>
            {/* This button now submits the form */}
            <AlertDialogAction asChild>
                 <SubmitButton />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}

