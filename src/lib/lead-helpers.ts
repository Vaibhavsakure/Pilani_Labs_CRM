// ============================================================
// PilaniLabs CRM — Lead Data Helpers
// Typed Supabase helper functions for lead queries/mutations
// ============================================================

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Lead,
  Company,
  Profile,
  InsertLead,
  InsertCompany,
  InsertActivity,
  ActivityType,
} from "@/lib/database.types";

// ============================================================
// Extended Lead Type with Related Data
// ============================================================

export interface LeadWithRelations extends Lead {
  company: Company | null;
  assigned_profile: Profile | null;
}

// ============================================================
// FETCH LEADS
// ============================================================

export async function fetchLeads(supabase: SupabaseClient): Promise<LeadWithRelations[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      company:companies(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  // Fetch assigned profiles separately
  const profileIds = [...new Set(data?.map((l) => l.assigned_to).filter(Boolean))];
  let profilesMap: Map<string, Profile> = new Map();

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", profileIds);

    if (profiles) {
      profilesMap = new Map(profiles.map((p) => [p.id, p as Profile]));
    }
  }

  return (
    data?.map((lead) => ({
      ...lead,
      company: lead.company || null,
      assigned_profile: lead.assigned_to ? profilesMap.get(lead.assigned_to) || null : null,
    })) || []
  );
}

// ============================================================
// FETCH SINGLE LEAD BY ID
// ============================================================

export async function fetchLeadById(
  supabase: SupabaseClient,
  leadId: string
): Promise<LeadWithRelations | null> {
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      company:companies(*)
    `
    )
    .eq("id", leadId)
    .single();

  if (error) {
    console.error("Error fetching lead:", error);
    return null;
  }

  if (!data) return null;

  // Fetch assigned profile if exists
  let assigned_profile: Profile | null = null;
  if (data.assigned_to) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.assigned_to)
      .single();

    if (profile) {
      assigned_profile = profile as Profile;
    }
  }

  return {
    ...data,
    company: data.company || null,
    assigned_profile,
  };
}

// ============================================================
// CREATE LEAD
// ============================================================

export async function createLead(
  supabase: SupabaseClient,
  leadData: InsertLead,
  userId: string | null
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert([leadData])
    .select()
    .single();

  if (error) {
    console.error("Error creating lead:", error);
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  // Log activity
  if (userId && data) {
    await logActivity(supabase, {
      lead_id: data.id,
      company_id: data.company_id,
      deal_id: null,
      type: "status_change",
      title: "Lead Created",
      description: `New lead ${leadData.full_name} was added to the system.`,
      created_by: userId,
    });
  }

  return data as Lead;
}

// ============================================================
// UPDATE LEAD
// ============================================================

export async function updateLead(
  supabase: SupabaseClient,
  leadId: string,
  updates: Partial<InsertLead>,
  userId: string | null,
  oldStatus?: string
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    console.error("Error updating lead:", error);
    throw new Error(`Failed to update lead: ${error.message}`);
  }

  // Log activity for status change
  if (userId && data && updates.status && updates.status !== oldStatus) {
    await logActivity(supabase, {
      lead_id: leadId,
      company_id: data.company_id,
      deal_id: null,
      type: "status_change",
      title: "Lead Status Updated",
      description: `Lead status changed from ${oldStatus} to ${updates.status}.`,
      created_by: userId,
    });
  } else if (userId && data) {
    // Log general update activity
    await logActivity(supabase, {
      lead_id: leadId,
      company_id: data.company_id,
      deal_id: null,
      type: "note",
      title: "Lead Updated",
      description: `Lead information was updated.`,
      created_by: userId,
    });
  }

  return data as Lead;
}

// ============================================================
// DELETE LEAD
// ============================================================

export async function deleteLead(
  supabase: SupabaseClient,
  leadId: string,
  userId: string | null
): Promise<void> {
  // Fetch lead info before deleting for activity log
  const { data: lead } = await supabase
    .from("leads")
    .select("full_name, company_id")
    .eq("id", leadId)
    .single();

  const { error } = await supabase.from("leads").delete().eq("id", leadId);

  if (error) {
    console.error("Error deleting lead:", error);
    throw new Error(`Failed to delete lead: ${error.message}`);
  }

  // Log activity
  if (userId && lead) {
    await logActivity(supabase, {
      lead_id: null,
      company_id: lead.company_id,
      deal_id: null,
      type: "note",
      title: "Lead Deleted",
      description: `Lead ${lead.full_name} was removed from the system.`,
      created_by: userId,
    });
  }
}

// ============================================================
// ARCHIVE LEAD (Set status to lost)
// ============================================================

export async function archiveLead(
  supabase: SupabaseClient,
  leadId: string,
  userId: string | null
): Promise<Lead> {
  return updateLead(supabase, leadId, { status: "lost" }, userId, undefined);
}

// ============================================================
// FETCH COMPANIES (For company selector)
// ============================================================

export async function fetchCompanies(supabase: SupabaseClient): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching companies:", error);
    throw new Error(`Failed to fetch companies: ${error.message}`);
  }

  return (data as Company[]) || [];
}

// ============================================================
// CREATE COMPANY (Quick-create from lead form)
// ============================================================

export async function createCompany(
  supabase: SupabaseClient,
  companyData: InsertCompany
): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .insert([companyData])
    .select()
    .single();

  if (error) {
    console.error("Error creating company:", error);
    throw new Error(`Failed to create company: ${error.message}`);
  }

  return data as Company;
}

// ============================================================
// LOG ACTIVITY
// ============================================================

export async function logActivity(
  supabase: SupabaseClient,
  activityData: InsertActivity
): Promise<void> {
  const { error } = await supabase.from("activities").insert([activityData]);

  if (error) {
    console.error("Error logging activity:", error);
    // Don't throw error for activity logging failures
  }
}

// ============================================================
// FETCH LEAD RELATED DATA (for detail page)
// ============================================================

export async function fetchLeadRelatedData(supabase: SupabaseClient, leadId: string) {
  // Fetch deals
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  // Fetch consultations
  const { data: consultations } = await supabase
    .from("consultations")
    .select("*, assigned_profile:profiles(*)")
    .eq("lead_id", leadId)
    .order("scheduled_at", { ascending: false });

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, assigned_profile:profiles(*)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  // Fetch notes
  const { data: notes } = await supabase
    .from("notes")
    .select("*, created_by_profile:profiles(*)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  // Fetch activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*, created_by_profile:profiles(*)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  return {
    deals: deals || [],
    consultations: consultations || [],
    tasks: tasks || [],
    notes: notes || [],
    activities: activities || [],
  };
}
