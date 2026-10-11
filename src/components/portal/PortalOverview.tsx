import React from "react";
import { useClientPortal, formatINR, CANONICAL_6_STAGES } from "../../context/ClientPortalContext";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Globe,
  Layers,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  Smartphone,
  Calendar,
  Gift,
  ArrowRight,
  Zap,
  Check,
  Sparkles,
} from "lucide-react";

interface PortalOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenPayModal: (payment: any) => void;
  onOpenRatingModal: () => void;
}

export const PortalOverview: React.FC<PortalOverviewProps> = ({
  onNavigateTab,
  onOpenPayModal,
}) => {
  const { activeProject } = useClientPortal();

  const completedMilestones = activeProject.milestones.filter((m) => m.status === "completed").length;
  const inProgressMilestones = activeProject.milestones.filter((m) => m.status === "in_progress").length;
  const totalMilestones = activeProject.milestones.length || 6;

  const totalPaid = activeProject.payments
    .filter((p) => p.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = activeProject.payments.filter((p) => p.status === "pending");
  const totalPending = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const primaryLiveUrl = activeProject.liveUrls.find((u) => u.type === "production") || activeProject.liveUrls[0];

  // Determine current active milestone
  const activeIdx = activeProject.milestones.findIndex((m) => m.status === "in_progress");
  const currentStageIdx = activeIdx !== -1 ? activeIdx : completedMilestones < totalMilestones ? completedMilestones : 5;
  const currentStage = activeProject.milestones[currentStageIdx] || activeProject.milestones[0];
  const cleanStageName = (currentStage?.title || "Development").replace(/^\d+\.\s*/, "").replace(/^(Phase|Sprint|Stage)\s*\d+[:\s-]*/i, "");
  const currentNote = currentStage?.notes || currentStage?.description || CANONICAL_6_STAGES[currentStageIdx]?.defaultNotes;

  const verifiedReferrals = activeProject.referrals.verifiedClientsCount || 0;
  const requiredReferrals = activeProject.referrals.requiredForUnlock || 4;
  const isCardUnlocked = activeProject.referrals.isCardUnlocked || verifiedReferrals >= requiredReferrals;
  const creditAmountINR = activeProject.referrals.creditCardAmountINR || 4000;

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
      {/* 1. HERO STATUS CARD - Responsive Desktop & Mobile */}
      <div className="bg-gradient-to-br from-[#18181b] via-[#141416] to-[#0f1013] border border-[#27272a] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#27272a] text-zinc-300 border border-[#3f3f46]">
              {activeProject.company}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-[#2563eb]/20 text-[#60a5fa] border border-[#2563eb]/40 text-xs font-bold">
            {activeProject.overallProgress}% Complete
          </div>
        </div>

        {/* Project Title */}
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {activeProject.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {activeProject.summary}
          </p>
        </div>

        {/* Active Stage & Progress Bar */}
        <div className="space-y-1.5 bg-[#121316] p-3.5 rounded-xl border border-[#27272a]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2563eb]" />
              Stage {currentStageIdx + 1}: {cleanStageName}
            </span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {currentStage?.progress || 0}%
            </span>
          </div>

          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563eb] h-full rounded-full transition-all duration-500"
              style={{ width: `${activeProject.overallProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
            <span>{completedMilestones} of {totalMilestones} stages done</span>
            <span>Target: {activeProject.targetLaunchDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 pt-1">
          {primaryLiveUrl ? (
            <a
              href={primaryLiveUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-transform active:scale-[0.98] shadow-md shadow-blue-900/30 text-center"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Launch App</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ) : (
            <button
              onClick={() => onNavigateTab("milestones")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-transform active:scale-[0.98] text-center"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View Stages</span>
            </button>
          )}

          <a
            href="https://wa.me/919849021345?text=Hi%20Arjun,%20checking%20in%20on%20my%20OOMA%20LABS%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-emerald-200 text-xs font-bold border border-emerald-800 transition-transform active:scale-[0.98] text-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Lead</span>
          </a>
        </div>
      </div>

      {/* 2. METRIC TILES: 4 Columns on Desktop, 2 Columns on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Stages Tile */}
        <button
          onClick={() => onNavigateTab("milestones")}
          className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-3.5 rounded-2xl text-left transition-all active:scale-[0.98] space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Stages</span>
            <Layers className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {completedMilestones} <span className="text-xs font-normal text-zinc-400">/ {totalMilestones}</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>View Timeline</span>
            <span className="text-blue-400 font-semibold">→</span>
          </div>
        </button>

        {/* Billing Tile */}
        <button
          onClick={() => onNavigateTab("payments")}
          className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-3.5 rounded-2xl text-left transition-all active:scale-[0.98] space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Invoices</span>
            <CreditCard className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {totalPending > 0 ? formatINR(totalPending) : "Settled"}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span className={totalPending > 0 ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
              {totalPending > 0 ? "Pending Due" : "All Paid"}
            </span>
            <span className="text-amber-400 font-semibold">→</span>
          </div>
        </button>

        {/* Rewards / VIP Card Tile */}
        <button
          onClick={() => onNavigateTab("referrals")}
          className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-3.5 rounded-2xl text-left transition-all active:scale-[0.98] space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">VIP Credit Card</span>
            <Gift className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {formatINR(creditAmountINR)}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="text-emerald-400 font-semibold">{verifiedReferrals}/4 Vetted</span>
            <span className="text-emerald-400 font-semibold">→</span>
          </div>
        </button>

        {/* Environments Tile */}
        <button
          onClick={() => onNavigateTab("live_urls")}
          className="bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-[#3f3f46] p-3.5 rounded-2xl text-left transition-all active:scale-[0.98] space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Environments</span>
            <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {activeProject.liveUrls.length} <span className="text-xs font-normal text-zinc-400">Live</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Prod & Staging</span>
            <span className="text-cyan-400 font-semibold">→</span>
          </div>
        </button>
      </div>

      {/* 3. CURRENT ACTIVE STAGE & LOG NOTE HIGHLIGHT */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Current Active Stage
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("milestones")}
            className="text-xs text-[#2563eb] hover:underline font-semibold flex items-center gap-1"
          >
            <span>All 6 Stages</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#121316] border border-[#27272a] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              Stage {currentStageIdx + 1}: {cleanStageName}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1e3a8a] text-blue-300">
              In Progress
            </span>
          </div>

          {currentNote && (
            <div className="text-xs text-zinc-300 leading-relaxed pt-1 border-t border-[#27272a]/80">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-0.5">
                Stage Log Notes:
              </span>
              {currentNote}
            </div>
          )}
        </div>
      </div>

      {/* 4. OOMA VIP CREDIT CARD COMPACT TEASER */}
      <div
        onClick={() => onNavigateTab("referrals")}
        className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-900/40 rounded-2xl p-4 cursor-pointer hover:border-amber-600/60 transition-all active:scale-[0.98] shadow-lg shadow-black/40"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden border border-amber-500/40 shadow-md shrink-0">
              <img
                src={isCardUnlocked ? "/ooma-vip-card-unlocked.png" : "/ooma-vip-card-ribbon.png"}
                alt="OOMA LABS VIP Card"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-200">OOMA LABS Credit Card</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono font-semibold">VIP</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isCardUnlocked ? "Card Active: ₹4,000 credit applied to next sprint" : "Refer 4 verified clients to unlock your ₹4,000 credit card"}
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-400 font-bold shrink-0 flex items-center gap-1">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 5. ENGINEERING LEAD & WHATSAPP CARD */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={activeProject.dedicatedLead.avatar}
            alt={activeProject.dedicatedLead.name}
            className="w-10 h-10 rounded-full object-cover border border-[#3f3f46]"
          />
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">{activeProject.dedicatedLead.name}</h3>
            <span className="text-[11px] text-zinc-400 block">{activeProject.dedicatedLead.role}</span>
          </div>
        </div>

        <a
          href="https://wa.me/919849021345?text=Namaste%20Arjun,%20checking%20in%20on%20my%20project%20deliverables."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-emerald-200 text-xs font-bold border border-emerald-800 transition-transform active:scale-95 shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
