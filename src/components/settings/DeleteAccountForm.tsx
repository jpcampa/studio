
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
    // Create a FormData object (even if empty, it's expected by useActionState's formAction)
    // or directly call the action if it's adapted.
    // For simplicity with useActionState, we can submit an empty form.
    const formData = new FormData(); 
    // This will trigger the formAction bound with useActionState
    // It seems useActionState is designed more for form elements.
    // Let's try calling the action directly and managing state.
    
    // Re-thinking: for useActionState, the form should be submitted.
    // So, the button in AlertDialogAction should actually submit the form.
    // This means the actual form submission logic will live within the form itself,
    // and the AlertDialog is just a gate.
    // The component needs to handle the `action` prop of the form.

    // Correction: `formAction` is called when the form is submitted.
    // The AlertDialog's "Confirm" should trigger the form submission.
    // This can be done by having a hidden submit button inside the form,
    // and clicking it programmatically, or by making the AlertDialogAction
    // of type="submit" and associating it with the form.

    // Let's simplify: The form itself will call the action.
    // The AlertDialog will be triggered *before* submitting the form.
    // The `SubmitButton` component will be the AlertDialogTrigger.
    // The actual form submission will happen when "Confirm" is clicked in the dialog.
    // This means the `formAction` will be called correctly.
    
    // The `form` tag itself is what `useActionState` uses.
    // We just need to ensure the actual submission happens via the confirm button.
    // The `SubmitButton` component from `useFormStatus` will reflect the pending state
    // *after* the `formAction` is invoked.

    // The current `SubmitButton` will be inside the `AlertDialogTrigger`.
    // The `AlertDialogAction` will perform the actual submission.
    
    // No, this is getting complicated. Let's stick to a simple form with its own submit button.
    // The AlertDialog will wrap the actual submit button.
    
    // If the form submission is triggered by the main button which in turn is gated by the dialog,
    // `formAction` will be executed.

    // The `formAction` needs to be called. The `SubmitButton` uses `useFormStatus`.
    // Let's refine this.
    document.getElementById("hidden-delete-form")?.requestSubmit();
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
            // onClick={() => setIsAlertDialogOpen(true)} // Dialog is controlled
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.confirmDeleteAccountButton}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteAccountPageTitle}</AlertDialogTitle>
            <AlertDialogDescription>
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

    