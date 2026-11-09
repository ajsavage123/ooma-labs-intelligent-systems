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
  Database,
  Check,
  Copy,
  ShieldCheck,
  AlertCircle,
  Lock,
  LogOut,
  Star,
  MessageSquare,
  Headphones,
  Send,
  Pin,
  Sliders,
  Settings,
  Inbox,
  ThumbsUp,
  Phone,
  Mail,
  Tag,
  Sparkles,
  Filter,
  LifeBuoy,
  Menu,
  X,
  Search,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  Briefcase,
  Activity,
  BarChart3,
} from "lucide-react";
import { WhatsAppAvatar, WHATSAPP_DEFAULT_AVATAR, sanitizeAvatarUrl } from "../../components/portal/WhatsAppAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ProjectLiveUrl, SupportTicket, TicketPriority, TicketStatus, ProjectComment, ClientRating, ClientProject, TicketAttachment } from "../../types";
import { PortalImageLightbox } from "../../components/portal/PortalImageLightbox";
import { OomaLogo } from "../../components/OomaLogo";
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
  lead_avatar TEXT DEFAULT '',
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

-- Row Level Security (RLS) & Server-Side Role-Based Access Control (RBAC)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Admins manage all; Users can read & update their own profile
CREATE POLICY "Admins full access to profiles" ON public.profiles FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT 
  USING (id = auth.uid()::text);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE 
  USING (id = auth.uid()::text);

-- 2. Projects: Admins manage all; Clients can only read their assigned project
CREATE POLICY "Admins full access to projects" ON public.projects FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Clients read own projects" ON public.projects FOR SELECT 
  USING (client_id = auth.uid()::text);

-- 3. Milestones & Live URLs: Tenant isolated by project_id
CREATE POLICY "Admins full access to milestones" ON public.milestones FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Clients read own project milestones" ON public.milestones FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = milestones.project_id AND projects.client_id = auth.uid()::text));

CREATE POLICY "Admins full access to live_urls" ON public.live_urls FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Clients read own project live_urls" ON public.live_urls FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = live_urls.project_id AND projects.client_id = auth.uid()::text));

-- 4. Invoices & Billing: Admins manage; Clients read own
CREATE POLICY "Admins full access to invoices" ON public.invoices FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Clients read own project invoices" ON public.invoices FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = invoices.project_id AND projects.client_id = auth.uid()::text));

-- 5. Support Tickets & Discussion
CREATE POLICY "Admins full access to support_tickets" ON public.support_tickets FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Clients access own project tickets" ON public.support_tickets FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = support_tickets.project_id AND projects.client_id = auth.uid()::text));

CREATE POLICY "Admins full access to comments" ON public.comments FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
CREATE POLICY "Project members access comments" ON public.comments FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = comments.project_id AND projects.client_id = auth.uid()::text));

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_urls;
`;


const getDefaultFutureDate = (days: number): string => {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

type AdminTab =
  | "stages"
  | "billing"
  | "referrals"
  | "urls"
  | "tickets"
  | "messages"
  | "reviews"
  | "quotations"
  | "settings"
  | "spreadsheet"
  | "supabase";

interface QuotationLead {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  projectCategory: string;
  requirementScope: string;
  budgetRange: string;
  timeline: string;
  submittedAt: string;
  status: string;
}

export const PortalAdminManager: React.FC = () => {
  const {
    projects,
    activeProject,
    clientUser,
    authLoading,
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
    purgeAllDemoData,
    updateTicketStatus,
    adminReplyToTicket,
    adminPostComment,
    togglePinComment,
    deleteComment,
    updateProjectDetails,
  } = useClientPortal();

  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject?.id || (projects[0]?.id ?? ""));
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("stages");

  // Enterprise Layout State (Sidebar & Navigation)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Supabase Configuration State
  const initialConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialConfig.anonKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isUploadingToSupabase, setIsUploadingToSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Admin PIN / Security Gate (prevents unauthorized client access)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        sessionStorage.getItem("ooma_admin_auth") === "true" ||
        clientUser?.portalRole === "admin" ||
        clientUser?.email === "admin@oomalabs.com" ||
        clientUser?.email === "hello@oomalabs.com" ||
        clientUser?.email === "oomalabs@gmail.com"
      );
    }
    return false;
  });

  const [adminPinInput, setAdminPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (
      clientUser?.portalRole === "admin" ||
      clientUser?.email === "admin@oomalabs.com" ||
      clientUser?.email === "hello@oomalabs.com" ||
      clientUser?.email === "oomalabs@gmail.com"
    ) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("ooma_admin_auth", "true");
    }
  }, [clientUser]);

  // Auto-sync projects and clients from Supabase database on mount
  useEffect(() => {
    syncSupabase().catch((e) => console.warn("[PortalAdminManager] Initial sync failed:", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminPinInput.trim();
    if (["OOMA2026", "9492", "2026", "ooma-admin", "admin123"].includes(cleanPin) || cleanPin.toLowerCase() === "ooma2026") {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("ooma_admin_auth", "true");
      setPinError("");
      toast.success("Administrator access granted! Welcome to the Admin Console.");
    } else {
      setPinError("Invalid admin passcode. Please try again.");
      toast.error("Invalid admin passcode.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("ooma_admin_auth");
    toast.info("Logged out from admin console.");
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
  const [newLaunchDate, setNewLaunchDate] = useState(() => getDefaultFutureDate(60));
  const [newTechStack, setNewTechStack] = useState("React, Node.js, PostgreSQL");

  // New Milestone Modal State
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");
  const [newStageDesc, setNewStageDesc] = useState("");
  const [newStageDueDate, setNewStageDueDate] = useState(() => getDefaultFutureDate(14));

  // New Invoice Modal State
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newInvTitle, setNewInvTitle] = useState("");
  const [newInvAmount, setNewInvAmount] = useState(350000);
  const [newInvDueDate, setNewInvDueDate] = useState(() => getDefaultFutureDate(15));

  // New Live URL State
  const [isAddUrlOpen, setIsAddUrlOpen] = useState(false);
  const [newUrlLabel, setNewUrlLabel] = useState("");
  const [newUrlAddress, setNewUrlAddress] = useState("https://");
  const [newUrlType, setNewUrlType] = useState<ProjectLiveUrl["type"]>("production");


  // Project Delete & Purge Modal States
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isPurgingDemo, setIsPurgingDemo] = useState(false);

  const handleDeleteCurrentProject = () => {
    if (!currentProject) return;
    const projectTitle = currentProject.title;
    deleteProject(currentProject.id);
    setIsDeleteProjectOpen(false);
    toast.success(`Project "${projectTitle}" has been deleted from production.`);
  };

  const handlePurgeDemoData = async () => {
    setIsPurgingDemo(true);
    try {
      const res = await purgeAllDemoData();
      toast.success(`Purged demo data successfully! ${res.count} demo record(s) cleaned.`);
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || "Failed to purge demo data.");
    } finally {
      setIsPurgingDemo(false);
    }
  };

  // CSV Import State
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [pastedCsvText, setPastedCsvText] = useState("");

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Synchronize selectedProjectId when projects list changes
  useEffect(() => {
    if (projects.length > 0) {
      if (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(projects[0].id);
      }
    } else {
      setSelectedProjectId("");
    }
  }, [projects, selectedProjectId]);

  // Dedicated log notes state per milestone
  const [stageNotes, setStageNotes] = useState<Record<string, string>>({});
  const [savingStageId, setSavingStageId] = useState<string | null>(null);
  const [expandedUpcomingStages, setExpandedUpcomingStages] = useState<Record<string, boolean>>({});
  const [isMoreTabsOpen, setIsMoreTabsOpen] = useState(false);

  // Synchronize stage notes with currentProject milestones
  useEffect(() => {
    if (!currentProject) return;
    const notesMap: Record<string, string> = {};
    (currentProject.milestones || []).forEach((m) => {
      notesMap[m.id] = m.notes || m.description || "";
    });
    setStageNotes(notesMap);
  }, [currentProject]);

  const activeMilestoneIndex = (currentProject?.milestones || []).findIndex((m) => m.status === "in_progress");
  const currentActiveStageIdx = activeMilestoneIndex !== -1 ? activeMilestoneIndex : 0;

  const handleNextStage = () => {
    if (!currentProject) return;
    advanceProjectStage(currentProject.id);
    const nextIdx = Math.min((currentProject.milestones || []).length - 1, currentActiveStageIdx + 1);
    const nextMilestone = currentProject.milestones?.[nextIdx];
    const cleanTitle = (nextMilestone?.title || `Stage ${nextIdx + 1}`).replace(/^\d+\.\s*/, "");
    toast.success(`Advanced to Stage ${nextIdx + 1}: ${cleanTitle}! Live on client portal.`);
  };

  const handlePreviousStage = () => {
    if (!currentProject) return;
    if (currentActiveStageIdx > 0) {
      setProjectStageIndex(currentProject.id, currentActiveStageIdx - 1);
      toast.info(`Moved back to Stage ${currentActiveStageIdx}`);
    }
  };

  const handleJumpToStage = (idx: number) => {
    if (!currentProject) return;
    setProjectStageIndex(currentProject.id, idx);
    const target = currentProject.milestones?.[idx];
    const cleanTitle = (target?.title || `Stage ${idx + 1}`).replace(/^\d+\.\s*/, "");
    toast.success(`Active stage set to Stage ${idx + 1}: ${cleanTitle}! Live on client portal.`);
  };

  const handleSaveStageNote = (milestoneId: string, stageTitle: string) => {
    if (!currentProject) return;
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
    if (!currentProject || !newStageTitle) return;

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
    if (!currentProject || !newInvTitle) return;

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
    if (!currentProject || !newUrlAddress) return;

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

  // ----------------------------------------------------
  // ADMIN TAB STATE: SUPPORT TICKETS & SLA
  // ----------------------------------------------------
  const [ticketFilterStatus, setTicketFilterStatus] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [ticketFilterPriority, setTicketFilterPriority] = useState<"all" | "urgent" | "high" | "medium" | "low">("all");
  const [ticketReplyText, setTicketReplyText] = useState<{ [ticketId: string]: string }>({});
  const [ticketAssignee, setTicketAssignee] = useState<{ [ticketId: string]: string }>({});
  const [adminPreviewAttachment, setAdminPreviewAttachment] = useState<TicketAttachment | null>(null);

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus, engineerName?: string) => {
    if (!currentProject) return;
    const finalEngineer = engineerName || ticketAssignee[ticketId] || currentProject.dedicatedLead?.name || "Arjun Mehta (Lead Systems Architect)";
    updateTicketStatus(currentProject.id, ticketId, status, finalEngineer);
    toast.success(`Ticket status updated to "${status.toUpperCase().replace(/_/g, " ")}"`);
  };

  const handleAdminReplyTicket = (ticketId: string) => {
    if (!currentProject) return;
    const msg = ticketReplyText[ticketId];
    if (!msg || !msg.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }
    adminReplyToTicket(currentProject.id, ticketId, msg.trim());
    setTicketReplyText((prev) => ({ ...prev, [ticketId]: "" }));
    toast.success("Support reply posted and notified to client!");
  };

  // ----------------------------------------------------
  // ADMIN TAB STATE: CLIENT ACTIVITY & BROADCAST
  // ----------------------------------------------------
  const [adminCommentText, setAdminCommentText] = useState("");
  const [adminCommentIsPinned, setAdminCommentIsPinned] = useState(false);

  const handlePostAdminComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    if (!adminCommentText.trim()) {
      toast.error("Please enter a message or update for the client.");
      return;
    }
    adminPostComment(currentProject.id, adminCommentText.trim(), adminCommentIsPinned);
    setAdminCommentText("");
    setAdminCommentIsPinned(false);
    toast.success("Broadcast message posted to project feed!");
  };

  const handleTogglePinComment = (commentId: string) => {
    if (!currentProject) return;
    togglePinComment(currentProject.id, commentId);
    toast.success("Comment pin status updated.");
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentProject) return;
    deleteComment(currentProject.id, commentId);
    toast.success("Comment deleted from project feed.");
  };

  // ----------------------------------------------------
  // ADMIN TAB STATE: QUOTATIONS & LEADS PIPELINE
  // ----------------------------------------------------
  const [quotationLeads, setQuotationLeads] = useState<QuotationLead[]>(() => {
    try {
      const stored = localStorage.getItem("ooma_quotations_list");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load quotation leads from storage:", e);
    }
    return [
      {
        id: "lead-sample-01",
        contactName: "Rajesh Sharma",
        companyName: "Nexus FinTech Labs",
        email: "rajesh@nexusfin.in",
        phone: "+91 98765 43210",
        projectCategory: "Enterprise AI & High-Throughput Engine",
        requirementScope: "Automated transaction reconciliation pipeline with sub-millisecond anomaly detection and Indian bank integrations.",
        budgetRange: "₹8,00,000 - ₹15,00,000",
        timeline: "6-8 Weeks",
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "pending_review",
      },
      {
        id: "lead-sample-02",
        contactName: "Sneha Reddy",
        companyName: "AeroHealth Logistics",
        email: "sneha.r@aerohealth.co",
        phone: "+91 91234 56789",
        projectCategory: "NextGen Cloud Microservices Architecture",
        requirementScope: "Real-time cold-chain tracking IoT platform with multi-tenant dashboard and automated Indian GST compliance.",
        budgetRange: "₹5,00,000 - ₹8,00,000",
        timeline: "4-6 Weeks",
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "contacted",
      },
    ];
  });

  const handleConvertQuotation = (lead: QuotationLead) => {
    setNewClientName(lead.contactName || "");
    setNewClientEmail(lead.email || "");
    setNewClientCompany(lead.companyName || "");
    setNewClientPhone(lead.phone || "+91 ");
    setNewProjectTitle(lead.projectCategory || `${lead.companyName} Intelligent System`);
    setNewProjectSummary(lead.requirementScope || "");
    setIsNewProjectModalOpen(true);
    toast.info("Pre-filled client onboarding form. Review and click Create!");
  };

  const handleDeleteQuotation = (leadId: string) => {
    setQuotationLeads((prev) => {
      const updated = prev.filter((l) => l.id !== leadId);
      try {
        localStorage.setItem("ooma_quotations_list", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save quotation leads:", e);
      }
      return updated;
    });
    toast.success("Quotation lead removed.");
  };

  const handleUpdateQuotationStatus = (leadId: string, status: string) => {
    setQuotationLeads((prev) => {
      const updated = prev.map((l) => (l.id === leadId ? { ...l, status } : l));
      try {
        localStorage.setItem("ooma_quotations_list", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save quotation leads:", e);
      }
      return updated;
    });
    toast.success(`Quotation lead marked as ${status.replace(/_/g, " ")}`);
  };

  // ----------------------------------------------------
  // ADMIN TAB STATE: PROJECT SETTINGS & ARCHITECT
  // ----------------------------------------------------
  const [settingsTitle, setSettingsTitle] = useState("");
  const [settingsCompany, setSettingsCompany] = useState("");
  const [settingsSummary, setSettingsSummary] = useState("");
  const [settingsTier, setSettingsTier] = useState<ClientProject["tier"]>("Strategic Engineering");
  const [settingsStatus, setSettingsStatus] = useState<ClientProject["status"]>("in_development");
  const [settingsStartDate, setSettingsStartDate] = useState("");
  const [settingsTargetDate, setSettingsTargetDate] = useState("");
  const [settingsTechStack, setSettingsTechStack] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadRole, setLeadRole] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadAvatar, setLeadAvatar] = useState("");

  useEffect(() => {
    if (currentProject) {
      setSettingsTitle(currentProject.title || "");
      setSettingsCompany(currentProject.company || "");
      setSettingsSummary(currentProject.summary || "");
      setSettingsTier(currentProject.tier || "Strategic Engineering");
      setSettingsStatus(currentProject.status || "in_development");
      setSettingsStartDate(currentProject.startDate || "");
      setSettingsTargetDate(currentProject.targetLaunchDate || "");
      setSettingsTechStack((currentProject.techStack || []).join(", "));
      setLeadName(currentProject.dedicatedLead?.name || "Arjun Mehta");
      setLeadRole(currentProject.dedicatedLead?.role || "Lead Systems Architect (OOMA Labs Hyderabad)");
      setLeadEmail(currentProject.dedicatedLead?.email || "arjun@oomalabs.com");
      const rawLeadPhone = currentProject.dedicatedLead?.phone || currentProject.dedicatedLead?.status || "";
      const isActualPhone = /^[+\d\s-]+$/.test(rawLeadPhone.trim()) && rawLeadPhone.trim().length >= 7;
      setLeadPhone(isActualPhone ? rawLeadPhone.trim() : "+91 80066 62364");
      setLeadAvatar(sanitizeAvatarUrl(currentProject.dedicatedLead?.avatar));
    }
  }, [currentProject]);

  const handleSaveProjectSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const stackArray = settingsTechStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updateProjectDetails(currentProject.id, {
      title: settingsTitle,
      company: settingsCompany,
      summary: settingsSummary,
      tier: settingsTier,
      status: settingsStatus,
      startDate: settingsStartDate,
      targetLaunchDate: settingsTargetDate,
      techStack: stackArray,
      dedicatedLead: {
        name: leadName,
        role: leadRole,
        avatar: sanitizeAvatarUrl(leadAvatar),
        email: leadEmail,
        status: "Available",
        phone: leadPhone || "+91 80066 62364",
      },
    });

    toast.success("Project settings & Lead Architect assignment saved!");
  };

  const spreadsheetRows = getSpreadsheetRows();

  // Loading state during auth resolution
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 mb-4 animate-pulse">
          OL
        </div>
        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-zinc-400 font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  // Strictly enforce server-verified admin role or authenticated admin session
  if (!isAdminAuthenticated && (!clientUser || clientUser.portalRole !== "admin")) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 text-white font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#121316] border border-[#27272a] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">OOMA LABS Admin Gate</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your Master Admin Passcode or sign in with an authorized administrator account to unlock control.
            </p>
          </div>

          <form onSubmit={handleAdminPinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Master Admin Passcode
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter admin passcode"
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    if (pinError) setPinError("");
                  }}
                  autoFocus
                  className="bg-[#18181b] border-[#27272a] text-white text-sm h-11 px-3 focus:border-blue-500 rounded-xl font-mono tracking-wider"
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {pinError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#27272a] w-full" />
            <span className="bg-[#121316] px-3 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              or
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/portal/login?email=admin@oomalabs.com&admin=true")}
              className="w-full bg-[#18181b] hover:bg-[#202024] border-[#27272a] text-zinc-300 hover:text-white font-medium text-xs h-10 rounded-xl"
            >
              Sign In with Admin Email (admin@oomalabs.com)
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/portal")}
              className="w-full text-zinc-500 hover:text-zinc-300 text-xs h-9"
            >
              ← Back to Client Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a10] text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* ─── 1. TOP GLOBAL ENTERPRISE APP BAR ─── */}
      <header className="sticky top-0 z-40 h-14 bg-[#0c0d14]/95 backdrop-blur-md border-b border-[#1f202b] px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Mobile Menu Toggle + Pod Brand + Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            className="lg:hidden p-1.5 rounded-lg bg-[#181922] text-zinc-400 hover:text-white border border-[#272835]"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex p-1.5 rounded-lg bg-[#181922] text-zinc-400 hover:text-white border border-[#272835] transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Brand Logo */}
          <OomaLogo linkTo="/portal" variant="dark" size="sm" subtitle="ADMIN CONSOLE" />

          <div className="h-4 w-px bg-[#272835] hidden sm:block shrink-0" />

          {/* Breadcrumbs Navigation */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 min-w-0">
            <span className="text-zinc-500">Workspace</span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-zinc-300 truncate max-w-[160px] lg:max-w-[220px]">
              {currentProject?.company || "All Projects"}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-blue-400 font-bold capitalize">
              {activeAdminTab === "urls" ? "Live URLs" : activeAdminTab === "spreadsheet" ? "Sheets Sync" : activeAdminTab}
            </span>
          </div>
        </div>

        {/* Center: Global Project Selector (SaaS Workspace Switcher) */}
        <div className="flex items-center gap-2 max-w-sm w-full mx-2 hidden sm:flex">
          <Select
            value={selectedProjectId || ""}
            onValueChange={(val) => {
              setSelectedProjectId(val);
              selectProject(val);
            }}
            disabled={projects.length === 0}
          >
            <SelectTrigger className="bg-[#12131b] border-[#222432] text-white font-medium text-xs h-8 w-full shadow-inner hover:border-zinc-700">
              <div className="flex items-center gap-2 truncate">
                <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">
                  {currentProject ? `${currentProject.title} (${currentProject.company})` : "Select Project..."}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#12131b] border-[#222432] text-white">
              {projects.map((proj) => (
                <SelectItem key={proj.id} value={proj.id} className="text-xs">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span className="font-semibold">{proj.title}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">({proj.company})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: Cloud DB Status + Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cloud DB Status */}
          <button
            onClick={() => setActiveAdminTab("supabase")}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 transition-colors ${
              supabaseStatus === "connected"
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60"
                : supabaseStatus === "connecting"
                ? "bg-blue-950/60 text-blue-400 border-blue-800/80 hover:bg-blue-900/60"
                : "bg-zinc-800/60 text-amber-400 border-zinc-700 hover:bg-zinc-700"
            }`}
            title="Click to view Supabase Cloud Database & RLS status"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <Database className="w-3 h-3" />
            <span>{supabaseStatus === "connected" ? "PostgreSQL Active" : supabaseStatus === "connecting" ? "Connecting..." : "DB Setup"}</span>
          </button>

          {/* Quick Action: New Project */}
          <Button
            onClick={() => setIsNewProjectModalOpen(true)}
            size="sm"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-8 px-2.5 sm:px-3 gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">+ Proj</span>
          </Button>

          {/* Export CSV */}
          <Button
            onClick={() => exportToSpreadsheetCSV()}
            size="sm"
            variant="outline"
            className="border-[#272835] bg-[#12131b] hover:bg-[#1c1d28] text-zinc-300 hover:text-white text-xs h-8 px-2 sm:px-2.5 gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">CSV</span>
          </Button>

          {/* Return to Client View */}
          <Link
            to="/portal"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181922] hover:bg-[#20212d] border border-[#272835] text-xs font-medium text-zinc-300 hover:text-white"
            title="Preview Client Portal"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </Link>

          {/* Lock Console */}
          <Button
            onClick={handleAdminLogout}
            size="sm"
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-[#181922] h-8 w-8 p-0"
            title="Lock Admin Console"
          >
            <Lock className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* ─── 2. DUAL-PANE ENTERPRISE BODY ─── */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Mobile Slide-Over Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* ─── 2A. ENTERPRISE NAVIGATION SIDEBAR ─── */}
        <aside
          className={`
            fixed lg:static top-14 bottom-0 left-0 z-50
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${isSidebarCollapsed ? "lg:w-[68px]" : "lg:w-[260px]"}
            w-[260px] bg-[#0c0d14] border-r border-[#1f202b] flex flex-col justify-between shrink-0 transition-all duration-200 ease-in-out select-none
          `}
        >
          {/* Scrollable Nav List */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {/* Quick Workspace Switcher on Mobile (< sm) */}
            <div className="sm:hidden mb-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Active Project
              </span>
              <Select
                value={selectedProjectId || ""}
                onValueChange={(val) => {
                  setSelectedProjectId(val);
                  selectProject(val);
                }}
              >
                <SelectTrigger className="bg-[#12131b] border-[#222432] text-white text-xs h-8">
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent className="bg-[#12131b] border-[#222432] text-white">
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation Groups */}
            {[
              {
                group: "Delivery Pipeline",
                items: [
                  { id: "stages", label: "6-Phase Stages", icon: Layers, count: currentProject ? currentProject.milestones?.length || 6 : 6 },
                  { id: "urls", label: "Live Environments", icon: Globe, count: currentProject ? currentProject.liveUrls?.length || 0 : 0 },
                ],
              },
              {
                group: "Commerce & Finance",
                items: [
                  { id: "billing", label: "Invoices & Fees (INR)", icon: CreditCard, count: currentProject ? currentProject.payments?.length || 0 : 0 },
                  { id: "referrals", label: "Referrals (4X)", icon: Gift, count: currentProject ? `${currentProject.referrals?.verifiedClientsCount || 0}/4` : "0/4" },
                ],
              },
              {
                group: "CRM & Support",
                items: [
                  { id: "tickets", label: "Support Desk", icon: Headphones, count: currentProject ? (currentProject.supportTickets || []).filter((t) => t.status !== "resolved").length : 0 },
                  { id: "quotations", label: "Quotation Leads", icon: Inbox, count: quotationLeads.length },
                  { id: "messages", label: "Broadcast & Feed", icon: MessageSquare, count: currentProject ? currentProject.comments?.length || 0 : 0 },
                  { id: "reviews", label: "Ratings & NPS Radar", icon: Star, count: currentProject ? currentProject.ratings?.length || 0 : 0 },
                ],
              },
              {
                group: "Platform & Systems",
                items: [
                  { id: "spreadsheet", label: "Spreadsheet Table", icon: FileSpreadsheet, count: spreadsheetRows.length || 30 },
                  { id: "supabase", label: "Supabase Database", icon: Database, count: supabaseStatus === "connected" ? "Live" : "Setup" },
                  { id: "settings", label: "Lead Architect Pod", icon: Settings, count: 1 },
                ],
              },
            ].map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {section.group}
                  </div>
                )}
                {section.items.map(({ id, label, icon: Icon, count }) => {
                  const isActive = activeAdminTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveAdminTab(id as AdminTab);
                        setIsMobileSidebarOpen(false);
                      }}
                      title={label}
                      className={`
                        w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-2.5"} py-2 rounded-lg text-xs font-medium transition-all group
                        ${
                          isActive
                            ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-[#161722]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                        {!isSidebarCollapsed && <span className="truncate">{label}</span>}
                      </div>

                      {!isSidebarCollapsed && (
                        <span
                          className={`
                            px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0
                            ${
                              isActive
                                ? "bg-blue-500/20 text-blue-300 font-bold"
                                : "bg-[#181922] text-zinc-500 group-hover:text-zinc-400"
                            }
                          `}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Admin Identity Card */}
          <div className="p-3 border-t border-[#1f202b] bg-[#0a0b10]">
            <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-2.5"}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                {clientUser?.name ? clientUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    {clientUser?.name || "Lead Architect Admin"}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
                    {clientUser?.email || "admin@oomalabs.com"}
                  </div>
                  <div className="mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[9px] font-bold font-mono">
                      SUPER ADMIN
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ─── 2B. MAIN WORKSPACE CANVAS ─── */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 bg-[#090a10]">
          {/* TOP KPI STATS SUMMARY ROW */}
          {currentProject && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {/* Stat 1: Stage Progress */}
              <div className="bg-[#0e0f17] border border-[#1f202b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Lifecycle Progress
                  </span>
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">
                      {currentProject.overallProgress ?? 0}%
                    </span>
                    <span className="text-xs font-bold text-blue-400 truncate max-w-[130px]">
                      {currentProject.milestones?.find((m) => m.status === "in_progress")?.title?.replace(/^(Phase|Sprint|Stage)\s*\d+[:\s-]*/i, "") || "Completed"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1b26] rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, currentProject.overallProgress || 0))}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center justify-between">
                    <span>Target: {currentProject.targetLaunchDate || "TBD"}</span>
                    <span>6 Stages Total</span>
                  </div>
                </div>
              </div>

              {/* Stat 2: Revenue & Invoices */}
              {(() => {
                const totalBilled = (currentProject.payments || []).reduce((acc, p) => acc + (p.amount || 0), 0);
                const paidBilled = (currentProject.payments || []).filter((p) => p.status === "paid").reduce((acc, p) => acc + (p.amount || 0), 0);
                const paidCount = (currentProject.payments || []).filter((p) => p.status === "paid").length;
                return (
                  <div className="bg-[#0e0f17] border border-[#1f202b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Milestone Revenue
                      </span>
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-white">
                          {formatINR(totalBilled || 0)}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {paidCount}/{(currentProject.payments || []).length} Paid
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1b26] rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${totalBilled > 0 ? Math.round((paidBilled / totalBilled) * 100) : 0}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center justify-between">
                        <span>Paid: {formatINR(paidBilled)}</span>
                        <span>Pending: {formatINR(Math.max(0, totalBilled - paidBilled))}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Stat 3: Support Health */}
              {(() => {
                const tickets = currentProject.supportTickets || [];
                const openTickets = tickets.filter((t) => t.status !== "resolved");
                const urgentCount = openTickets.filter((t) => t.priority === "urgent").length;
                return (
                  <div className="bg-[#0e0f17] border border-[#1f202b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Support Desk & SLA
                      </span>
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <Headphones className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-white">
                          {openTickets.length}
                        </span>
                        <span className={`text-xs font-bold ${urgentCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {urgentCount > 0 ? `${urgentCount} Urgent` : "All Normal"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1b26] rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${urgentCount > 0 ? "bg-red-500" : "bg-purple-500"}`}
                          style={{ width: `${tickets.length > 0 ? Math.round(((tickets.length - openTickets.length) / tickets.length) * 100) : 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center justify-between">
                        <span>Resolved: {tickets.length - openTickets.length}</span>
                        <span>Total: {tickets.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Stat 4: Inbound Pipeline */}
              <div className="bg-[#0e0f17] border border-[#1f202b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Growth & Inbound
                  </span>
                  <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Inbox className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">
                      {quotationLeads.length}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      Inbound Leads
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1b26] rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (quotationLeads.length / 10) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center justify-between">
                    <span>Referrals: {currentProject.referrals?.verifiedClientsCount || 0}/4</span>
                    <span>Direct WhatsApp: Live</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ACTIVE TAB CONTENT VIEW */}
          {/* ========================================================= */}

        {/* ========================================================= */}
        {/* TAB 1: 6 DELIVERY STAGES & STAGE LOG NOTES */}
        {/* ========================================================= */}
        
        {!currentProject && activeAdminTab !== "supabase" && activeAdminTab !== "spreadsheet" ? (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-4 sm:my-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Building className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white">No Client Projects in Database</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
              Your production dashboard is clean and ready. There are no demo or placeholder projects. Create a new client and project to initialize a dedicated 6-phase engineering lifecycle.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full">
              <Button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-10 px-5 gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Client & Project</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsImportCsvOpen(true)}
                className="w-full sm:w-auto border-[#27272a] bg-[#121316] hover:bg-[#202024] text-zinc-300 hover:text-white text-xs h-10 px-4 gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import from CSV</span>
              </Button>
            </div>
          </div>
        ) : null}

        {currentProject && activeAdminTab === "stages" && (
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
              {(currentProject.milestones || []).map((milestone, idx) => {
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
                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => handleJumpToStage(idx)}
                              variant="outline"
                              size="sm"
                              className="bg-[#1e293b] hover:bg-[#2563eb] hover:text-white text-zinc-300 border-[#334155] text-xs h-7 px-3 gap-1"
                            >
                              <span>Move to this stage</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedUpcomingStages((prev) => ({ ...prev, [milestone.id]: !prev[milestone.id] }))}
                              className="sm:hidden text-zinc-400 hover:text-zinc-200 text-xs h-7 px-2 border border-[#334155]"
                            >
                              <span>{expandedUpcomingStages[milestone.id] ? "Hide" : "Notes"}</span>
                            </Button>
                          </div>
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
                    <div className={`p-4 bg-[#121316] border-t border-[#27272a] rounded-b-xl space-y-2 ${isUpcoming && !expandedUpcomingStages[milestone.id] ? "hidden sm:block" : "block"}`}>
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
        {currentProject && activeAdminTab === "billing" && (
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
              {(currentProject.payments || []).map((invoice) => {
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
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this invoice?")) {
                            deleteInvoice(currentProject.id, invoice.id);
                            toast.success("Invoice removed");
                          }
                        }}
                        title="Delete Invoice"
                        aria-label="Delete Invoice"
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
        {currentProject && activeAdminTab === "referrals" && (
          <div className="space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Referral Vetting & 4-Client Milestone Control
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage incoming client introductions for <strong className="text-white">{currentProject.company}</strong>. Once 4 referred clients have their requirements vetted and pay their project advance, the 20% discount coupon (<code className="text-amber-400">{currentProject.referrals?.unlockedCouponCode || "OOMA-VERIFIED-4X"}</code>) unlocks automatically for them.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    (currentProject.referrals?.verifiedClientsCount || 0) >= 4
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-[#27272a] text-amber-300 border-[#3f3f46]"
                  }`}
                >
                  {(currentProject.referrals?.verifiedClientsCount || 0) >= 4
                    ? "20% VIP Coupon UNLOCKED"
                    : `${4 - (currentProject.referrals?.verifiedClientsCount || 0)} More Needed for 20% Unlock`}
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
                  {currentProject.referrals?.verifiedClientsCount || 0} / 4
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Paid project advance</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  Total Leads Submitted
                </span>
                <div className="text-2xl font-bold text-white">
                  {(currentProject.referrals?.history || []).length}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Introductions logged</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  VIP Coupon Code
                </span>
                <div className="text-base font-mono font-bold text-amber-400 mt-1">
                  {currentProject.referrals?.unlockedCouponCode || "OOMA-VERIFIED-4X"}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">20% Milestone Invoice Waiver</span>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <span className="text-xs uppercase text-zinc-400 font-semibold block mb-1">
                  Credits Credited (INR)
                </span>
                <div className="text-xl font-bold text-white">
                  {formatINR(currentProject.referrals?.totalEarnings || 0)}
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
                  {(currentProject.referrals?.history || []).length} Leads
                </span>
              </div>

              {(currentProject.referrals?.history || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  No referrals submitted yet by this client.
                </div>
              ) : (
                <div className="divide-y divide-[#27272a]">
                  {(currentProject.referrals?.history || []).map((lead) => {
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
        {currentProject && activeAdminTab === "urls" && (
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
              {(currentProject.liveUrls || []).map((url) => (
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
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this URL?")) {
                          deleteLiveUrl(currentProject.id, url.id);
                          toast.success("URL deleted");
                        }
                      }}
                      title="Delete Environment URL"
                      aria-label="Delete Environment URL"
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

        {/* ========================================================= */}
        {/* TAB 4: CLIENT SUPPORT TICKETS & SLA */}
        {/* ========================================================= */}
        {activeAdminTab === "tickets" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Support Tickets & SLA Tracking</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage incoming client tickets, assign lead engineers, and respond with official updates.
                </p>
              </div>

              {currentProject && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-400">Filter Status:</span>
                  <div className="inline-flex rounded-lg bg-[#18181b] border border-[#27272a] p-0.5 text-xs">
                    {(["all", "open", "in_progress", "resolved"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setTicketFilterStatus(st)}
                        className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                          ticketFilterStatus === st
                            ? "bg-[#2563eb] text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!currentProject ? (
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-zinc-400 text-xs">
                Please select or create a project above to inspect support tickets.
              </div>
            ) : (() => {
              const allTickets = currentProject.supportTickets || [];
              const filteredTickets = allTickets.filter((t) => {
                if (ticketFilterStatus !== "all" && t.status !== ticketFilterStatus) return false;
                if (ticketFilterPriority !== "all" && t.priority !== ticketFilterPriority) return false;
                return true;
              });

              const openCount = allTickets.filter((t) => t.status === "open").length;
              const inProgCount = allTickets.filter((t) => t.status === "in_progress").length;
              const resolvedCount = allTickets.filter((t) => t.status === "resolved").length;

              return (
                <div className="space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-3.5">
                      <span className="text-[11px] text-zinc-400 block font-medium uppercase tracking-wider">Total Tickets</span>
                      <strong className="text-lg font-bold text-white mt-0.5 block">{allTickets.length}</strong>
                    </div>
                    <div className="bg-[#18181b] border border-amber-900/30 rounded-xl p-3.5">
                      <span className="text-[11px] text-amber-400 block font-medium uppercase tracking-wider">Awaiting Action</span>
                      <strong className="text-lg font-bold text-amber-300 mt-0.5 block">{openCount}</strong>
                    </div>
                    <div className="bg-[#18181b] border border-blue-900/30 rounded-xl p-3.5">
                      <span className="text-[11px] text-blue-400 block font-medium uppercase tracking-wider">In Progress</span>
                      <strong className="text-lg font-bold text-blue-300 mt-0.5 block">{inProgCount}</strong>
                    </div>
                    <div className="bg-[#18181b] border border-emerald-900/30 rounded-xl p-3.5">
                      <span className="text-[11px] text-emerald-400 block font-medium uppercase tracking-wider">Resolved</span>
                      <strong className="text-lg font-bold text-emerald-300 mt-0.5 block">{resolvedCount}</strong>
                    </div>
                  </div>

                  {/* Priority Filters */}
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Priority:</span>
                    {(["all", "urgent", "high", "medium", "low"] as const).map((pr) => (
                      <button
                        key={pr}
                        onClick={() => setTicketFilterPriority(pr)}
                        className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                          ticketFilterPriority === pr
                            ? "bg-zinc-200 text-zinc-900 font-bold"
                            : "bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-white"
                        }`}
                      >
                        {pr}
                      </button>
                    ))}
                  </div>

                  {filteredTickets.length === 0 ? (
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-10 text-center space-y-2">
                      <LifeBuoy className="w-8 h-8 text-zinc-600 mx-auto" />
                      <h4 className="text-sm font-semibold text-white">No Tickets Match Filter</h4>
                      <p className="text-xs text-zinc-500 max-w-md mx-auto">
                        There are currently no tickets matching the selected filters. When clients submit tickets through their portal support tab, they will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => {
                        const isResolved = ticket.status === "resolved";
                        return (
                          <div
                            key={ticket.id}
                            className={`bg-[#18181b] border rounded-xl p-4 sm:p-5 space-y-4 transition-all ${
                              ticket.priority === "urgent" && !isResolved
                                ? "border-red-900/60 bg-red-950/10"
                                : "border-[#27272a]"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#27272a]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-white bg-[#27272a] px-2 py-0.5 rounded">
                                  {ticket.ticketNumber}
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                                  {ticket.category.replace(/_/g, " ")}
                                </span>
                                <span
                                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    ticket.priority === "urgent"
                                      ? "bg-red-950 text-red-400 border border-red-800/50 animate-pulse"
                                      : ticket.priority === "high"
                                      ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                                      : ticket.priority === "medium"
                                      ? "bg-blue-950 text-blue-400 border border-blue-800/50"
                                      : "bg-zinc-800 text-zinc-400"
                                  }`}
                                >
                                  {ticket.priority} priority
                                </span>
                                <span
                                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    ticket.status === "resolved"
                                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                                      : ticket.status === "in_progress"
                                      ? "bg-blue-950 text-blue-400 border border-blue-800/50"
                                      : "bg-amber-950 text-amber-400 border border-amber-800/50"
                                  }`}
                                >
                                  {ticket.status.replace(/_/g, " ")}
                                </span>
                              </div>

                              <span className="text-[11px] text-zinc-500">
                                Created: {ticket.createdAt || "Recently"}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-white">{ticket.title}</h4>
                              <p className="text-xs text-zinc-300 mt-1.5 p-3 rounded-lg bg-[#121316] border border-[#27272a]/60 leading-relaxed whitespace-pre-wrap">
                                {ticket.description}
                              </p>

                              {/* Attached Client Screenshots & Environment Telemetry */}
                              {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-2.5 space-y-1.5">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                    Client Screenshots ({ticket.attachments.length})
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {ticket.attachments.map((att) => (
                                      <button
                                        key={att.id}
                                        type="button"
                                        onClick={() => setAdminPreviewAttachment(att)}
                                        className="group rounded-lg border border-[#27272a] hover:border-blue-500 overflow-hidden bg-[#121316] p-1 flex items-center gap-2 text-left transition-colors"
                                      >
                                        <img src={att.url} alt={att.name} className="w-10 h-10 rounded object-cover" />
                                        <div className="pr-2 text-[11px]">
                                          <div className="text-zinc-200 font-medium truncate max-w-[130px]">{att.name}</div>
                                          <div className="text-blue-400 text-[10px] group-hover:underline">Click to view ↗</div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {ticket.deviceInfo && (
                                <div className="mt-2 text-[11px] text-zinc-400 font-mono">
                                  Client Telemetry: {ticket.deviceInfo.os} • {ticket.deviceInfo.browser} • {ticket.deviceInfo.screen}
                                </div>
                              )}
                            </div>

                            {/* Assignee & Status Quick Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <Label className="text-[11px] text-zinc-400">Assigned Engineer</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    value={
                                      ticketAssignee[ticket.id] !== undefined
                                        ? ticketAssignee[ticket.id]
                                        : ticket.assignedEngineer || "Arjun Mehta (Lead Systems Architect)"
                                    }
                                    onChange={(e) =>
                                      setTicketAssignee((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                                    }
                                    className="bg-[#121316] border-[#27272a] text-white text-xs h-8"
                                    placeholder="Engineer name..."
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateTicketStatus(
                                        ticket.id,
                                        ticket.status,
                                        ticketAssignee[ticket.id]
                                      )
                                    }
                                    className="h-8 px-2.5 text-xs bg-[#27272a] hover:bg-[#3f3f46] text-white"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label className="text-[11px] text-zinc-400">Status Quick Actions</Label>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleUpdateTicketStatus(ticket.id, "open")}
                                    className={`h-8 px-2.5 text-[11px] font-bold ${
                                      ticket.status === "open"
                                        ? "bg-amber-600 text-white"
                                        : "bg-[#27272a] text-zinc-300 hover:text-white"
                                    }`}
                                  >
                                    Mark Open
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleUpdateTicketStatus(ticket.id, "in_progress")}
                                    className={`h-8 px-2.5 text-[11px] font-bold ${
                                      ticket.status === "in_progress"
                                        ? "bg-blue-600 text-white"
                                        : "bg-[#27272a] text-zinc-300 hover:text-white"
                                    }`}
                                  >
                                    In Progress
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleUpdateTicketStatus(ticket.id, "resolved")}
                                    className={`h-8 px-2.5 text-[11px] font-bold ${
                                      ticket.status === "resolved"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#27272a] text-zinc-300 hover:text-white"
                                    }`}
                                  >
                                    Mark Resolved
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Updates / Thread */}
                            {ticket.updates && ticket.updates.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-[#27272a]">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                  Conversation & Updates Thread ({ticket.updates.length})
                                </span>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {ticket.updates.map((up) => (
                                    <div
                                      key={up.id}
                                      className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                        up.sender.includes("Admin") || up.sender.includes("Arjun")
                                          ? "bg-blue-950/30 border border-blue-900/40 text-blue-200"
                                          : "bg-[#121316] border border-[#27272a] text-zinc-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                                        <strong className="text-white font-semibold">{up.sender}</strong>
                                        <span>{up.time}</span>
                                      </div>
                                      <p>{up.message}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Reply Input */}
                            <div className="pt-2 border-t border-[#27272a] space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={ticketReplyText[ticket.id] || ""}
                                  onChange={(e) =>
                                    setTicketReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                                  }
                                  placeholder="Type official engineering support update or resolution for client..."
                                  className="bg-[#121316] border-[#27272a] text-white text-xs h-9 flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAdminReplyTicket(ticket.id);
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={() => handleAdminReplyTicket(ticket.id)}
                                  className="h-9 px-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Reply</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CLIENT ACTIVITY & BROADCAST */}
        {/* ========================================================= */}
        {activeAdminTab === "messages" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Client Activity & Announcement Stream</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Broadcast official progress updates, pin high-priority announcements, and moderate client discussion.
                </p>
              </div>
            </div>

            {!currentProject ? (
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-zinc-400 text-xs">
                Please select or create a project above to view discussion stream.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Broadcast Composer */}
                <form
                  onSubmit={handlePostAdminComment}
                  className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <WhatsAppAvatar
                      src={currentProject.dedicatedLead?.avatar}
                      alt={currentProject.dedicatedLead?.name || "Arjun Mehta"}
                      sizeClassName="w-8 h-8"
                      className="border border-blue-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {currentProject.dedicatedLead?.name || "Arjun Mehta"}
                      </h4>
                      <span className="text-[10px] text-blue-400 font-medium">
                        {currentProject.dedicatedLead?.role || "Lead Systems Architect (OOMA Labs)"}
                      </span>
                    </div>
                  </div>

                  <Textarea
                    value={adminCommentText}
                    onChange={(e) => setAdminCommentText(e.target.value)}
                    placeholder="Broadcast an official engineering update, milestone delivery notice, or message to the client..."
                    className="bg-[#121316] border-[#27272a] text-white text-xs min-h-[80px]"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={adminCommentIsPinned}
                        onChange={(e) => setAdminCommentIsPinned(e.target.checked)}
                        className="rounded border-[#27272a] bg-[#121316] text-[#2563eb] focus:ring-0"
                      />
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pin this message as Important Announcement</span>
                    </label>

                    <Button
                      type="submit"
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-4 gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast to Client</span>
                    </Button>
                  </div>
                </form>

                {/* Comment Stream */}
                {(() => {
                  const comments = currentProject.comments || [];
                  const sortedComments = [...comments].sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                  });

                  if (sortedComments.length === 0) {
                    return (
                      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-zinc-500 text-xs">
                        No messages in the project feed yet. Use the composer above to post your first announcement.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {sortedComments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`bg-[#18181b] border rounded-xl p-4 sm:p-5 space-y-3 ${
                            comment.isPinned
                              ? "border-amber-500/50 bg-amber-950/10 shadow-sm"
                              : "border-[#27272a]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <WhatsAppAvatar
                                src={comment.authorAvatar}
                                alt={comment.authorName}
                                sizeClassName="w-8 h-8"
                                className="border border-zinc-700 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white">{comment.authorName}</h5>
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                      comment.authorRole === "lead_architect" || comment.authorRole === "engineer"
                                        ? "bg-blue-950 text-blue-400 border border-blue-800/40"
                                        : "bg-zinc-800 text-zinc-300"
                                    }`}
                                  >
                                    {comment.authorRole.replace(/_/g, " ")}
                                  </span>
                                  {comment.isPinned && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                                      <Pin className="w-2.5 h-2.5" />
                                      <span>Pinned</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-zinc-500">{comment.timestamp}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTogglePinComment(comment.id)}
                                title={comment.isPinned ? "Unpin message" : "Pin message"}
                                className={`h-8 w-8 p-0 ${comment.isPinned ? "text-amber-400" : "text-zinc-500 hover:text-white"}`}
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Delete comment"
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap pl-10">
                            {comment.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CLIENT RATINGS & REVIEWS / NPS */}
        {/* ========================================================= */}
        {activeAdminTab === "reviews" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Client Ratings, Reviews & NPS</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Inspect client satisfaction metrics, 4-vector delivery performance, and written testimonials.
                </p>
              </div>
            </div>

            {!currentProject ? (
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-zinc-400 text-xs">
                Please select or create a project above to inspect client ratings.
              </div>
            ) : (() => {
              const ratings = currentProject.ratings || [];
              const hasRatings = ratings.length > 0;
              const avgScore = hasRatings
                ? (ratings.reduce((acc, r) => acc + (r.overallScore || 5), 0) / ratings.length).toFixed(1)
                : "—";

              const recommendCount = ratings.filter((r) => r.clientRecommendation !== false).length;
              const npsPercent = hasRatings ? `${Math.round((recommendCount / ratings.length) * 100)}%` : "—";

              const avgEng = hasRatings
                ? (ratings.reduce((acc, r) => acc + (r.categories?.engineeringQuality || 5), 0) / ratings.length).toFixed(1)
                : "—";
              const avgComm = hasRatings
                ? (ratings.reduce((acc, r) => acc + (r.categories?.communication || 5), 0) / ratings.length).toFixed(1)
                : "—";
              const avgVel = hasRatings
                ? (ratings.reduce((acc, r) => acc + (r.categories?.velocity || 5), 0) / ratings.length).toFixed(1)
                : "—";
              const avgDesign = hasRatings
                ? (ratings.reduce((acc, r) => acc + (r.categories?.uiUxDesign || 5), 0) / ratings.length).toFixed(1)
                : "—";

              return (
                <div className="space-y-4">
                  {!hasRatings && (
                    <div className="bg-[#18181b] border border-amber-500/20 rounded-xl p-6 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-1">
                        <Star className="w-5 h-5 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white">No Client Reviews Submitted Yet</h4>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        There are currently 0 evaluations for <strong>"{currentProject.title}"</strong>.
                        When clients rate deliverables in their portal, real scores, vector breakdowns, and written feedback will display here.
                      </p>
                    </div>
                  )}

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6 fill-amber-400" />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Average Overall Score</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-bold text-white">{avgScore}</span>
                          <span className="text-xs text-zinc-400">/ 5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <ThumbsUp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Client Recommendation Rate</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-bold text-emerald-400">{npsPercent}</span>
                          <span className="text-xs text-zinc-400">NPS score</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Total Evaluations</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-bold text-white">{ratings.length}</span>
                          <span className="text-xs text-zinc-400">client review(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vector Performance Breakdown */}
                  <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      4-Vector Delivery Performance Radar
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">Engineering & Code Quality</span>
                          <span className="text-white font-bold">{avgEng} / 5.0</span>
                        </div>
                        <div className="w-full bg-[#121316] rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${hasRatings ? (Number(avgEng) / 5) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">Communication & Transparency</span>
                          <span className="text-white font-bold">{avgComm} / 5.0</span>
                        </div>
                        <div className="w-full bg-[#121316] rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${hasRatings ? (Number(avgComm) / 5) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">Sprint Delivery Velocity</span>
                          <span className="text-white font-bold">{avgVel} / 5.0</span>
                        </div>
                        <div className="w-full bg-[#121316] rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${hasRatings ? (Number(avgVel) / 5) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">UI/UX & Design Precision</span>
                          <span className="text-white font-bold">{avgDesign} / 5.0</span>
                        </div>
                        <div className="w-full bg-[#121316] rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${hasRatings ? (Number(avgDesign) / 5) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {ratings.length === 0 ? (
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-zinc-500 text-xs">
                      No ratings submitted yet for this project. Once the client evaluates milestone deliverables in their portal, their review will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ratings.map((rating) => (
                        <div
                          key={rating.id}
                          className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#27272a] text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0">
                                {rating.authorName?.charAt(0) || "C"}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white">{rating.authorName}</h5>
                                <span className="text-[11px] text-zinc-500">{rating.submittedAt || "Recently"}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {[1, 2, 3, 4, 5].slice(0, Math.max(1, Math.min(5, Math.round(Number(rating.overallScore) || 5)))).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              {rating.clientRecommendation !== false && (
                                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Recommends OOMA Labs</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed italic bg-[#121316] p-3 rounded-lg border border-[#27272a]/60">
                            "{rating.feedbackText}"
                          </p>

                          <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 pt-1">
                            <span className="px-2 py-0.5 rounded bg-[#27272a]">
                              Engineering: <strong>{rating.categories?.engineeringQuality || 5}/5</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#27272a]">
                              Communication: <strong>{rating.categories?.communication || 5}/5</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#27272a]">
                              Velocity: <strong>{rating.categories?.velocity || 5}/5</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#27272a]">
                              UI/UX: <strong>{rating.categories?.uiUxDesign || 5}/5</strong>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: QUOTATIONS & LEADS PIPELINE */}
        {/* ========================================================= */}
        {activeAdminTab === "quotations" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Prospective Client Quotations & Lead Pipeline</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Inquiries from the Free Quotation Calculator and AI Quote Widget. Convert qualified leads into active projects with 1 click.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-3.5 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard New Client</span>
                </Button>
              </div>
            </div>

            {/* Inquiries List */}
            {quotationLeads.length === 0 ? (
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-10 text-center space-y-2">
                <Inbox className="w-8 h-8 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Quotation Inquiries Yet</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  When potential clients request estimates or submit system specs via the website, their details appear here for immediate follow-up.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotationLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#27272a]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{lead.contactName}</h4>
                          <span className="text-xs text-zinc-400 font-medium">({lead.companyName})</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              lead.status === "converted"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                : lead.status === "contacted"
                                ? "bg-blue-950 text-blue-400 border border-blue-800/40"
                                : "bg-amber-950 text-amber-400 border border-amber-800/40"
                            }`}
                          >
                            {(lead.status || "pending_review").replace(/_/g, " ")}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">
                          Submitted: {new Date(lead.submittedAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleConvertQuotation(lead)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3 gap-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>1-Click Onboard Project</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteQuotation(lead.id)}
                          className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#121316] border border-[#27272a]">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Contact Info</span>
                        <div className="mt-1 space-y-0.5 text-zinc-200">
                          <a href={`mailto:${lead.email}`} className="text-blue-400 hover:underline block truncate">
                            {lead.email}
                          </a>
                          <span className="block">{lead.phone}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#121316] border border-[#27272a]">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Category</span>
                        <span className="font-semibold text-white block mt-1 truncate">
                          {lead.projectCategory || "Custom Intelligent System"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#121316] border border-[#27272a]">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Budget Tier</span>
                        <span className="font-bold text-emerald-400 block mt-1">
                          {lead.budgetRange || "₹5,00,000 - ₹10,00,000"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#121316] border border-[#27272a]">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Target Timeline</span>
                        <span className="font-medium text-zinc-300 block mt-1">
                          {lead.timeline || "4-6 Weeks"}
                        </span>
                      </div>
                    </div>

                    {lead.requirementScope && (
                      <div className="p-3 rounded-lg bg-[#121316] border border-[#27272a] text-xs text-zinc-300 leading-relaxed">
                        <strong className="text-white block mb-1">Requirement Scope:</strong>
                        {lead.requirementScope}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                      <span>Status:</span>
                      {(["pending_review", "contacted", "converted"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateQuotationStatus(lead.id, st)}
                          className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                            lead.status === st
                              ? "bg-zinc-200 text-zinc-900 font-bold"
                              : "bg-[#27272a] text-zinc-300 hover:text-white"
                          }`}
                        >
                          {st.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: PROJECT SETTINGS & LEAD ARCHITECT */}
        {/* ========================================================= */}
        {currentProject && activeAdminTab === "settings" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Project Configuration & Dedicated Lead Architect</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure project metadata, tier, delivery dates, and assign the Dedicated Lead Architect.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProjectSettings} className="space-y-5">
              {/* Card 1: Project Metadata */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>Project Scope & Metadata</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-zinc-300">Project Title *</Label>
                    <Input
                      value={settingsTitle}
                      onChange={(e) => setSettingsTitle(e.target.value)}
                      required
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Client Organization / Company *</Label>
                    <Input
                      value={settingsCompany}
                      onChange={(e) => setSettingsCompany(e.target.value)}
                      required
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-zinc-300">Project Summary / Scope Overview</Label>
                  <Textarea
                    value={settingsSummary}
                    onChange={(e) => setSettingsSummary(e.target.value)}
                    rows={3}
                    className="bg-[#121316] border-[#27272a] text-white text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-zinc-300">Engineering Tier</Label>
                    <Select
                      value={settingsTier}
                      onValueChange={(val) => setSettingsTier(val as ClientProject["tier"])}
                    >
                      <SelectTrigger className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                        <SelectItem value="Strategic Engineering">Strategic Engineering</SelectItem>
                        <SelectItem value="Enterprise AI Suite">Enterprise AI Suite</SelectItem>
                        <SelectItem value="Cloud System">Cloud System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Lifecycle Status</Label>
                    <Select
                      value={settingsStatus}
                      onValueChange={(val) => setSettingsStatus(val as ClientProject["status"])}
                    >
                      <SelectTrigger className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                        <SelectItem value="in_development">In Development</SelectItem>
                        <SelectItem value="in_testing">In QA / Testing</SelectItem>
                        <SelectItem value="live_deployed">Live Deployed</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Start Date</Label>
                    <Input
                      value={settingsStartDate}
                      onChange={(e) => setSettingsStartDate(e.target.value)}
                      placeholder="e.g. Jan 15, 2026"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Target Launch Date</Label>
                    <Input
                      value={settingsTargetDate}
                      onChange={(e) => setSettingsTargetDate(e.target.value)}
                      placeholder="e.g. Mar 30, 2026"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-zinc-300">Tech Stack Tags (comma separated)</Label>
                  <Input
                    value={settingsTechStack}
                    onChange={(e) => setSettingsTechStack(e.target.value)}
                    placeholder="React, TypeScript, Node.js, PostgreSQL, TailwindCSS"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                  />
                </div>
              </div>

              {/* Card 2: Dedicated Lead Architect */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Lead Systems Architect (OOMA Labs)</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  This architect is presented to the client as their primary contact, with direct WhatsApp hotline and SLA commitment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-zinc-300">Architect Full Name</Label>
                    <Input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      placeholder="Arjun Mehta"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Official Designation</Label>
                    <Input
                      value={leadRole}
                      onChange={(e) => setLeadRole(e.target.value)}
                      required
                      placeholder="Lead Systems Architect (OOMA Labs Hyderabad)"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-zinc-300">Email Address</Label>
                    <Input
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="arjun@oomalabs.com"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">WhatsApp Hotline / Phone</Label>
                    <Input
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 8006662364"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-300">Avatar Image URL</Label>
                    <Input
                      value={leadAvatar}
                      onChange={(e) => setLeadAvatar(e.target.value)}
                      placeholder="https://..."
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-9 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete "${currentProject.title}" (${currentProject.company})? This action cannot be undone.`)) {
                      handleDeleteCurrentProject();
                    }
                  }}
                  className="bg-red-950/20 hover:bg-red-950/50 text-red-400 border border-red-800/40 text-xs font-bold h-9 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Project...</span>
                </Button>

                <Button
                  type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-6 gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project & Architect Settings</span>
                </Button>
              </div>
            </form>
          </div>
        )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ONBOARD NEW CLIENT & PROJECT */}
      {/* ========================================================= */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-xl bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              Onboard New Client & Create Project
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              When a new client signs up, create their project here. They will immediately see this when logging in.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <DialogContent className="w-[95vw] sm:max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-white">Add New Pipeline Phase</DialogTitle>
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
        <DialogContent className="w-[95vw] sm:max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-white">Issue Milestone Invoice (INR)</DialogTitle>
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
        <DialogContent className="w-[95vw] sm:max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-white">Add Live Deployment URL</DialogTitle>
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
              <Select value={newUrlType} onValueChange={(val: "production" | "staging" | "design" | "api_docs") => setNewUrlType(val)}>
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
        <DialogContent className="w-[95vw] sm:max-w-lg bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-white">
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

      {/* ========================================================= */}
      {/* MODAL: DELETE PROJECT CONFIRMATION */}
      {/* ========================================================= */}
      <Dialog open={isDeleteProjectOpen} onOpenChange={setIsDeleteProjectOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md bg-[#18181b] border border-[#27272a] text-white rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>Delete Client Project</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs pt-1">
              Are you sure you want to permanently delete <strong>"{currentProject?.title}"</strong>?
              This will remove all associated milestones, invoices, and live URLs from the production database.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteProjectOpen(false)}
              className="flex-1 bg-[#27272a] text-white text-xs h-9 border-[#3f3f46]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteCurrentProject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9"
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox for inspecting client ticket screenshots */}
      <PortalImageLightbox
        attachment={adminPreviewAttachment}
        onClose={() => setAdminPreviewAttachment(null)}
      />

    </div>
  );
};

export default PortalAdminManager;
