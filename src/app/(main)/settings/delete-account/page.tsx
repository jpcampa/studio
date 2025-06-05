
"use client";

import { DeleteAccountForm } from '@/components/settings/DeleteAccountForm';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeleteAccountPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-xl border-destructive">
        <CardHeader className="text-center bg-destructive/10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-destructive">
            {t.deleteAccountPageTitle}
          </CardTitle>
          <CardDescription className="text-destructive/90 text-sm md:text-base mt-1">
            {t.deleteAccountWarningTitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 md:p-8">
          <p className="text-base text-foreground leading-relaxed">
            {t.deleteAccountWarningMessage}
          </p>
          <p className="text-base font-semibold text-foreground">
            {t.deleteAccountConfirmationPrompt}
          </p>
          
          <DeleteAccountForm />

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/settings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.cancelDeleteAccountButton}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    