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
-- ============================================================
-- PilaniLabs CRM — Row Level Security Policies
-- Migration 002: RLS for all tables
-- ============================================================
-- Policy: Internal CRM tool — all authenticated users can read.
-- Write access is granted to all authenticated users (can be
-- tightened per-role in a future migration).
-- ============================================================


-- =========================
-- PROFILES
-- =========================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read all profiles
CREATE POLICY "Profiles: authenticated read"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own profile (on first sign-in)
CREATE POLICY "Profiles: self insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Profiles: self update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- =========================
-- COMPANIES
-- =========================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies: authenticated read"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Companies: authenticated insert"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Companies: authenticated update"
  ON companies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Companies: authenticated delete"
  ON companies FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- LEADS
-- =========================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads: authenticated read"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Leads: authenticated insert"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Leads: authenticated update"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Leads: authenticated delete"
  ON leads FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- DEALS
-- =========================

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deals: authenticated read"
  ON deals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Deals: authenticated insert"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Deals: authenticated update"
  ON deals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Deals: authenticated delete"
  ON deals FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- CONSULTATIONS
-- =========================

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultations: authenticated read"
  ON consultations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Consultations: authenticated insert"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Consultations: authenticated update"
  ON consultations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Consultations: authenticated delete"
  ON consultations FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- PROGRAMS
-- =========================

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs: authenticated read"
  ON programs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Programs: authenticated insert"
  ON programs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Programs: authenticated update"
  ON programs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Programs: authenticated delete"
  ON programs FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- TASKS
-- =========================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks: authenticated read"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tasks: authenticated insert"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Tasks: authenticated update"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tasks: authenticated delete"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- NOTES
-- =========================

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes: authenticated read"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Notes: authenticated insert"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Notes: authenticated update"
  ON notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Notes: authenticated delete"
  ON notes FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- ACTIVITIES
-- =========================

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities: authenticated read"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Activities: authenticated insert"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Activities: authenticated update"
  ON activities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Activities: authenticated delete"
  ON activities FOR DELETE
  TO authenticated
  USING (true);


-- =========================
-- PROPOSALS
-- =========================

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Proposals: authenticated read"
  ON proposals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Proposals: authenticated insert"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Proposals: authenticated update"
  ON proposals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Proposals: authenticated delete"
  ON proposals FOR DELETE
  TO authenticated
  USING (true);
-- ============================================================
-- PilaniLabs CRM — Seed Data
-- Run after 001_schema.sql and 002_rls_policies.sql
-- ============================================================
-- Uses hardcoded UUIDs for consistent FK references.
-- Profile seeds use placeholder UUIDs (not linked to auth.users
-- until real authentication is configured).
-- ============================================================


-- =========================
-- COMPANIES
-- =========================

INSERT INTO companies (id, name, industry, country, company_size, website, notes) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Infosys', 'IT Services & Consulting', 'India', '10000+', 'https://www.infosys.com', 'Major IT services company. Interested in AI leadership programs for VP+ level.'),
  ('c0000001-0000-0000-0000-000000000002', 'Wipro', 'IT Services & Consulting', 'India', '10000+', 'https://www.wipro.com', 'Exploring enterprise-wide digital transformation training.'),
  ('c0000001-0000-0000-0000-000000000003', 'Tata Consultancy Services', 'IT Services & Consulting', 'India', '10000+', 'https://www.tcs.com', 'Innovation department exploring AI strategy workshops.'),
  ('c0000001-0000-0000-0000-000000000004', 'Reliance Jio', 'Telecommunications', 'India', '10000+', 'https://www.jio.com', 'AI strategy team evaluating private enterprise programs.'),
  ('c0000001-0000-0000-0000-000000000005', 'Mahindra Group', 'Conglomerate', 'India', '10000+', 'https://www.mahindra.com', 'CTO office interested in hands-on AI intensive.'),
  ('c0000001-0000-0000-0000-000000000006', 'HDFC Bank', 'Banking & Financial Services', 'India', '10000+', 'https://www.hdfcbank.com', 'Digital transformation division. Won enterprise deal.');


-- =========================
-- LEADS
-- =========================

INSERT INTO leads (id, full_name, email, phone, designation, company_id, source, interest, status, priority, next_follow_up_at) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Rajesh Sharma', 'rajesh.sharma@infosys.com', '+91 98765 43210', 'VP of Technology', 'c0000001-0000-0000-0000-000000000001', 'linkedin', 'enterprise_private_program', 'qualified', 'high', '2026-07-10 10:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000002', 'Priya Nair', 'priya.nair@wipro.com', '+91 98765 43211', 'Chief Digital Officer', 'c0000001-0000-0000-0000-000000000002', 'referral', 'virtual_intensive', 'contacted', 'high', '2026-07-09 14:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@tcs.com', '+91 98765 43212', 'Director of Innovation', 'c0000001-0000-0000-0000-000000000003', 'website', 'in_person_intensive', 'new', 'medium', '2026-07-12 11:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000004', 'Sneha Gupta', 'sneha.g@reliancejio.com', '+91 98765 43213', 'Head of AI Strategy', 'c0000001-0000-0000-0000-000000000004', 'consultation_form', 'enterprise_private_program', 'qualified', 'high', '2026-07-08 09:30:00+05:30'),
  ('d0000001-0000-0000-0000-000000000005', 'Vikram Desai', 'vikram.d@mahindra.com', '+91 98765 43214', 'CTO', 'c0000001-0000-0000-0000-000000000005', 'event', 'in_person_intensive', 'contacted', 'medium', '2026-07-11 15:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000006', 'Ananya Reddy', 'ananya.r@hdfcbank.com', '+91 98765 43215', 'SVP Digital Transformation', 'c0000001-0000-0000-0000-000000000006', 'referral', 'enterprise_private_program', 'converted', 'high', NULL),
  ('d0000001-0000-0000-0000-000000000007', 'Karthik Iyer', 'karthik.i@tatasteel.com', '+91 98765 43216', 'General Manager - IT', NULL, 'website', 'virtual_intensive', 'qualified', 'medium', '2026-07-13 10:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000008', 'Meera Joshi', 'meera.j@adani.com', '+91 98765 43217', 'VP - Strategic Initiatives', NULL, 'brochure_download', 'enterprise_private_program', 'contacted', 'low', '2026-07-14 11:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000009', 'Rohan Kapoor', 'rohan.k@airtel.com', '+91 98765 43218', 'CDO', NULL, 'linkedin', 'virtual_intensive', 'new', 'medium', '2026-07-15 09:00:00+05:30'),
  ('d0000001-0000-0000-0000-000000000010', 'Deepa Menon', 'deepa.m@larsentoubro.com', '+91 98765 43219', 'Chief Strategy Officer', NULL, 'event', 'in_person_intensive', 'lost', 'low', NULL);


-- =========================
-- DEALS
-- =========================

INSERT INTO deals (id, lead_id, company_id, title, stage, value, currency, expected_close_date, lost_reason) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Infosys VP AI Leadership Program', 'proposal_sent', 250000.00, 'INR', '2026-08-15', NULL),
  ('e0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'Wipro CDO Virtual Intensive', 'consultation_done', 480000.00, 'INR', '2026-08-30', NULL),
  ('e0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'TCS Innovation Team Workshop', 'new_lead', 150000.00, 'INR', '2026-09-15', NULL),
  ('e0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'Reliance Jio Enterprise AI Program', 'negotiation', 720000.00, 'INR', '2026-07-31', NULL),
  ('e0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'Mahindra CTO In-Person Intensive', 'contacted', 350000.00, 'INR', '2026-09-01', NULL),
  ('e0000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'HDFC Bank Enterprise Private Program', 'won', 890000.00, 'INR', '2026-06-28', NULL),
  ('e0000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000007', NULL, 'Tata Steel Virtual Intensive', 'consultation_scheduled', 200000.00, 'INR', '2026-09-10', NULL),
  ('e0000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000010', NULL, 'L&T CSO Strategy Program', 'lost', 400000.00, 'INR', '2026-07-01', 'Budget constraints — postponed to next FY');


-- =========================
-- CONSULTATIONS
-- =========================

INSERT INTO consultations (id, lead_id, company_id, scheduled_at, meeting_link, status, outcome, notes) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', '2026-07-10 10:00:00+05:30', 'https://meet.google.com/abc-def-ghi', 'scheduled', NULL, 'Discovery call — discuss AI leadership program scope and cohort size.'),
  ('f0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', '2026-07-05 14:00:00+05:30', 'https://zoom.us/j/123456789', 'completed', 'Interested in 2-day virtual intensive for 15 executives. Requested proposal.', 'CDO Priya Nair attended with 2 direct reports. Very engaged.'),
  ('f0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', '2026-07-03 09:30:00+05:30', 'https://meet.google.com/jkl-mno-pqr', 'completed', 'Moving to negotiation. Wants customized enterprise program.', 'Sneha discussed budget approval process. Need CFO sign-off.'),
  ('f0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', '2026-07-11 15:00:00+05:30', 'https://teams.microsoft.com/l/meetup/xyz', 'scheduled', NULL, 'Strategy session with CTO Vikram. Discuss in-person intensive format.'),
  ('f0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', '2026-06-25 11:00:00+05:30', 'https://zoom.us/j/987654321', 'completed', 'Deal closed. 3-month enterprise program starting August.', 'Ananya confirmed budget and participant list.'),
  ('f0000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000010', NULL, '2026-06-20 16:00:00+05:30', 'https://meet.google.com/stu-vwx-yza', 'cancelled', NULL, 'Deepa cancelled — L&T postponing AI initiatives to next fiscal year.');


-- =========================
-- PROGRAMS (Cohorts)
-- =========================

INSERT INTO programs (id, name, format, start_date, end_date, max_participants, status) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'AI Strategy Virtual Intensive — Cohort 7', 'virtual_intensive', '2026-08-18', '2026-08-19', 25, 'planned'),
  ('a0000001-0000-0000-0000-000000000002', 'Executive AI In-Person Intensive — Bangalore Q3', 'in_person_intensive', '2026-09-08', '2026-09-10', 20, 'planned'),
  ('a0000001-0000-0000-0000-000000000003', 'HDFC Bank Enterprise Private Program', 'enterprise_private_program', '2026-08-01', '2026-10-31', 40, 'active');


-- =========================
-- TASKS
-- =========================

INSERT INTO tasks (id, title, description, lead_id, company_id, deal_id, due_at, priority, status) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Send proposal to Rajesh Sharma', 'Prepare and send the AI Leadership Program proposal to VP Technology at Infosys.', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', '2026-07-09 17:00:00+05:30', 'high', 'pending'),
  ('b0000001-0000-0000-0000-000000000002', 'Follow up with Priya Nair', 'Check if Wipro CDO has reviewed the virtual intensive proposal.', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', '2026-07-09 14:00:00+05:30', 'high', 'pending'),
  ('b0000001-0000-0000-0000-000000000003', 'Schedule discovery call with Amit Patel', 'Reach out to TCS Director of Innovation to schedule initial discovery call.', 'd0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000003', '2026-07-10 12:00:00+05:30', 'medium', 'pending'),
  ('b0000001-0000-0000-0000-000000000004', 'Prepare negotiation brief for Reliance Jio', 'Compile pricing options and customization scope for enterprise program negotiation.', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000004', '2026-07-08 09:00:00+05:30', 'high', 'pending'),
  ('b0000001-0000-0000-0000-000000000005', 'Confirm Vikram Desai meeting details', 'Send calendar invite and agenda for CTO strategy session.', 'd0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000005', '2026-07-10 10:00:00+05:30', 'medium', 'pending'),
  ('b0000001-0000-0000-0000-000000000006', 'Onboard HDFC Bank participants', 'Send welcome kit and pre-program materials to all 40 participants.', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000006', '2026-07-25 17:00:00+05:30', 'high', 'pending'),
  ('b0000001-0000-0000-0000-000000000007', 'Update Cohort 7 curriculum', 'Finalize session plan and case studies for Virtual Intensive Cohort 7.', NULL, NULL, NULL, '2026-08-10 17:00:00+05:30', 'medium', 'pending'),
  ('b0000001-0000-0000-0000-000000000008', 'Review lost deal feedback — L&T', 'Analyze Deepa Menon feedback and plan re-engagement for next FY.', 'd0000001-0000-0000-0000-000000000010', NULL, 'e0000001-0000-0000-0000-000000000008', '2026-07-15 12:00:00+05:30', 'low', 'pending');


-- =========================
-- NOTES
-- =========================

INSERT INTO notes (id, lead_id, company_id, deal_id, body) VALUES
  ('70000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'Rajesh mentioned Infosys is planning org-wide AI upskilling. Our Enterprise Private Program is a strong fit. He wants a proposal by end of week.'),
  ('70000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'Priya''s team loved the consultation demo. They want a 2-day virtual intensive format. Budget is pre-approved up to ₹5L.'),
  ('70000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000004', 'Sneha confirmed Reliance Jio wants a fully customized program. Need to include telecom-specific AI use cases. CFO approval expected by July 15.'),
  ('70000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000006', 'HDFC deal closed! Ananya sent the signed contract. 40 participants confirmed. Program starts August 1. Need to begin onboarding immediately.'),
  ('70000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000010', NULL, 'e0000001-0000-0000-0000-000000000008', 'Deepa shared that L&T is reallocating AI budget to other priorities this FY. She is personally interested and may revisit in Q1 next year.'),
  ('70000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000003', 'Amit downloaded the brochure and filled out the consultation form. Seems like a warm lead. Schedule discovery call ASAP.');


-- =========================
-- ACTIVITIES
-- =========================

INSERT INTO activities (id, lead_id, company_id, deal_id, type, title, description) VALUES
  ('80000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'meeting', 'Discovery call with Rajesh Sharma', 'Initial discovery call. Discussed Infosys AI strategy goals and training needs.'),
  ('80000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'proposal_sent', 'Proposal sent to Infosys', 'Sent AI Leadership Program proposal (₹2.5L) via email.'),
  ('80000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'meeting', 'Consultation with Priya Nair', 'Demo of Virtual Intensive format. Priya attended with 2 reports.'),
  ('80000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'status_change', 'Deal moved to Consultation Done', 'Wipro CDO deal advanced from Consultation Scheduled to Consultation Done.'),
  ('80000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000004', 'call', 'Negotiation call with Sneha Gupta', 'Discussed pricing and customization scope. Awaiting CFO sign-off.'),
  ('80000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000006', 'status_change', 'Deal Won — HDFC Bank', 'Enterprise Private Program deal closed at ₹8.9L. Contract signed.'),
  ('80000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000003', 'email', 'Welcome email sent to Amit Patel', 'Sent PilaniLabs intro email and brochure to TCS Director of Innovation.'),
  ('80000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000005', 'email', 'Follow-up email to Vikram Desai', 'Sent meeting agenda and program overview for CTO strategy session.'),
  ('80000001-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000010', NULL, 'e0000001-0000-0000-0000-000000000008', 'status_change', 'Deal Lost — L&T', 'L&T postponed AI initiatives. Deal marked as lost. Re-engage next FY.'),
  ('80000001-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000006', 'task_completed', 'Contract signed by HDFC Bank', 'Ananya Reddy signed and returned the enterprise program contract.');


-- =========================
-- PROPOSALS
-- =========================

INSERT INTO proposals (id, deal_id, lead_id, company_id, title, amount, status, file_url, sent_at) VALUES
  ('90000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Infosys AI Leadership Program — Proposal', 250000.00, 'sent', '/proposals/infosys-ai-leadership-v1.pdf', '2026-07-06 10:00:00+05:30'),
  ('90000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'Wipro Virtual Intensive — Proposal', 480000.00, 'draft', NULL, NULL),
  ('90000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'Reliance Jio Enterprise AI Program — Proposal', 720000.00, 'sent', '/proposals/reliance-jio-enterprise-v2.pdf', '2026-07-04 16:00:00+05:30'),
  ('90000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'HDFC Bank Enterprise Private Program — Proposal', 890000.00, 'accepted', '/proposals/hdfc-enterprise-private-final.pdf', '2026-06-22 11:00:00+05:30');
