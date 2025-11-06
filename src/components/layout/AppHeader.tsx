
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings as SettingsIcon, Sun, Moon, Laptop, ListChecks, MessageSquareQuote } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "next-themes";
import { useActivePath } from "@/contexts/ActivePathContext";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const { user, logout } = useUser();
  const t = useTranslations();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { activePath } = useActivePath();
  const pathname = usePathname();

  const modulesRemaining = activePath ? activePath.totalModules - activePath.completedModuleIds.length : 0;

  let showProgressBadge = false;
  if (activePath && modulesRemaining > 0) {
    const isCurrentlyOnActivePathPage = pathname === `/paths/${activePath.id}`;
    const hasMadeProgressOnActivePath = activePath.completedModuleIds.length > 0;
    if (isCurrentlyOnActivePathPage || hasMadeProgressOnActivePath) {
      showProgressBadge = true;
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Logo />
      </div>
      
      <div className="flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/daily-check-in">
                      <MessageSquareQuote className="h-5 w-5 text-primary" />
                      <span className="sr-only">Pregunta Diaria</span>
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Pregunta Diaria</p>
            </TooltipContent>
        </Tooltip>

        {showProgressBadge && activePath && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href={`/paths/${activePath.id}`}>
                  <ListChecks className="h-5 w-5 text-primary" />
                  {modulesRemaining > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                      {modulesRemaining}
                    </Badge>
                  )}
                  <span className="sr-only">Progreso de Ruta</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.modulesLeftTooltip.replace("{count}", modulesRemaining.toString()).replace("{pathTitle}", activePath.title)}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name?.[0]?.toUpperCase() || 'U'}`} alt={user.name || "Usuarie"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{t.navSettings}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === 'light' && <Sun className="mr-2 h-4 w-4" />}
                  {theme === 'dark' && <Moon className="mr-2 h-4 w-4" />}
                  {theme === 'system' && <Laptop className="mr-2 h-4 w-4" />}
                  <span>{t.theme}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>{t.themeLight}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>{t.themeDark}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>{t.themeSystem}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
