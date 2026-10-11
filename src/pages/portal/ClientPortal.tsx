import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useClientPortal } from "../../context/ClientPortalContext";
import { PortalOverview } from "../../components/portal/PortalOverview";
import { PortalMilestones } from "../../components/portal/PortalMilestones";
import { PortalLiveUrls } from "../../components/portal/PortalLiveUrls";
import { PortalComments } from "../../components/portal/PortalComments";
import { PortalPayments } from "../../components/portal/PortalPayments";
import { PortalRatings } from "../../components/portal/PortalRatings";
import { PortalSupport } from "../../components/portal/PortalSupport";
import { PortalReferrals } from "../../components/portal/PortalReferrals";
import { PortalPayModal } from "../../components/portal/PortalPayModal";
import { PortalRatingModal } from "../../components/portal/PortalRatingModal";
import { PortalTicketModal } from "../../components/portal/PortalTicketModal";
import { PortalFAQ } from "../../components/portal/PortalFAQ";
import {
  LayoutDashboard,
  Layers,
  Globe,
  MessageSquare,
  CreditCard,
  Star,
  Headphones,
  Gift,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building,
  Menu,
  X,
  Bell,
  ShieldCheck,
  LayoutGrid,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientPayment } from "../../types";

type TabKey =
  | "overview"
  | "milestones"
  | "payments"
  | "referrals"
  | "hub"
  | "live_urls"
  | "comments"
  | "ratings"
  | "support"
  | "faq";

export const ClientPortal: React.FC = () => {
  const {
    clientUser,
    activeProject,
    projects,
    availableClients,
    selectProject,
    switchClient,
    logoutClient,
    payInvoice,
    submitRating,
    createSupportTicket,
  } = useClientPortal();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = (searchParams.get("tab") as TabKey) || null;
  const [activeTab, setActiveTabState] = useState<TabKey>(tabFromQuery || "overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTabState(tabFromQuery);
    }
  }, [tabFromQuery]);

  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  // Modals state
  const [payModalPayment, setPayModalPayment] = useState<ClientPayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  if (!clientUser) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-xl bg-[#18181b] border border-[#27272a] text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Client Login Required</h2>
          <p className="text-xs text-zinc-400">
            Please log in with your client credentials to access your dashboard.
          </p>
          <Button
            onClick={() => navigate("/portal/login")}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold"
          >
            Go to Client Login
          </Button>
        </div>
      </div>
    );
  }

  const desktopTabs: { key: TabKey; label: string; icon: React.ElementType; badge?: string }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "milestones", label: "Stages & Timeline", icon: Layers, badge: `${activeProject.overallProgress}%` },
    { key: "live_urls", label: "Environments", icon: Globe, badge: `${activeProject.liveUrls.length}` },
    { key: "comments", label: "Discussions", icon: MessageSquare, badge: `${activeProject.comments.length}` },
    {
      key: "payments",
      label: "Billing & Invoices",
      icon: CreditCard,
      badge: activeProject.payments.some((p) => p.status === "pending") ? "Due" : undefined,
    },
    { key: "ratings", label: "Client Reviews", icon: Star },
    { key: "support", label: "Support", icon: Headphones },
    { key: "referrals", label: "Rewards & VIP Card", icon: Gift, badge: "₹4,000" },
    { key: "faq", label: "FAQ & Policies", icon: HelpCircle },
  ];

  const primaryTabs: { key: TabKey; label: string; icon: React.ElementType; badge?: string }[] = [
    { key: "overview", label: "Home", icon: LayoutDashboard },
    { key: "milestones", label: "Stages", icon: Layers, badge: `${activeProject.overallProgress}%` },
    {
      key: "payments",
      label: "Billing",
      icon: CreditCard,
      badge: activeProject.payments.some((p) => p.status === "pending") ? "Due" : undefined,
    },
    { key: "referrals", label: "Rewards", icon: Gift, badge: "₹4,000" },
    { key: "hub", label: "Hub", icon: LayoutGrid },
  ];

  const handleLogout = () => {
    logoutClient();
    toast.info("Signed out of client portal");
    navigate("/portal/login");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
      {/* Top Navbar - Solid Dark Slate */}
      <header className="sticky top-0 z-50 bg-[#121316] border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Project Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white stroke-[6]">
                  <path d="M 35 15 A 40 40 0 1 1 20 35" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                  OOMA LABS
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  CLIENT WORKSPACE
                </span>
              </div>
            </Link>

            {/* Project Switcher Dropdown (Desktop) */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#27272a] text-xs font-semibold text-zinc-200 transition-colors">
                    <Building className="w-3.5 h-3.5 text-[#2563eb]" />
                    <span className="max-w-[220px] truncate">{activeProject.title}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#18181b] border-[#27272a] text-white min-w-[260px]">
                  <DropdownMenuLabel className="text-xs text-zinc-400 uppercase">
                    Your Active SOW Projects
                  </DropdownMenuLabel>
                  {projects.map((proj) => (
                    <DropdownMenuItem
                      key={proj.id}
                      onClick={() => selectProject(proj.id)}
                      className={`text-xs cursor-pointer flex items-center justify-between ${
                        proj.id === activeProject.id ? "bg-[#2563eb] text-white font-bold" : ""
                      }`}
                    >
                      <span className="truncate">{proj.title}</span>
                      <span className="text-xs text-zinc-400">{proj.overallProgress}%</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toast.info("All 6-phase engineering pipelines operational. No errors.")}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#27272a] text-zinc-400 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Client User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#27272a] transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-700">
                    {clientUser.avatar ? (
                      <img src={clientUser.avatar} alt={clientUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                        {clientUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight">{clientUser.name}</div>
                    <div className="text-[11px] text-zinc-400 leading-tight truncate max-w-[120px]">
                      {clientUser.company}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#18181b] border-[#27272a] text-white min-w-[220px]">
                <DropdownMenuLabel>
                  <div className="text-xs font-bold text-white">{clientUser.name}</div>
                  <div className="text-[11px] text-zinc-400">{clientUser.email}</div>
                  <div className="text-[11px] text-zinc-400 font-normal">{clientUser.title}</div>
                  <div className="text-[11px] text-zinc-400 font-normal mt-0.5">{clientUser.company}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#27272a]" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs Ribbon - Full Desktop Layout with All 9 Tabs */}
        <div className="hidden lg:block border-t border-[#27272a] bg-[#121316]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {desktopTabs.map(({ key, label, icon: Icon, badge }) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30 font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-[#18181b]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                    {badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : badge === "Due"
                            ? "bg-[#78350f] text-amber-200"
                            : "bg-[#27272a] text-zinc-300"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-3">
              <span className="text-xs text-zinc-400">Target Launch: <strong className="text-emerald-400">{activeProject.targetLaunchDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#121316] border-t border-[#27272a] p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {desktopTabs.map(({ key, label, icon: Icon, badge }) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? "bg-[#2563eb] text-white font-bold"
                        : "bg-[#18181b] text-zinc-300 border border-[#27272a]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                    {badge && <span className="text-[10px] font-bold ml-auto">{badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mb-20 lg:mb-6">
        {/* Back Button for Hub Sub-Views (Mobile Only) */}
        {["live_urls", "comments", "ratings", "support", "faq"].includes(activeTab) && (
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <button
              onClick={() => setActiveTab("hub")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] text-xs font-semibold text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              {activeTab === "live_urls" ? "Live Environments" : activeTab.replace("_", " ")}
            </span>
          </div>
        )}

        {activeTab === "overview" && (
          <PortalOverview
            onNavigateTab={(tab) => setActiveTab(tab as TabKey)}
            onOpenPayModal={(payment) => {
              setPayModalPayment(payment);
              setIsPayModalOpen(true);
            }}
            onOpenRatingModal={() => setIsRatingModalOpen(true)}
          />
        )}

        {activeTab === "milestones" && <PortalMilestones />}
        {activeTab === "payments" && <PortalPayments />}
        {activeTab === "referrals" && <PortalReferrals />}

        {/* Unified Mobile App Hub */}
        {activeTab === "hub" && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Hub Header */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#2563eb]" />
                Project Hub & Utilities
              </h2>
              <p className="text-xs text-zinc-400">
                Explore live app deployments, chat with engineering leads, CSAT reviews, and 24/7 support.
              </p>
            </div>

            {/* Grid of Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Live Environments */}
              <button
                onClick={() => setActiveTab("live_urls")}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Environments</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold">Live</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    {activeProject.liveUrls.length} Active URLs (Prod & Staging)
                  </p>
                </div>
              </button>

              {/* Project Discussion */}
              <button
                onClick={() => setActiveTab("comments")}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Discussion</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">{activeProject.comments.length} msgs</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Chat with lead architect & pod devs
                  </p>
                </div>
              </button>

              {/* CSAT Reviews & Rating */}
              <button
                onClick={() => setActiveTab("ratings")}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Client Reviews</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold">5.0 ★</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Rate engineering velocity & design
                  </p>
                </div>
              </button>

              {/* 24/7 WhatsApp & Support */}
              <button
                onClick={() => setActiveTab("support")}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">24/7 Support</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold">WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Direct line to dedicated engineer
                  </p>
                </div>
              </button>

              {/* FAQs & Guide */}
              <button
                onClick={() => setActiveTab("faq")}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">FAQ & SOW Guide</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">Policy</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Delivery lifecycle & scope policies
                  </p>
                </div>
              </button>

              {/* Direct Support Ticket Modal Trigger */}
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-4 rounded-2xl text-left transition-all active:scale-[0.98] flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Create Ticket</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold">Priority</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Submit architecture or scope inquiry
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Sub-Views */}
        {activeTab === "live_urls" && <PortalLiveUrls />}
        {activeTab === "comments" && <PortalComments />}
        {activeTab === "ratings" && <PortalRatings />}
        {activeTab === "support" && <PortalSupport />}
        {activeTab === "faq" && <PortalFAQ />}
      </main>

      {/* Mobile Bottom Sticky Navigation (Native Mobile App Bar - Hidden on Desktop) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121316]/95 backdrop-blur-xl border-t border-[#27272a] px-3 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {primaryTabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key || (key === "hub" && ["live_urls", "comments", "ratings", "support", "faq"].includes(activeTab));
          const isDue = key === "payments" && activeProject.payments.some((p) => p.status === "pending");

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabKey)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive ? "text-[#3b82f6] font-bold" : "text-zinc-400 hover:text-zinc-200 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#3b82f6] stroke-[2.4]" : "stroke-[1.8]"}`} />
                {isDue && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                {key === "referrals" && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#3b82f6] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Modals */}
      <PortalPayModal
        payment={payModalPayment}
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onConfirmPay={(id) => payInvoice(id)}
      />

      <PortalRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmitRating={submitRating}
      />

      <PortalTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmitTicket={createSupportTicket}
      />
    </div>
  );
};

export default ClientPortal;
