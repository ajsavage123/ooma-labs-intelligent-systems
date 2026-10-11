import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useClientPortal } from "../context/ClientPortalContext";
import {
  FileText,
  Send,
  CheckCircle2,
  Building,
  User,
  Mail,
  Phone,
  Code,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const FreeQuotationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const { projects, submitQuotationRequest } = useClientPortal();

  // Find referring client info if available
  const referringProject = projects.find(
    (p) =>
      p.referrals?.referralCode?.toLowerCase() === refCode.toLowerCase() ||
      p.id.toLowerCase() === refCode.toLowerCase()
  );
  const referringClientName =
    referringProject?.referrals?.cardholderName ||
    (referringProject?.id === "proj-bharatlogistics-01" ? "Rajesh Sharma" : "OOMA Labs Enterprise Client");
  const referringCompany = referringProject?.company || "VIP Enterprise Partner";

  // Form states
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectCategory, setProjectCategory] = useState("Enterprise AI & Intelligent Agents");
  const [requirementScope, setRequirementScope] = useState("");
  const [timeline, setTimeline] = useState("6-8 weeks");
  const [budgetRange, setBudgetRange] = useState("₹5L - ₹15L (MVP to Production)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !companyName || !email || !requirementScope) {
      toast.error("Please fill in contact name, company name, email, and requirements scope");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitQuotationRequest({
        referralCode: refCode,
        contactName: `${fullName} (${jobTitle || "Director"})`,
        companyName,
        email,
        phone,
        projectCategory,
        requirementScope,
        budgetRange,
        timeline,
      });

      setSubmittedLeadId(result.leadId);
      setIsSubmitting(false);
      toast.success("Quotation request submitted! Our lead architects will prepare your scope.");
    }, 600);
  };

  const whatsappPrefilledUrl = `https://wa.me/918006662364?text=${encodeURIComponent(
    `Namaste OOMA LABS! I just requested a free quotation for ${companyName} (${fullName}). Requirement: ${projectCategory}. Ref: ${refCode || "direct"}`
  )}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm tracking-wider shadow-md shadow-blue-600/30">
              OL
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                OOMA LABS
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Intelligent Systems & Cloud Engineering
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/portal"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
            >
              Client Portal
            </Link>
            <a
              href="https://wa.me/918006662364"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-16">
        {/* Luxury VIP Invitation Pass */}
        {refCode && (
          <div className="relative mb-6 sm:mb-10 rounded-2xl p-[1px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.25)] overflow-hidden">
            <div className="relative rounded-[15px] bg-gradient-to-br from-[#18181b] via-[#121316] to-[#0d0e12] p-3.5 sm:p-7">
              {/* Background ambient gold sheen */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  {/* Executive Avatar or Gold Medallion */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        referringProject?.id === "proj-bharatlogistics-01"
                          ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80"
                          : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
                      }
                      alt={referringClientName}
                      className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-400/80 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-[9px] sm:text-[10px] shadow">
                      ★
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        EXECUTIVE VIP INVITATION
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                        PASS: {refCode}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight">
                      Invited by {referringClientName}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400">
                      {referringCompany} • Verified OOMA LABS Enterprise Partner
                    </p>
                  </div>
                </div>

                {/* VIP Waiver Privilege Ticket */}
                <div className="bg-zinc-950/90 border border-amber-500/30 rounded-xl p-2.5 sm:px-4 sm:py-3 shrink-0 flex items-center gap-2.5 sm:gap-3 shadow-inner self-start md:self-auto">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                      PRIVILEGE UNLOCKED
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      ₹50,000 Audit Fee Waiver
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-400 block font-medium">
                      + Priority Discovery Call Scheduling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {submittedLeadId ? (
          /* Submission Success State */
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-5 sm:p-12 text-center shadow-2xl space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Quotation Request Received!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Thank you, <strong className="text-white">{fullName}</strong>. Our Lead Systems Architect Arjun Mehta has received your project brief for <strong className="text-white">{companyName}</strong>.
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 max-w-sm mx-auto text-[11px] sm:text-xs text-left space-y-1 font-mono">
              <div className="text-zinc-500">REQUEST ID: <span className="text-amber-400 font-bold">{submittedLeadId}</span></div>
              <div className="text-zinc-500">CATEGORY: <span className="text-zinc-300">{projectCategory}</span></div>
              <div className="text-zinc-500">TIMELINE: <span className="text-zinc-300">{timeline}</span></div>
              <div className="text-zinc-500">BUDGET TIER: <span className="text-zinc-300">{budgetRange}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <a
                href={whatsappPrefilledUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp with Lead Architect</span>
              </a>

              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm transition-colors text-center"
              >
                Return to Homepage
              </Link>
            </div>

            <p className="text-[10px] sm:text-[11px] text-zinc-500 pt-1 sm:pt-2">
              A comprehensive technical architecture document, milestone breakdown, and commercial quotation will be delivered to <span className="text-zinc-400">{email}</span> within 24 business hours.
            </p>
          </div>
        ) : (
          /* Intake Form */
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-10 shadow-2xl">
            <div className="mb-4 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2 sm:mb-3">
                <FileText className="w-3.5 h-3.5" />
                Enterprise Software Quotation
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Request a Free Engineering SOW & Quotation
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 sm:mt-2 max-w-2xl leading-relaxed">
                Tell us about your technical requirements, systems integrations, and business objectives. Our senior engineering leads will review your specs and deliver a formal architectural proposal and milestone quotation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-6">
              {/* Row 1: Contact Name & Title */}
              {/* Row 1: Contact Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    Full Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                    Job Title / Role
                  </Label>
                  <Input
                    placeholder="e.g. Founder, CTO, VP Operations"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Row 2: Company Name & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-zinc-400" />
                    Company / Organization *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Singhania Logistics Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-zinc-400" />
                    Company Website (Optional)
                  </Label>
                  <Input
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Row 3: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    Official Work Email *
                  </Label>
                  <Input
                    required
                    type="email"
                    placeholder="vikram@singhania.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    WhatsApp / Phone Number
                  </Label>
                  <Input
                    placeholder="+91 98400 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Row 4: Project Category */}
              <div className="space-y-1 sm:space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300 block">
                  Project Domain / Engineering Focus
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {[
                    "Enterprise AI & Intelligent Agents",
                    "Fleet & Logistics Telematics",
                    "HealthTech & ABDM Health Cloud",
                    "Fullstack Web App Platform",
                    "Microservices & High-Scale APIs",
                    "Legacy Modernization & Database",
                  ].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setProjectCategory(category)}
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-semibold text-left transition-all ${
                        projectCategory === category
                          ? "bg-blue-600/15 border-blue-500 text-white shadow-sm"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Requirements Scope */}
              <div className="space-y-1 sm:space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Detailed Objectives & Feature Scope *</span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 font-normal hidden sm:inline">What does your application need to achieve?</span>
                </Label>
                <Textarea
                  required
                  rows={3}
                  placeholder="Describe your user journeys, key features, external APIs (e.g. FASTag, GST, Payment Gateway), and existing systems..."
                  value={requirementScope}
                  onChange={(e) => setRequirementScope(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-blue-500 resize-none text-xs leading-relaxed"
                />
              </div>

              {/* Row 6: Timeline & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Target Timeline
                  </Label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full h-10 sm:h-11 bg-zinc-950 border border-zinc-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="4-6 weeks (Rapid MVP)">4-6 weeks (Rapid MVP)</option>
                    <option value="6-8 weeks (Standard Fullstack)">6-8 weeks (Standard Fullstack)</option>
                    <option value="2-3 months (Enterprise SOW)">2-3 months (Enterprise SOW)</option>
                    <option value="3-6 months (Strategic Retainer)">3-6 months (Strategic Retainer)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-zinc-400" />
                    Target Budget Range (INR)
                  </Label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full h-10 sm:h-11 bg-zinc-950 border border-zinc-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="₹3L - ₹5L (Focused Module)">₹3 Lakhs - ₹5 Lakhs (Focused Module)</option>
                    <option value="₹5L - ₹15L (MVP to Production)">₹5 Lakhs - ₹15 Lakhs (MVP to Production)</option>
                    <option value="₹15L - ₹30L (Comprehensive Platform)">₹15 Lakhs - ₹30 Lakhs (Comprehensive Platform)</option>
                    <option value="₹30L+ (Enterprise Multi-Depot / ABDM)">₹30 Lakhs+ (Enterprise Multi-Depot / ABDM)</option>
                  </select>
                </div>
              </div>

              {/* Security & Confidentiality Notice */}
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  All project specifications and commercial requirements are protected by mutual non-disclosure (NDA) standards. We never share proprietary client data.
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Preparing Architectural Brief...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Project Requirements & Request Free Quotation</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
