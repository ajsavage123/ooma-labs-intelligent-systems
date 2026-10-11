-- ==============================================================================
-- OOMA LABS INTELLIGENT SYSTEMS - CLIENT PORTAL DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase
-- Currency: Indian Rupee (INR / ₹)
-- ==============================================================================

-- 1. Profiles Table (Admins & Clients)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'engineer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  summary TEXT,
  tier TEXT NOT NULL DEFAULT 'Strategic Engineering',
  overall_progress INTEGER NOT NULL DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  status TEXT NOT NULL DEFAULT 'in_development' CHECK (status IN ('in_development', 'sprint_planning', 'uat_testing', 'live_production', 'maintenance')),
  start_date TEXT NOT NULL,
  target_launch_date TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  lead_name TEXT DEFAULT 'Arjun Mehta',
  lead_role TEXT DEFAULT 'Lead Systems Architect (OOMA Labs Hyderabad)',
  lead_email TEXT DEFAULT 'arjun@oomalabs.com',
  lead_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Milestones / Sprint Stages Table
CREATE TABLE IF NOT EXISTS public.milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'in_progress', 'pending')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date TEXT NOT NULL,
  completed_date TEXT,
  deliverables TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Live Deployment URLs Table
CREATE TABLE IF NOT EXISTS public.live_urls (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('production', 'staging', 'figma', 'api_docs', 'mobile_preview')),
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'deploying', 'offline', 'internal')),
  uptime TEXT DEFAULT '99.9%',
  last_deployed TEXT DEFAULT 'Recently',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Invoices & Indian Payments Table (INR / ₹)
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  milestone_title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  gst_sac TEXT DEFAULT '998314',
  issue_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  paid_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'processing')),
  payment_method TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Sprint Discussion & Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'client',
  author_avatar TEXT,
  message TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Client Performance Ratings Table
CREATE TABLE IF NOT EXISTS public.ratings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 1 AND overall_score <= 5),
  engineering_quality INTEGER NOT NULL,
  communication INTEGER NOT NULL,
  velocity INTEGER NOT NULL,
  ui_ux_design INTEGER NOT NULL,
  feedback_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  client_recommendation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'change_request', 'infra_scaling', 'billing', 'general')),
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  assigned_engineer TEXT DEFAULT 'Arjun Mehta (Lead Systems Architect)',
  updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write access to profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public write access to projects" ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read access to milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Allow public write access to milestones" ON public.milestones FOR ALL USING (true);

CREATE POLICY "Allow public read access to live_urls" ON public.live_urls FOR SELECT USING (true);
CREATE POLICY "Allow public write access to live_urls" ON public.live_urls FOR ALL USING (true);

CREATE POLICY "Allow public read access to invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public write access to invoices" ON public.invoices FOR ALL USING (true);

CREATE POLICY "Allow public read access to comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public write access to comments" ON public.comments FOR ALL USING (true);

CREATE POLICY "Allow public read access to ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Allow public write access to ratings" ON public.ratings FOR ALL USING (true);

CREATE POLICY "Allow public read access to support_tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow public write access to support_tickets" ON public.support_tickets FOR ALL USING (true);

-- Enable Realtime WebSockets
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_urls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;

-- ==============================================================================
-- INITIAL SEED DATA (Indian Enterprise Clients)
-- ==============================================================================
INSERT INTO public.profiles (id, name, email, company, title, phone, avatar_url, role)
VALUES
  ('client-bharatlogistics', 'Rajesh Sharma', 'rajesh.sharma@bharatlogistics.in', 'BharatLogistics Tech Pvt Ltd', 'Chief Operating Officer', '+91 98490 21345', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80', 'client'),
  ('client-swasthyacare', 'Priya Nair', 'priya.nair@swasthyacare.com', 'SwasthyaCare Digital Health', 'VP of Product Engineering', '+91 98201 55432', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', 'client')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, client_id, title, company, summary, tier, overall_progress, status, start_date, target_launch_date, tech_stack)
VALUES
  ('proj-bharatlogistics-01', 'client-bharatlogistics', 'Pan-India Fleet Operations & FASTag Dispatch Portal', 'BharatLogistics Tech Pvt Ltd', 'Enterprise logistics platform tracking 1,200+ inter-city transport trucks across India with live GPS, automated FASTag toll tracking, GST E-Way Bill integration, and driver mobile app.', 'Strategic Engineering', 82, 'in_development', 'Jan 10, 2025', 'April 20, 2025', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google Maps India', 'NIC E-Way Bill API']),
  ('proj-swasthyacare-01', 'client-swasthyacare', 'ABDM Health Records & AI Clinic Automation', 'SwasthyaCare Digital Health', 'Ayushman Bharat Digital Mission (ABDM) M1-M3 certified health repository, automated OPD consultation booking, and electronic prescription delivery.', 'Strategic Engineering', 45, 'in_development', 'Feb 01, 2025', 'May 30, 2025', ARRAY['Next.js', 'FastAPI', 'PostgreSQL', 'ABDM Gateway', 'WhatsApp Cloud API'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.milestones (id, project_id, title, description, status, progress, due_date, completed_date, deliverables, sort_order)
VALUES
  ('m-1', 'proj-bharatlogistics-01', 'Phase 1: Client Discovery', 'Intake and audit of client assets, existing brand design tokens, AWS/GCP cloud environments, and external telematics vendor API credentials.', 'completed', 100, 'Jan 18, 2025', 'Jan 17, 2025', ARRAY['Client Asset & Brand Guideline Ingestion', 'NIC E-Way Bill & NETC FASTag API Keys Verification', 'Cloud Infrastructure Scoping & Access Setup'], 1),
  ('m-2', 'proj-bharatlogistics-01', 'Phase 2: Objective Requirements Gathering', 'Formal Scope of Work (SOW), multi-depot operational workflows, functional specifications, and PostgreSQL database ER schemas.', 'completed', 100, 'Jan 30, 2025', 'Jan 29, 2025', ARRAY['Formal SOW & Functional Requirement Document', 'PostgreSQL Schema & Depot Partitioning Model', 'Dispatcher & Driver User Story Mapping'], 2),
  ('m-3', 'proj-bharatlogistics-01', 'Phase 3: UI/UX Development', 'High-contrast driver screens optimized for direct sunlight, transport dispatcher operations console, and interactive Figma design sign-off.', 'completed', 100, 'Feb 18, 2025', 'Feb 17, 2025', ARRAY['Figma Design System & High-Contrast Mobile Tokens', 'Dispatcher Fleet Map & Toll Ledger Wireframes', 'Client Design Review & Final Sign-Off'], 3),
  ('m-4', 'proj-bharatlogistics-01', 'Phase 4: Development', 'Fullstack engineering: Live GPS map telemetry, NPCI FASTag webhook integration, driver web application, and GST tax invoicing engine.', 'in_progress', 85, 'March 28, 2025', NULL, ARRAY['Live GPS Telematics & FASTag Toll Ledger APIs', 'Driver Trip Manifest & E-Way Bill QR Scanner UI', 'GST Compliant Invoicing Engine (HSN/SAC 9965)'], 4),
  ('m-5', 'proj-bharatlogistics-01', 'Phase 5: Testing', 'End-to-end integration testing across 4 regional transport hubs, security vulnerability assessment, and client User Acceptance Testing (UAT).', 'pending', 20, 'April 10, 2025', NULL, ARRAY['Cross-Browser & Low-Connectivity Mobile QA', 'OWASP Top 10 Security Penetration Audit', 'Client User Acceptance Testing (UAT) Sign-Off'], 5),
  ('m-6', 'proj-bharatlogistics-01', 'Phase 6: Hosting', 'Production cloud launch on AWS Mumbai, domain SSL/TLS certificate binding, 99.98% uptime monitoring, and final handover.', 'pending', 0, 'April 20, 2025', NULL, ARRAY['Production AWS Mumbai Multi-AZ Launch', 'DNS & SSL Certificate Binding (fleet.bharatlogistics.in)', '24/7 Sentry & CloudWatch Monitoring Handover'], 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  deliverables = EXCLUDED.deliverables,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.invoices (id, project_id, invoice_number, milestone_title, amount, currency, gst_sac, issue_date, due_date, paid_date, status, payment_method)
VALUES
  ('inv-001', 'proj-bharatlogistics-01', 'INV-2025-0102', 'Milestone 1: Project Kickoff & Database Architecture', 450000, 'INR', '998314', 'Jan 15, 2025', 'Jan 30, 2025', 'Jan 28, 2025', 'paid', 'HDFC Bank NEFT/RTGS'),
  ('inv-002', 'proj-bharatlogistics-01', 'INV-2025-0148', 'Milestone 2: Live GPS Tracking & FASTag Toll API', 550000, 'INR', '998314', 'Feb 15, 2025', 'March 02, 2025', 'Feb 27, 2025', 'paid', 'Corporate NetBanking (ICICI)'),
  ('inv-003', 'proj-bharatlogistics-01', 'INV-2025-0219', 'Milestone 3: Driver Mobile Web App & E-Way Bill Verification', 450000, 'INR', '998314', 'March 01, 2025', 'March 25, 2025', NULL, 'pending', NULL),
  ('inv-004', 'proj-bharatlogistics-01', 'INV-2025-0290', 'Milestone 4: GST Invoicing, Fuel Calculator & Launch', 400000, 'INR', '998314', 'April 01, 2025', 'April 25, 2025', NULL, 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_urls (id, project_id, label, url, type, status, uptime, last_deployed, notes)
VALUES
  ('url-1', 'proj-bharatlogistics-01', 'Production Dashboard', 'https://ops.bharatlogistics.in', 'production', 'live', '99.98%', '4 hours ago', 'Primary dispatch console for North & West logistics corridors.'),
  ('url-2', 'proj-bharatlogistics-01', 'Staging & QA Environment', 'https://stage.bharatlogistics.in', 'staging', 'live', '99.95%', 'Yesterday at 18:30 IST', 'Build #192: FASTag ICICI NETC auto-reconciliation active.'),
  ('url-3', 'proj-bharatlogistics-01', 'Figma Design System', 'https://figma.com/@oomalabs/bharat-logistics-system', 'figma', 'live', '100%', 'Updated weekly', 'Complete mobile & web components with Indian Hindi localization specs.'),
  ('url-4', 'proj-bharatlogistics-01', 'REST API Documentation', 'https://api-docs.bharatlogistics.in', 'api_docs', 'live', '99.99%', '3 days ago', 'Swagger specs for GPS telematics vendors and warehouse ERPs.')
ON CONFLICT (id) DO NOTHING;
