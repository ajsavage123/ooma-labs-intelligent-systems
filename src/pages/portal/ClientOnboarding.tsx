import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useClientPortal, CANONICAL_6_STAGES } from "../../context/ClientPortalContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Building2,
  Phone,
  Layers,
  Calendar,
  IndianRupee,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { OomaLogo } from "../../components/OomaLogo";

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

  // 3-step onboarding: 1 = Personal/Company, 2 = Project Details, 3 = Provisioning Setup Animation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal & Business Info
  const [name, setName] = useState(clientUser?.name || "");
  const [company, setCompany] = useState(
    clientUser?.company && !clientUser.company.includes("Solutions") ? clientUser.company : ""
  );
  const [phone, setPhone] = useState(clientUser?.phone || "");

  // Step 2: Project Scope
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Website & Web Application");
  const [requirementScope, setRequirementScope] = useState("");
  const [timeline, setTimeline] = useState("1 - 2 Months (Standard Delivery)");
  const [budgetRange, setBudgetRange] = useState("Flexible / Open to Discussion");

  // Step 3: Setup Animation state
  const [provisionProgress, setProvisionProgress] = useState(15);
  const [provisionStageText, setProvisionStageText] = useState("Initializing your workspace...");
  const [activeStageIndex, setActiveStageIndex] = useState(0);

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
      toast.error("Please provide a name or title for your project.");
      return;
    }

    setStep(3);
    setProvisionProgress(25);
    setProvisionStageText("Setting up your account & organization...");
    setActiveStageIndex(0);

    // Setup sequence animation
    const t1 = setTimeout(() => {
      setProvisionProgress(55);
      setProvisionStageText("Configuring your 6-stage engineering roadmap...");
      setActiveStageIndex(1);
    }, 700);

    const t2 = setTimeout(() => {
      setProvisionProgress(80);
      setProvisionStageText("Preparing your live sprint & deliverables tracker...");
      setActiveStageIndex(2);
    }, 1400);

    const t3 = setTimeout(() => {
      setProvisionProgress(95);
      setProvisionStageText("Finalizing your dashboard...");
      setActiveStageIndex(3);
    }, 2000);

    try {
      await completeOnboarding({
        name: name.trim(),
        company: company.trim(),
        title: "Project Lead",
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
        setProvisionStageText("Workspace ready! Opening your client portal...");
        setActiveStageIndex(6);
        toast.success("Welcome! Your project workspace is ready.");
        setTimeout(() => {
          navigate("/portal");
        }, 700);
      }, 2500);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      toast.error(err.message || "Failed to create project workspace. Please try again.");
      setStep(2);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#000000] text-white font-sans flex flex-col selection:bg-[#D946EF] selection:text-white relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 12%, rgba(123, 33, 209, 0.22) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(circle at 20% 80%, rgba(217, 70, 239, 0.08) 0%, rgba(0, 0, 0, 0) 50%)",
      }}
    >
      {/* Header with clean logo */}
      <header className="shrink-0 px-4 sm:px-10 py-3 sm:py-4 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-white/5">
        <OomaLogo linkTo="/" variant="dark" size="sm" subtitle="CLIENT PORTAL" />

        {activeProject && (
          <Link
            to="/portal"
            className="text-xs text-purple-200/70 hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Skip to Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </header>

      {/* Main Content Area - Centered Claymorphic Experience */}
      <main className="flex-1 flex items-start justify-center px-4 pt-1 pb-3 sm:items-center sm:py-8 w-full">
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10">
          
          {/* 3D Character Illustration - Desktop Centered */}
          {step !== 3 && (
            <div className="hidden sm:flex shrink-0 items-center justify-center w-24 sm:w-28 md:w-32">
              <img
                src="/onboarding-character.png"
                alt="Welcome character"
                className="w-full h-auto max-h-[340px] md:max-h-[360px] object-contain select-none pointer-events-none drop-shadow-2xl"
              />
            </div>
          )}

          {/* Form Card Container - Claymorphic 3D Card */}
          <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center space-y-1.5 sm:space-y-3">
            
            {/* Mobile Header: character lying beside the title (no container) */}
            {step !== 3 && (
              <div className="sm:hidden flex items-center justify-center w-full gap-1.5 -mb-1 pt-0.5">
                <img
                  src="/onboarding-character.png"
                  alt="Welcome"
                  className="w-[68px] shrink-0 h-auto object-contain select-none pointer-events-none drop-shadow-xl -mr-1 z-10"
                />
                <div className="text-left min-w-0">
                  <h1 className="text-[1.45rem] font-extrabold text-[#EBDBFF] tracking-tight leading-[1.06]">
                    {step === 1 ? (
                      <>
                        Get started
                        <span className="block text-[1.15rem] text-[#D8B4FE]">with Ooma Labs</span>
                      </>
                    ) : (
                      "Project Setup"
                    )}
                  </h1>
                  <p className="text-[11px] text-purple-200/70 leading-snug mt-0.5 max-w-[200px]">
                    {step === 1
                      ? "Share your details to set up your account."
                      : "Tell us what you want our engineering team to build."}
                  </p>
                </div>
              </div>
            )}

            {/* Desktop Title & Friendly Text for Steps 1 & 2 */}
            {step !== 3 && (
              <div className="hidden sm:block space-y-1.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#EBDBFF] tracking-tight leading-tight">
                  {step === 1 ? (
                    <>
                      Get started
                      <span className="block">with Ooma Labs</span>
                    </>
                  ) : (
                    "Project Setup"
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-purple-200/70 max-w-sm mx-auto leading-relaxed font-normal">
                  {step === 1
                    ? "Share your details to set up your account."
                    : "Tell us what you want our engineering team to build so we can prepare your project dashboard."}
                </p>
              </div>
            )}

            {/* Referral Pill */}
            {referralCode && step !== 3 && (
              <div className="clay-pill inline-flex items-center gap-2 px-3.5 py-1 text-xs text-purple-200">
                <Tag className="w-3.5 h-3.5 text-[#DC33CE]" />
                <span>
                  Referral invite <strong className="font-semibold text-white">{referralCode}</strong> applied
                </span>
              </div>
            )}

            {/* STEP 1: PERSONAL & BUSINESS DETAILS */}
            {step === 1 && (
              <form onSubmit={handleNextToStep2} className="w-full space-y-3.5 text-left pt-1 sm:pt-2">
                {/* Full Name */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    Name (First and Last) <span className="text-[#DC33CE]">*</span>
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="EX. RAHUL SHARMA"
                      className="neon-input h-12 pl-10 pr-4 text-sm font-medium placeholder:text-purple-300/40 placeholder:text-xs placeholder:tracking-wider placeholder:font-semibold"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Company / Business */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    Business / Company Name <span className="text-[#DC33CE]">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="EX. ACME TECHNOLOGIES"
                      className="neon-input h-12 pl-10 pr-4 text-sm font-medium placeholder:text-purple-300/40 placeholder:text-xs placeholder:tracking-wider placeholder:font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    Phone / WhatsApp (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="neon-input h-12 pl-10 pr-4 text-sm font-medium placeholder:text-purple-300/40 placeholder:text-xs placeholder:tracking-wider"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="neon-btn-pill w-full h-12 font-bold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-right text-[11px] font-medium text-purple-300/60 pt-2">
                    Step 1 of 2
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: PROJECT DETAILS */}
            {step === 2 && (
              <form onSubmit={handleStartProvisioning} className="w-full space-y-3.5 text-left pt-1 sm:pt-2">
                {/* Project Title */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    Project Name <span className="text-[#DC33CE]">*</span>
                  </Label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="EX. CUSTOMER MOBILE APP, SAAS PORTAL"
                      className="neon-input h-12 pl-10 pr-4 text-sm font-medium placeholder:text-purple-300/40 placeholder:text-xs placeholder:tracking-wider placeholder:font-semibold"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Solution Category */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    What type of project is this? <span className="text-[#DC33CE]">*</span>
                  </Label>
                  <div className="relative">
                    <Cpu className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      className="neon-input w-full h-12 pl-10 pr-4 text-sm font-medium outline-none cursor-pointer"
                    >
                      <option value="Mobile App (Android & iOS)" className="bg-[#120826] text-white">📱 Mobile App (Android & iOS)</option>
                      <option value="Website & Web Application" className="bg-[#120826] text-white">🌐 Website & Web Application</option>
                      <option value="AI & Business Automations" className="bg-[#120826] text-white">⚡ AI & Business Automations</option>
                      <option value="Custom Software & CRM / ERP" className="bg-[#120826] text-white">💼 Custom Software & CRM / ERP</option>
                      <option value="E-Commerce & Online Store" className="bg-[#120826] text-white">🛒 E-Commerce & Online Store</option>
                      <option value="Cloud Systems & Backend APIs" className="bg-[#120826] text-white">☁️ Cloud Systems & Backend APIs</option>
                      <option value="UI/UX Design & Prototyping" className="bg-[#120826] text-white">🎨 UI/UX Design & Prototyping</option>
                      <option value="Fullstack Engineering (End-to-End)" className="bg-[#120826] text-white">🚀 Complete End-to-End Build</option>
                    </select>
                  </div>
                </div>

                {/* Brief Message / Scope */}
                <div>
                  <Label className="text-xs font-semibold text-white mb-1.5 block">
                    Brief Notes / What You Need (Optional)
                  </Label>
                  <Textarea
                    value={requirementScope}
                    onChange={(e) => setRequirementScope(e.target.value)}
                    placeholder="Describe what you want to build or any key goals..."
                    className="neon-input p-3.5 text-sm font-medium min-h-[65px] sm:min-h-[75px] placeholder:text-purple-300/40"
                  />
                </div>

                {/* Timeline & Budget Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-white mb-1.5 block">
                      Target Timeline
                    </Label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="neon-input w-full h-11 px-3 text-xs font-medium outline-none cursor-pointer"
                    >
                      <option value="Flexible / Open to Timeline Advice" className="bg-[#120826] text-white">⏱️ Flexible</option>
                      <option value="Urgent (1 - 2 Weeks)" className="bg-[#120826] text-white">⚡ Urgent (1-2 Wks)</option>
                      <option value="2 - 4 Weeks (Quick MVP)" className="bg-[#120826] text-white">🚀 2-4 Wks (MVP)</option>
                      <option value="1 - 2 Months (Standard Delivery)" className="bg-[#120826] text-white">📅 1-2 Months</option>
                      <option value="3 - 6 Months (Complete System)" className="bg-[#120826] text-white">🏗️ 3-6 Months</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-white mb-1.5 block">
                      Estimated Budget (Optional)
                    </Label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="neon-input w-full h-11 px-3 text-xs font-medium outline-none cursor-pointer"
                    >
                      <option value="Flexible / Open to Discussion" className="bg-[#120826] text-white">🤝 Flexible / Discuss</option>
                      <option value="Under ₹50,000" className="bg-[#120826] text-white">Under ₹50,000</option>
                      <option value="₹50,000 - ₹1,50,000" className="bg-[#120826] text-white">₹50k - ₹1.5L</option>
                      <option value="₹1,50,000 - ₹3,50,000" className="bg-[#120826] text-white">₹1.5L - ₹3.5L</option>
                      <option value="₹3,50,000 - ₹7,50,000" className="bg-[#120826] text-white">₹3.5L - ₹7.5L</option>
                      <option value="₹7,50,000 - ₹15,00,000" className="bg-[#120826] text-white">₹7.5L - ₹15L</option>
                      <option value="₹15,00,000+" className="bg-[#120826] text-white">₹15L+</option>
                      <option value="Not Sure / Need Free Quote" className="bg-[#120826] text-white">❓ Need Free Quote</option>
                    </select>
                  </div>
                </div>

                {/* Back & Submit Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="clay-btn-ghost h-12 text-xs font-semibold px-4 cursor-pointer text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="neon-btn-pill flex-1 h-12 font-bold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </button>
                </div>
                <div className="text-right text-[11px] font-medium text-purple-300/60 pt-1">
                  Step 2 of 2
                </div>
              </form>
            )}

            {/* STEP 3: PROVISIONING SETUP ANIMATION (CLAYMORPHIC) */}
            {step === 3 && (
              <div className="neon-glass-card w-full p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                {/* Pulsing Spinner Icon */}
                <div className="clay-pill w-16 h-16 mx-auto flex items-center justify-center animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin text-[#DC33CE]" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#EBDBFF] tracking-tight">
                    Setting Up Your Project Workspace
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200/70 font-medium animate-pulse">
                    {provisionStageText}
                  </p>
                </div>

                {/* Claymorphic Progress Bar */}
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-purple-200">
                    <span>Progress</span>
                    <span className="text-[#DC33CE]">{provisionProgress}%</span>
                  </div>
                  <div className="clay-inset w-full h-3 p-0.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#AA34F8] via-[#DC33CE] to-[#F8477E] transition-all duration-500 ease-out rounded-full shadow-md"
                      style={{ width: `${provisionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Live Stages Checklist Animation */}
                <div className="clay-inset p-4 text-left space-y-2.5">
                  <div className="text-[11px] font-bold text-purple-300/60 uppercase tracking-wider mb-1">
                    Project Roadmap Initialized:
                  </div>
                  {CANONICAL_6_STAGES.map((s, idx) => {
                    const isPassed = activeStageIndex > idx;
                    const isCurrent = activeStageIndex === idx;
                    return (
                      <div
                        key={s.stage}
                        className={`flex items-center justify-between text-xs transition-colors duration-300 ${
                          isPassed || isCurrent ? "text-white font-semibold" : "text-purple-300/40"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-[#A86BDC] animate-ping shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{s.title}</span>
                        </span>
                        <span className="text-[11px] font-mono text-purple-300/50 shrink-0">
                          {isPassed ? "Ready" : isCurrent ? "Setting Up..." : "Queued"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-purple-300/60 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure Project Workspace • OOMA LABS</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 p-4 text-center text-xs text-purple-300/40 border-t border-white/5">
        © {new Date().getFullYear()} OOMA LABS. All rights reserved.
      </footer>
    </div>
  );
};

export default ClientOnboarding;