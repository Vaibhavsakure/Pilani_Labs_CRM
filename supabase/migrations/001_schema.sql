-- ============================================================
-- PilaniLabs CRM — Full Database Schema
-- Migration 001: Tables, Enums, Indexes, Triggers
-- ============================================================

-- =========================
-- ENUMS
-- =========================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'viewer');

CREATE TYPE lead_source AS ENUM (
  'website', 'brochure_download', 'consultation_form',
  'linkedin', 'referral', 'manual', 'event'
);

CREATE TYPE lead_interest AS ENUM (
  'virtual_intensive', 'in_person_intensive',
  'enterprise_private_program', 'unsure'
);

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'
);

CREATE TYPE deal_stage AS ENUM (
  'new_lead', 'contacted', 'consultation_scheduled',
  'consultation_done', 'proposal_sent', 'negotiation', 'won', 'lost'
);

CREATE TYPE consultation_status AS ENUM (
  'scheduled', 'completed', 'cancelled', 'no_show'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TYPE task_status AS ENUM ('pending', 'completed', 'overdue');

CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'accepted', 'rejected');

CREATE TYPE program_format AS ENUM (
  'virtual_intensive', 'in_person_intensive', 'enterprise_private_program'
);

CREATE TYPE program_status AS ENUM ('planned', 'active', 'completed', 'cancelled');

CREATE TYPE activity_type AS ENUM (
  'note', 'call', 'email', 'meeting',
  'status_change', 'proposal_sent', 'task_completed'
);


-- =========================
-- UTILITY: updated_at trigger
-- =========================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- 1. PROFILES
-- =========================

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        user_role NOT NULL DEFAULT 'viewer',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);


-- =========================
-- 2. COMPANIES
-- =========================

CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  industry      TEXT,
  country       TEXT DEFAULT 'India',
  company_size  TEXT,
  website       TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);

CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();


-- =========================
-- 3. LEADS
-- =========================

CREATE TABLE leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  designation       TEXT,
  company_id        UUID REFERENCES companies(id) ON DELETE SET NULL,
  source            lead_source NOT NULL DEFAULT 'manual',
  interest          lead_interest DEFAULT 'unsure',
  status            lead_status NOT NULL DEFAULT 'new',
  assigned_to       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority          task_priority NOT NULL DEFAULT 'medium',
  next_follow_up_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();


-- =========================
-- 4. DEALS
-- =========================

CREATE TABLE deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_id          UUID REFERENCES companies(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  stage               deal_stage NOT NULL DEFAULT 'new_lead',
  value               NUMERIC(12,2) DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'INR',
  expected_close_date DATE,
  lost_reason         TEXT,
  assigned_to         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_lead_id ON deals(lead_id);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_expected_close ON deals(expected_close_date);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();


-- =========================
-- 5. CONSULTATIONS
-- =========================

CREATE TABLE consultations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_id    UUID REFERENCES companies(id) ON DELETE SET NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  meeting_link  TEXT,
  assigned_to   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status        consultation_status NOT NULL DEFAULT 'scheduled',
  outcome       TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX idx_consultations_lead_id ON consultations(lead_id);
CREATE INDEX idx_consultations_assigned_to ON consultations(assigned_to);


-- =========================
-- 6. PROGRAMS (Cohorts)
-- =========================

CREATE TABLE programs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  format            program_format NOT NULL,
  start_date        DATE,
  end_date          DATE,
  max_participants  INT DEFAULT 30,
  status            program_status NOT NULL DEFAULT 'planned',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_format ON programs(format);


-- =========================
-- 7. TASKS
-- =========================

CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_id  UUID REFERENCES companies(id) ON DELETE SET NULL,
  deal_id     UUID REFERENCES deals(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_at      TIMESTAMPTZ,
  priority    task_priority NOT NULL DEFAULT 'medium',
  status      task_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);
CREATE INDEX idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);

CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();


-- =========================
-- 8. NOTES
-- =========================

CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  deal_id     UUID REFERENCES deals(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_lead_id ON notes(lead_id);
CREATE INDEX idx_notes_deal_id ON notes(deal_id);
CREATE INDEX idx_notes_company_id ON notes(company_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);


-- =========================
-- 9. ACTIVITIES
-- =========================

CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  deal_id     UUID REFERENCES deals(id) ON DELETE CASCADE,
  type        activity_type NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
CREATE INDEX idx_activities_company_id ON activities(company_id);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);


-- =========================
-- 10. PROPOSALS
-- =========================

CREATE TABLE proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id     UUID REFERENCES deals(id) ON DELETE CASCADE,
  lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_id  UUID REFERENCES companies(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  status      proposal_status NOT NULL DEFAULT 'draft',
  file_url    TEXT,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposals_deal_id ON proposals(deal_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_lead_id ON proposals(lead_id);
