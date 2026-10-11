import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClientPortal, formatINR, SpreadsheetRow } from "../../context/ClientPortalContext";
import {
  Plus,
  Layers,
  CreditCard,
  Globe,
  Gift,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Save,
  Building,
  User,
  Calendar,
  ExternalLink,
  Edit2,
  RefreshCw,
  Sparkles,
  Database,
  Check,
  Copy,
  ShieldCheck,
  AlertCircle,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ProjectLiveUrl } from "../../types";
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from "../../lib/supabase";

const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
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
  status TEXT NOT NULL DEFAULT 'in_development',
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
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0,
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
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'live',
  uptime TEXT DEFAULT '99.9%',
  last_deployed TEXT DEFAULT 'Recently',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Invoices & Indian Payments Table
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
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Comments Table
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

-- 7. Ratings Table
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
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_engineer TEXT DEFAULT 'Arjun Mehta (Lead Systems Architect)',
  updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security
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

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_urls;
`;

export const PortalAdminManager: React.FC = () => {
  const {
    projects,
    activeProject,
    availableClients,
    selectProject,
    updateMilestone,
    advanceProjectStage,
    setProjectStageIndex,
    addMilestone,
    deleteMilestone,
    updateLiveUrl,
    addLiveUrl,
    deleteLiveUrl,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    createClientAndProject,
    deleteProject,
    exportToSpreadsheetCSV,
    importFromSpreadsheetCSV,
    getSpreadsheetRows,
    saveSpreadsheetRow,
    verifyReferralRequirement,
    confirmReferralAdvancePaid,
    supabaseStatus,
    syncSupabase,
    uploadLocalToSupabase,
  } = useClientPortal();

  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject.id);
  const [activeAdminTab, setActiveAdminTab] = useState<"stages" | "billing" | "referrals" | "urls" | "spreadsheet" | "supabase">("stages");

  // Supabase Configuration State
  const initialConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialConfig.anonKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isUploadingToSupabase, setIsUploadingToSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Admin PIN / Security Gate (prevents clients from accessing)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("ooma_admin_auth") === "true";
  });
  const [adminPinInput, setAdminPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ["ooma-admin", "admin2025", "ooma2025", "oomalabs", "admin123"];
    if (validPins.includes(adminPinInput.trim().toLowerCase())) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("ooma_admin_auth", "true");
      setPinError(false);
      toast.success("Welcome Founder! Admin console unlocked.");
    } else {
      setPinError(true);
      toast.error("Access Denied: Incorrect Founder Master Password.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("ooma_admin_auth");
    toast.info("Admin console locked.");
    navigate("/portal");
  };

  // Create Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("+91 ");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectSummary, setNewProjectSummary] = useState("");
  const [newLaunchDate, setNewLaunchDate] = useState("May 15, 2025");
  const [newTechStack, setNewTechStack] = useState("React, Node.js, PostgreSQL");

  // New Milestone Modal State
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");
  const [newStageDesc, setNewStageDesc] = useState("");
  const [newStageDueDate, setNewStageDueDate] = useState("May 01, 2025");

  // New Invoice Modal State
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newInvTitle, setNewInvTitle] = useState("");
  const [newInvAmount, setNewInvAmount] = useState(350000);
  const [newInvDueDate, setNewInvDueDate] = useState("April 30, 2025");

  // New Live URL State
  const [isAddUrlOpen, setIsAddUrlOpen] = useState(false);
  const [newUrlLabel, setNewUrlLabel] = useState("");
  const [newUrlAddress, setNewUrlAddress] = useState("https://");
  const [newUrlType, setNewUrlType] = useState<ProjectLiveUrl["type"]>("production");

  // CSV Import State
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [pastedCsvText, setPastedCsvText] = useState("");

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || activeProject;

  // Dedicated log notes state per milestone
  const [stageNotes, setStageNotes] = useState<Record<string, string>>({});
  const [savingStageId, setSavingStageId] = useState<string | null>(null);

  // Synchronize stage notes with currentProject milestones
  useEffect(() => {
    const notesMap: Record<string, string> = {};
    (currentProject.milestones || []).forEach((m) => {
      notesMap[m.id] = m.notes || m.description || "";
    });
    setStageNotes(notesMap);
  }, [currentProject.id, currentProject.milestones]);

  const activeMilestoneIndex = currentProject.milestones.findIndex((m) => m.status === "in_progress");
  const currentActiveStageIdx = activeMilestoneIndex !== -1 ? activeMilestoneIndex : 0;

  const handleNextStage = () => {
    advanceProjectStage(currentProject.id);
    const nextIdx = Math.min(currentProject.milestones.length - 1, currentActiveStageIdx + 1);
    const nextMilestone = currentProject.milestones[nextIdx];
    const cleanTitle = (nextMilestone?.title || `Stage ${nextIdx + 1}`).replace(/^\d+\.\s*/, "");
    toast.success(`Advanced to Stage ${nextIdx + 1}: ${cleanTitle}! Live on client portal.`);
  };

  const handlePreviousStage = () => {
    if (currentActiveStageIdx > 0) {
      setProjectStageIndex(currentProject.id, currentActiveStageIdx - 1);
      toast.info(`Moved back to Stage ${currentActiveStageIdx}`);
    }
  };

  const handleJumpToStage = (idx: number) => {
    setProjectStageIndex(currentProject.id, idx);
    const target = currentProject.milestones[idx];
    const cleanTitle = (target?.title || `Stage ${idx + 1}`).replace(/^\d+\.\s*/, "");
    toast.success(`Active stage set to Stage ${idx + 1}: ${cleanTitle}! Live on client portal.`);
  };

  const handleSaveStageNote = (milestoneId: string, stageTitle: string) => {
    const note = stageNotes[milestoneId] || "";
    setSavingStageId(milestoneId);
    updateMilestone(currentProject.id, milestoneId, {
      notes: note,
      description: note,
    });
    toast.success(`Notes saved for ${stageTitle}! Immediately fetched in client portal.`);
    setTimeout(() => setSavingStageId(null), 800);
  };

  // Handle New Client + Project creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail || !newProjectTitle) {
      toast.error("Please fill in required fields (Client Name, Email, and Project Title)");
      return;
    }

    const createdId = createClientAndProject(
      {
        name: newClientName,
        email: newClientEmail,
        company: newClientCompany || `${newClientName} Enterprise`,
        phone: newClientPhone,
      },
      {
        title: newProjectTitle,
        summary: newProjectSummary || "Enterprise custom engineering by OOMA LABS.",
        targetLaunchDate: newLaunchDate,
        techStack: newTechStack.split(",").map((s) => s.trim()),
        milestones: [
          {
            title: "Phase 1: Client Discovery",
            description: "Intake and audit of client assets, design tokens, external API credentials, and cloud infrastructure.",
            dueDate: "Within 2 Weeks",
          },
          {
            title: "Phase 2: Objective Requirements Gathering",
            description: "Formal Scope of Work (SOW), functional specifications, user story journeys, and database ER schema sign-off.",
            dueDate: "Within 4 Weeks",
          },
          {
            title: "Phase 3: UI/UX Development",
            description: "Interactive Figma wireframes, component design system, and client design review sign-off.",
            dueDate: "Within 6 Weeks",
          },
          {
            title: "Phase 4: Development",
            description: "Fullstack engineering implementation, backend APIs, database migrations, and frontend state architecture.",
            dueDate: "Within 10 Weeks",
          },
          {
            title: "Phase 5: Testing",
            description: "Rigorous quality assurance, cross-device testing, security penetration audits, and client UAT sign-off.",
            dueDate: "Within 12 Weeks",
          },
          {
            title: "Phase 6: Hosting",
            description: "Production cloud launch (AWS/GCP), custom domain DNS and SSL certificate binding, 24/7 monitoring handover.",
            dueDate: newLaunchDate,
          },
        ],
        invoices: [
          {
            milestoneTitle: "Milestone 1: Project Initiation & Architecture",
            amount: 350000,
            dueDate: "Within 15 Days",
          },
        ],
        liveUrls: [
          {
            label: "Production Preview URL",
            url: "https://preview.oomalabs.com",
            type: "staging",
          },
        ],
      }
    );

    toast.success(`New Project "${newProjectTitle}" created for ${newClientName}!`);
    setSelectedProjectId(createdId);
    setIsNewProjectModalOpen(false);

    // reset fields
    setNewClientName("");
    setNewClientEmail("");
    setNewClientCompany("");
    setNewProjectTitle("");
    setNewProjectSummary("");
  };

  // Handle adding milestone
  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageTitle) return;

    addMilestone(currentProject.id, {
      title: newStageTitle,
      description: newStageDesc || "Engineering phase milestones and acceptance deliverables.",
      status: "pending",
      progress: 0,
      dueDate: newStageDueDate,
      deliverables: ["Specification Sign-Off", "Code Implementation & QA"],
    });

    toast.success("New engineering phase added to project!");
    setNewStageTitle("");
    setNewStageDesc("");
    setIsAddMilestoneOpen(false);
  };

  // Handle adding invoice
  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvTitle) return;

    addInvoice(currentProject.id, {
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      milestoneTitle: newInvTitle,
      amount: Number(newInvAmount) || 100000,
      currency: "INR",
      issueDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      dueDate: newInvDueDate,
      status: "pending",
    });

    toast.success("New milestone invoice generated!");
    setNewInvTitle("");
    setIsAddInvoiceOpen(false);
  };

  // Handle adding live URL
  const handleAddUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlAddress) return;

    addLiveUrl(currentProject.id, {
      label: newUrlLabel || "Environment URL",
      url: newUrlAddress,
      type: newUrlType,
      status: "live",
      uptime: "99.98%",
      lastDeployed: "Just now",
    });

    toast.success("Live URL added to project environment list!");
    setNewUrlLabel("");
    setNewUrlAddress("https://");
    setIsAddUrlOpen(false);
  };

  // Handle CSV Import
  const handleImportCSV = () => {
    if (!pastedCsvText.trim()) {
      toast.error("Please paste CSV data or upload a file");
      return;
    }
    const result = importFromSpreadsheetCSV(pastedCsvText);
    if (result.success) {
      toast.success(result.message);
      setIsImportCsvOpen(false);
      setPastedCsvText("");
    } else {
      toast.error(result.message);
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPastedCsvText(text);
          const result = importFromSpreadsheetCSV(text);
          if (result.success) {
            toast.success(result.message);
            setIsImportCsvOpen(false);
          } else {
            toast.error(result.message);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const spreadsheetRows = getSpreadsheetRows();

  // If not authenticated as Founder/Admin, render lock screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-xl bg-[#121316] border border-[#27272a] shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                OOMA LABS Restricted Founder Gate
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                This console contains confidential client SOWs, billing, and Supabase database controls.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-zinc-300">
                Founder Master Passcode
              </Label>
              <Input
                type="password"
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter admin password (e.g. ooma-admin)"
                className="bg-[#18181b] border-[#27272a] text-white text-xs h-10 mt-1 font-mono"
                autoFocus
                required
              />
              {pinError && (
                <span className="text-[11px] text-red-400 mt-1 block">
                  Incorrect master passcode. Access restricted to OOMA LABS core team.
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10"
            >
              Unlock Admin Console
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/portal")}
              className="w-full bg-[#18181b] hover:bg-[#202024] border-[#27272a] text-zinc-400 hover:text-white text-xs h-9"
            >
              Back to Client Portal
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 bg-[#121316] border-b border-[#27272a] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/portal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#27272a] text-xs font-semibold text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Client View</span>
          </Link>

          <div className="h-4 w-px bg-[#27272a]" />

          <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            OOMA LABS Admin Control & Spreadsheet Hub
          </span>

          <button
            onClick={() => setActiveAdminTab("supabase")}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
              supabaseStatus === "connected"
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900"
                : supabaseStatus === "connecting"
                ? "bg-blue-950/80 text-blue-400 border-blue-800 hover:bg-blue-900"
                : supabaseStatus === "error"
                ? "bg-red-950/80 text-red-400 border-red-800 hover:bg-red-900"
                : "bg-zinc-800/80 text-amber-400 border-zinc-700 hover:bg-zinc-700"
            }`}
            title="Click to manage Supabase Cloud Database"
          >
            <Database className="w-3 h-3" />
            <span>
              {supabaseStatus === "connected"
                ? "PostgreSQL Active"
                : supabaseStatus === "connecting"
                ? "Connecting..."
                : supabaseStatus === "error"
                ? "Supabase Error"
                : "Local Storage Mode"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-3.5 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Client & Project</span>
          </Button>

          <Button
            onClick={() => exportToSpreadsheetCSV()}
            className="bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold h-9 px-3.5 gap-1.5"
            title="Download CSV for Google Sheets / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={handleAdminLogout}
            className="bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 hover:text-white text-xs font-semibold h-9 px-3 gap-1.5 border border-[#3f3f46]"
            title="Lock Admin Console"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Console</span>
          </Button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Project Selector Bar */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#27272a] text-zinc-300 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-zinc-400 block">
                Managing Project
              </span>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedProjectId}
                  onValueChange={(val) => {
                    setSelectedProjectId(val);
                    selectProject(val);
                  }}
                >
                  <SelectTrigger className="bg-[#121316] border-[#27272a] text-white font-bold text-sm h-9 w-[280px] sm:w-[360px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.title} ({proj.company})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div>
              <span>Overall Progress: </span>
              <strong className="text-white text-sm">{currentProject.overallProgress}%</strong>
            </div>
            <div className="h-4 w-px bg-[#27272a]" />
            <div>
              <span>Target Launch: </span>
              <strong className="text-zinc-200">{currentProject.targetLaunchDate}</strong>
            </div>
            <div className="h-4 w-px bg-[#27272a]" />
            <Link
              to="/portal"
              onClick={() => selectProject(currentProject.id)}
              className="text-[#2563eb] hover:underline font-semibold flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Client Portal</span>
            </Link>
          </div>
        </div>

        {/* Tab Selector: Stages, Billing, Live URLs, Spreadsheet */}
        <div className="flex border-b border-[#27272a] gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "stages", label: "6-Phase Pipeline & Progress", icon: Layers, count: currentProject.milestones.length },
            { id: "billing", label: "Invoices & Fees (INR)", icon: CreditCard, count: currentProject.payments.length },
            {
              id: "referrals",
              label: "Referrals & Vetting (4-Client Unlock)",
              icon: Gift,
              count: `${currentProject.referrals.verifiedClientsCount || 0}/4`,
            },
            { id: "urls", label: "Live Deployment URLs", icon: Globe, count: currentProject.liveUrls.length },
            { id: "spreadsheet", label: "Spreadsheet Table & CSV Sync", icon: FileSpreadsheet, count: "Sheets" },
            {
              id: "supabase",
              label: "Supabase Cloud Database",
              icon: Database,
              count: supabaseStatus === "connected" ? "Live" : "Setup",
            },
          ].map(({ id, label, icon: Icon, count }) => {
            const isActive = activeAdminTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveAdminTab(id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-[#2563eb] text-white bg-[#18181b]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#27272a] text-zinc-300 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: 6 DELIVERY STAGES & STAGE LOG NOTES */}
        {/* ========================================================= */}
        {activeAdminTab === "stages" && (
          <div className="space-y-5">
            {/* Stage Controls Header */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Stage Pipeline Controller
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2563eb]" />
                  Stages for "{currentProject.title}"
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Click <strong>Next Stage</strong> to advance immediately. Notes saved below fetch live to the client side.
                </p>
              </div>

              {/* Action Buttons: Prev & NEXT STAGE */}
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handlePreviousStage}
                  disabled={currentActiveStageIdx <= 0}
                  variant="outline"
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 disabled:opacity-40 text-xs h-9 px-3 gap-1.5 border-[#3f3f46]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={handleNextStage}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-4 gap-2 shadow-lg shadow-blue-500/20"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stages List (Clean, No Sliders or Checklist Matter) */}
            <div className="space-y-3.5">
              {currentProject.milestones.map((milestone, idx) => {
                const cleanName = milestone.title
                  .replace(/^(Phase|Sprint|Stage)\s*\d+[:\s-]*/i, "")
                  .replace(/^\d+\.\s*/, "");
                const stageTitle = `Stage ${idx + 1}: ${cleanName || milestone.title}`;
                const isCompleted = milestone.status === "completed";
                const isInProgress = milestone.status === "in_progress";
                const isUpcoming = milestone.status === "pending";

                return (
                  <div
                    key={milestone.id}
                    className={`rounded-xl border transition-all ${
                      isInProgress
                        ? "bg-[#18181b] border-[#2563eb] shadow-md shadow-blue-950/40"
                        : isCompleted
                        ? "bg-[#18181b] border-[#27272a]"
                        : "bg-[#141416] border-[#27272a] opacity-90"
                    }`}
                  >
                    {/* Header Row: Stage Name & Instant Status / Advance */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            isCompleted
                              ? "bg-[#064e3b] text-emerald-300"
                              : isInProgress
                              ? "bg-[#1e3a8a] text-blue-300 ring-2 ring-blue-500/40"
                              : "bg-[#27272a] text-zinc-400"
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                isCompleted
                                  ? "bg-[#064e3b] text-emerald-300"
                                  : isInProgress
                                  ? "bg-[#1e3a8a] text-blue-300"
                                  : "bg-[#27272a] text-zinc-400"
                              }`}
                            >
                              {isCompleted ? "Completed" : isInProgress ? "Active Now" : "Upcoming"}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {stageTitle}
                          </h4>
                        </div>
                      </div>

                      {/* Action Button: Jump / Set Stage */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {isInProgress ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-400 font-semibold px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800">
                              Active Stage
                            </span>
                            <Button
                              onClick={handleNextStage}
                              size="sm"
                              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold h-7 px-2.5 gap-1"
                            >
                              <span>Next Stage</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : isUpcoming ? (
                          <Button
                            onClick={() => handleJumpToStage(idx)}
                            variant="outline"
                            size="sm"
                            className="bg-[#1e293b] hover:bg-[#2563eb] hover:text-white text-zinc-300 border-[#334155] text-xs h-7 px-3 gap-1"
                          >
                            <span>Move to this stage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleJumpToStage(idx)}
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white text-xs h-7 px-2"
                          >
                            <span>Re-activate</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dedicated Editable Log Note Box (Fetched to Client Side) */}
                    <div className="p-4 bg-[#121316] border-t border-[#27272a] rounded-b-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#2563eb]" />
                          <span>Notes for this stage (Fetched to Client Side):</span>
                        </label>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Auto-syncs to client portal
                        </span>
                      </div>

                      <Textarea
                        value={stageNotes[milestone.id] ?? (milestone.notes || milestone.description || "")}
                        onChange={(e) =>
                          setStageNotes((prev) => ({ ...prev, [milestone.id]: e.target.value }))
                        }
                        placeholder="Write notes, credentials collected, client requirements, or specs for this stage..."
                        rows={2}
                        className="bg-[#18181b] border-[#27272a] text-white text-xs sm:text-sm focus:border-[#2563eb] rounded-lg resize-y placeholder:text-zinc-600"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-zinc-500">
                          Visible to client under their project timeline notes.
                        </span>
                        <Button
                          onClick={() => handleSaveStageNote(milestone.id, stageTitle)}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold h-8 px-3.5 gap-1.5 shrink-0"
                        >
                          {savingStageId === milestone.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Saved & Synced!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Note</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INVOICES & PAYMENTS MANAGER (INR) */}
        {/* ========================================================= */}
        {activeAdminTab === "billing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Milestone Invoices & Settlements (INR)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Create new milestone invoices, mark them as paid, or update due dates.
                </p>
              </div>

              <Button
                onClick={() => setIsAddInvoiceOpen(true)}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold h-8 px-3 gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </Button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden divide-y divide-[#27272a]">
              {currentProject.payments.map((invoice) => {
                const isPaid = invoice.status === "paid";

                return (
                  <div
                    key={invoice.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          {invoice.invoiceNumber}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            isPaid ? "bg-[#064e3b] text-emerald-300" : "bg-[#78350f] text-amber-300"
                          }`}
                        >
                          {isPaid ? "Settled (Paid)" : "Pending Payment"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{invoice.milestoneTitle}</h4>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        Issued: {invoice.issueDate} • Due: {invoice.dueDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-[#27272a]">
                      <span className="text-base font-bold text-white">
                        {formatINR(invoice.amount)}
                      </span>

                      {/* Toggle Paid / Pending */}
                      <Button
                        size="sm"
                        onClick={() => {
                          const newStatus = isPaid ? "pending" : "paid";
                          updateInvoice(currentProject.id, invoice.id, {
                            status: newStatus,
                            paidDate:
                              newStatus === "paid"
                                ? new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                                : undefined,
                          });
                          toast.success(`Invoice marked as ${newStatus === "paid" ? "PAID" : "PENDING"}`);
                        }}
                        className={`text-xs h-8 px-3 font-semibold ${
                          isPaid
                            ? "bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300"
                            : "bg-[#064e3b] hover:bg-[#047857] text-white"
                        }`}
                      >
                        {isPaid ? "Mark as Pending" : "Mark as Paid ✓"}
                      </Button>

                      <button
                        onClick={() => {
                          if (confirm("Delete this invoice?")) {
                            deleteInvoice(currentProject.id, invoice.id);
                            toast.success("Invoice removed");
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-950 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: REFERRALS & 4-CLIENT MILESTONE VETTING CONTROLS */}
        {/* ========================================================= */}
        {activeAdminTab === "referrals" && (
          <div className="space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Referral Vetting & 4-Client Milestone Control
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage incoming client introductions for <strong className="text-white">{currentProject.company}</strong>. Once 4 referred clients have their requirements vetted and pay their project advance, the 20% discount coupon (<code className="text-amber-400">{currentProject.referrals.unlockedCouponCode || "OOMA-VERIFIED-4X"}</code>) unlocks automatically for them.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    (currentProject.referrals.verifiedClientsCount || 0) >= 4
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-[#27272a] text-amber-300 border-[#3f3f46]"
                  }`}
                >
                  {(currentProject.referrals.verifiedClientsCount || 0) >= 4
                    ? "20% VIP Coupon UNLOCKED"
                    : `${4 - (currentProject.referrals.verifiedClientsCount || 0)} More Needed for 20% Unlock`}
                </span>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  Verified Clients Count
                </span>
                <div className="text-2xl font-bold text-emerald-400">
                  {currentProject.referrals.verifiedClientsCount || 0} / 4
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Paid project advance</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  Total Leads Submitted
                </span>
                <div className="text-2xl font-bold text-white">
                  {currentProject.referrals.history.length}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Introductions logged</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  VIP Coupon Code
                </span>
                <div className="text-base font-mono font-bold text-amber-400 mt-1">
                  {currentProject.referrals.unlockedCouponCode || "OOMA-VERIFIED-4X"}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">20% Milestone Invoice Waiver</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  Credits Credited (INR)
                </span>
                <div className="text-xl font-bold text-white">
                  {formatINR(currentProject.referrals.totalEarnings || 0)}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Total referral rewards</span>
              </div>
            </div>

            {/* Vetting Queue Table */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Client Introductions & Vetting Pipeline
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Review each company's project requirement, approve technical fit, and confirm advance payments.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 font-semibold">
                  {currentProject.referrals.history.length} Leads
                </span>
              </div>

              {currentProject.referrals.history.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  No referrals submitted yet by this client.
                </div>
              ) : (
                <div className="divide-y divide-[#27272a]">
                  {currentProject.referrals.history.map((lead) => {
                    const isVerified = lead.status === "verified_client" || lead.status === "advance_paid";
                    const isVetted = lead.status === "requirement_verified";

                    return (
                      <div
                        key={lead.id}
                        className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#202024] transition-colors"
                      >
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{lead.contactName}</span>
                            <span className="text-xs text-zinc-400">({lead.companyName})</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isVerified
                                  ? "bg-[#064e3b] text-emerald-300"
                                  : isVetted
                                  ? "bg-[#1e3a8a] text-blue-300"
                                  : "bg-[#78350f] text-amber-300"
                              }`}
                            >
                              {isVerified
                                ? "Verified Client (Counts to 4X)"
                                : isVetted
                                ? "Requirement Vetted (SOW Stage)"
                                : "Under Background Vetting"}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-400">
                            <span>{lead.email}</span>
                            {lead.phone && <span> • {lead.phone}</span>}
                            <span> • Introduced on {lead.date}</span>
                          </div>

                          {lead.requirementBrief && (
                            <div className="bg-[#121316] p-2.5 rounded border border-[#27272a] text-xs text-zinc-300">
                              <strong className="text-zinc-200">Commercial Requirement Brief: </strong>
                              {lead.requirementBrief}
                            </div>
                          )}

                          {lead.advancePaidINR ? (
                            <div className="text-xs text-emerald-400 font-semibold">
                              Advance Deposit Received: {formatINR(lead.advancePaidINR)}
                            </div>
                          ) : null}
                        </div>

                        {/* Founder Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {lead.status === "under_vetting" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                verifyReferralRequirement(currentProject.id, lead.id);
                                toast.success(`Requirement for ${lead.companyName} vetted and approved!`);
                              }}
                              className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs h-8 px-3 gap-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>1. Vet Requirement</span>
                            </Button>
                          )}

                          {!isVerified && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const amountStr = prompt(`Enter advance deposit received in INR from ${lead.companyName}:`, "100000");
                                if (amountStr !== null) {
                                  const amt = Number(amountStr) || 100000;
                                  confirmReferralAdvancePaid(currentProject.id, lead.id, amt);
                                  toast.success(`Advance payment of ${formatINR(amt)} confirmed for ${lead.companyName}! Client verified.`);
                                }
                              }}
                              className="bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold h-8 px-3 gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>2. Confirm Advance Paid (Mark Verified)</span>
                            </Button>
                          )}

                          {isVerified && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#064e3b]/40 border border-emerald-800 text-emerald-300 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Verified Client (Counted Toward 4X)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LIVE DEPLOYMENT URLS MANAGER */}
        {/* ========================================================= */}
        {activeAdminTab === "urls" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live URLs & Environments
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update staging links, production domains, and API specs shown to the client.
                </p>
              </div>

              <Button
                onClick={() => setIsAddUrlOpen(true)}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold h-8 px-3 gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Environment URL</span>
              </Button>
            </div>

            <div className="space-y-3">
              {currentProject.liveUrls.map((url) => (
                <div
                  key={url.id}
                  className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 w-full max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{url.label}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#27272a] text-zinc-400">
                        {url.type}
                      </span>
                    </div>

                    <Input
                      value={url.url}
                      onChange={(e) =>
                        updateLiveUrl(currentProject.id, url.id, { url: e.target.value })
                      }
                      className="bg-[#121316] border-[#27272a] text-white font-mono text-xs h-8"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test URL</span>
                    </a>

                    <button
                      onClick={() => {
                        if (confirm("Delete this URL?")) {
                          deleteLiveUrl(currentProject.id, url.id);
                          toast.success("URL deleted");
                        }
                      }}
                      className="p-2 rounded hover:bg-red-950 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SPREADSHEETS TABLE VIEW & CSV SYNC (THE USER'S REQUEST) */}
        {/* ========================================================= */}
        {activeAdminTab === "spreadsheet" && (
          <div className="space-y-4">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    Google Sheets & Excel Spreadsheet Sync
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage all your projects and stages directly in a spreadsheet. Export to CSV, open in Google Sheets, or paste back to update live!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => exportToSpreadsheetCSV()}
                    className="bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold h-9 px-3 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV for Google Sheets</span>
                  </Button>

                  <Button
                    onClick={() => setIsImportCsvOpen(true)}
                    className="bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold h-9 px-3 gap-1.5 border border-[#3f3f46]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import / Paste CSV</span>
                  </Button>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-[#121316] border border-[#27272a] p-3.5 rounded-lg text-xs text-zinc-300 space-y-1">
                <strong>How to preserve and update via Spreadsheets:</strong>
                <ol className="list-decimal pl-4 space-y-0.5 text-zinc-400 text-[11px]">
                  <li>Click <strong>"Download CSV for Google Sheets"</strong> to get your latest project roadmap and milestone data.</li>
                  <li>Import the CSV into Google Sheets or Excel to update stage progress % or due dates with your team.</li>
                  <li>Click <strong>"Import / Paste CSV"</strong> above to sync your spreadsheet changes back into this portal in 1 second.</li>
                </ol>
              </div>
            </div>

            {/* In-App Live Spreadsheet Grid (Editable Table) */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
              <div className="p-3.5 bg-[#121316] border-b border-[#27272a] flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-white">Live In-App Spreadsheet Grid ({spreadsheetRows.length} Rows)</span>
                <span>Double-click or edit values and click "Save Row"</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#141417] text-zinc-400 border-b border-[#27272a] font-mono text-[11px]">
                      <th className="p-3">Project Title</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Stage / Milestone</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Progress %</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Total SOW (INR)</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]">
                    {spreadsheetRows.map((row, index) => (
                      <tr key={`${row.projectId}-${index}`} className="hover:bg-[#202024] transition-colors">
                        <td className="p-3 font-semibold text-white max-w-[180px] truncate">{row.projectTitle}</td>
                        <td className="p-3 text-zinc-300 max-w-[140px] truncate">{row.company}</td>
                        <td className="p-3 text-zinc-400">{row.clientName}</td>
                        <td className="p-3 text-zinc-200 font-medium max-w-[200px] truncate">{row.stageName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.stageStatus === "completed"
                                ? "bg-[#064e3b] text-emerald-300"
                                : row.stageStatus === "in_progress"
                                ? "bg-[#1e3a8a] text-blue-300"
                                : "bg-[#27272a] text-zinc-400"
                            }`}
                          >
                            {row.stageStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-zinc-300 font-bold">{row.stageProgress}%</td>
                        <td className="p-3 text-zinc-400">{row.stageDueDate}</td>
                        <td className="p-3 font-mono text-white">{formatINR(row.totalBudgetINR)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedProjectId(row.projectId);
                              setActiveAdminTab("stages");
                              toast.info(`Switched to editor for ${row.projectTitle}`);
                            }}
                            className="px-2 py-1 rounded bg-[#27272a] hover:bg-[#3f3f46] text-white text-[11px] font-semibold"
                          >
                            Edit Stage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SUPABASE CLOUD DATABASE & LIVE REALTIME SYNC */}
        {/* ========================================================= */}
        {activeAdminTab === "supabase" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Cloud PostgreSQL Database & Realtime Hub</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Connect your free Supabase project to enable centralized cloud storage, live cross-device client synchronization, and persistent PostgreSQL tables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={async () => {
                    setIsSyncingSupabase(true);
                    const res = await syncSupabase();
                    setIsSyncingSupabase(false);
                    if (res.success) {
                      toast.success(res.message);
                    } else {
                      toast.error(res.message);
                    }
                  }}
                  disabled={isSyncingSupabase}
                  className="bg-[#27272a] hover:bg-[#323238] border border-[#3f3f46] text-white text-xs font-semibold h-8 px-3 gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-zinc-300 ${isSyncingSupabase ? "animate-spin" : ""}`} />
                  <span>Sync from Cloud</span>
                </Button>

                <Button
                  onClick={async () => {
                    setIsUploadingToSupabase(true);
                    const res = await uploadLocalToSupabase();
                    setIsUploadingToSupabase(false);
                    if (res.success) {
                      toast.success(res.message);
                    } else {
                      toast.error(res.message);
                    }
                  }}
                  disabled={isUploadingToSupabase}
                  className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold h-8 px-3 gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local Data to Supabase</span>
                </Button>
              </div>
            </div>

            {/* Connection Status Banner */}
            <div
              className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                supabaseStatus === "connected"
                  ? "bg-[#064e3b]/30 border-[#059669]/50 text-white"
                  : supabaseStatus === "connecting"
                  ? "bg-[#1e3a8a]/30 border-[#2563eb]/50 text-white"
                  : supabaseStatus === "error"
                  ? "bg-[#7f1d1d]/30 border-[#dc2626]/50 text-white"
                  : "bg-[#18181b] border-[#27272a] text-white"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    supabaseStatus === "connected"
                      ? "bg-[#059669] text-white"
                      : supabaseStatus === "connecting"
                      ? "bg-[#2563eb] text-white"
                      : supabaseStatus === "error"
                      ? "bg-[#dc2626] text-white"
                      : "bg-[#27272a] text-amber-400"
                  }`}
                >
                  {supabaseStatus === "connected" ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : supabaseStatus === "connecting" ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : supabaseStatus === "error" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Database className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {supabaseStatus === "connected"
                        ? "Supabase PostgreSQL Database: CONNECTED & LIVE"
                        : supabaseStatus === "connecting"
                        ? "Testing Connection to Supabase..."
                        : supabaseStatus === "error"
                        ? "Connection Error (Check URL / Anon Key)"
                        : "Local Storage Mode (Standby for Supabase Connection)"}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        supabaseStatus === "connected"
                          ? "bg-[#059669] text-white"
                          : supabaseStatus === "connecting"
                          ? "bg-[#2563eb] text-white"
                          : supabaseStatus === "error"
                          ? "bg-[#dc2626] text-white"
                          : "bg-[#27272a] text-zinc-300"
                      }`}
                    >
                      {supabaseStatus}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {supabaseStatus === "connected"
                      ? "Sprints, client stages, Indian payments, and live URLs automatically replicate to your Supabase PostgreSQL cluster with live WebSockets."
                      : "The portal is currently saving all client records in your browser's persistent storage. Enter your free Supabase credentials below to sync across all devices."}
                  </p>
                </div>
              </div>
            </div>

            {/* Supabase Credentials Form */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Supabase API Credentials</span>
                <span className="text-[11px] text-zinc-400 font-normal lowercase">(stored securely in your environment / browser)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-zinc-300">
                    Supabase Project URL (VITE_SUPABASE_URL) *
                  </Label>
                  <Input
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 font-mono"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Found in your Supabase Dashboard: Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-zinc-300">
                    Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY) *
                  </Label>
                  <Input
                    type="password"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 font-mono"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Found in your Supabase Dashboard: Settings &gt; API &gt; Project API Keys &gt; anon / public
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={async () => {
                    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
                      toast.error("Please enter both Supabase URL and Anon Key.");
                      return;
                    }
                    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
                    setIsTestingSupabase(true);
                    const test = await testSupabaseConnection();
                    setIsTestingSupabase(false);
                    if (test.success) {
                      toast.success(test.message);
                      await syncSupabase();
                    } else {
                      toast.error(test.message);
                    }
                  }}
                  disabled={isTestingSupabase}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-4 gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isTestingSupabase ? "Verifying..." : "Save & Connect Supabase"}</span>
                </Button>

                <Button
                  onClick={async () => {
                    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
                    setIsTestingSupabase(true);
                    const test = await testSupabaseConnection();
                    setIsTestingSupabase(false);
                    if (test.success) {
                      toast.success(test.message);
                    } else {
                      toast.error(test.message);
                    }
                  }}
                  variant="outline"
                  className="bg-[#27272a] hover:bg-[#323238] border-[#3f3f46] text-white text-xs font-semibold h-9 px-4 gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? "animate-spin" : ""}`} />
                  <span>Test Database Reachability</span>
                </Button>

                {supabaseUrlInput && (
                  <Button
                    onClick={() => {
                      saveSupabaseConfig("", "");
                      setSupabaseUrlInput("");
                      setSupabaseKeyInput("");
                      toast.info("Supabase keys cleared. Reverted to Local Storage Mode.");
                    }}
                    variant="ghost"
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 h-9 px-3 ml-auto"
                  >
                    Disconnect & Revert to Local Storage
                  </Button>
                )}
              </div>
            </div>

            {/* 3-Step Setup Instructions Card */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Quick 3-Step Supabase Setup (Under 2 Minutes)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Follow these steps to initialize your cloud database tables with full Indian Rupee schema and Row Level Security.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                    setCopiedSchema(true);
                    toast.success("Complete SQL schema copied to clipboard! Paste it into Supabase SQL Editor.");
                    setTimeout(() => setCopiedSchema(false), 2500);
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold h-9 px-4 gap-2"
                >
                  {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSchema ? "SQL Copied!" : "Copy SQL Schema Script"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-[#121316] border border-[#27272a] space-y-2">
                  <div className="w-6 h-6 rounded bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-white">Create Free Project</h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563eb] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>
                    , sign in with GitHub/Email, and click <strong>New Project</strong> (e.g. "ooma-labs-portal"). Select region India (Mumbai) for minimum latency.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#121316] border border-[#27272a] space-y-2">
                  <div className="w-6 h-6 rounded bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-white">Run SQL Schema</h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Click the green <strong>Copy SQL Schema Script</strong> button above. In your Supabase Dashboard, open <strong>SQL Editor</strong> on the left bar, paste the code, and click <strong>RUN</strong>. This creates all tables and initial seed data.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#121316] border border-[#27272a] space-y-2">
                  <div className="w-6 h-6 rounded bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-white">Paste Keys & Connect</h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    In your Supabase Dashboard, go to <strong>Project Settings &gt; API</strong>. Copy the <strong>Project URL</strong> and <strong>anon public key</strong> into the boxes above and click <strong>Save & Connect</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* SQL Script Viewer */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  PostgreSQL Tables & Schema Preview (Ready for Supabase)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Tables: profiles, projects, milestones, live_urls, invoices, comments, ratings, support_tickets
                </span>
              </div>
              <pre className="p-4 rounded-lg bg-[#0d0e11] border border-[#27272a] text-zinc-300 text-[11px] font-mono overflow-x-auto max-h-60 overflow-y-auto leading-relaxed">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: ONBOARD NEW CLIENT & PROJECT */}
      {/* ========================================================= */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent className="max-w-xl bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Onboard New Client & Create Project
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              When a new client signs up, create their workspace project here. They will immediately see this when logging in.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-300">Client Contact Person Name *</Label>
                <Input
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-300">Client Work Email *</Label>
                <Input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="vikram@company.in"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-300">Company / Organization *</Label>
                <Input
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="e.g. Singhania Express Cargo Pvt Ltd"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-300">Phone / WhatsApp</Label>
                <Input
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+91 98490 00000"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Project Title *</Label>
              <Input
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="e.g. Warehouse Inventory & Cold Storage Tracking Platform"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Project Scope Summary</Label>
              <Textarea
                value={newProjectSummary}
                onChange={(e) => setNewProjectSummary(e.target.value)}
                placeholder="Briefly describe the deliverables, architecture, and objectives..."
                rows={2}
                className="bg-[#121316] border-[#27272a] text-white text-xs mt-1 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-300">Target Launch Date</Label>
                <Input
                  value={newLaunchDate}
                  onChange={(e) => setNewLaunchDate(e.target.value)}
                  placeholder="e.g. June 15, 2025"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-300">Tech Stack (comma separated)</Label>
                <Input
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs h-10 border-[#3f3f46]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs h-10"
              >
                Create Client & Launch Portal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD PIPELINE PHASE */}
      {/* ========================================================= */}
      <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Add New Pipeline Phase</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMilestoneSubmit} className="space-y-3 pt-2">
            <div>
              <Label className="text-xs text-zinc-300">Phase Title</Label>
              <Input
                value={newStageTitle}
                onChange={(e) => setNewStageTitle(e.target.value)}
                placeholder="e.g. Phase 07: Mobile App Expansion & API Scale"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Description</Label>
              <Textarea
                value={newStageDesc}
                onChange={(e) => setNewStageDesc(e.target.value)}
                placeholder="Scope details and acceptance criteria..."
                rows={3}
                className="bg-[#121316] border-[#27272a] text-white text-xs mt-1 resize-none"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Due Date</Label>
              <Input
                value={newStageDueDate}
                onChange={(e) => setNewStageDueDate(e.target.value)}
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMilestoneOpen(false)}
                className="flex-1 bg-[#27272a] text-white text-xs h-9 border-[#3f3f46]"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#2563eb] text-white text-xs font-bold h-9">
                Save Stage
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD MILESTONE INVOICE (INR) */}
      {/* ========================================================= */}
      <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Issue Milestone Invoice (INR)</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddInvoiceSubmit} className="space-y-3 pt-2">
            <div>
              <Label className="text-xs text-zinc-300">Milestone Title</Label>
              <Input
                value={newInvTitle}
                onChange={(e) => setNewInvTitle(e.target.value)}
                placeholder="e.g. Milestone 4: Production Deployment & QA"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Amount (INR / ₹)</Label>
              <Input
                type="number"
                value={newInvAmount}
                onChange={(e) => setNewInvAmount(Number(e.target.value))}
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Due Date</Label>
              <Input
                value={newInvDueDate}
                onChange={(e) => setNewInvDueDate(e.target.value)}
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddInvoiceOpen(false)}
                className="flex-1 bg-[#27272a] text-white text-xs h-9 border-[#3f3f46]"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#2563eb] text-white text-xs font-bold h-9">
                Generate Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD LIVE URL */}
      {/* ========================================================= */}
      <Dialog open={isAddUrlOpen} onOpenChange={setIsAddUrlOpen}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Add Live Deployment URL</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddUrlSubmit} className="space-y-3 pt-2">
            <div>
              <Label className="text-xs text-zinc-300">Label</Label>
              <Input
                value={newUrlLabel}
                onChange={(e) => setNewUrlLabel(e.target.value)}
                placeholder="e.g. Staging V2 Preview"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">URL</Label>
              <Input
                value={newUrlAddress}
                onChange={(e) => setNewUrlAddress(e.target.value)}
                placeholder="https://app.clientdomain.com"
                className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Environment Type</Label>
              <Select value={newUrlType} onValueChange={(val: any) => setNewUrlType(val)}>
                <SelectTrigger className="bg-[#121316] border-[#27272a] text-xs h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="design">Figma Design</SelectItem>
                  <SelectItem value="api_docs">API Docs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUrlOpen(false)}
                className="flex-1 bg-[#27272a] text-white text-xs h-9 border-[#3f3f46]"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#2563eb] text-white text-xs font-bold h-9">
                Save URL
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: SPREADSHEET CSV IMPORT */}
      {/* ========================================================= */}
      <Dialog open={isImportCsvOpen} onOpenChange={setIsImportCsvOpen}>
        <DialogContent className="max-w-lg bg-[#18181b] border border-[#27272a] text-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Import from Spreadsheet CSV
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Upload a .csv file exported from Google Sheets or Excel, or paste the CSV rows directly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-zinc-300">Upload CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1 cursor-pointer"
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-300">Or Paste CSV Text</Label>
              <Textarea
                value={pastedCsvText}
                onChange={(e) => setPastedCsvText(e.target.value)}
                placeholder="Paste CSV rows here..."
                rows={6}
                className="bg-[#121316] border-[#27272a] text-white font-mono text-xs mt-1 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsImportCsvOpen(false)}
                className="flex-1 bg-[#27272a] text-white text-xs h-9 border-[#3f3f46]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportCSV}
                className="flex-1 bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold h-9"
              >
                Apply Spreadsheet Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortalAdminManager;
