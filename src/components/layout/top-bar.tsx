"use client";

import React from "react";
import { Bell, Search, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-display font-semibold text-navy">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-64 rounded-sm border border-border bg-white pl-9 pr-4 text-sm text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-[inset_0_1px_2px_rgba(27,42,74,0.02)] transition-colors duration-150"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden items-center gap-0.5 rounded-sm border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </div>

        {/* Quick Add */}
        <Button size="sm" className="hidden sm:inline-flex gap-1.5 rounded-sm">
          <Plus className="h-4 w-4" />
          New Lead
        </Button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-white text-navy hover:bg-secondary transition-colors duration-150 cursor-pointer shadow-sm">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <Avatar className="h-9 w-9 border border-border shadow-sm rounded-sm">
            <AvatarFallback className="text-xs rounded-sm">AM</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-navy leading-none mb-1">Arjun Mehta</p>
            <p className="text-[11px] text-muted-foreground leading-none uppercase tracking-wider">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
