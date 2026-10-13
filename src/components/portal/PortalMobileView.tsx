import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useClientPortal, formatINR, CANONICAL_6_STAGES } from "../../context/ClientPortalContext";
import { ClientPayment, ProjectMilestone } from "../../types";
import {
  Home,
  Layers,
  CreditCard,
  Gift,
  LayoutGrid,
  Bell,
  Menu,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  CheckCircle2,
  Globe,
  MessageSquare,
  Share2,
  ShieldCheck,
  Calendar,
  Users,
  Headphones,
  Info,
  FileText,
  Bot,
  Send,
  Building,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type MobileTabKey = "home" | "stages" | "billing" | "rewards" | "hub";

interface PortalMobileViewProps {
  initialTab?: MobileTabKey;
  onOpenPayModal?: (payment: ClientPayment, initialMethod?: "upi" | "netbanking" | "neft" | "card") => void;
  onOpenRatingModal?: () => void;
  onOpenTicketModal?: () => void;
}

export const PortalMobileView: React.FC<PortalMobileViewProps> = ({
  initialTab = "home",
  onOpenPayModal,
  onOpenRatingModal,
  onOpenTicketModal,
}) => {
  const {
    clientUser,
    activeProject,
    projects,
    selectProject,
    logoutClient,
    payInvoice,
    supabaseStatus,
  } = useClientPortal();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = (searchParams.get("tab") as MobileTabKey) || initialTab;

  // Tab navigation state
  const [activeTab, setActiveTabState] = useState<MobileTabKey>(
    ["home", "stages", "billing", "rewards", "hub"].includes(tabFromQuery) ? tabFromQuery : "home"
  );

  useEffect(() => {
    const qTab = searchParams.get("tab") as MobileTabKey;
    if (qTab && ["home", "stages", "billing", "rewards", "hub"].includes(qTab) && qTab !== activeTab) {
      setActiveTabState(qTab);
    }
  }, [searchParams, activeTab]);

  const setActiveTab = (tab: MobileTabKey) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  const [billingSubTab, setBillingSubTab] = useState<"invoices" | "payments" | "documents">("invoices");

  // Interactive drawers and dialogs
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [engineeringLogOpen, setEngineeringLogOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Copy states
  const [copiedGst, setCopiedGst] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic calculations from activeProject
  const milestones = activeProject.milestones || [];
  const completedMilestones = milestones.filter((m) => m.status === "completed").length;
  const totalMilestones = milestones.length || 6;
  const overallProgress = activeProject.overallProgress ?? 82;

  // Find active / in-progress stage dynamically
  const inProgressIdx = milestones.findIndex((m) => m.status === "in_progress");
  const currentStageIdx = inProgressIdx !== -1 ? inProgressIdx : Math.min(completedMilestones, totalMilestones - 1);
  const currentStage: ProjectMilestone | undefined = milestones[currentStageIdx] || milestones[0];
  const canonicalFallback = CANONICAL_6_STAGES[currentStageIdx] || CANONICAL_6_STAGES[0];
  const currentStageName = currentStage?.title
    ? currentStage.title.replace(/^\d+\.\s*/, "")
    : canonicalFallback.title.replace(/^\d+\.\s*/, "");
  const currentStageProgress = currentStage?.progress ?? (currentStage?.status === "completed" ? 100 : 40);
  const currentStageNote = currentStage?.notes || currentStage?.description || canonicalFallback.defaultNotes;
  const currentStageTarget = currentStage?.dueDate || activeProject.targetLaunchDate || "Apr 20, 2025";

  // Financial calculations from activeProject.payments dynamically
  const payments = activeProject.payments || [];
  const totalContract = useMemo(
    () => payments.reduce((acc, p) => acc + (p.amount || 0), 0) || 1850000,
    [payments]
  );
  const totalPaid = useMemo(
    () => payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + (p.amount || 0), 0),
    [payments]
  );
  const pendingPayments = useMemo(
    () => payments.filter((p) => p.status !== "paid"),
    [payments]
  );
  const totalPending = useMemo(
    () => pendingPayments.reduce((acc, p) => acc + (p.amount || 0), 0),
    [pendingPayments]
  );
  const paidPercent = totalContract > 0 ? Math.round((totalPaid / totalContract) * 100) : 54;

  // Referral calculations from activeProject.referrals dynamically
  const referrals = activeProject?.referrals;
  const verifiedReferrals = referrals?.verifiedClientsCount ?? 0;
  const requiredReferrals = referrals?.requiredForUnlock ?? 4;
  const referralPercent = Math.min(100, Math.round((verifiedReferrals / requiredReferrals) * 100));
  const creditAmountINR = referrals?.creditCardAmountINR ?? 4000;
  const referralCode = referrals?.referralCode || "OOMA-RAJESH-BLR";

  // Dynamic live URLs
  const liveUrls = activeProject.liveUrls || [];
  const primaryLiveUrl =
    liveUrls.find((u) => u.type === "production")?.url || liveUrls[0]?.url || "https://fleet.bharatlogistics.in";

  // Dynamic Project Short Title
  const projectDisplayTitle =
    activeProject.title && activeProject.title.length > 25
      ? activeProject.title.includes("Dispatch Portal")
        ? "Dispatch Portal"
        : activeProject.title.split(":")[0].trim()
      : activeProject.title || "Dispatch Portal";

  // Chat conversation state for the floating AI assistant
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string; time: string }>>([
    {
      sender: "bot",
      text: `Namaste ${clientUser?.name?.split(" ")[0] || "there"}! I'm your OOMA LABS Project Assistant. How can I help you today with ${projectDisplayTitle}?`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "user", text: userText, time: timeNow }]);
    setChatInput("");

    setTimeout(() => {
      let botReply = `Our engineering pod has logged your message. Lead architect Arjun Mehta will follow up on ${projectDisplayTitle}!`;
      const lower = userText.toLowerCase();
      if (lower.includes("invoice") || lower.includes("pay") || lower.includes("bill")) {
        botReply = `You currently have ${pendingPayments.length} pending invoice(s) totaling ${formatINR(totalPending)}. You can settle via UPI, NetBanking, or Cards in the Billing tab.`;
      } else if (lower.includes("stage") || lower.includes("timeline") || lower.includes("progress")) {
        botReply = `Overall project is at ${overallProgress}%. We are in Stage ${currentStageIdx + 1}: ${currentStageName} (${currentStageProgress}%). Target completion is ${currentStageTarget}.`;
      } else if (lower.includes("whatsapp") || lower.includes("call")) {
        botReply = "You can connect with our lead architect directly on WhatsApp at +91 98490 21345.";
      } else if (lower.includes("reward") || lower.includes("referral")) {
        botReply = `Invite 4 verified clients using your code ${referralCode} to unlock your ${formatINR(creditAmountINR)} VIP Partner Credit!`;
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply, time: "Just now" }]);
    }, 500);
  };

  const handleCopyGst = () => {
    navigator.clipboard.writeText("36AAFCO7891K1Z8");
    setCopiedGst(true);
    toast.success("GSTIN copied to clipboard!");
    setTimeout(() => setCopiedGst(false), 2000);
  };

  const handleCopyReferral = () => {
    const link = `https://oomalabs.com/free-quotation?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Referral invitation link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePayClick = (payment: ClientPayment, initialMethod?: "upi" | "netbanking" | "neft" | "card") => {
    if (onOpenPayModal) {
      onOpenPayModal(payment, initialMethod);
    } else {
      payInvoice(payment.id);
      toast.success(`Payment initiated for ${payment.invoiceNumber}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col pb-24 select-none">
      {/* =========================================================================
          TOP HEADER - UNIFIED RESPONSIVE (MOBILE & DESKTOP)
          Mobile: Clean white bar, logo, notification bell, avatar, hamburger menu
          Desktop: Clean white bar, logo, project dropdown, 5 top navigation tabs,
                   admin manager, notification bell, user profile dropdown
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Client Workspace + (Desktop Project Switcher) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-slate-900 stroke-[7]">
                  <circle cx="50" cy="50" r="40" strokeDasharray="215 45" strokeLinecap="round" transform="rotate(-30 50 50)" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-black tracking-tight text-slate-900 uppercase">
                  OOMA LABS
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
                  CLIENT WORKSPACE
                </span>
              </div>
            </Link>

            {/* Desktop Project Selector */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span className="max-w-[200px] truncate">{activeProject.title}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-slate-200 text-slate-900 min-w-[260px] shadow-lg">
                  <DropdownMenuLabel className="text-xs text-slate-400 uppercase">
                    Your Active SOW Projects
                  </DropdownMenuLabel>
                  {projects.map((proj) => (
                    <DropdownMenuItem
                      key={proj.id}
                      onClick={() => selectProject(proj.id)}
                      className={`text-xs cursor-pointer flex items-center justify-between ${
                        proj.id === activeProject.id ? "bg-blue-50 text-blue-700 font-bold" : ""
                      }`}
                    >
                      <span className="truncate">{proj.title}</span>
                      <span className="text-xs text-slate-400">{proj.overallProgress}%</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Center (Desktop only): 5 Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
            {[
              { key: "home" as MobileTabKey, label: "Home", icon: Home },
              { key: "stages" as MobileTabKey, label: "Stages", icon: Layers, badge: `${completedMilestones}/${totalMilestones}` },
              { key: "billing" as MobileTabKey, label: "Billing", icon: CreditCard, badge: pendingPayments.length > 0 ? "Due" : undefined },
              { key: "rewards" as MobileTabKey, label: "Rewards", icon: Gift, badge: "₹4,000" },
              { key: "hub" as MobileTabKey, label: "Hub", icon: LayoutGrid },
            ].map(({ key, label, icon: TabIcon, badge }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm font-bold border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                  <span>{label}</span>
                  {badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : badge === "Due"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Realtime Status, Admin Link (Desktop), Bell with Red Dot, Avatar, Hamburger (Mobile) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Supabase Realtime Sync Badge */}
            <div
              onClick={() => navigate("/portal/admin")}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                supabaseStatus === "connected"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : supabaseStatus === "connecting"
                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  : supabaseStatus === "error"
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              }`}
              title="Supabase PostgreSQL Realtime WebSocket Status (Click for Admin Console)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : supabaseStatus === "connecting"
                    ? "bg-blue-500 animate-spin"
                    : supabaseStatus === "error"
                    ? "bg-red-500"
                    : "bg-amber-400"
                }`}
              />
              <span>
                {supabaseStatus === "connected"
                  ? "Realtime Active"
                  : supabaseStatus === "connecting"
                  ? "Connecting..."
                  : supabaseStatus === "error"
                  ? "Sync Error"
                  : "Local Mode"}
              </span>
            </div>

            <Link
              to="/portal/admin"
              className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <span>Admin Manager</span>
            </Link>

            {/* Bell with red notification badge */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User Profile Avatar with dropdown for desktop / menu for mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 p-0.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors shrink-0"
                  title={clientUser?.name || "Client Profile"}
                >
                  <img
                    src={
                      clientUser?.avatar ||
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80"
                    }
                    alt={clientUser?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden lg:inline text-xs font-bold text-slate-800 pr-2">
                    {clientUser?.name?.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-900 min-w-[200px] shadow-lg">
                <DropdownMenuLabel>
                  <div className="text-xs font-bold text-slate-900">{clientUser?.name}</div>
                  <div className="text-[11px] text-slate-500">{clientUser?.company}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logoutClient();
                    navigate("/portal/login");
                  }}
                  className="text-xs text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger Menu Toggle (Mobile only) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors active:scale-95"
              title="Menu"
            >
              <Menu className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN TAB CONTENT AREA (Responsive max-w-xl on mobile, max-w-4xl on desktop)
         ========================================================================= */}
      <main className="flex-1 px-4 pt-4 lg:pt-6 pb-24 lg:pb-12 max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full space-y-4 lg:space-y-6">
        {/* =======================================================================
            TAB 1: HOME / PROJECT OVERVIEW (1:1 CLONE OF SCREENSHOT 1 & SCREENSHOT 5)
           ======================================================================= */}
        {activeTab === "home" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title & Subtitle - Exact match of Screenshot 5 Left / Screenshot 1 */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {clientUser?.name ? `Hi, ${clientUser.name.split(" ")[0]}! 👋` : "Project overview"}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Here's what's happening with your project.
              </p>
            </div>

            {/* PROJECT CARD - Dispatch Portal (NO LORRY! High-Tech Project Glyph) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all space-y-3.5">
              {/* Header: High-Tech Project Glyph (NO LORRY!) + Title + Active/Live Badge */}
              <div className="flex items-start gap-3">
                {/* Modern High-Tech Glyph (Rounded rectangle thumbnail proportions, NO LORRY!) */}
                <div className="w-[72px] h-[52px] rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 relative overflow-hidden border border-white/20">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:6px_6px] opacity-60" />
                  <div className="relative flex flex-col items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-200 animate-pulse" />
                    <span className="text-[8px] font-black tracking-widest text-white/90 uppercase mt-0.5">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Project Title & Active Pill */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 truncate">
                        {projectDisplayTitle}
                      </h2>
                      <span className="bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                    {activeProject.summary ||
                      "Enterprise logistics platform tracking 1,200+ inter-city transport trucks across India with live GPS, automated alerts, and analytics."}
                  </p>
                </div>
              </div>

              {/* Overall Progress Block */}
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-slate-600 mb-1">
                  Overall progress
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {overallProgress}%
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {completedMilestones} of {totalMilestones} stages complete
                </div>
              </div>

              {/* Stage Progress Item */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                      Stage {currentStageIdx + 1} · {currentStageName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${currentStageProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {currentStageProgress}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[210px]">{currentStageNote}</span>
                  <span className="text-slate-400 font-medium shrink-0 ml-2">
                    Target: {currentStageTarget}
                  </span>
                </div>
              </div>

              {/* Dual Action Buttons: Launch App (Blue) & Contact Team (Light Green) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={primaryLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Launch app</span>
                  <span className="text-[11px]">↗</span>
                </a>

                <a
                  href="https://wa.me/919849021345?text=Hi%20Arjun,%20checking%20in%20on%20my%20OOMA%20LABS%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all border border-emerald-300"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact team</span>
                </a>
              </div>
            </div>

            {/* METRIC CARDS GRID (Visible borders on both Mobile & Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {/* Card 1: Pending invoices */}
              <div
                onClick={() => setActiveTab("billing")}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200/50">
                    <FileText className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Pending invoices
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    {formatINR(totalPending)}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-600 block mt-0.5">
                    {pendingPayments.length} milestone invoice(s) due
                  </span>
                </div>
              </div>

              {/* Card 2: VIP reward */}
              <div
                onClick={() => setActiveTab("rewards")}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-200/50">
                    <Gift className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    VIP reward
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    {formatINR(creditAmountINR)}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                    {verifiedReferrals} / {requiredReferrals} verified
                  </span>
                </div>
              </div>

              {/* Card 3: Project stages */}
              <div
                onClick={() => setActiveTab("stages")}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-200/50">
                    <Layers className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Project stages
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    {completedMilestones} / {totalMilestones}
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 block mt-0.5">
                    View timeline
                  </span>
                </div>
              </div>

              {/* Card 4: Environments */}
              <div
                onClick={() => {
                  toast.info(`${liveUrls.length || 4} Environments live: Prod & Staging clusters.`);
                }}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-200/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Environments
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    {liveUrls.length || 4} live
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                    Prod & Staging
                  </span>
                </div>
              </div>
            </div>

            {/* ALERT CARD: Next action (Punchy visible amber border) */}
            <div
              onClick={() => setActiveTab("billing")}
              className="bg-[#fef9c3] border-2 border-amber-300/90 hover:border-amber-400 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                  !
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Next action
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Review pending invoices
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {pendingPayments.length} milestone invoice(s) need attention.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
            </div>

            {/* RECENT ACTIVITY SECTION (Visible Borders) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Recent activity
                </h3>
                <button
                  onClick={() => setActiveTab("hub")}
                  className="text-xs font-semibold text-blue-600 flex items-center gap-0.5 hover:underline"
                >
                  View all →
                </button>
              </div>

              {/* Activity Item 1 */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      Stage {Math.max(1, completedMilestones)} completed
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Jan 10, 2025
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    UI/UX design and prototypes approved
                  </p>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      New message from Engineering
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Jan 09, 2025
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Build deployment link shared
                  </p>
                </div>
              </div>

              {/* Activity Item 3 (Exact match of Screenshot 1 & 5) */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      Invoice INV-004 generated
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Jan 08, 2025
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Milestone 4: Testing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 2: STAGES / TIMELINE (1:1 CLONE OF SCREENSHOT 2)
           ======================================================================= */}
        {activeTab === "stages" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Project stages
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Track progress from discovery to launch.
              </p>
            </div>

            {/* OVERALL PROGRESS CARD (With circular gauge) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${overallProgress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-xs font-black text-slate-900">
                  {overallProgress}%
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-900">
                  Overall progress
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-2">
                  {completedMilestones} of {totalMilestones} stages complete
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                  <div
                    className="bg-[#10b981] h-full rounded-full transition-all duration-700"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* VERTICAL TIMELINE - DYNAMICALLY MAPPED FROM MILESTONES (1:1 CLONE OF SCREENSHOT 2) */}
            <div className="relative pl-7 space-y-3">
              {/* Vertical connector line */}
              <div className="absolute left-3 top-5 bottom-5 w-0.5 bg-slate-200" />

              {milestones.map((milestone, idx) => {
                const isCompleted = milestone.status === "completed";
                const isInProgress = milestone.status === "in_progress";
                const fallback = CANONICAL_6_STAGES[idx] || CANONICAL_6_STAGES[0];
                const stageCleanTitle = milestone.title ? milestone.title.replace(/^\d+\.\s*/, "") : fallback.title.replace(/^\d+\.\s*/, "");
                const stageNote = milestone.notes || milestone.description || fallback.defaultNotes;
                const stageDate = isCompleted
                  ? (milestone.completedDate || (idx === 0 ? "Jan 10, 2025" : idx === 1 ? "Jan 10, 2025" : idx === 2 ? "Jan 18, 2025" : "Feb 05, 2025"))
                  : (milestone.dueDate || "Target: Apr 20, 2025");
                const progressVal = milestone.progress ?? (isCompleted ? 100 : isInProgress ? 40 : 0);

                return (
                  <div key={milestone.id || idx} className="relative group cursor-pointer">
                    {/* Timeline Node Circle on the stem */}
                    <div
                      className={`absolute -left-7 top-4 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-[#F8FAFC] z-10 shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isInProgress
                          ? "bg-blue-600 text-white ring-blue-100"
                          : "bg-white border-2 border-slate-300 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isInProgress ? (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>

                    {/* Individual White Rounded Card (Visible Crisp Border) */}
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-start gap-3 transition-all">
                      {/* Number badge */}
                      <div
                        className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : isInProgress
                            ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                            : "bg-slate-100 text-slate-500 border border-slate-200/50"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {stageCleanTitle}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              isCompleted
                                ? "text-emerald-700 bg-emerald-50"
                                : isInProgress
                                ? "text-blue-700 bg-blue-50"
                                : "text-slate-500 bg-slate-100"
                            }`}
                          >
                            {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                          </span>
                        </div>

                        {/* Date shown right under title/badge */}
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {stageDate}
                        </div>

                        {/* In-progress progress bar (Stage 5) */}
                        {isInProgress && (
                          <div className="flex items-center gap-2 mt-2 mb-1">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressVal}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900">
                              {progressVal}%
                            </span>
                          </div>
                        )}

                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {stageNote}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 self-center shrink-0 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Button: View engineering log */}
            <button
              onClick={() => setEngineeringLogOpen(true)}
              className="w-full bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-blue-600 font-bold text-xs shadow-sm transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>View engineering log</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =======================================================================
            TAB 3: BILLING & INVOICES (1:1 CLONE OF SCREENSHOT 3)
           ======================================================================= */}
        {activeTab === "billing" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Billing & invoices
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Track payments and download invoices.
              </p>
            </div>

            {/* TOTAL CONTRACT VALUE CARD */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">
                  Total Contract Value
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatINR(totalContract)}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Agreed total SOW budget
                </span>
              </div>
            </div>

            {/* 2 SIDE-BY-SIDE METRIC CARDS */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Paid & Settled */}
              <div className="bg-[#f0fdf4] border border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-700 block">
                  Paid & Settled
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight mt-1">
                  {formatINR(totalPaid)}
                </div>
                <span className="text-[10px] text-slate-600 block mt-1">
                  {paidPercent}% of milestone fees paid
                </span>
              </div>

              {/* Pending Balance */}
              <div className="bg-[#fffbeb] border border-amber-300/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
                <span className="text-[11px] font-bold text-amber-700 block">
                  Pending Balance
                </span>
                <div className="text-xl sm:text-2xl font-black text-amber-900 tracking-tight mt-1">
                  {formatINR(totalPending)}
                </div>
                <span className="text-[10px] text-slate-600 block mt-1">
                  {pendingPayments.length} invoice(s) due
                </span>
              </div>
            </div>

            {/* GSTIN VERIFICATION BANNER */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  GSTIN: 36AAFCO7891K1Z8 (Telangana)
                </span>
              </div>
              <button
                onClick={handleCopyGst}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Copy GSTIN"
              >
                {copiedGst ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* TABS SWITCHER: Invoices | Payments | Documents */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setBillingSubTab("invoices")}
                className={`flex-1 pb-2 text-xs font-bold transition-colors relative ${
                  billingSubTab === "invoices"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Invoices ({payments.length})
              </button>
              <button
                onClick={() => setBillingSubTab("payments")}
                className={`flex-1 pb-2 text-xs font-bold transition-colors relative ${
                  billingSubTab === "payments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setBillingSubTab("documents")}
                className={`flex-1 pb-2 text-xs font-bold transition-colors relative ${
                  billingSubTab === "documents"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Documents
              </button>
            </div>

            {/* DYNAMIC INVOICES LIST (Visible Borders) */}
            {billingSubTab === "invoices" && (
              <div className="space-y-2.5">
                {payments.map((payment) => {
                  const isPaid = payment.status === "paid";
                  return (
                    <div
                      key={payment.id}
                      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPaid ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" : "bg-red-50 text-red-500 border border-red-200/50"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {payment.invoiceNumber}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {payment.milestoneTitle}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {isPaid ? (
                              <span className="inline-block bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200/50">
                                Paid on {payment.paidDate || "Settled"}
                              </span>
                            ) : (
                              <span className="inline-block bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded border border-red-200/50">
                                Due {payment.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                            {formatINR(payment.amount)}
                          </span>
                          {/* Preserved pricing with clear Coming Soon state */}
                          {payment.invoiceNumber === "INV-003" || (payment === pendingPayments[0] && payment.invoiceNumber !== "INV-004") ? (
                            <button
                              onClick={() => handlePayClick(payment)}
                              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg mt-1 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <span>View Pricing</span>
                              <span className="bg-amber-100 text-amber-800 border border-amber-300/80 text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                                Coming Soon
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePayClick(payment)}
                              className="bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg mt-1 transition-colors"
                            >
                              View
                            </button>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {billingSubTab === "payments" && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">Total Settled: {formatINR(totalPaid)}</h4>
                <p className="text-[11px] text-slate-500">
                  Payments verified and credited to OOMA LABS intelligent systems retainer escrow.
                </p>
              </div>
            )}

            {billingSubTab === "documents" && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm text-center space-y-2">
                <FileText className="w-8 h-8 text-blue-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">Tax Documents & SOW Agreement</h4>
                <p className="text-[11px] text-slate-500">
                  Master Services Agreement (MSA) signed Jan 08, 2025. 18% GST tax invoices available on request.
                </p>
              </div>
            )}

            {/* PAYMENT METHODS SECTION - 1:1 EXACT CLONE OF SCREENSHOT 3 */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Payment Methods
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Online Gateway Coming Soon
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {/* 1. UPI: Exact Dual-Triangle NPCI Glyphs (Green & Orange) */}
                <button
                  type="button"
                  onClick={() => handlePayClick(pendingPayments[0] || payments[0], "upi")}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center my-0.5">
                    <svg viewBox="0 0 32 32" className="w-6 h-6 transform group-hover:scale-110 transition-transform">
                      {/* Left Triangle: Official NPCI Green */}
                      <path d="M12 3 L20 14 L4 28 Z" fill="#00A859" />
                      {/* Right Triangle: Official NPCI Orange */}
                      <path d="M20 3 L28 14 L12 28 Z" fill="#F37021" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">UPI</span>
                </button>

                {/* 2. NetBanking: Authentic Royal Blue Bank Pillars */}
                <button
                  type="button"
                  onClick={() => handlePayClick(pendingPayments[0] || payments[0], "netbanking")}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center my-0.5">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0052cc] transform group-hover:scale-110 transition-transform">
                      <path d="M12 2L2 7v2h20V7L12 2zm-8 8v8h3v-8H4zm6 0v8h3v-8h-3zm6 0v8h3v-8h-3zm-14 10v2h20v-2H2z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">NetBanking</span>
                </button>

                {/* 3. NEFT / RTGS: Authentic Transfer Loop Badge in Emerald Green */}
                <button
                  type="button"
                  onClick={() => handlePayClick(pendingPayments[0] || payments[0], "neft")}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center my-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-none stroke-[#00b074] stroke-[2.2] stroke-linecap-round stroke-linejoin-round transform group-hover:scale-110 transition-transform"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="3" />
                      <path d="M16 9l-4-3-4 3" />
                      <path d="M8 15l4 3 4-3" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">NEFT / RTGS</span>
                </button>

                {/* 4. Cards: Authentic Rounded Purple Credit Card Glyph */}
                <button
                  type="button"
                  onClick={() => handlePayClick(pendingPayments[0] || payments[0], "card")}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center my-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-none stroke-[#7c3aed] stroke-[2.2] stroke-linecap-round stroke-linejoin-round transform group-hover:scale-110 transition-transform"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="3" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                      <circle cx="6" cy="15" r="1" fill="#7c3aed" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Cards</span>
                </button>
              </div>
            </div>

            {/* GST INVOICES BANNER */}
            <div className="bg-[#f0fdf4] border border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    GST Invoices
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">
                    Invoices are automatically generated with 18% GST and sent to your registered email.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 4: REWARDS / VIP PARTNER REWARDS (1:1 CLONE OF SCREENSHOT 4)
           ======================================================================= */}
        {activeTab === "rewards" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                VIP Partner Rewards
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Invite verified clients and unlock exclusive rewards.
              </p>
            </div>

            {/* 0 OF 4 REFERRALS VERIFIED PROGRESS CARD (Dynamic) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  {verifiedReferrals} of {requiredReferrals} referrals verified
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  {referralPercent}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${referralPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                Invite 4 verified clients to unlock your {formatINR(creditAmountINR)} reward.
              </p>
            </div>

            {/* 4-STEP HORIZONTAL STEPPER */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-colors">
              <div className="relative flex items-center justify-between">
                <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />

                {[1, 2, 3, 4].map((step) => {
                  const isReached = verifiedReferrals >= step;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ring-4 ring-white shadow-sm ${
                          isReached ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isReached ? "✓" : step}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium mt-1.5">
                        Client {step}
                      </span>
                      <span className="text-xs font-black text-slate-900 mt-0.5">
                        {step * 25}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GOLD VIP PARTNER REWARD CARD (With Generated 3D Luxury Gift Box) */}
            <div className="bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/70 to-[#fef9c3] border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
              <div className="inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                <span>👑</span>
                <span>OOMA LABS VIP</span>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Partner Reward
                </h3>
                <div className="text-3xl sm:text-4xl font-black text-[#b45309] tracking-tight mt-0.5">
                  {formatINR(creditAmountINR)}
                </div>
                <p className="text-[11px] text-amber-900/80 font-medium mt-1">
                  Unlock after {requiredReferrals} verified referrals
                </p>
              </div>

              <div className="absolute right-1 -bottom-2 w-36 h-36 pointer-events-none drop-shadow-lg">
                <img
                  src="/vip-gift-reward.jpg"
                  alt="OOMA LABS VIP Gift Box"
                  className="w-full h-full object-contain transform rotate-3"
                />
              </div>
            </div>

            {/* BLUE ACTION BUTTON: Invite partners */}
            <button
              onClick={() => setInviteModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Share2 className="w-4 h-4 stroke-[2.2]" />
              <span>Invite partners</span>
            </button>

            {/* LINK CARDS */}
            <div className="space-y-2.5 pt-1">
              <div
                onClick={() =>
                  toast.info(
                    "Each referred client who engages with OOMA LABS unlocks ₹1,000 credit. After 4 verified referrals, your ₹4,000 VIP Card unlocks for instant invoice deduction!"
                  )
                }
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      How rewards work?
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Learn about eligibility, verification and payout.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() =>
                  toast.info(
                    "OOMA LABS Referral Policy: Verified enterprise referrals with discovery calls or advance fee deposits qualify. Payouts applied as direct invoice deduction or direct bank transfer."
                  )
                }
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Terms & Conditions
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Read the full reward policy and eligibility criteria.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 5: HUB / QUICK ACTIONS (1:1 CLONE OF SCREENSHOT 5 RIGHT)
           ======================================================================= */}
        {activeTab === "hub" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Project Hub
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Quick actions, team access, and 24/7 dedicated support.
              </p>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Activity
                </h3>
                <span className="text-xs font-semibold text-blue-600">
                  View All &gt;
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Stage {Math.max(1, completedMilestones)} completed</div>
                      <div className="text-[10px] text-slate-400">UI/UX design and prototypes approved</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Jan 10</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">New message from Engineering</div>
                      <div className="text-[10px] text-slate-400">Build deployment link shared</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Jan 09</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Invoice {payments[1]?.invoiceNumber || "INV-004"} generated</div>
                      <div className="text-[10px] text-slate-400">{payments[1]?.milestoneTitle || "Milestone 4: Testing"}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Jan 08</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS 2x2 GRID */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-bold text-slate-900">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={primaryLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#eff6ff] hover:bg-[#dbeafe] rounded-2xl p-3.5 border border-blue-200 shadow-sm hover:border-blue-300 flex flex-col justify-between transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Globe className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Launch App
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Open live application
                    </span>
                  </div>
                </a>

                <a
                  href="https://wa.me/919849021345?text=Hi%20Arjun,%20checking%20in%20from%20OOMA%20LABS%20Hub."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f0fdf4] hover:bg-[#dcfce7] rounded-2xl p-3.5 border border-emerald-200 shadow-sm hover:border-emerald-300 flex flex-col justify-between transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      WhatsApp
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Chat with team
                    </span>
                  </div>
                </a>

                <div
                  onClick={() => setAiChatOpen(true)}
                  className="bg-[#faf5ff] hover:bg-[#f3e8ff] rounded-2xl p-3.5 border border-purple-200 shadow-sm hover:border-purple-300 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Team Discussion
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      View messages
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("billing")}
                  className="bg-[#fffbeb] hover:bg-[#fef3c7] rounded-2xl p-3.5 border border-amber-200 shadow-sm hover:border-amber-300 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      View Invoices
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Check & pay invoices
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE LIST CARDS */}
            <div className="space-y-2 pt-1">
              {/* Project Team */}
              <div
                onClick={() =>
                  toast.info("Pod Assigned: Arjun Mehta (Lead Architect), Sneha Rao (Fullstack), Vikram Joshi (DevOps)")
                }
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Project Team</h4>
                    <p className="text-[10px] text-slate-500">Contact your dedicated team.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80"
                      alt="Team 1"
                    />
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                      alt="Team 2"
                    />
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                      alt="Team 3"
                    />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Key Dates */}
              <div
                onClick={() => setActiveTab("stages")}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Key Dates</h4>
                    <p className="text-[10px] text-slate-500">Target Completion</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{currentStageTarget}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Support & Engineering Tickets */}
              <div
                onClick={() => {
                  if (onOpenTicketModal) {
                    onOpenTicketModal();
                  } else {
                    window.open("https://wa.me/919849021345?text=Hi%20OOMA%20LABS%20Support,%20I%20need%20assistance%20with%20my%20project.", "_blank");
                  }
                }}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Engineering Support & Tickets</h4>
                      {activeProject.supportTickets?.length > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                          {activeProject.supportTickets.length}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">Raise bugs, change requests, or track active tickets</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Rate Engineering Pod & Feedback */}
              <div
                onClick={() => {
                  if (onOpenRatingModal) {
                    onOpenRatingModal();
                  } else {
                    toast.success("Thank you for your feedback! You can rate the delivery anytime.");
                  }
                }}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rate Engineering Pod & Quality</h4>
                    <p className="text-[10px] text-slate-500">Submit official CSAT rating for Lead Architect & Pod</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    5.0 ★
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* About This Project */}
              <div
                onClick={() =>
                  toast.info(
                    `${activeProject.title}: Dedicated SOW tier "${activeProject.tier || "Strategic"}". Built by OOMA LABS pod team.`
                  )
                }
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-slate-300 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">About This Project</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {activeProject.summary || "Enterprise logistics platform tracking..."}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          FLOATING BLUE CHATBOT BUTTON (Fixed bottom-right above bottom nav on mobile, bottom-6 on desktop)
         ========================================================================= */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
        title="OOMA LABS AI Assistant"
      >
        <Bot className="w-6 h-6 lg:w-7 lg:h-7" />
      </button>

      {/* =========================================================================
          BOTTOM STICKY NAVIGATION BAR - 1:1 CLONE (MOBILE ONLY, lg:hidden)
          Home, Stages, Billing, Rewards, Hub
          Active: Blue icon, Blue label, Blue indicator dot below
         ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.03)] max-w-xl mx-auto lg:hidden">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === "home" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          {activeTab === "home" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 2: Stages */}
        <button
          onClick={() => setActiveTab("stages")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === "stages" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === "stages" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Stages</span>
          {activeTab === "stages" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 3: Billing */}
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === "billing" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div className="relative">
            <CreditCard className={`w-5 h-5 ${activeTab === "billing" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            {pendingPayments.length > 0 && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Billing</span>
          {activeTab === "billing" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 4: Rewards */}
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === "rewards" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Gift className={`w-5 h-5 ${activeTab === "rewards" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Rewards</span>
          {activeTab === "rewards" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 5: Hub */}
        <button
          onClick={() => setActiveTab("hub")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === "hub" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${activeTab === "hub" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Hub</span>
          {activeTab === "hub" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>
      </nav>

      {/* =========================================================================
          HAMBURGER / CLIENT DRAWER MODAL
         ========================================================================= */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-3xl p-5 bg-white text-slate-900 border border-slate-200 shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-base font-black text-slate-900">
              Client Workspace Menu
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {clientUser?.name} · {clientUser?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-200/60">
              <img
                src={clientUser?.avatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80"}
                alt="Client"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">{clientUser?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{clientUser?.email}</div>
                <div className="text-[10px] text-blue-600 font-semibold">{clientUser?.title}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Projects
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    selectProject(proj.id);
                    setMenuOpen(false);
                    toast.success(`Switched to ${proj.title}`);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    proj.id === activeProject.id
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  <span className="truncate">{proj.title}</span>
                  <span className="text-[10px] opacity-80">{proj.overallProgress}%</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-200">
              <Link
                to="/portal/admin"
                className="w-full p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Admin Manager & Live Sync</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/free-quotation"
                className="w-full p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Request New Scope / AI SOW</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            <button
              onClick={() => {
                logoutClient();
                setMenuOpen(false);
                toast.info("Signed out of client workspace");
                navigate("/portal/login");
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          NOTIFICATIONS SHEET MODAL
         ========================================================================= */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-3xl p-5 bg-white text-slate-900 border border-slate-200 shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Project Notifications
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Real-time engineering alerts & billing updates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto pr-1">
            {pendingPayments.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Billing Notice</span>
                  <span className="text-[10px] text-slate-400">Action Required</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{pendingPayments[0]?.invoiceNumber} is pending</p>
                <p className="text-[11px] text-slate-600">Amount {formatINR(pendingPayments[0]?.amount || 0)} awaiting payment.</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Stage Progress</span>
                <span className="text-[10px] text-slate-400">Live Status</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Stage {currentStageIdx + 1}: {currentStageName} ({currentStageProgress}%)</p>
              <p className="text-[11px] text-slate-600">{currentStageNote}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Previous Stages</span>
                <span className="text-[10px] text-slate-400">Verified</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{completedMilestones} of {totalMilestones} phases marked completed</p>
              <p className="text-[11px] text-slate-600">All deliverables verified by OOMA LABS pod team.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          ENGINEERING LOG MODAL (From Stages Screen)
         ========================================================================= */}
      <Dialog open={engineeringLogOpen} onOpenChange={setEngineeringLogOpen}>
        <DialogContent className="max-w-xs sm:max-w-md rounded-3xl p-5 bg-white text-slate-900 border border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Engineering Pod Activity Log
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Direct telemetry from OOMA LABS pod team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            {milestones.map((m, idx) => (
              <div key={m.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Stage {idx + 1}: {m.title.replace(/^\d+\.\s*/, "")}</strong>
                  <span className="text-[10px] text-slate-400">{m.completedDate || m.dueDate || "In progress"}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {m.notes || m.description || "Engineering pod tasks executed according to SOW specification."}
                </p>
                <div className="text-[10px] text-blue-600 font-semibold">
                  Status: {m.status === "completed" ? "Completed ✓" : m.status === "in_progress" ? `In Progress (${m.progress}%)` : "Upcoming"}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          INVITE PARTNERS REFERRAL MODAL (From Rewards Screen)
         ========================================================================= */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-3xl p-5 bg-white text-slate-900 border border-slate-200 shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              Invite Business Partners
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Share your VIP referral link to unlock your {formatINR(creditAmountINR)} credit card!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Referral Code
              </span>
              <div className="text-sm font-black text-slate-900 font-mono mt-0.5">
                {referralCode}
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={handleCopyReferral}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Invitation Link Copied!" : "Copy Invitation Link"}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Namaste! Check out OOMA LABS for building software & AI systems. Use my referral code ${referralCode} to claim a ₹50,000 discovery audit fee waiver: https://oomalabs.com/free-quotation?ref=${referralCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          INTERACTIVE AI ASSISTANT CHAT MODAL
         ========================================================================= */}
      <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <DialogContent className="max-w-xs sm:max-w-md rounded-3xl p-5 bg-white text-slate-900 border border-slate-200 shadow-xl flex flex-col h-[75vh]">
          <DialogHeader className="text-left space-y-1 pb-2 border-b border-slate-200">
            <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              OOMA LABS AI Assistant
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Live SOW, Milestones, and Engineering Support
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-sm"
                      : "bg-slate-100 text-slate-900 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setChatInput(`What is the status of Stage ${currentStageIdx + 1}?`)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              Stage Status?
            </button>
            <button
              onClick={() => setChatInput("How can I pay my pending invoices?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              Pay Invoices?
            </button>
            <button
              onClick={() => setChatInput("Can I talk with lead engineer on WhatsApp?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              WhatsApp Lead?
            </button>
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about your project..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortalMobileView;
