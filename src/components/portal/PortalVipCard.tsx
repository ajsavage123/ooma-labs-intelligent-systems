import React, { useState } from "react";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  ChevronRight,
  Wifi,
  Award,
  Zap,
  Gift,
  Eye,
  RotateCcw,
} from "lucide-react";
import { formatINR } from "../../context/ClientPortalContext";

interface PortalVipCardProps {
  verifiedCount: number;
  requiredCount?: number;
  cardholderName?: string;
  isUnlocked?: boolean;
  creditAmountINR?: number;
  onApplyCredit?: () => void;
}

export const PortalVipCard: React.FC<PortalVipCardProps> = ({
  verifiedCount,
  requiredCount = 4,
  cardholderName = "Rajesh Sharma",
  isUnlocked = false,
  creditAmountINR = 4000,
  onApplyCredit,
}) => {
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [demoUnlocked, setDemoUnlocked] = useState<boolean | null>(null);

  // Progressive unlock calculation
  const progressRatio = Math.min(1, Math.max(0, verifiedCount / requiredCount));
  const progressPercent = Math.round(progressRatio * 100);
  const isRealUnlocked = isUnlocked || verifiedCount >= requiredCount;
  const actuallyUnlocked = demoUnlocked !== null ? demoUnlocked : isRealUnlocked;

  // 3D perspective tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 12), y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("OOMA-VERIFIED-4X");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#18181b] via-[#121215] to-[#09090b] border border-amber-500/20 p-3 sm:p-6 lg:p-8 shadow-[0_10px_50px_-15px_rgba(245,158,11,0.15)] overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      {/* Header & Milestone Status */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-5 mb-2.5 sm:mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wider sm:tracking-widest uppercase bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400" />
              OOMA LABS VIP
            </span>
            {actuallyUnlocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 100% UNLOCKED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" /> {verifiedCount} / {requiredCount} Verified
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            VIP Partner Credit Card ({formatINR(creditAmountINR)})
          </h2>
          <p className="text-[11px] sm:text-sm text-zinc-400 mt-0.5 sm:mt-1 max-w-xl leading-snug sm:leading-relaxed hidden sm:block">
            Invite 4 verified enterprise peers to unlock your{" "}
            <span className="text-amber-400 font-semibold">{formatINR(creditAmountINR)} Credit Card</span>, directly applicable on milestone invoices.
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 sm:hidden">
            Invite 4 peers to unlock your <strong className="text-amber-400">{formatINR(creditAmountINR)} Credit Card</strong>.
          </p>
        </div>

        {/* Progress Counter Box */}
        <div className="flex items-center sm:flex-col justify-between sm:items-end bg-zinc-950/80 border border-amber-500/20 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-5 sm:py-3 shrink-0 shadow-lg">
          <span className="text-[9px] sm:text-[11px] text-zinc-400 uppercase tracking-wider sm:tracking-widest font-bold">Progressive Reveal</span>
          <div className="flex items-baseline gap-1 sm:mt-1">
            <span className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              {progressPercent}%
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">({verifiedCount}/4 Verified)</span>
          </div>
        </div>
      </div>

      {/* Progressive Unlock Step Indicators */}
      <div className="relative z-10 mb-3 sm:mb-6 space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300 flex items-center gap-1 sm:gap-1.5">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            Verification Stages
          </span>
          <span className="font-medium text-amber-400">
            {actuallyUnlocked
              ? "All 4 Clients Verified • Card Ready"
              : `${requiredCount - verifiedCount} more advance needed`}
          </span>
        </div>

        {/* Multi-step progress bar */}
        <div className="h-1.5 sm:h-3 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              actuallyUnlocked
                ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                : "bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500"
            }`}
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        {/* 4 Quarter Milestone Cards - Ultra compact horizontal stepper */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2.5 pt-0.5 sm:pt-1">
          {[
            { step: 1, label: "Client 1", reveal: "25%" },
            { step: 2, label: "Client 2", reveal: "50%" },
            { step: 3, label: "Client 3", reveal: "75%" },
            { step: 4, label: "Client 4", reveal: "100%" },
          ].map((item) => {
            const isDone = verifiedCount >= item.step;
            return (
              <div
                key={item.step}
                className={`p-1 sm:p-2.5 rounded-md sm:rounded-xl border text-center sm:text-left transition-all ${
                  isDone
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-500"
                }`}
              >
                <div className="flex items-center justify-center sm:justify-between mb-0.5">
                  <span className="font-bold text-[9px] sm:text-[11px] uppercase tracking-wider">{item.label}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 hidden sm:inline" />
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-mono hidden sm:inline">0/1</span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[11px] font-semibold text-zinc-300 sm:text-zinc-400 block truncate">
                  {isDone ? `✓ ${item.reveal}` : item.reveal}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Card Presentation Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-3 sm:gap-6 lg:gap-8 justify-center my-1 sm:my-2">
        {/* 3D Physical Credit Card Container */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-[480px]">
          <div
            className="relative w-full aspect-[961/569] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer select-none transition-transform duration-200"
            style={{
              perspective: "1000px",
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
              boxShadow: actuallyUnlocked
                ? "0 25px 50px -12px rgba(245, 158, 11, 0.45), 0 0 0 1px rgba(245, 158, 11, 0.5)"
                : "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(245, 158, 11, 0.25)",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Unlocked Card Image (Ribbon removed - reveals clean card) */}
            <img
              src="/ooma-vip-card-unlocked.png"
              alt="OOMA LABS VIP Partner Credit Card (Unlocked - Clean)"
              className="absolute inset-0 w-full h-full object-contain object-center rounded-xl sm:rounded-2xl transition-opacity duration-700 ease-in-out"
              style={{
                opacity: actuallyUnlocked ? 1 : 0,
              }}
            />

            {/* Gift Ribbon Wrapped Card Image (Visible while locked, removed upon unlock) */}
            <img
              src="/ooma-vip-card-ribbon.png"
              alt="OOMA LABS VIP Partner Gift Card (Ribbon Wrapped)"
              className="absolute inset-0 w-full h-full object-contain object-center rounded-xl sm:rounded-2xl transition-all duration-700 ease-in-out"
              style={{
                opacity: actuallyUnlocked ? 0 : 1,
                transform: actuallyUnlocked ? "scale(1.04)" : "scale(1)",
              }}
            />

            {/* Interactive Light Holographic Sheen */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl opacity-30 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `linear-gradient(${115 + tilt.y * 3}deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.8) 45%, rgba(255,215,0,0.9) 55%, rgba(255,255,255,0) 80%)`,
              }}
            />

            {/* Floating Gift / Ribbon Status Badge on Card */}
            <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 pointer-events-none z-10">
              {actuallyUnlocked ? (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wide uppercase bg-emerald-950/85 text-emerald-300 border border-emerald-500/50 shadow-lg backdrop-blur-md">
                  <Unlock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  Ribbon Untied • Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wide uppercase bg-black/70 text-amber-300 border border-amber-500/50 shadow-lg backdrop-blur-md">
                  <Gift className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  Gift Ribbon Tied • {verifiedCount}/4 Verified
                </span>
              )}
            </div>

            {/* Discreet Cardholder Pill */}
            <div className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-4 pointer-events-none z-10 flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-amber-200/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-amber-500/30">
                {cardholderName}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-zinc-300/80 bg-black/50 backdrop-blur-md px-1 py-0.5 rounded border border-zinc-700/40">
                •••• {creditAmountINR}
              </span>
            </div>
          </div>

          {/* Ribbon State Interactive Preview Controls */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-0.5 text-xs">
            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mr-0.5">Preview:</span>
            <button
              type="button"
              onClick={() => setDemoUnlocked(false)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border text-[10px] sm:text-xs font-medium transition-all ${
                !actuallyUnlocked
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              🎁 Ribbon Tied (Locked)
            </button>
            <button
              type="button"
              onClick={() => setDemoUnlocked(true)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border text-[10px] sm:text-xs font-medium transition-all ${
                actuallyUnlocked
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              ✨ Ribbon Removed (Unlocked)
            </button>
            {demoUnlocked !== null && (
              <button
                type="button"
                onClick={() => setDemoUnlocked(null)}
                className="px-1.5 py-0.5 rounded-md text-zinc-500 hover:text-zinc-300 text-[10px] sm:text-xs flex items-center gap-1 transition-colors"
                title="Reset to real status"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Benefits & Actions Card */}
        <div className="w-full lg:max-w-md flex flex-col justify-between space-y-2 sm:space-y-4">
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-lg space-y-1.5 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              VIP Partner Exclusive Privileges
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs text-zinc-300">
              <li className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Instant {formatINR(creditAmountINR)} Milestone Credit</strong>
                  <span className="hidden sm:inline">: Redeemable directly on upcoming development sprints.</span>
                </span>
              </li>
              <li className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Lifetime 20% Sprint Discount</strong>
                  <span className="hidden sm:inline">: Unlocks coupon code <code className="text-amber-300 font-mono font-bold">OOMA-VERIFIED-4X</code> for all future modules.</span>
                </span>
              </li>
              <li className="flex items-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Lead Architect Direct Line</strong>
                  <span className="hidden sm:inline">: Priority 1-on-1 reviews and escalation with Arjun Mehta.</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Action Trigger */}
          {actuallyUnlocked ? (
            <div className="space-y-1.5 sm:space-y-2">
              <button
                type="button"
                onClick={onApplyCredit}
                className="w-full py-2 sm:py-3.5 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)]"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Apply {formatINR(creditAmountINR)} Credit to Milestone Invoice
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-mono text-amber-300 flex items-center justify-between">
                  <span>COUPON: OOMA-VERIFIED-4X</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold shrink-0">
                  {copied ? "Copied!" : "20% Active"}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950/60 border border-amber-500/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center space-y-1 sm:space-y-2">
              <p className="text-[10px] sm:text-xs text-zinc-300 leading-snug">
                Share your partner link. As peers deposit their advance, your card progressively unlocks!
              </p>
              <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-400 font-bold">
                <span>Status: {verifiedCount} of 4 Verified Clients</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
