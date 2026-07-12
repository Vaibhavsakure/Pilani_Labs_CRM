"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileSelector } from "@/components/ui/profile-selector";
import { CompanySelector } from "@/components/ui/company-selector";
import { Loader2 } from "lucide-react";
import type { LeadWithRelations } from "@/lib/lead-helpers";
import type { LeadSource, LeadInterest, LeadStatus, TaskPriority } from "@/lib/database.types";
import {
  LEAD_SOURCES,
  LEAD_INTERESTS,
  LEAD_STATUSES,
  PRIORITY_OPTIONS,
  formatDateForInput,
} from "@/lib/lead-constants";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: LeadWithRelations | null;
  loading?: boolean;
}

export interface LeadFormData {
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  company_id: string | null;
  company_name?: string; // For quick-create
  source: LeadSource;
  interest: LeadInterest | null;
  status: LeadStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  next_follow_up_at: string | null;
}

export function LeadFormModal({
  open,
  onClose,
  onSubmit,
  lead,
  loading = false,
}: LeadFormModalProps) {
  const isEdit = !!lead;

  const [formData, setFormData] = useState<LeadFormData>({
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    company_id: null,
    source: "manual",
    interest: null,
    status: "new",
    priority: "medium",
    assigned_to: null,
    next_follow_up_at: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone || "",
        designation: lead.designation || "",
        company_id: lead.company_id,
        source: lead.source,
        interest: lead.interest,
        status: lead.status,
        priority: lead.priority,
        assigned_to: lead.assigned_to,
        next_follow_up_at: lead.next_follow_up_at,
      });
    } else {
      // Reset form for new lead
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        company_id: null,
        source: "manual",
        interest: null,
        status: "new",
        priority: "medium",
        assigned_to: null,
        next_follow_up_at: null,
      });
    }
    setErrors({});
  }, [lead, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCompanyChange = (companyId: string | null, companyName?: string) => {
    if (companyName) {
      // Quick-create company
      setFormData({ ...formData, company_id: null, company_name: companyName });
    } else {
      setFormData({ ...formData, company_id: companyId, company_name: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update lead information and save changes."
              : "Create a new lead by filling in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="col-span-2">
              <label htmlFor="full_name" className="block text-sm font-medium text-navy mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John Doe"
              />
              {errors.full_name && (
                <p className="text-xs text-destructive mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="john@company.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1.5">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Designation */}
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-navy mb-1.5">
                Designation
              </label>
              <input
                id="designation"
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="VP of Technology"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-navy mb-1.5">
                Company
              </label>
              <CompanySelector
                value={formData.company_id}
                onChange={handleCompanyChange}
                placeholder="Select or create company..."
                allowCreate={true}
              />
            </div>

            {/* Source */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-navy mb-1.5">
                Source
              </label>
              <select
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {LEAD_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interest */}
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-navy mb-1.5">
                Program Interest
              </label>
              <select
                id="interest"
                value={formData.interest || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interest: e.target.value ? (e.target.value as LeadInterest) : null,
                  })
                }
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Select interest...</option>
                {LEAD_INTERESTS.map((interest) => (
                  <option key={interest.value} value={interest.value}>
                    {interest.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-navy mb-1.5">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-navy mb-1.5">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as TaskPriority })
                }
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label htmlFor="assigned_to" className="block text-sm font-medium text-navy mb-1.5">
                Assigned To
              </label>
              <ProfileSelector
                value={formData.assigned_to}
                onChange={(profileId) => setFormData({ ...formData, assigned_to: profileId })}
                placeholder="Assign to user..."
              />
            </div>

            {/* Next Follow-up */}
            <div>
              <label
                htmlFor="next_follow_up_at"
                className="block text-sm font-medium text-navy mb-1.5"
              >
                Next Follow-up
              </label>
              <input
                id="next_follow_up_at"
                type="datetime-local"
                value={formData.next_follow_up_at ? formatDateForInput(formData.next_follow_up_at) + "T00:00" : ""}
                onChange={(e) =>
                  setFormData({ ...formData, next_follow_up_at: e.target.value || null })
                }
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
