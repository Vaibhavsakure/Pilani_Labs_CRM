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
