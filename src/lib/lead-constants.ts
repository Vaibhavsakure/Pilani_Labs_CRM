// ============================================================
// PilaniLabs CRM — Lead Constants & Labels
// Centralized definitions for lead enums, labels, and styling
// ============================================================

import type { LeadSource, LeadInterest, LeadStatus, TaskPriority } from "@/lib/database.types";

// Lead Source Options
export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "brochure_download", label: "Brochure Download" },
  { value: "consultation_form", label: "Consultation Form" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
  { value: "manual", label: "Manual Entry" },
  { value: "event", label: "Event" },
];

// Lead Interest/Program Type Options
export const LEAD_INTERESTS: { value: LeadInterest; label: string }[] = [
  { value: "virtual_intensive", label: "Virtual Intensive" },
  { value: "in_person_intensive", label: "In-Person Intensive" },
  { value: "enterprise_private_program", label: "Enterprise Private Program" },
  { value: "unsure", label: "Unsure / TBD" },
];

// Lead Status Options with Badge Variants
export const LEAD_STATUSES: {
  value: LeadStatus;
  label: string;
  variant: "default" | "secondary" | "success" | "warning" | "destructive" | "navy";
}[] = [
  { value: "new", label: "New", variant: "default" },
  { value: "contacted", label: "Contacted", variant: "navy" },
  { value: "qualified", label: "Qualified", variant: "warning" },
  { value: "unqualified", label: "Unqualified", variant: "secondary" },
  { value: "converted", label: "Converted", variant: "success" },
  { value: "lost", label: "Lost", variant: "destructive" },
];

// Priority Options with Badge Variants
export const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  variant: "default" | "secondary" | "warning" | "destructive";
}[] = [
  { value: "low", label: "Low", variant: "secondary" },
  { value: "medium", label: "Medium", variant: "default" },
  { value: "high", label: "High", variant: "warning" },
];

// Helper functions to get label and variant from enum value
export function getLeadSourceLabel(source: LeadSource): string {
  return LEAD_SOURCES.find((s) => s.value === source)?.label || source;
}

export function getLeadInterestLabel(interest: LeadInterest | null): string {
  if (!interest) return "TBD";
  return LEAD_INTERESTS.find((i) => i.value === interest)?.label || interest;
}

export function getLeadStatusConfig(status: LeadStatus) {
  return (
    LEAD_STATUSES.find((s) => s.value === status) || {
      value: status,
      label: status,
      variant: "secondary" as const,
    }
  );
}

export function getPriorityConfig(priority: TaskPriority) {
  return (
    PRIORITY_OPTIONS.find((p) => p.value === priority) || {
      value: priority,
      label: priority,
      variant: "secondary" as const,
    }
  );
}

// Format phone number for display
export function formatPhoneNumber(phone: string | null): string {
  if (!phone) return "—";
  return phone;
}

// Format date for display
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Format date for input fields (YYYY-MM-DD)
export function formatDateForInput(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}
