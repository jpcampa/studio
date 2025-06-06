
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("HomePage useEffect: user:", user, "loading:", loading);
    if (!loading) {
      if (user) {
        console.log("HomePage: Redirecting to /dashboard");
        router.replace('/dashboard');
      } else {
        console.log("HomePage: Redirecting to /login");
        router.replace('/login');
      }
    } else {
      console.log("HomePage: Not redirecting, loading is true.");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
