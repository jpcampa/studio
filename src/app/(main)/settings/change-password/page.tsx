
"use client";

import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
            {t.changePasswordTitle}
          </CardTitle>
          <CardDescription className="text-sm md:text-base mt-1">
            Introduce tu nueva contraseña dos veces para confirmarla.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <ChangePasswordForm />
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/settings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Configuración
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
