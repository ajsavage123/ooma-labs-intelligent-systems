-- Ooma Workspace Supabase Schema

-- Partnership Requests Table
CREATE TABLE IF NOT EXISTS partnership_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    profession TEXT,
    expertise TEXT NOT NULL,
    linkedin TEXT,
    interest TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    designation TEXT CHECK (designation IN ('Innovation & Research Team', 'Developer & Engineering Team', 'Business Strategy & Marketing Team', NULL)),
    role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('partner', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    team_members TEXT,
    drive_link TEXT,
    github_link TEXT,
    current_stage TEXT NOT NULL DEFAULT 'Ideology & Concept',
    progress INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Logs Table
CREATE TABLE IF NOT EXISTS timeline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    stage TEXT NOT NULL,
    update_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Ratings Table
CREATE TABLE IF NOT EXISTS admin_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    problem_importance INTEGER CHECK (problem_importance >= 1 AND problem_importance <= 10),
    technical_feasibility INTEGER CHECK (technical_feasibility >= 1 AND technical_feasibility <= 10),
    market_demand INTEGER CHECK (market_demand >= 1 AND market_demand <= 10),
    impact_potential INTEGER CHECK (impact_potential >= 1 AND impact_potential <= 10),
    development_complexity INTEGER CHECK (development_complexity >= 1 AND development_complexity <= 10),
    innovation_score NUMERIC(4, 2),
    notes TEXT,
    rated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_ratings ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Simplistic for initial setup, can be refined)
-- For now, let's allow authenticated users to read and admins to do everything.

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Everyone can insert partnership requests (public)
CREATE POLICY "Public can insert partnership requests" ON partnership_requests FOR INSERT WITH CHECK (true);

-- Admins can view/update partnership requests
CREATE POLICY "Admins can manage partnership requests" ON partnership_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Projects access: Partners and Admins can read all projects
CREATE POLICY "Authenticated users can read projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Innovation Team can create projects" ON projects FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND designation = 'Innovation & Research Team')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update projects" ON projects FOR UPDATE TO authenticated USING (true);

-- Timeline logs: Read by all authenticated users
CREATE POLICY "Authenticated users can read timeline" ON timeline_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert timeline" ON timeline_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Admin ratings: Only admins can manage
CREATE POLICY "Admins can manage ratings" ON admin_ratings FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
