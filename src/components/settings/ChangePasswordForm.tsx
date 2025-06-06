
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
// import { changePasswordAction, type ChangePasswordState } from "@/actions/auth"; // Descomentar cuando se cree la acción
// import { useActionState } from "react"; // Descomentar cuando se use la acción

// const initialState: ChangePasswordState = { errors: {}, message: null }; // Descomentar cuando se cree la acción

export function ChangePasswordForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Temporal, hasta usar useActionState

  // const [state, formAction] = useActionState(changePasswordAction, initialState); // Descomentar

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    console.log("Submit ChangePasswordForm with:", { newPassword, confirmNewPassword });

    if (newPassword !== confirmNewPassword) {
      toast({
        title: t.errorOccurred,
        description: t.passwordsDoNotMatchError,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (newPassword.length < 6) {
         toast({
            title: t.errorOccurred,
            description: "La nueva contraseña debe tener al menos 6 caracteres.",
            variant: "destructive",
         });
         setIsSubmitting(false);
         return;
    }

    // Aquí iría la llamada a formAction(formData) cuando se implemente la acción del servidor
    // Por ahora, simulamos un delay y un mensaje
    setTimeout(() => {
      toast({
        title: "Funcionalidad en desarrollo",
        description: "La acción de cambiar contraseña aún no está implementada.",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="newPassword">{t.newPasswordLabel}</Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="pr-10"
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
        {/* {state.errors?.newPassword && <p className="text-sm text-destructive pt-1">{state.errors.newPassword[0]}</p>} */}
      </div>
      <div>
        <Label htmlFor="confirmNewPassword">{t.confirmNewPasswordLabel}</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            minLength={6}
            className="pr-10"
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
        {/* {state.errors?.confirmNewPassword && <p className="text-sm text-destructive pt-1">{state.errors.confirmNewPassword[0]}</p>} */}
      </div>
      {/* {state.message && !state.errors && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-destructive'}`}>{state.message}</p>
      )} */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {t.saveChanges}
      </Button>
    </form>
  );
}
