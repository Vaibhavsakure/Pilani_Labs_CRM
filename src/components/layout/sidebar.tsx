"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Pipeline", href: "/pipeline", icon: GitBranch },
  { name: "Consultations", href: "/consultations", icon: CalendarCheck },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { canAccessAdmin } = useAuth();

  // Build navigation with conditional Admin item
  const fullNavigation = canAccessAdmin()
    ? [...navigation, { name: "Admin", href: "/admin", icon: Shield }]
    : navigation;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-white transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-border transition-all duration-300", collapsed ? "justify-center px-0" : "px-4")}>
        <div className="relative flex items-center justify-center h-10 w-full overflow-hidden">
          <Image
            src="/logo.png"
            alt="PilaniLabs Logo"
            fill
            className={cn("object-contain transition-all duration-300", collapsed ? "scale-150 object-left ml-2" : "object-left")}
            priority
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <div className={cn("mb-4", collapsed ? "px-0" : "px-2")}>
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Menu
            </span>
          )}
        </div>
        {fullNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold-light text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-navy",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-navy"
                )}
                strokeWidth={1.5}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold-light text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-navy",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon
                className="h-[18px] w-[18px] shrink-0 text-muted-foreground group-hover:text-navy transition-colors"
                strokeWidth={1.5}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-18 flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-white text-navy shadow-[0_2px_8px_rgba(27,42,74,0.12)] hover:bg-secondary transition-colors duration-150 cursor-pointer z-50"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}

