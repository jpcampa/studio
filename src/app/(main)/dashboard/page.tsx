"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useUser();

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Bienestar emocional" 
              width={600} 
              height={400} 
              className="object-cover w-full h-full"
              data-ai-hint="wellbeing support" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">
                {t.welcome}, {user?.name || "Usuarie"}!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {t.welcomeToWorkWell}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mt-4 text-muted-foreground">
                {t.assessmentIntro}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="mt-6">
                <Link href="/assessment">
                  {t.takeInitialAssessment} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
