
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

const oldNavItems = [
  { href: "/resources-old", label: "Recursos (Antiguo)", icon: Archive },
];

const settingsNavItems = [
 { href: "/settings", labelKey: "navSettings", icon: Settings },
];

export function AppSidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const { logout } = useUser();

  const isActive = (href: string) => {
    if (href === "/assessment/intro") {
      return pathname.startsWith("/assessment"); 
    }
    if (href === "/my-assessments") {
        return pathname.startsWith("/my-assessments") || pathname.startsWith("/assessment/history-results");
    }
    if (href === "/resources") {
        return pathname.startsWith("/resources") && !pathname.startsWith("/resources-old");
    }
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

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
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t[item.labelKey as keyof typeof t]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
          {oldNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
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
            <SidebarMenuButton onClick={logout} tooltip={t.logout}>
              <LogOut />
              <span>{t.logout}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
