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
