"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LeadFormModal, type LeadFormData } from "@/components/leads/lead-form-modal";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { LeadWithRelations } from "@/lib/lead-helpers";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  createCompany,
} from "@/lib/lead-helpers";
import {
  getLeadSourceLabel,
  getLeadInterestLabel,
  getLeadStatusConfig,
  getPriorityConfig,
  formatPhoneNumber,
  formatDate,
  LEAD_STATUSES,
  LEAD_SOURCES,
  LEAD_INTERESTS,
  PRIORITY_OPTIONS,
} from "@/lib/lead-constants";
import type { InsertLead } from "@/lib/database.types";

export default function LeadsPage() {
  const { profile, hasRole } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();

  // State
  const [leads, setLeads] = useState<LeadWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");

  // Modal state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadWithRelations | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingLead, setDeletingLead] = useState<LeadWithRelations | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Permissions
  const canEdit = hasRole("admin", "manager", "sales");
  const canDelete = hasRole("admin", "manager");

  // Fetch leads
  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const data = await fetchLeads(supabase);
      setLeads(data);
    } catch (error) {
      console.error("Error loading leads:", error);
      showToast("error", "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.designation && lead.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.company?.name && lead.company.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesAssigned =
      assignedFilter === "all" ||
      (assignedFilter === "unassigned" && !lead.assigned_to) ||
      lead.assigned_to === assignedFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority && matchesAssigned;
  });

  // Handle create/edit lead
  async function handleLeadSubmit(data: LeadFormData) {
    try {
      setModalLoading(true);

      // Handle company quick-create
      let companyId = data.company_id;
      if (data.company_name && !data.company_id) {
        const newCompany = await createCompany(supabase, {
          name: data.company_name,
          industry: null,
          country: "India",
          company_size: null,
          website: null,
          notes: null,
        });
        companyId = newCompany.id;
      }

      const leadData: InsertLead = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        designation: data.designation || null,
        company_id: companyId,
        source: data.source,
        interest: data.interest,
        status: data.status,
        priority: data.priority,
        assigned_to: data.assigned_to,
        next_follow_up_at: data.next_follow_up_at,
      };

      if (editingLead) {
        // Update existing lead
        await updateLead(supabase, editingLead.id, leadData, profile?.id || null, editingLead.status);
        showToast("success", "Lead updated successfully");
      } else {
        // Create new lead
        await createLead(supabase, leadData, profile?.id || null);
        showToast("success", "Lead created successfully");
      }

      await loadLeads();
      setShowLeadModal(false);
      setEditingLead(null);
    } catch (error) {
      console.error("Error saving lead:", error);
      showToast("error", "Failed to save lead");
    } finally {
      setModalLoading(false);
    }
  }

  // Handle delete lead
  async function handleDeleteLead() {
    if (!deletingLead) return;

    try {
      setDeleteLoading(true);
      await deleteLead(supabase, deletingLead.id, profile?.id || null);
      showToast("success", "Lead deleted successfully");
      await loadLeads();
      setShowDeleteDialog(false);
      setDeletingLead(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      showToast("error", "Failed to delete lead");
    } finally {
      setDeleteLoading(false);
    }
  }

  // Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setPriorityFilter("all");
    setAssignedFilter("all");
  }

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    sourceFilter !== "all" ||
    priorityFilter !== "all" ||
    assignedFilter !== "all";

  return (
    <AppShell title="Leads" subtitle="Manage and track your executive leads">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, phone, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
            />
          </div>
          {canEdit && (
            <Button
              className="gap-2 h-10 px-5"
              onClick={() => {
                setEditingLead(null);
                setShowLeadModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-sm border border-border bg-white px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Status</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-9 rounded-sm border border-border bg-white px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Sources</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 rounded-sm border border-border bg-white px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="h-9 rounded-sm border border-border bg-white px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground">
            {filteredLeads.length} of {leads.length} leads
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Executive
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Follow-up
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const statusConfig = getLeadStatusConfig(lead.status);
                  const priorityConfig = getPriorityConfig(lead.priority);

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors duration-150 group"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className="text-xs">
                              {lead.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/leads/${lead.id}`}
                              className="text-sm font-semibold text-navy hover:text-primary transition-colors"
                            >
                              {lead.full_name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {lead.designation || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="text-sm font-medium text-navy">
                          {lead.company?.name || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getLeadSourceLabel(lead.source)}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2 text-sm text-navy">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2 text-sm text-navy whitespace-nowrap">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{formatPhoneNumber(lead.phone)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="text-xs text-navy">
                          {getLeadInterestLabel(lead.interest)}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
                      </td>
                      <td className="px-5 py-4 align-top">
                        {lead.assigned_profile ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border">
                              <AvatarFallback className="text-[8px]">
                                {lead.assigned_profile.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-navy truncate max-w-[100px]">
                              {lead.assigned_profile.full_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="text-xs text-navy whitespace-nowrap">
                          {lead.next_follow_up_at
                            ? formatDate(lead.next_follow_up_at)
                            : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(lead.created_at)}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/leads/${lead.id}`}>
                            <button
                              className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingLead(lead);
                                setShowLeadModal(true);
                              }}
                              className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-navy transition-all cursor-pointer"
                              title="Edit Lead"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => {
                                setDeletingLead(lead);
                                setShowDeleteDialog(true);
                              }}
                              className="p-2 rounded-sm hover:bg-white border border-transparent hover:border-border text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-5 py-12 text-center text-muted-foreground">
                      {searchQuery || hasActiveFilters
                        ? "No leads found matching your criteria."
                        : "No leads yet. Create your first lead to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <LeadFormModal
        open={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setEditingLead(null);
        }}
        onSubmit={handleLeadSubmit}
        lead={editingLead}
        loading={modalLoading}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingLead(null);
        }}
        onConfirm={handleDeleteLead}
        title="Delete Lead"
        description={`Are you sure you want to delete ${deletingLead?.full_name}? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete Lead"
        variant="destructive"
        loading={deleteLoading}
      />
    </AppShell>
  );
}
