import React, { useState } from "react";
import { useClientPortal, formatINR } from "../../context/ClientPortalContext";
import {
  Copy,
  Check,
  Gift,
  Share2,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Building,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PortalVipCard } from "./PortalVipCard";

export const PortalReferrals: React.FC = () => {
  const { activeProject, clientUser } = useClientPortal();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const { referrals } = activeProject;
  const verifiedCount = referrals.verifiedClientsCount || 0;
  const requiredCount = referrals.requiredForUnlock || 4;
  const progressPercent = Math.min(100, Math.round((verifiedCount / requiredCount) * 100));
  const isUnlocked = referrals.isCouponUnlocked || referrals.isCardUnlocked || verifiedCount >= requiredCount;
  const couponCode = referrals.unlockedCouponCode || "OOMA-VERIFIED-4X";

  // Dynamic shareable quotation referral link pointing to the AI Chatbot Intake
  const shareableQuotationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/free-quotation?ref=${referrals.referralCode}`
      : referrals.shareableUrl || `https://oomalabs.com/free-quotation?ref=${referrals.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referrals.referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableQuotationUrl);
    setCopiedLink(true);
    toast.success("Referral link copied! Share with your peers.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    toast.success(`Coupon code ${couponCode} copied! Apply during milestone payment.`);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const whatsappShareText = encodeURIComponent(
    `Namaste! If you're building software, intelligent systems, or AI agents, check out OOMA LABS. Request a free architectural quotation and claim a ₹50,000 discovery audit fee waiver here:\n${shareableQuotationUrl}`
  );

  return (
    <div className="space-y-3.5 sm:space-y-6 w-full max-w-7xl mx-auto">
      {/* Mobile Top Quick Action Bar */}
      <div className="sm:hidden bg-[#18181b] border border-[#27272a] rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1.5 min-w-0">
          <Gift className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white truncate">Referral Program</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#064e3b] text-emerald-200 border border-emerald-700/60 text-[10px] font-bold h-7 px-2.5 rounded-lg inline-flex items-center gap-1 active:scale-95"
          >
            <Share2 className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
          <Button
            onClick={handleCopyLink}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[10px] font-bold h-7 px-2.5 gap-1 shrink-0 active:scale-95"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Desktop Header Banner - Solid & Clean */}
      <div className="hidden sm:flex bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            Client Referral Program & ₹4,000 VIP Card
          </h2>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Share your partner link with peer businesses. When they submit requirements and pay their advance deposit, you unlock your ₹4,000 VIP Credit Card!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#064e3b] hover:bg-[#047857] text-emerald-200 border border-emerald-700/60 text-xs font-bold h-9 px-4 rounded-lg inline-flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Button
            onClick={handleCopyLink}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9 px-4 gap-1.5 shrink-0 active:scale-95 transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied" : "Copy Link"}</span>
          </Button>
        </div>
      </div>

      {/* OOMA LABS VIP Partner Credit Card (Progressive Unlock) */}
      <PortalVipCard
        verifiedCount={verifiedCount}
        requiredCount={requiredCount}
        cardholderName={referrals.cardholderName || clientUser?.name || "Rajesh Sharma"}
        isUnlocked={isUnlocked}
        creditAmountINR={referrals.creditCardAmountINR || 4000}
        onApplyCredit={handleCopyCoupon}
      />

      {/* Mobile Unified Quick Share Box */}
      <div className="sm:hidden bg-[#18181b] border border-[#27272a] rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Share Your Partner Access</span>
          <span className="text-[10px] text-amber-400 font-semibold">₹50K Audit Waiver</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-[#121316] rounded-lg border border-[#27272a]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[9px] uppercase font-bold text-zinc-500">CODE:</span>
            <span className="text-xs font-mono font-bold text-amber-400">{referrals.referralCode}</span>
          </div>
          <Button
            size="sm"
            onClick={handleCopyCode}
            className="bg-[#27272a] hover:bg-[#3f3f46] text-white text-[10px] h-6 px-2"
          >
            {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-400 mr-1" /> : <Copy className="w-2.5 h-2.5 mr-1" />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </Button>
        </div>

        <div className="flex items-center justify-between p-2 bg-[#121316] rounded-lg border border-[#27272a] gap-2">
          <span className="text-[10px] font-mono text-amber-300 truncate font-medium">
            {shareableQuotationUrl}
          </span>
          <Button
            size="sm"
            onClick={handleCopyLink}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[10px] h-6 px-2 shrink-0"
          >
            {copiedLink ? <Check className="w-2.5 h-2.5 mr-1" /> : <Share2 className="w-2.5 h-2.5 mr-1" />}
            <span>{copiedLink ? "Copied" : "Copy Link"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[9px] text-zinc-500 font-medium">1-Tap:</span>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Namaste! Check out OOMA LABS for enterprise software & intelligent systems. Request a free architectural quotation and claim a ₹50,000 discovery audit fee waiver: ${shareableQuotationUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded bg-[#064e3b] text-white text-[9px] font-bold"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableQuotationUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded bg-[#004182] text-white text-[9px] font-bold"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Desktop Code & Link Cards */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        {/* Code Box */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-3">
          <div>
            <span className="text-xs uppercase font-semibold text-zinc-400 block">
              Your Referral Code
            </span>
            <div className="flex items-center justify-between mt-2 p-3 bg-[#121316] rounded-lg border border-[#27272a]">
              <span className="text-base font-mono font-bold text-amber-400">
                {referrals.referralCode}
              </span>
              <Button
                size="sm"
                onClick={handleCopyCode}
                className="bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs h-8 px-3"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-snug">
            Peers receive a ₹50,000 architecture audit waiver on their first development sprint.
          </p>
        </div>

        {/* Link Box */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
          <div>
            <span className="text-xs uppercase font-semibold text-zinc-400 block">
              Shareable Quotation Link
            </span>
            <div className="flex items-center justify-between mt-2 p-3 bg-[#121316] rounded-lg border border-[#27272a] gap-2">
              <span className="text-xs font-mono text-amber-300 truncate font-semibold">
                {shareableQuotationUrl}
              </span>
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs h-8 px-3 shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3 mr-1" /> : <Share2 className="w-3 h-3 mr-1" />}
                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
              </Button>
            </div>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#27272a]">
            <span className="text-[11px] text-zinc-400 font-medium">1-Click Share:</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Namaste! Check out OOMA LABS for enterprise software & intelligent systems. Request a free architectural quotation and claim a ₹50,000 discovery audit fee waiver: ${shareableQuotationUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#064e3b] hover:bg-[#047857] text-white text-[11px] font-bold transition-colors"
            >
              WhatsApp
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableQuotationUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#004182] hover:bg-[#003366] text-white text-[11px] font-bold transition-colors"
            >
              LinkedIn
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(
                "Exclusive Invitation: Free Enterprise Architecture SOW with OOMA LABS"
              )}&body=${encodeURIComponent(
                `Hi,\n\nI recommend working with OOMA LABS for building your intelligent systems and fullstack applications. Use my VIP partner link to request a free quotation and claim a ₹50,000 architecture audit waiver:\n\n${shareableQuotationUrl}\n\nBest regards,\n${clientUser?.name || "VIP Partner"}`
              )}`}
              className="px-2.5 py-1 rounded bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 text-[11px] font-semibold transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* 4-Step Verification Funnel - Horizontal Swipe Track on Mobile */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1 sm:gap-1.5">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            <span>How Referrals Unlock Your VIP Card</span>
          </span>
          <span className="text-[9px] sm:text-xs font-semibold text-amber-400">
            <span className="sm:hidden">Swipe →</span>
            <span className="hidden sm:inline">4 Verified = 100% Unlocked</span>
          </span>
        </div>

        {/* Scrollable horizontal track on mobile, 4-col grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 gap-2 pt-0.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory">
          <div className="w-[160px] sm:w-auto shrink-0 snap-start bg-[#121316] p-2.5 rounded-lg sm:rounded-xl border border-[#27272a] space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-blue-400 font-mono">STEP 01</span>
              <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">Share</span>
            </div>
            <h4 className="text-[10px] sm:text-xs font-bold text-white">Send Quotation Link</h4>
            <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">
              Peer accesses the free architectural quotation form.
            </p>
          </div>

          <div className="w-[160px] sm:w-auto shrink-0 snap-start bg-[#121316] p-2.5 rounded-lg sm:rounded-xl border border-[#27272a] space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-indigo-400 font-mono">STEP 02</span>
              <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">Intake</span>
            </div>
            <h4 className="text-[10px] sm:text-xs font-bold text-white">Peer Submits Scope</h4>
            <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">
              Peer details requirements, budget range, and timeline.
            </p>
          </div>

          <div className="w-[160px] sm:w-auto shrink-0 snap-start bg-[#121316] p-2.5 rounded-lg sm:rounded-xl border border-[#27272a] space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-purple-400 font-mono">STEP 03</span>
              <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">Review</span>
            </div>
            <h4 className="text-[10px] sm:text-xs font-bold text-white">Technical Discovery</h4>
            <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">
              OOMA Labs architects present formal SOW specs.
            </p>
          </div>

          <div className="w-[160px] sm:w-auto shrink-0 snap-start bg-[#064e3b]/20 p-2.5 rounded-lg sm:rounded-xl border border-emerald-500/40 space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-emerald-400 font-mono">STEP 04</span>
              <span className="text-[8px] sm:text-[10px] text-emerald-300 font-bold uppercase">Reward</span>
            </div>
            <h4 className="text-[10px] sm:text-xs font-bold text-emerald-300">Advance Paid (+1)</h4>
            <p className="text-[9px] sm:text-[11px] text-zinc-300 leading-tight">
              Peer deposits advance. Your card reveals +25%!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact INR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-[#18181b] border border-[#27272a] p-2.5 sm:p-5 rounded-lg sm:rounded-xl">
          <span className="text-[9px] sm:text-xs uppercase font-semibold text-zinc-400 block mb-0.5">
            Introductions
          </span>
          <div className="text-lg sm:text-2xl font-bold text-white">{referrals.totalReferrals || referrals.history.length}</div>
          <span className="text-[9px] sm:text-xs text-zinc-500 block mt-0.5">Peers referred</span>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-2.5 sm:p-5 rounded-lg sm:rounded-xl">
          <span className="text-[9px] sm:text-xs uppercase font-semibold text-emerald-400 block mb-0.5">
            Verified Clients
          </span>
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">{verifiedCount} / {requiredCount}</div>
          <span className="text-[9px] sm:text-xs text-zinc-500 block mt-0.5">Paid advance</span>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-2.5 sm:p-5 rounded-lg sm:rounded-xl">
          <span className="text-[9px] sm:text-xs uppercase font-semibold text-amber-400 block mb-0.5">
            Credits Earned
          </span>
          <div className="text-base sm:text-2xl font-bold text-amber-400 truncate">{formatINR(referrals.totalEarnings || 0)}</div>
          <span className="text-[9px] sm:text-xs text-zinc-500 block mt-0.5">In ledger</span>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-2.5 sm:p-5 rounded-lg sm:rounded-xl">
          <span className="text-[9px] sm:text-xs uppercase font-semibold text-blue-400 block mb-0.5">
            Discount Status
          </span>
          <div className="text-sm sm:text-2xl font-bold text-blue-400 truncate">
            {isUnlocked ? "20% Active" : `${requiredCount - verifiedCount} Left`}
          </div>
          <span className="text-[9px] sm:text-xs text-zinc-500 block mt-0.5">Invoice waiver</span>
        </div>
      </div>

      {/* Referral History Table with Vetting Stages - Compact on Mobile */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="p-2.5 sm:p-5 border-b border-[#27272a] flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Referral Activity & Vetting Pipeline
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
              Tracks the vetting and advance payment progress of your referred clients.
            </p>
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400 shrink-0">{referrals.history.length} Total</span>
        </div>

        {referrals.history.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-xs text-zinc-400 space-y-1.5 sm:space-y-2">
            <p>No referrals logged yet.</p>
            <p className="text-zinc-500 max-w-md mx-auto text-[10px] sm:text-[11px]">
              Share your partner quotation link with peers. When they submit requirements and pay their advance deposit, they will appear here!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#27272a]">
            {referrals.history.map((lead) => {
              const isVerified = lead.status === "verified_client" || lead.status === "advance_paid";
              const isVetted = lead.status === "requirement_verified";

              return (
                <div
                  key={lead.id}
                  className="p-2.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:bg-[#202024] transition-colors"
                >
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white">{lead.contactName}</h4>
                      <span className="text-[10px] sm:text-xs text-zinc-400">({lead.companyName})</span>
                    </div>

                    <div className="text-[10px] sm:text-xs text-zinc-400 flex flex-wrap items-center gap-x-2">
                      <span>{lead.email}</span>
                      {lead.phone && <span>• {lead.phone}</span>}
                      <span>• {lead.date}</span>
                    </div>

                    {lead.requirementBrief && (
                      <p className="text-[9px] sm:text-xs text-zinc-400 bg-[#121316] p-1.5 sm:p-2 rounded-lg border border-[#27272a] mt-1 max-w-xl line-clamp-2 sm:line-clamp-none">
                        <strong className="text-zinc-300 font-semibold">Scope: </strong>
                        {lead.requirementBrief}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1.5 sm:gap-2 shrink-0 pt-1 sm:pt-0 border-t border-[#27272a]/50 sm:border-0">
                    <span
                      className={`text-[9px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded inline-flex items-center gap-1 ${
                        isVerified
                          ? "bg-[#064e3b] text-emerald-300"
                          : isVetted
                          ? "bg-[#1e3a8a] text-blue-300"
                          : "bg-[#78350f] text-amber-300"
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Advance Paid</span>
                        </>
                      ) : isVetted ? (
                        <>
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Scope Vetted</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Under Vetting</span>
                        </>
                      )}
                    </span>

                    {lead.advancePaidINR ? (
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-400">
                        {formatINR(lead.advancePaidINR)}
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-zinc-500">Advance Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Chatbot Referral Intake Info Box */}
      <div className="bg-[#121316] border border-[#27272a] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            AI Chatbot Quotation Intake for Referred Clients
          </span>
          <p className="text-[10px] sm:text-xs text-zinc-400 max-w-2xl leading-relaxed">
            When peers click your link, our AI chatbot guides them through scoping requirements. Once their deposit is received, your ₹4,000 credit is unlocked!
          </p>
        </div>

        <a
          href={shareableQuotationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#27272a] text-[10px] sm:text-xs font-semibold text-zinc-200 transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <span>Preview Intake Page</span>
          <Share2 className="w-3 h-3 text-blue-400" />
        </a>
      </div>
    </div>
  );
};
