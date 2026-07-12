"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { Company } from "@/lib/database.types";
import { Building2, ChevronDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanySelectorProps {
  value: string | null;
  onChange: (companyId: string | null, companyName?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowCreate?: boolean;
}

export function CompanySelector({
  value,
  onChange,
  placeholder = "Select company...",
  className,
  disabled = false,
  allowCreate = true,
}: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchCompanies() {
      const { data } = await supabase
        .from("companies")
        .select("*")
        .order("name");

      if (data) {
        setCompanies(data as Company[]);
      }
      setLoading(false);
    }

    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCompany = companies.find((c) => c.id === value);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    if (searchQuery.trim()) {
      onChange(null, searchQuery.trim());
      setOpen(false);
      setSearchQuery("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-9 px-3 rounded-sm border border-border bg-white text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading companies...
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
        {selectedCompany ? (
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate">{selectedCompany.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />
            {placeholder}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-sm border border-border bg-white shadow-[0_4px_16px_rgba(27,42,74,0.1)]">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder="Search or type new company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 px-3 text-sm rounded-sm border border-border bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {/* Create new option */}
              {allowCreate && searchQuery.trim() && !filteredCompanies.find(c => c.name.toLowerCase() === searchQuery.toLowerCase()) && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-primary hover:bg-gold-light transition-colors cursor-pointer border-b border-border"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>Create "{searchQuery}"</span>
                </button>
              )}
              {/* Unassign option */}
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                  setSearchQuery("");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                No company
              </button>
              {/* Existing companies */}
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer",
                      value === c.id && "bg-gold-light"
                    )}
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {c.name}
                      </p>
                      {c.industry && (
                        <p className="text-xs text-muted-foreground truncate">
                          {c.industry}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No companies found
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
