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

-- Helper function to check if the caller has an admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES: Users read/update their own profile; admins can read all
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public write access to profiles" ON public.profiles;

CREATE POLICY "Users can read own profile or admin reads all" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile on signup" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PROJECTS: Client reads their own project; admins can read/write all
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public write access to projects" ON public.projects;

CREATE POLICY "Clients read own projects, admins read all" ON public.projects
  FOR SELECT USING (auth.uid() = client_id OR public.is_admin());

CREATE POLICY "Admins or owners insert projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = client_id OR public.is_admin());

CREATE POLICY "Admins or owners update projects" ON public.projects
  FOR UPDATE USING (auth.uid() = client_id OR public.is_admin());

CREATE POLICY "Admins delete projects" ON public.projects
  FOR DELETE USING (public.is_admin());

-- MILESTONES: Read and write scoped to project ownership or admin
DROP POLICY IF EXISTS "Allow public read access to milestones" ON public.milestones;
DROP POLICY IF EXISTS "Allow public write access to milestones" ON public.milestones;

CREATE POLICY "View milestones for own project" ON public.milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = milestones.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Admins or project owner insert milestones" ON public.milestones
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = milestones.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Admins update milestones" ON public.milestones
  FOR UPDATE USING (public.is_admin());

-- LIVE URLS: Scoped to project ownership or admin
DROP POLICY IF EXISTS "Allow public read access to live_urls" ON public.live_urls;
DROP POLICY IF EXISTS "Allow public write access to live_urls" ON public.live_urls;

CREATE POLICY "View live URLs for own project" ON public.live_urls
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = live_urls.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Admins manage live URLs" ON public.live_urls
  FOR ALL USING (public.is_admin());

-- INVOICES: Scoped to project ownership or admin
DROP POLICY IF EXISTS "Allow public read access to invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow public write access to invoices" ON public.invoices;

CREATE POLICY "View invoices for own project" ON public.invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = invoices.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Admins manage invoices" ON public.invoices
  FOR ALL USING (public.is_admin());

-- COMMENTS: Scoped to project
DROP POLICY IF EXISTS "Allow public read access to comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public write access to comments" ON public.comments;

CREATE POLICY "View comments for own project" ON public.comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = comments.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Add comments to own project" ON public.comments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = comments.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

-- RATINGS: Scoped to project
DROP POLICY IF EXISTS "Allow public read access to ratings" ON public.ratings;
DROP POLICY IF EXISTS "Allow public write access to ratings" ON public.ratings;

CREATE POLICY "View ratings for own project" ON public.ratings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = ratings.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Submit rating for own project" ON public.ratings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = ratings.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

-- SUPPORT TICKETS: Scoped to project
DROP POLICY IF EXISTS "Allow public read access to support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Allow public write access to support_tickets" ON public.support_tickets;

CREATE POLICY "View support tickets for own project" ON public.support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = support_tickets.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Create support ticket for own project" ON public.support_tickets
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = support_tickets.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Update support tickets" ON public.support_tickets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = support_tickets.project_id AND (p.client_id = auth.uid() OR public.is_admin()))
  );

-- Enable Realtime WebSockets
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_urls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;

-- ==============================================================================
-- PRODUCTION SETUP & PURGE OF HISTORICAL DEMO SEED DATA
-- ==============================================================================
-- If your database previously had demo/seed projects, run this to ensure a clean production environment:
DELETE FROM public.live_urls WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.invoices WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.milestones WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.comments WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.ratings WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.support_tickets WHERE project_id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.projects WHERE id IN ('proj-bharatlogistics-01', 'proj-swasthyacare-01');
DELETE FROM public.profiles WHERE id IN ('client-bharatlogistics', 'client-swasthyacare');

