
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar, // Importar el hook
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ClipboardList, Milestone, Bot, Library, Settings, History, NotebookText, FileQuestion, HeartPulse, Archive } from "lucide-react";
import { useTranslations } from "@/lib/translations";
import { useUser } from "@/contexts/UserContext";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/dashboard", labelKey: "navDashboard", icon: LayoutDashboard },
  { href: "/assessment/intro", labelKey: "navAssessment", icon: ClipboardList }, 
  { href: "/my-assessments", labelKey: "navMyAssessments", icon: History },
  { href: "/paths", labelKey: "navPaths", icon: Milestone },
  { href: "/emotional-log", labelKey: "navMyEmotions", icon: HeartPulse },
  { href: "/therapeutic-notebook", labelKey: "navTherapeuticNotebook", icon: NotebookText },
  { href: "/chatbot", labelKey: "navChatbot", icon: Bot },
  // { href: "/knowledge-assistant", labelKey: "navKnowledgeAssistant", icon: FileQuestion },
  { href: "/resources", labelKey: "navResources", icon: Library },
];

const settingsNavItems = [
 { href: "/settings", labelKey: "navSettings", icon: Settings },
];

export function AppSidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const { logout } = useUser();
  const { setOpenMobile, isMobile } = useSidebar(); // Usar el hook para acceder al estado y la función

  const isActive = (href: string) => {
    if (href === "/assessment/intro") {
      // Highlights for any page under /assessment except history
      return pathname.startsWith("/assessment") && !pathname.startsWith('/assessment/history-results'); 
    }
    if (href === "/my-assessments") {
        return pathname.startsWith("/my-assessments") || pathname.startsWith("/assessment/history-results");
    }
    if (href === "/resources") {
        return pathname.startsWith("/resources");
    }
    if (href === "/paths") {
        return pathname.startsWith("/paths");
    }
    return pathname === href;
  }

  // Función que se llamará al hacer clic en un enlace del menú
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogoutClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    logout();
  };


  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader className="p-4">
        <Logo className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={t[item.labelKey as keyof typeof t]}
                onClick={handleLinkClick} // Añadir onClick a cada botón
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t[item.labelKey as keyof typeof t]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
          {settingsNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={t[item.labelKey as keyof typeof t]}
                onClick={handleLinkClick} // Añadir onClick a cada botón
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t[item.labelKey as keyof typeof t]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogoutClick} tooltip={t.logout}>
              <LogOut />
              <span>{t.logout}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
