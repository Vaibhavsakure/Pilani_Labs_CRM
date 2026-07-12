"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Globe,
  ChevronLeft,
  FileText,
  Activity,
  Target,
  Loader2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { LeadWithRelations } from "@/lib/lead-helpers";
import { fetchLeadById, fetchLeadRelatedData } from "@/lib/lead-helpers";
import {
  getLeadSourceLabel,
  getLeadInterestLabel,
  getLeadStatusConfig,
  formatPhoneNumber,
  formatDate,
} from "@/lib/lead-constants";
import { LeadFormModal } from "@/components/leads/lead-form-modal";
import type { LeadFormData } from "@/components/leads/lead-form-modal";
import { updateLead, createCompany } from "@/lib/lead-helpers";
import type { InsertLead } from "@/lib/database.types";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { profile, hasRole } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();

  // State
  const [lead, setLead] = useState<LeadWithRelations | null>(null);
  const [relatedData, setRelatedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Permissions
  const canEdit = hasRole("admin", "manager", "sales");

  // Fetch lead data
  useEffect(() => {
    loadLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadLead() {
    try {
      setLoading(true);
      const leadData = await fetchLeadById(supabase, id);

      if (!leadData) {
        showToast("error", "Lead not found");
        router.push("/leads");
        return;
      }

      setLead(leadData);

      // Fetch related data
      const related = await fetchLeadRelatedData(supabase, id);
      setRelatedData(related);
    } catch (error) {
      console.error("Error loading lead:", error);
      showToast("error", "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }

  // Handle edit lead
  async function handleLeadUpdate(data: LeadFormData) {
    if (!lead) return;

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

      await updateLead(supabase, lead.id, leadData, profile?.id || null, lead.status);
      showToast("success", "Lead updated successfully");
      await loadLead();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating lead:", error);
      showToast("error", "Failed to update lead");
    } finally {
      setModalLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell title="Lead Profile" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell title="Lead Not Found" subtitle="The lead you're looking for doesn't exist">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Lead not found</p>
            <Link href="/leads">
              <Button variant="outline">Back to Leads</Button>
            </Link>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const statusConfig = getLeadStatusConfig(lead.status);

  return (
    <AppShell
      title="Lead Profile"
      subtitle={`Managing ${lead.full_name}${lead.company ? ` at ${lead.company.name}` : ""}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/leads"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-navy transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
        {canEdit && (
          <Button onClick={() => setShowEditModal(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Lead
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Profile & Details */}
        <div className="xl:col-span-1 space-y-8">
          {/* Main Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-border mb-4">
                  <AvatarFallback className="text-2xl bg-secondary text-navy">
                    {lead.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-display font-semibold text-navy">
                  {lead.full_name}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">
                  {lead.designation || "—"}
                  {lead.company && ` at ${lead.company.name}`}
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  <Badge variant="outline">{getLeadSourceLabel(lead.source)}</Badge>
                </div>

                <div className="flex items-center justify-center gap-3 w-full border-t border-border pt-6">
                  <Button className="flex-1 gap-2 bg-navy hover:bg-navy-light" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  {lead.phone && (
                    <Button variant="outline" className="flex-1 gap-2" asChild>
                      <a href={`tel:${lead.phone}`}>
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm font-medium text-navy hover:text-primary"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-navy">
                    {formatPhoneNumber(lead.phone)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Company
                  </p>
                  <p className="text-sm font-medium text-navy">
                    {lead.company?.name || "No company"}
                  </p>
                  {lead.company?.industry && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lead.company.industry}
                    </p>
                  )}
                </div>
              </div>
              {lead.company?.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      Website
                    </p>
                    <a
                      href={lead.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {lead.company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}
              {lead.assigned_profile && (
                <div className="flex items-start gap-3 pt-3 border-t border-border">
                  <Avatar className="h-6 w-6 border border-border mt-0.5">
                    <AvatarFallback className="text-[8px]">
                      {lead.assigned_profile.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      Assigned To
                    </p>
                    <p className="text-sm font-medium text-navy">
                      {lead.assigned_profile.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {lead.assigned_profile.role}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity, Deals, Notes */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Interest
                    </p>
                    <p className="text-sm font-display font-semibold text-navy">
                      {getLeadInterestLabel(lead.interest)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Follow-up
                    </p>
                    <p className="text-sm font-display font-semibold text-navy">
                      {lead.next_follow_up_at ? formatDate(lead.next_follow_up_at) : "None"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-navy shadow-sm border border-border">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-display font-semibold text-navy">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Deals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Active Deals
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {relatedData?.deals.length || 0} deals
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {relatedData?.deals.length > 0 ? (
                  <div className="divide-y divide-border">
                    {relatedData.deals.slice(0, 3).map((deal: any) => (
                      <div key={deal.id} className="p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-semibold text-navy">{deal.title}</h4>
                          <span className="text-sm font-semibold text-navy">
                            ₹{(deal.value / 100000).toFixed(1)}L
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px]">
                            {deal.stage.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          {deal.expected_close_date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" /> Close:{" "}
                              {formatDate(deal.expected_close_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No active deals for this lead.
                    </p>
                    <Button variant="outline" size="sm">
                      Create Deal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Consultations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Consultations
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {relatedData?.consultations.length || 0} meetings
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {relatedData?.consultations.length > 0 ? (
                  <div className="divide-y divide-border">
                    {relatedData.consultations.slice(0, 3).map((consultation: any) => (
                      <div
                        key={consultation.id}
                        className="p-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant={
                              consultation.status === "completed" ? "success" : "navy"
                            }
                            className="shrink-0"
                          >
                            {consultation.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />{" "}
                            {formatDate(consultation.scheduled_at)}
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5 text-primary" />{" "}
                            {new Date(consultation.scheduled_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {consultation.assigned_profile && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                With:
                              </span>
                              <Avatar className="h-5 w-5 border border-white">
                                <AvatarFallback className="text-[8px] bg-secondary text-navy">
                                  {consultation.assigned_profile.full_name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-navy">
                                {consultation.assigned_profile.full_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No upcoming consultations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-base font-semibold text-navy flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {relatedData?.activities.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {relatedData.activities.slice(0, 5).map((activity: any, index: number) => (
                    <div
                      key={activity.id}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                          index === 0
                            ? "bg-gold-light text-primary"
                            : "bg-secondary text-navy"
                        )}
                      >
                        {activity.type === "email" ? (
                          <Mail className="h-4 w-4" />
                        ) : activity.type === "call" ? (
                          <Phone className="h-4 w-4" />
                        ) : activity.type === "meeting" ? (
                          <Calendar className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-sm border border-border bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-navy">
                            {activity.title}
                          </h4>
                          <time className="text-xs font-medium text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </time>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        )}
                        {activity.created_by_profile && (
                          <p className="text-xs text-muted-foreground mt-2">
                            by {activity.created_by_profile.full_name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <LeadFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleLeadUpdate}
        lead={lead}
        loading={modalLoading}
      />
    </AppShell>
  );
}
