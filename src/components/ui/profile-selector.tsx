"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/database.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSelectorProps {
  value: string | null;
  onChange: (profileId: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ProfileSelector({
  value,
  onChange,
  placeholder = "Assign to...",
  className,
  disabled = false,
}: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    }

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProfile = profiles.find((p) => p.id === value);

  const roleColor: Record<string, string> = {
    admin: "text-primary",
    manager: "text-info",
    sales: "text-success",
    viewer: "text-muted-foreground",
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-9 px-3 rounded-sm border border-border bg-white text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading users...
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 h-9 w-full rounded-sm border border-border bg-white px-3 text-sm text-navy hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedProfile ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 border border-border">
              <AvatarFallback className="text-[8px]">
                {selectedProfile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedProfile.full_name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            {placeholder}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-sm border border-border bg-white shadow-[0_4px_16px_rgba(27,42,74,0.1)]">
            {/* Unassign option */}
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Unassigned
            </button>
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer",
                  value === p.id && "bg-gold-light"
                )}
              >
                <Avatar className="h-6 w-6 border border-border shrink-0">
                  <AvatarFallback className="text-[8px]">
                    {p.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {p.full_name}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    roleColor[p.role] || "text-muted-foreground"
                  )}
                >
                  {p.role}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
