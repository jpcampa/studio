
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';

export function Logo({className}: {className?: string}) {
  const t = useTranslations();
  return (
    <Link href="/welcome" className={`flex items-center gap-2 text-2xl font-bold text-primary ${className || ''}`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
        <path d="M12 17.5C14.49 17.5 16.5 15.49 16.5 13C16.5 11.54 15.85 10.26 14.83 9.39L15.94 8.28C17.39 9.53 18.25 11.17 18.25 13C18.25 16.45 15.45 19.25 12 19.25C8.55 19.25 5.75 16.45 5.75 13C5.75 11.17 6.61 9.53 8.06 8.28L9.17 9.39C8.15 10.26 7.5 11.54 7.5 13C7.5 15.49 9.51 17.5 12 17.5Z" fill="currentColor"/>
      </svg>
      <span>{t.appName}</span>
    </Link>
  );
}

    