import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useClientPortal, CANONICAL_6_STAGES } from "../../context/ClientPortalContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  User,
  Phone,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Cpu,
  Loader2,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";

export const ClientOnboarding: React.FC = () => {
  const { clientUser, activeProject, completeOnboarding } = useClientPortal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get("ref") || "";
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("ooma_pending_ref_code") || "";
    const activeRef = refParam || saved;
    if (activeRef) {
      setReferralCode(activeRef);
    }
  }, [refParam]);

  // If activeProject already exists and user has completed onboarding, allow skipping
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal & Business Info
  const [name, setName] = useState(clientUser?.name || "");
  const [company, setCompany] = useState(clientUser?.company && !clientUser.company.includes("Solutions") ? clientUser.company : "");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState(clientUser?.phone || "");

  // Step 2: Project Scope
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Fullstack Web App / SaaS");
  const [requirementScope, setRequirementScope] = useState("");
  const [timeline, setTimeline] = useState("2 - 3 Months (Production Ready)");
  const [budgetRange, setBudgetRange] = useState("₹5,00,000 - ₹15,00,000");

  // Step 3: Provisioning progress
  const [provisionProgress, setProvisionProgress] = useState(10);
  const [provisionStageText, setProvisionStageText] = useState("Connecting organization to Supabase Cloud...");

  useEffect(() => {
    if (clientUser?.name && !name) {
      setName(clientUser.name);
    }
    if (clientUser?.company && !company && !clientUser.company.includes("Solutions")) {
      setCompany(clientUser.company);
    }
    if (clientUser?.phone && !phone) {
      setPhone(clientUser.phone);
    }
  }, [clientUser, name, company, phone]);

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!company.trim()) {
      toast.error("Please enter your company or business name.");
      return;
    }
    setStep(2);
  };

  const handleStartProvisioning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      toast.error("Please provide a name for your project.");
      return;
    }

    setStep(3);

    // Animate setup phases
    setTimeout(() => {
      setProvisionProgress(35);
      setProvisionStageText("Setting up your account...");
    }, 600);

    setTimeout(() => {
      setProvisionProgress(65);
      setProvisionStageText("Preparing your project dashboard...");
    }, 1300);

    setTimeout(() => {
      setProvisionProgress(90);
      setProvisionStageText("Finalizing your workspace...");
    }, 2000);

    try {
      await completeOnboarding({
        name: name.trim(),
        company: company.trim(),
        title: title.trim() || "Project Director",
        phone: phone.trim() || "+91 98000 00000",
        projectTitle: projectTitle.trim(),
        projectCategory,
        requirementScope: requirementScope.trim(),
        timeline,
        budgetRange,
        referralCode: referralCode || undefined,
      });

      setTimeout(() => {
        setProvisionProgress(100);
        setProvisionStageText("Your project dashboard is ready! Opening...");
        toast.success(`Welcome to OOMA LABS! Project dashboard ready.`);
        setTimeout(() => {
          navigate("/portal");
        }, 800);
      }, 2600);
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize project dashboard.");
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="p-5 md:px-10 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-[#27272a]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
            <span className="text-blue-400 font-black text-xs tracking-wider">OL</span>
          </div>
          <span className="text-sm font-bold text-white tracking-widest uppercase">
            OOMA LABS <span className="text-zinc-500 font-normal">/ ONBOARDING</span>
          </span>
        </Link>

        {activeProject && (
          <Link
            to="/portal"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Skip to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-xl bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl shadow-black/80">
          
          {/* Referral Partner Waiver Active Banner */}
          {referralCode && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4 flex items-start gap-3">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200">
                <div className="font-semibold text-white flex items-center gap-1.5 flex-wrap">
                  <span>VIP Partner Referral Benefit Active</span>
                  <code className="text-amber-300 font-mono text-[11px] bg-amber-500/20 px-1.5 py-0.5 rounded">{referralCode}</code>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Your ₹50,000 architectural discovery audit waiver will be automatically applied to your project scope upon project onboarding completion.
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Layers className="w-3.5 h-3.5" />
                Step {step} of 3: {step === 1 ? "Organization Setup" : step === 2 ? "Project Scope" : "Dashboard Setup"}
              </span>
              <span className="text-zinc-500">{step === 1 ? "33%" : step === 2 ? "66%" : "100%"} Complete</span>
            </div>
            <div className="w-full h-1.5 bg-[#121316] rounded-full overflow-hidden border border-[#27272a]">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : `${provisionProgress}%` }}
              />
            </div>
          </div>

          {/* STEP 1: ORGANIZATION & CONTACT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextToStep2} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Business & Contact Details
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Enter your details to set up your account and get started.
                </p>
              </div>

              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Business / Company Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. KiranaTech Innovations Pvt Ltd"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl focus:border-blue-500"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    This business name will appear on your dashboard and invoices.
                  </p>
                </div>

                {/* Your Name */}
                <div>
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Your Full Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title / Role */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      Your Designation / Role
                    </Label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Founder & CEO / CTO"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl focus:border-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      Business Phone / WhatsApp
                    </Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <span>Continue to Project Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: PROJECT & TECHNICAL REQUIREMENTS */}
          {step === 2 && (
            <form onSubmit={handleStartProvisioning} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Project Details
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Tell us what you want to build so we can prepare your project workspace.
                </p>
              </div>

              <div className="space-y-4">
                {/* Project Title */}
                <div>
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    Project Title <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Omnichannel AI Retail Platform"
                    className="bg-[#121316] border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl focus:border-blue-500"
                    required
                  />
                </div>

                {/* Solution Category */}
                <div>
                  <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    Project Type
                  </Label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-[#121316] border border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl px-3 focus:border-blue-500 outline-none"
                  >
                    <option value="Fullstack Web App / SaaS">Fullstack Web App / SaaS</option>
                    <option value="Enterprise Software / ERP">Enterprise Software / ERP</option>
                    <option value="Mobile App (iOS & Android)">Mobile App (iOS & Android)</option>
                    <option value="AI Application / Automation">AI Application / Automation</option>
                    <option value="Cloud & Backend API">Cloud & Backend API</option>
                  </select>
                </div>

                {/* Scope Brief */}
                <div>
                  <Label className="text-xs font-semibold text-zinc-300">
                    Project Description (Optional)
                  </Label>
                  <Textarea
                    value={requirementScope}
                    onChange={(e) => setRequirementScope(e.target.value)}
                    placeholder="Tell us what you want to build, key features, or any specific requirements..."
                    className="bg-[#121316] border-[#27272a] text-white text-xs mt-1.5 rounded-xl min-h-[75px] focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Timeline */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Target Timeline
                    </Label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-[#121316] border border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl px-3 focus:border-blue-500 outline-none"
                    >
                      <option value="4 - 6 Weeks (Rapid MVP)">4 - 6 Weeks (Rapid MVP)</option>
                      <option value="2 - 3 Months (Production Ready)">2 - 3 Months (Production Ready)</option>
                      <option value="4 - 6 Months (Enterprise Suite)">4 - 6 Months (Enterprise Suite)</option>
                    </select>
                  </div>

                  {/* Budget Tier */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                      Estimated Budget Range
                    </Label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full bg-[#121316] border border-[#27272a] text-white text-xs h-10 mt-1.5 rounded-xl px-3 focus:border-blue-500 outline-none"
                    >
                      <option value="₹2,50,000 - ₹5,00,000">₹2.5L - ₹5L (Starter)</option>
                      <option value="₹5,00,000 - ₹15,00,000">₹5L - ₹15L (Professional)</option>
                      <option value="₹15,00,000 - ₹50,00,000">₹15L - ₹50L (Enterprise)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-[#27272a] text-zinc-300 hover:text-white text-xs h-11 rounded-xl px-4 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Initialize Project Dashboard</span>
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: PROVISIONING ANIMATION */}
          {step === 3 && (
            <div className="py-8 space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Setting Up Your Project Dashboard
                </h2>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
                  {provisionStageText}
                </p>
              </div>

              {/* Project Stages Preview */}
              <div className="bg-[#121316] border border-[#27272a] rounded-xl p-4 text-left max-w-md mx-auto space-y-2.5">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Project Stages:
                </div>
                {CANONICAL_6_STAGES.map((s, idx) => (
                  <div key={s.stage} className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {s.title}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {idx === 0 ? "In Progress" : "Queued"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted • Secure Database Connection</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="p-5 text-center text-xs text-zinc-500 border-t border-[#27272a]">
        © {new Date().getFullYear()} OOMA LABS. All rights reserved.
      </footer>
    </div>
  );
};

export default ClientOnboarding;
