
import type { ReactNode } from 'react';

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  // The background is now controlled by the page itself for dynamic changes
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
