// ============================================================
// PilaniLabs CRM — Database TypeScript Types
// Generated from supabase/migrations/001_schema.sql
// ============================================================

// =========================
// Enum Types
// =========================

export type UserRole = "admin" | "manager" | "sales" | "viewer";

export type LeadSource =
  | "website"
  | "brochure_download"
  | "consultation_form"
  | "linkedin"
  | "referral"
  | "manual"
  | "event";

export type LeadInterest =
  | "virtual_intensive"
  | "in_person_intensive"
  | "enterprise_private_program"
  | "unsure";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted"
  | "lost";

export type DealStage =
  | "new_lead"
  | "contacted"
  | "consultation_scheduled"
  | "consultation_done"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type ConsultationStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "completed" | "overdue";

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";

export type ProgramFormat =
  | "virtual_intensive"
  | "in_person_intensive"
  | "enterprise_private_program";

export type ProgramStatus = "planned" | "active" | "completed" | "cancelled";

export type ActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "status_change"
  | "proposal_sent"
  | "task_completed";

// =========================
// Table Row Types
// =========================

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  company_size: string | null;
  website: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  company_id: string | null;
  source: LeadSource;
  interest: LeadInterest | null;
  status: LeadStatus;
  assigned_to: string | null;
  priority: TaskPriority;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  lead_id: string | null;
  company_id: string | null;
  title: string;
  stage: DealStage;
  value: number;
  currency: string;
  expected_close_date: string | null;
  lost_reason: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  lead_id: string | null;
  company_id: string | null;
  scheduled_at: string;
  meeting_link: string | null;
  assigned_to: string | null;
  status: ConsultationStatus;
  outcome: string | null;
  notes: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  name: string;
  format: ProgramFormat;
  start_date: string | null;
  end_date: string | null;
  max_participants: number;
  status: ProgramStatus;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  lead_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  assigned_to: string | null;
  due_at: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  lead_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  body: string;
  created_by: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  lead_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  type: ActivityType;
  title: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Proposal {
  id: string;
  deal_id: string;
  lead_id: string | null;
  company_id: string | null;
  title: string;
  amount: number;
  status: ProposalStatus;
  file_url: string | null;
  sent_at: string | null;
  created_at: string;
}

// =========================
// Insert Types (omit auto-generated fields)
// =========================

export type InsertProfile = Omit<Profile, "created_at">;
export type InsertCompany = Omit<Company, "id" | "created_at" | "updated_at">;
export type InsertLead = Omit<Lead, "id" | "created_at" | "updated_at">;
export type InsertDeal = Omit<Deal, "id" | "created_at" | "updated_at">;
export type InsertConsultation = Omit<Consultation, "id" | "created_at">;
export type InsertProgram = Omit<Program, "id" | "created_at">;
export type InsertTask = Omit<Task, "id" | "created_at" | "updated_at">;
export type InsertNote = Omit<Note, "id" | "created_at">;
export type InsertActivity = Omit<Activity, "id" | "created_at">;
export type InsertProposal = Omit<Proposal, "id" | "created_at">;

// =========================
// Update Types (all fields optional except id)
// =========================

export type UpdateProfile = Partial<Omit<Profile, "id" | "created_at">> & { id: string };
export type UpdateCompany = Partial<Omit<Company, "id" | "created_at" | "updated_at">> & { id: string };
export type UpdateLead = Partial<Omit<Lead, "id" | "created_at" | "updated_at">> & { id: string };
export type UpdateDeal = Partial<Omit<Deal, "id" | "created_at" | "updated_at">> & { id: string };
export type UpdateConsultation = Partial<Omit<Consultation, "id" | "created_at">> & { id: string };
export type UpdateProgram = Partial<Omit<Program, "id" | "created_at">> & { id: string };
export type UpdateTask = Partial<Omit<Task, "id" | "created_at" | "updated_at">> & { id: string };
export type UpdateNote = Partial<Omit<Note, "id" | "created_at">> & { id: string };
export type UpdateProposal = Partial<Omit<Proposal, "id" | "created_at">> & { id: string };

// =========================
// Joined / Extended Types (for queries with relations)
// =========================

export interface LeadWithCompany extends Lead {
  company: Company | null;
}

export interface DealWithRelations extends Deal {
  lead: Lead | null;
  company: Company | null;
  assigned_profile: Profile | null;
}

export interface TaskWithRelations extends Task {
  lead: Lead | null;
  company: Company | null;
  deal: Deal | null;
  assigned_profile: Profile | null;
}

export interface ConsultationWithRelations extends Consultation {
  lead: Lead | null;
  company: Company | null;
  assigned_profile: Profile | null;
}

export interface ProposalWithRelations extends Proposal {
  deal: Deal | null;
  lead: Lead | null;
  company: Company | null;
}

export interface NoteWithCreator extends Note {
  created_by_profile: Profile | null;
}

export interface ActivityWithCreator extends Activity {
  created_by_profile: Profile | null;
}
