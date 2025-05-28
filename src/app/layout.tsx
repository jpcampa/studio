
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActivePathProvider } from '@/contexts/ActivePathContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WorkWell',
  description: 'Tu app de acompañamiento emocional',
  manifest: '/manifest.json', // Enlace al manifest
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WorkWell',
    // startupImage: [], // Opcional: imágenes de inicio para iOS
  },
};

export const viewport: Viewport = {
  themeColor: '#64B5F6', // Coincide con theme_color en manifest.json
  initialScale: 1,
  width: 'device-width',
  // userScalable: false, // Considera si quieres permitir zoom
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Se pueden añadir más meta tags específicos de PWA aquí si es necesario */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <ActivePathProvider>
              <FeatureFlagProvider>
                {children}
                <Toaster />
              </FeatureFlagProvider>
            </ActivePathProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
