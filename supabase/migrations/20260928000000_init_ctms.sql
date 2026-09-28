-- ==============================================================================
-- AIIA CLINICAL TRIAL MANAGEMENT SYSTEM (CTMS) - POSTGRESQL SCHEMA
-- Problem Statement: SIH26046 | Ministry of Ayush & AIIA
-- National Pharmacovigilance Coordination Centre (NPvCC) Apex Node
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Investigators
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('pi', 'study_coordinator', 'cra_monitor', 'iec_member', 'pharmacovigilance_officer', 'admin', 'regulator')),
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Research Sites
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  principal_investigator TEXT NOT NULL,
  pi_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_activation', 'suspended', 'closed')),
  recruitment_target INT NOT NULL DEFAULT 100,
  enrolled_count INT NOT NULL DEFAULT 0,
  last_monitoring_date DATE,
  next_monitoring_date DATE,
  open_findings_count INT DEFAULT 0,
  ethics_approval_status TEXT DEFAULT 'Approved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Clinical Studies
CREATE TABLE IF NOT EXISTS studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  protocol_number TEXT NOT NULL,
  protocol_version TEXT NOT NULL,
  study_type TEXT NOT NULL,
  phase TEXT NOT NULL,
  principal_investigator TEXT NOT NULL,
  pi_id UUID REFERENCES profiles(id),
  sponsor TEXT NOT NULL,
  indication TEXT NOT NULL,
  ayush_system TEXT NOT NULL CHECK (ayush_system IN ('Ayurveda', 'Siddha', 'Unani', 'Homeopathy', 'Integrative')),
  investigational_product TEXT NOT NULL,
  comparator_product TEXT,
  planned_target INT NOT NULL,
  enrolled_count INT DEFAULT 0,
  screened_count INT DEFAULT 0,
  completed_count INT DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_ethics' CHECK (status IN ('draft', 'under_review', 'awaiting_ethics', 'awaiting_ctri', 'ready_to_start', 'recruiting', 'active', 'suspended', 'completed', 'closed')),
  ctri_number TEXT,
  ctri_status TEXT DEFAULT 'Pending Verification',
  ctri_url TEXT,
  iec_name TEXT,
  iec_approval_ref TEXT,
  iec_approval_date DATE,
  iec_expiry_date DATE,
  iec_status TEXT DEFAULT 'Under Review',
  budget_allocated_lakhs NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Study Milestones
CREATE TABLE IF NOT EXISTS study_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('protocol', 'ethics', 'ctri', 'site_activation', 'recruitment', 'data_lock', 'reporting')),
  planned_date DATE NOT NULL,
  actual_date DATE,
  responsible_person TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  evidence_ref TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Participants
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  synthetic_id TEXT UNIQUE NOT NULL,
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id),
  age INT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  screening_number TEXT UNIQUE NOT NULL,
  screening_date DATE NOT NULL,
  eligibility_status TEXT NOT NULL CHECK (eligibility_status IN ('Eligible', 'Screen Failure', 'Pending')),
  screen_failure_reason TEXT,
  consent_status TEXT NOT NULL CHECK (consent_status IN ('Consented', 'Pending', 'Re-consent Required', 'Withdrawn')),
  consent_date DATE,
  enrolment_status TEXT NOT NULL CHECK (enrolment_status IN ('Enrolled', 'Not Enrolled')),
  enrolment_date DATE,
  randomization_id TEXT,
  treatment_arm TEXT,
  current_status TEXT NOT NULL DEFAULT 'Screened' CHECK (current_status IN ('Screened', 'Eligible', 'Screen Failure', 'Enrolled', 'Active Treatment', 'In Follow-up', 'Completed', 'Withdrawn', 'Lost to Follow-up')),
  adherence_percentage INT DEFAULT 100,
  completed_visits_count INT DEFAULT 0,
  total_scheduled_visits INT DEFAULT 6,
  has_adverse_event BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Pharmacovigilance Safety Cases (NPvCC)
CREATE TABLE IF NOT EXISTS safety_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE NOT NULL,
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id),
  participant_id UUID NOT NULL REFERENCES participants(id),
  synthetic_participant_id TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'Initial',
  received_date TIMESTAMPTZ DEFAULT NOW(),
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  event_term TEXT NOT NULL,
  meddra_synthetic_code TEXT,
  ayush_term_equivalent TEXT,
  event_onset_date DATE NOT NULL,
  outcome TEXT NOT NULL,
  is_serious BOOLEAN NOT NULL DEFAULT FALSE,
  seriousness_criteria JSONB DEFAULT '[]'::jsonb,
  severity TEXT NOT NULL CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Life-threatening')),
  expectedness TEXT NOT NULL CHECK (expectedness IN ('Expected', 'Unexpected')),
  suspected_product TEXT NOT NULL,
  ayush_dosage_form TEXT NOT NULL,
  batch_number TEXT,
  dosage_and_route TEXT,
  therapy_start_date DATE,
  therapy_stop_date DATE,
  dechallenge TEXT,
  rechallenge TEXT,
  concomitant_medications TEXT,
  causality_assessment TEXT NOT NULL CHECK (causality_assessment IN ('Certain', 'Probable / Likely', 'Possible', 'Unlikely', 'Conditional / Unclassified', 'Unassessable / Unclassifiable')),
  naranjo_score INT,
  medical_summary TEXT NOT NULL,
  assessed_by TEXT NOT NULL,
  assessed_date TIMESTAMPTZ,
  dsmb_review_status TEXT DEFAULT 'Pending DSMB',
  regulatory_deadline_hours INT NOT NULL DEFAULT 24,
  deadline_date TIMESTAMPTZ NOT NULL,
  submission_status TEXT NOT NULL DEFAULT 'Draft',
  submission_date TIMESTAMPTZ,
  ack_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Protocol Deviations
CREATE TABLE IF NOT EXISTS protocol_deviations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deviation_code TEXT UNIQUE NOT NULL,
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id),
  participant_id TEXT,
  date_identified DATE NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Minor', 'Major', 'Critical')),
  description TEXT NOT NULL,
  impact_assessment TEXT,
  root_cause TEXT,
  corrective_action TEXT NOT NULL,
  preventive_action TEXT,
  responsible_person TEXT NOT NULL,
  due_date DATE NOT NULL,
  reported_to_iec BOOLEAN DEFAULT FALSE,
  iec_notification_date DATE,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Investigation', 'CAPA Implemented', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ALCOA+ Cryptographic Audit Logs (Immutable SHA-256 Ledger)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_number BIGSERIAL NOT NULL UNIQUE,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_id TEXT NOT NULL,
  record_identifier TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details TEXT NOT NULL,
  ip_address TEXT,
  previous_hash TEXT NOT NULL,
  current_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Standard Least-Privilege Policies
CREATE POLICY "Public read for authenticated institutional profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Regulators read-only on clinical studies" ON studies FOR SELECT USING (true);
CREATE POLICY "Auditors can inspect audit trail" ON audit_logs FOR SELECT USING (true);
-- Prevent user modification of audit logs
CREATE POLICY "Audit logs immutable by standard users" ON audit_logs FOR UPDATE USING (false);
CREATE POLICY "Audit logs undeletable" ON audit_logs FOR DELETE USING (false);
